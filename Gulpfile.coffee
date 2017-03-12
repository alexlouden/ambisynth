# Utils
gulp       = require 'gulp'
merge      = require 'merge-stream'
del        = require 'del'
gutil      = require 'gulp-util'

# CSS
sass       = require 'gulp-sass'
autoprefix = require 'autoprefixer'
postcss    = require 'gulp-postcss'
assets     = require 'postcss-assets'
sourcemaps = require 'gulp-sourcemaps'

# HTML
minifyHTML = require 'gulp-minify-html'

# JS
webpack    = require 'webpack'
webpackStr = require 'webpack-stream'
uglify     = require 'gulp-uglify'
concat     = require 'gulp-concat'

# serve & LR
server     = require 'gulp-server-livereload'

# config
serverport = 5001

######

webpackConfig =
  entry:
    index: './src/js/app.jsx'
  output:
    filename: 'app.js'
  module:
    loaders: [
      test:  /\.jsx?$/
      exclude: /(node_modules|bower_components)/
      loader: 'babel-loader'
      query:
        presets: ['react', 'es2015']
    ]

# console.log webpackConfig.modules.loaders

gulp.task 'clean', -> del ['dist']

gulp.task 'styles', ->

  sassStream = gulp.src 'src/css/*.sass'
    .pipe sourcemaps.init()
    .pipe sass().on 'error', sass.logError
    .pipe postcss [
      autoprefix
        browsers: 'last 2 versions'
      # assets
      #   loadPaths: ['src/assets'] # noop for now
    ]
    .pipe sourcemaps.write()
    .pipe concat 'sass.css'

  cssStream = gulp.src 'src/css/*.css'
    .pipe concat 'css.css'

  merge(cssStream, sassStream)
    .pipe concat 'styles.css'
    .pipe gulp.dest 'dist/css'


gulp.task 'scripts', ->
  gulp.src '.'
    .pipe sourcemaps.init()
    # .pipe named()
    .pipe webpackStr(webpackConfig, webpack)
    .on 'error', (e) ->
      # gutil.log gutil.colors.red 'Webpack error:\n' + e.message
      @emit 'end'
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