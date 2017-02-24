var gulp = require('gulp'),
    replacebatch = require('gulp-batch-replace'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    csvParser = require('gulp-csv-to-json-array'),
    browserSync = require('browser-sync').create();

gulp.task('csv', function(cb) {
  gulp.src(['*.csv'])
        .pipe(csvParser({
            dynamicTyping: true,
            skipEmptyLines: true
        }))
        .pipe(gulp.dest("./"));
        setTimeout(function () {
     console.log('dokonceno')
     cb()
   }, 100)
});

gulp.task('json', ['csv'], function() {
  return gulp.src('translate.json', { base: './' })
     .pipe(htmlmin({collapseWhitespace: true}))
     .pipe(replace('["','[">'))
     .pipe(replace('","','<",">'))
     .pipe(replace('"]','<"]'))
     .pipe(gulp.dest('./'));
});

var replaceThis = require('./translate.json');

gulp.task('html', ['json'], function(){
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(replacebatch(replaceThis))
    .pipe(gulp.dest('build'))
});

gulp.task('browser-sync', ['html'], function() {
     browserSync.init({
         server: {
             baseDir: "./build"
         }
     });
});

gulp.task('default', ['csv', 'json', 'html', 'browser-sync']);
