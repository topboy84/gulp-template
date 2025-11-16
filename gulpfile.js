const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function scripts() {
  return src([
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(autoprefixer({ overrideBrowserslist: ['last 5 versions'], grid: true }))
    .pipe(concat('style.min.css'))
    .pipe(scss({ style: 'compressed' }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function images() {
  return src('app/images/**/*.*', {
        encoding: false
    })
    .pipe(imagemin(
      [
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]
  ))
    .pipe(dest('dist/images'))
}


function watching() {
  watch(['app/scss/**/*.scss'], styles)
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload);
}

function brosersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

function cleanDist() {
  return src('dist')
    .pipe(clean());
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/js/main.js',
    'app/**/*.html'
  ], { base: 'app' })
    .pipe(dest('dist'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.brosersync = brosersync;

exports.default = parallel(styles, scripts, brosersync, watching);
exports.build = series(cleanDist, building, images);