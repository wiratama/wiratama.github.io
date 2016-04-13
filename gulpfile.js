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
    sassPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js',
    imagesPath: 'src/images/**/*.+(png|jpg|gif|svg)',
    fontsPath: 'src/fonts/**/*',
    bowerDir: './bower_components'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    // return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
    return gulp.src(config.fontsPath)
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('css', function() {
  return gulp.src(config.sassPath)
    .pipe(sass({
            style: 'compressed',
            loadPath: [
                config.sassPath,
                // config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                // config.bowerDir + '/fontawesome/scss',
            ]
        })
    	.on("error", notify.onError(function (error) {
                return "Error: " + error.message;
        }))
    )
    .pipe(cssnano())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({
    	stream: true
    }))
})

gulp.task('js', function() {
  return gulp.src(config.jsPath)
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.reload({
    	stream: true
    }))
})

gulp.task('watch', ['browserSync', 'css','js','fonts', 'icons','images'], function() {
  gulp.watch(config.sassPath, ['css']);
  gulp.watch(config.jsPath, ['js']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch(config.jsPath, browserSync.reload);
})

gulp.task('fonts', function() {
  return gulp.src(config.fontsPath)
  .pipe(gulp.dest('assets/fonts'))
})

gulp.task('images', function(){
  return gulp.src(config.imagesPath)
  .pipe(gulp.dest('assets/images'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'assets'
    },
  })
})

gulp.task('clean:css', function() {
  return del.sync('assets/css');
})

gulp.task('clean:js', function() {
  return del.sync('assets/js');
})

gulp.task('default', function(callback) {
	runSequence(
		['css', 'js', 'images', 'fonts', 'icons', 'browserSync', 'watch'],
    	callback
  	)
})

gulp.task('build', function(callback) {
  runSequence(
  	'clean:css',
  	'clean:js',
  	['css', 'js', 'images', 'fonts', 'icons', 'browserSync', 'watch'],
    callback
  )
})