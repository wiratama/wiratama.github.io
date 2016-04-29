var gulp 			= require('gulp');
var sass 			= require('gulp-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var browserSync 	= require('browser-sync');
var uglify 			= require('gulp-uglify');
var cssnano 		= require('gulp-cssnano');
var del 			= require('del');
var runSequence 	= require('run-sequence');
var sourcemaps 		= require('gulp-sourcemaps');
var watch       	= require('gulp-watch');
var bower 			= require('gulp-bower');
var notify 			= require('gulp-notify');

var config = {
    htmlPath: 'src/*.html',
    sassPath: 'src/scss/*.scss',
    jsPath: 'src/js/**/*.js',
    imagesPath: 'src/images/**/*.+(png|jpg|gif|svg)',
    fontsPath: 'src/fonts/**/*',
    bowerDir: 'bower_components'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
    // return gulp.src(config.fontsPath)
        .pipe(gulp.dest('apps/fonts'));
});

gulp.task('css', function() {
  return gulp.src(config.sassPath)
    .pipe(
    	sass
    	(
	    	{
	            style: 'compressed',
	            includePaths: [
	                config.sassPath,
	                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
	                config.bowerDir + '/fontawesome/scss',
	            ]
	        }
	    )
    	.on("error", notify.onError(function (error) {
                return "Error: " + error.message;
        }))
    )
    // .pipe(autoprefixer('last 2 version'))
    .pipe(cssnano())
    .pipe(gulp.dest('apps/css'))
    .pipe(browserSync.reload({
    	stream: true
    }))
})

gulp.task('js', function() {
  return gulp.src(
    // config.jsPath
      [
          config.jsPath,
          config.bowerDir + '/bootstrap-sass-official/assets/javascripts/*.js',
          config.bowerDir + '/jquery/dist/*.js',
      ]
    )
    .pipe(uglify())
    .pipe(gulp.dest('apps/js'))
    .pipe(browserSync.reload({
    	stream: true
    }))
})

gulp.task('watch', ['browserSync', 'css','js', 'html','fonts', 'icons','images'], function() {
  gulp.watch(config.sassPath, ['css']);
  gulp.watch(config.jsPath, ['js']);
  gulp.watch(config.htmlPath, ['html']);
  gulp.watch(config.fontsPath, ['fonts']);
  gulp.watch(config.imagesPath, ['images']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch(config.sassPath, browserSync.reload);
  gulp.watch(config.jsPath, browserSync.reload);
})

gulp.task('fonts', function() {
  return gulp.src(
      // config.fontsPath
      // {
        // includePaths: 
        [
            config.fontsPath,
            config.bowerDir + '/bootstrap-sass-official/assets/fonts/**/*',
            config.bowerDir + '/fontawesome/fonts/**/*',
        ]
      // }
    )
  .pipe(gulp.dest('apps/fonts'))
})

gulp.task('html', function() {
  return gulp.src(config.htmlPath)
  .pipe(gulp.dest('apps'))
})

gulp.task('images', function(){
  return gulp.src(config.imagesPath)
  .pipe(gulp.dest('apps/images'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'apps'
    },
  })
})

gulp.task('clean:css', function() {
  return del.sync('apps/css');
})

gulp.task('clean:js', function() {
  return del.sync('apps/js');
})

gulp.task('clean:fonts', function() {
  return del.sync('apps/fonts');
})

gulp.task('clean:images', function() {
  return del.sync('apps/images');
})

gulp.task('default', function(callback) {
	runSequence(
		['css', 'js', 'html', 'images', 'fonts', 'icons', 'browserSync', 'watch'],
    	callback
  	)
})

gulp.task('build', function(callback) {
  runSequence(
  	'clean:css',
    'clean:js',
    'clean:fonts',
  	'clean:images',
  	['css', 'js', 'html', 'images', 'fonts', 'icons', 'browserSync', 'watch'],
    callback
  )
})