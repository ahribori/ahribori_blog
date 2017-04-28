'use strict';
const gulp = require('gulp');
const gutil = require('gulp-util');

const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const jsdoc = require('gulp-jsdoc3');
const replace = require('gulp-replace');
// const exec = require('child_process').exec;
// const exec = require('gulp-exec');
const del = require('del');

const gulpWebpack = require('webpack-stream');
const webpack2 = require('webpack');

const CONFIG = require('./config.js');
const WEBPACK_CONFIG = require('./client/config/webpack.config.js');
const JSDOC_CONFIG = require('./jsdoc.sdk.json');

gulp.task('clean:prod:build', () => del.sync([CONFIG.DIR.DEST, `${WEBPACK_CONFIG.output.path}/*.js`]));

gulp.task('eslint:prod', () => gulp.src([`${CONFIG.SRC.SERVER}/**/*.js`, `${CONFIG.SRC.CLIENT}/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('webpack:prod:build', [/* 'eslint:prod' */], () => gulp.src(`${CONFIG.SRC.CLIENT}/**/*.js`)
    .pipe(gulpWebpack(WEBPACK_CONFIG, webpack2))
    .pipe(gulp.dest(WEBPACK_CONFIG.output.path)));

gulp.task('copy:env:prod', () => gulp.src('.env.example')
    .pipe(gulp.dest(CONFIG.DEST.SERVER)));

gulp.task('copy:public:prod', ['webpack:prod:build'], () => gulp.src(`${WEBPACK_CONFIG.output.path}/**/*`)
    .pipe(gulp.dest(`${CONFIG.DIR.DEST}/public`)));

gulp.task('babel:prod:build', () => gulp.src(`${CONFIG.SRC.SERVER}/**/*.js`)
    .pipe(babel(CONFIG.BABEL.SERVER.PROD))
    .pipe(gulp.dest(CONFIG.DEST.SERVER)));

gulp.task('sdk.doc:prod:build', (cb) => {
    gulp.src([`${CONFIG.SRC.CLIENT}/sdk/sdk.md`], { read: false })
        .pipe(jsdoc(JSDOC_CONFIG, cb));
});

gulp.task('copy:sdk.doc:prod', ['sdk.doc:prod:build'], () => gulp.src(`${JSDOC_CONFIG.opts.destination}/**/*`)
    .pipe(gulp.dest(`${CONFIG.DIR.DEST}/${JSDOC_CONFIG.opts.destination}`)));

gulp.task('copy:package.json:prod', () => gulp.src('package.json')
    .pipe(gulp.dest(CONFIG.DIR.DEST)));

gulp.task('replace:pm2.config:prod', () => gulp.src('webapm.auth.yml')
    .pipe(replace('build/app.js', 'app.js'))
    .pipe(gulp.dest(CONFIG.DIR.DEST)));

// gulp.task('npm:install:prod', ['replace:pm2.config:prod'], (cb) => {
//     exec('cd build && npm i', (err, stdout, stderr) => {
//         console.log(stdout);
//         console.log(stderr);
//         cb(err);
//     });
// });

// gulp.task('npm:install:prod', ['replace:pm2.config:prod'], () => gulp.src('./build/**')
//     .pipe(exec('npm i', {
//         continueOnError: false,
//         pipeStdout: false,
//         customTemplatingThing: "test"
//     }))
//     .pipe(exec.reporter({
//         err: true,
//         stderr: true,
//         stdout: true
//     })));

gulp.task('default', [
        'clean:prod:build',
        'webpack:prod:build',
        'babel:prod:build',
        'copy:env:prod',
        'copy:public:prod',
        'copy:sdk.doc:prod',
        'copy:package.json:prod',
        'replace:pm2.config:prod',
        // 'npm:install:prod'
    ], () => gutil.log(
    gutil.colors.bgMagenta.black('#### AHRIBORI, SUCCESSFULLY BUILT ####'),
    gutil.colors.yellow(`
    RUN ["npm install" in /build/] && MAKE FILE "touch [.env]"
    
    ex) 
    [ahribori ~]#  cd build && npm i
    [ahribori ~]#  cat .env.example >> .env
    `))
);
