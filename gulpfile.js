import gulp from 'gulp'
import * as sass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import uglify from 'gulp-uglify'
import imagemin from 'gulp-imagemin'
import browserSync from 'browser-sync'
import concat from 'gulp-concat'
import inject from 'gulp-inject'

const sassCompiler = gulpSass(sass)
const { src, dest, watch, series, parallel } = gulp

const paths = {
  html: './src/index.html',
  scss: './src/css/**/*.scss',
  js: './src/js/**/*.js',
  img: './src/img/*',
  dist: './dist'
}

function styles () {
  return src(paths.scss)
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('index.min.css'))
    .pipe(dest(paths.dist + '/css'))
    .pipe(browserSync.stream())
}

function scripts () {
  return src(paths.js)
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(dest(paths.dist + '/js'))
    .pipe(browserSync.stream())
}

function images () {
  return src(paths.img)
    .pipe(imagemin())
    .pipe(dest(paths.dist + '/img'))
}

function html () {
  const sources = src([paths.dist + '/js/*.js', paths.dist + '/css/*.css'], {
    read: false
  })
  return src(paths.html)
    .pipe(inject(sources, { relative: true, ignorePath: '../dist' }))
    .pipe(dest(paths.dist))
}

function watch_function () {
  browserSync.init({ server: { baseDir: paths.dist } })
  watch(paths.scss, styles)
  watch(paths.js, scripts)
  watch(paths.img, images)
  watch(paths.html, html).on('change', browserSync.reload)
}

const build = series(parallel(styles, scripts, images), html)
const serve = series(build, watch_function)

const _build = build
export { _build as build }
const _serve = serve
export { _serve as serve }
const _default = serve
export { _default as default }
