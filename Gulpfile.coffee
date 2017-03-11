# Utils
gulp       = require 'gulp'
merge      = require 'merge-stream'

# CSS
sass       = require 'gulp-sass'
sourcemaps = require 'gulp-sourcemaps'
cssmin     = require 'gulp-cssmin'

# HTML
minifyHTML = require 'gulp-minify-html'

# JS
babel      = require 'gulp-babel'
uglify     = require 'gulp-uglify'
concat     = require 'gulp-concat'

# serve & LR
http       = require('http')
ecstatic   = require('ecstatic')
refresh    = require('gulp-livereload')
lrserver   = require('tiny-lr')()
embedlr    = require('gulp-embedlr')
lrport     = 35729
serverport = 5001

######


gulp.task 'styles', ->

  sassStream = gulp.src 'src/css/*.sass'
    .pipe sourcemaps.init()
    .pipe sass().on 'error', sass.logError
    .pipe sourcemaps.write()
    .pipe concat('sass.css')

  cssStream = gulp.src 'src/css/*.css'
    .pipe concat('css.css')

  merge(cssStream, sassStream)
    .pipe concat('styles.css')
    .pipe gulp.dest 'dest/css'
    .pipe refresh lrserver


gulp.task 'scripts', ->
  gulp.src 'src/js/*.js'
    .pipe(sourcemaps.init())
    .pipe babel
      presets: ['es2015']
    .pipe concat('app.js')
    .pipe sourcemaps.write '.'
    .pipe gulp.dest 'dest/js'
    .pipe refresh lrserver


gulp.task 'html', ->
  gulp.src 'src/*.html'
    .pipe embedlr()
    .pipe gulp.dest 'dest/'
    .pipe refresh lrserver


gulp.task 'assets', ->
  gulp.src('app/assets/**')
    # .pipe imagemin optimizationLevel: 5
    .pipe gulp.dest 'dest/assets/'
    .pipe refresh lrserver


gulp.task 'serve', ->
  s = http.createServer ecstatic root: __dirname + '/dest'
  s.listen serverport
  lrserver.listen lrport


gulp.task 'watch', ->
  gulp.watch 'src/src/**', ['scripts']
  gulp.watch 'src/css/**', ['styles']
  gulp.watch 'src/*.html', ['html']
  gulp.watch 'src/assets/**', ['assets']


gulp.task 'default', ['scripts', 'styles', 'html', 'assets', 'serve', 'watch']