const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const babelify = require('babelify');
const copy = require('gulp-copy');

const isProduction = process.env.NODE_ENV === 'production';

const paths = {
  scripts: 'app/**/*.js',
  vendorScripts: ['bower_components/angular/angular.js','bower_components/angular-ui-router/release/angular-ui-router.js','node_modules/materialize-css/dist/js/materialize.js', 'node_modules/fabric/dist/fabric.js'],
  styles: ['app/**/*.scss', 'node_modules/materialize-css/dist/css/materialize.css'],
  assets: 'assets/**/*',
  dist: 'docs',
};

gulp.task('concat-scripts', function () {
  return gulp.src(['app/**/*.js'])
    .pipe(concat('app.js'))
    .on('data', function (file) {
      console.log('Processing file:', file.path);
    })
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload());
});

gulp.task('vendor-scripts', function () {
  return gulp.src(paths.vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload());
});

gulp.task('assets', function () {
  return gulp.src(paths.assets, { base: '.' })
    .pipe(copy(paths.dist + '/assets', { prefix: 1 }))
    .pipe(connect.reload());
});

gulp.task('copy-html', function () {
    return gulp.src(['app/**/*.html', 'index.html'])
      .pipe(gulp.dest(function(file) {
        // Preserve folder structure in the dist directory
        return file.base === process.cwd() ? paths.dist : paths.dist + '/app';
      }))
      .pipe(connect.reload());
  });
  

gulp.task('connect', function () {
  connect.server({
    root: paths.dist,
    livereload: true,
    port: 8080,
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, gulp.series('concat-scripts'));
  gulp.watch(paths.styles, gulp.series('styles'));
  gulp.watch(paths.assets, gulp.series('assets'));
  gulp.watch(['app/**/*.html'], gulp.series('copy-html')); // Watch for changes in HTML files
});

gulp.task('serve', gulp.parallel('vendor-scripts', 'concat-scripts', 'styles', 'assets', 'copy-html', 'connect', 'watch'));

gulp.task('build', gulp.parallel('vendor-scripts', 'concat-scripts', 'styles', 'assets', 'copy-html'));

gulp.task('build:prod', function () {
  return gulp.src(['app/**/*.html', 'index.html'])
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.parallel('vendor-scripts', 'concat-scripts', 'styles', 'assets', 'copy-html'))
    .pipe(isProduction ? uglify() : gulp.dest(paths.dist));
});

gulp.task('default', isProduction ? gulp.series('build:prod') : gulp.series('serve'));
