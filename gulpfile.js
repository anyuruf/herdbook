
let gulp          = require('gulp')
let babel         = require('gulp-babel')

//let fs            = require('fs')
//let path          = require('path')
//let yaml          = require('js-yaml')
//let mkdirp        = require('mkdirp')


//
// Server
//
gulp.task('server-transpile', () => {
  gulp
    .src('**/*.js', {cwd: 'src'})
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})

gulp.task('copy-server', () => {
  gulp
    .src("**/*.json", {cwd: 'src'})
    .pipe(gulp.dest('dist'))
})

//
// Dependencies
//
gulp.task('default', ['server-transpile', 'copy-server'])

