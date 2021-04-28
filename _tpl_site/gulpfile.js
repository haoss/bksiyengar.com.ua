"use strict"

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  uncss = require('gulp-uncss'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require("gulp-rename"),
  minifyCss  = require('gulp-minify-css'),
  plumber = require('gulp-plumber'),
  jade = require('gulp-jade'),
  spritesmith = require('gulp.spritesmith'),
  buffer = require('vinyl-buffer'),
  merge = require('merge-stream'),
  realFavicon = require ('gulp-real-favicon'),
  fs = require('fs'),
  watch = require('gulp-watch'),
  // svgmin = require('gulp-svgmin'),
  // svgstore = require('gulp-svgstore'),
  // cheerio = require('gulp-cheerio'),
  browserSync = require('browser-sync');

var plugins = require("gulp-load-plugins")();

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('favicon-1-generate', function(done) {
  realFavicon.generateFavicon({
    masterPicture: './favicon/favicon.png',
    dest: './dist/favicon',
    iconsPath: './favicon/',
    design: {
      ios: {
        pictureAspect: 'noChange'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'B.K.S.Iyengar Ukraine',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 53.90625,
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('favicon-2-inject-markups', function() {
  gulp.src([ './dist/*.html' ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('./dist/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('favicon-3-check-for-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    notify: false,
    reloadDelay: 3000
  });
});

gulp.task('sprite-svg', function () {
  return gulp.src('./img/svg-sprite/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hide');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest('./dist/img/svg-sprite/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('sprite-image', function () {
  var spriteData = gulp.src('./img-sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.sass',
    algorithm : 'top-down'
  }));
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(gulp.dest('./dist/img/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest('./sass/1-base/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

// jade
gulp.task('jade', function() {
  gulp.src('./jade/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: '    '
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('sass', function() {
  gulp.src('./sass/main.sass')
    .pipe(plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(sass({
        includePaths: ['./dist/css/'],
        onError: browserSync.notify
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    // .pipe(uncss({
    //    html: ['*.html']
    // }))
    .pipe(plugins.sourcemaps.write("./"))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function(){
  gulp.src('./dist/*.html')
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('js', function(){
  gulp.src('./dist/**/*.js')
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('watch', function () {
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./dist/*.html', ['html']);
  gulp.watch('./jade/**/*.jade', ['jade']);
  gulp.watch('./dist/**/*.js', ['js']);
  gulp.watch('./img/img-sprite/*.png', ['sprite-image']);
  gulp.watch('./img/svg-sprite/*.svg', ['sprite-svg']);
});

gulp.task('default', ['browser-sync', 'watch']);
