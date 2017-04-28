'use strict';
const gulp = require('gulp');
const gutil = require('gulp-util');

const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const del = require('del');

const gulpWebpack = require('webpack-stream');
const webpack2 = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const CONFIG = require('./config.js');
const WEBPACK_CONFIG = require('./client/config/webpack.dev.config.js');

gulp.task('clean:build', () => del.sync([CONFIG.DIR.DEST]));

gulp.task('eslint', () => gulp.src([`${CONFIG.SRC.SERVER}/**/*.js`, `${CONFIG.SRC.CLIENT}/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format()));

gulp.task('webpack:build', () => gulp.src(`${CONFIG.SRC.CLIENT}/**/*.js`)
    .pipe(gulpWebpack(WEBPACK_CONFIG, webpack2))
    .pipe(gulp.dest(WEBPACK_CONFIG.output.path)));

gulp.task('babel:build', () => gulp.src(`${CONFIG.SRC.SERVER}/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(babel(CONFIG.BABEL.SERVER.DEV))
    .pipe(sourcemaps.write('./', { sourceRoot: '../src' }))
    .pipe(gulp.dest(CONFIG.DEST.SERVER))
    .pipe(eslint.failAfterError()));

gulp.task('copy:env:dev', () => gulp.src('.env*')
    .pipe(gulp.dest(CONFIG.DEST.SERVER)));

gulp.task('watch:src', ['babel:build'], () => {
    const watcher = {
        babel: gulp.watch(`${CONFIG.SRC.SERVER}/**/*.js`, ['babel:build']),
    };
    const notify = (event) => {
        gutil.log(`### File ${gutil.colors.yellow(event.path)} was ${gutil.colors.magenta(event.type)} ###`);
    };

    for (const key in watcher) {
        watcher[key].on('change', notify);
    }
});

gulp.task('webpack:dev-server', () => {
    new WebpackDevServer(
        webpack2(WEBPACK_CONFIG),
        WEBPACK_CONFIG.devServer
    ).listen(WEBPACK_CONFIG.devServer.port, 'localhost', (err) => {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log(`${
            gutil.colors.yellow('[webpack-dev-server]')
            } is Running at localhost:${gutil.colors.red(WEBPACK_CONFIG.devServer.port)}`);
    });
});

gulp.task('start', ['babel:build'], () => nodemon({
    script: `${CONFIG.DEST.SERVER}/app.js`,
    watch: CONFIG.DEST.SERVER
}));

gulp.task('default', [
    'clean:build',
    'webpack:build',
    'watch:src',
    'webpack:dev-server',
    'copy:env:dev',
    'start'
]);
