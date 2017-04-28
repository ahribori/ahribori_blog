import { dirname } from 'path';
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const LOG_PATH = process.env.LOG_PATH || `${process.cwd()}/logs`;
const rootDir = dirname(require.main.filename);


// 템플릿 문자에서 개행문자 제거
const ts = (templateData, ...param) => {
    let output = '';

    for (let i = 0; i < param.length; i += 1) {
        output += templateData[i] + param[i];
    }
    output += templateData[param.length];

    const lines = output.split(/(?:\r\n|\n|\r)/);

    return lines.map(line => line.replace(/^\s+/gm, '')).join(' ').trim();
};


// Error Stack 분석
const splitStackTrace = (err) => {
    const lines = err.stack.split('\n').slice(1);
    // winston stack 시작의 바로 전 단계가 호출 파일
    const lineMatch = lines[9].match(/at (?:(.+)\s+)?\(?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/);

    if (lineMatch[2] !== null && lineMatch[3] !== null) {
        const fileName = lineMatch[2].split(rootDir)[1];

        return {
            fileName,
            line: lineMatch[3],
            full: `${fileName}:${lineMatch[3]}`
        };
    }
    return null;
};


// 기본 옵션 설정
const defaultOption = {
    timestamp() {
        return moment().format('Y-MM-DD HH:mm:ss');
    },
    formatter(options) {
        const stackInfo = splitStackTrace(new Error());

        return ts`${options.timestamp()} - ${options.level}:
      ${(options.message || '') +
        (options.meta
        && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '') +
        (stackInfo ? ` - ${stackInfo.full}` : '')}`;
    },
    json: false
};


// error, warn, info, verbose, debug, silly
const logger = new (winston.Logger)({
    transports: [
        new DailyRotateFile(_.extend(defaultOption, {
            name: 'all-log',
            filename: `${LOG_PATH}/all-log.log`,
            datePattern: '-yyyyMMdd'
        })),
        new (winston.transports.File)(_.extend(defaultOption, {
            name: 'error-log',
            level: 'error',
            filename: `${LOG_PATH}/error-log.log`,
            maxsize: 1024 * 1024 * 25,
            maxFiles: 10
        })),
        new (winston.transports.Console)({
            level: 'info'
        })
    ],
    exitOnError: false
});


try {
    fs.statSync(LOG_PATH);
} catch (err) {
    if (err) { // === 'ENOENT'
        fs.mkdirSync(LOG_PATH);
    }
}

export default logger;
