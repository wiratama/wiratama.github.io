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

gulp.task('css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({
    	stream: true
    }))
})

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.reload({
    	stream: true
    }))
})

gulp.task('watch', ['browserSync', 'css','js','fonts','images'], function() {
  gulp.watch('src/scss/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('assets/fonts'))
})

gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
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
		['css', 'js', 'images', 'fonts', 'browserSync', 'watch'],
    	callback
  	)
})

gulp.task('build', function(callback) {
  runSequence(
  	'clean:css',
  	'clean:js',
  	['css', 'js', 'images', 'fonts', 'browserSync', 'watch'],
    callback
  )
})