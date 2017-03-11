# Utils
gulp       = require 'gulp'
merge      = require 'merge-stream'
del        = require 'del'

# CSS
sass       = require 'gulp-sass'
sourcemaps = require 'gulp-sourcemaps'
cssmin     = require 'gulp-cssmin'

# HTML
minifyHTML = require 'gulp-minify-html'

# JS
babel      = require 'gulp-babel'
webpack    = require('webpack')
webpackStr = require 'webpack-stream'
uglify     = require 'gulp-uglify'
concat     = require 'gulp-concat'

# serve & LR
server = require 'gulp-server-livereload'

# config
serverport = 5001

######

gulp.task 'clean', -> del ['dist']

gulp.task 'styles', ->

  sassStream = gulp.src 'src/css/*.sass'
    .pipe sourcemaps.init()
    .pipe sass().on 'error', sass.logError
    .pipe sourcemaps.write()
    .pipe concat 'sass.css'

  cssStream = gulp.src 'src/css/*.css'
    .pipe concat 'css.css'

  merge(cssStream, sassStream)
    .pipe concat 'styles.css'
    .pipe gulp.dest 'dist/css'


gulp.task 'scripts', ->
  gulp.src 'src/js/app.js'
    .pipe sourcemaps.init()
    .pipe babel
      presets: ['es2015']
    .pipe webpackStr
        output: filename: 'app.js'
      , webpack
    .pipe sourcemaps.write '.'
    .pipe gulp.dest 'dist/js'


gulp.task 'html', ->
  gulp.src 'src/*.html'
    .pipe gulp.dest 'dist/'


gulp.task 'assets', ->
  gulp.src('src/assets/**')
    # .pipe imagemin optimizationLevel: 5
    .pipe gulp.dest 'dist/assets/'


gulp.task 'serve', ->
  gulp.src 'dist'
    .pipe server
      port: 5001
      livereload: true
      directoryListing: false
      open: false


gulp.task 'watch', ->
  gulp.watch 'src/js/**', ['scripts']
  gulp.watch 'src/css/**', ['styles']
  gulp.watch 'src/*.html', ['html']
  gulp.watch 'src/assets/**', ['assets']

gulp.task 'default', ['scripts', 'styles', 'html', 'assets', 'serve', 'watch']