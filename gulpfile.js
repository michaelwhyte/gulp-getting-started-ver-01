var gulp = require('gulp');

// Gulp Plugins
var sa = require('gulp-sass');
var sm = require('gulp-sourcemaps');
var cc = require('gulp-concat');
var bs = require('browser-sync').create();
var ur = require('gulp-useref');
var ug = require('gulp-uglify');
var gi = require('gulp-if');
var im = require('gulp-imagemin');
var ca = require('gulp-cache');
var cc = require('gulp-clean-css');
var dl = require('del');
var rs = require('run-sequence');

// Gulp Tasks

gulp.task('hello', function(){
	console.log('Hello from Gulp!!!');
});

// Compile Tasks

gulp.task('sass', function(){
	return gulp.src('dev/scss/**/*.scss')
			.pipe(sm.init())
			.pipe(sa({outputStyle: 'compressed'}).on('error', sa.logError))
			.pipe(sm.write('./'))
			.pipe(gulp.dest('dev/css'))
			.pipe(bs.reload({stream: true}));
});

// Browser Tasks

gulp.task('browser-sync', function(){
	bs.init({
		server: {
			baseDir: 'dev'
		}
	})
});

// Optimization Tasks

// Optimize JS
gulp.task('js', function(){
	return gulp.src('dev/*.html')
			.pipe(ur())
			.pipe(gi('*.js', ug()))
			.pipe(gulp.dest('dist'));
});

// Optimize CSS
gulp.task('css', function(){
	return gulp.src('dev/css/**/*.css')
			.pipe(cc())
			.pipe(gulp.dest('dist/css'));
});

// Optimize Fonts
gulp.task('fonts', function(){
	return gulp.src('dev/fonts/**/*')
			.pipe(gulp.dest('dist/fonts'));
});

// Optimize Images
gulp.task('images', function(){
	return gulp.src('dev/images/**/*.+(png|jpg|gif|svg)')
			.pipe(ca(im({
				interlaced: true
			})))
			.pipe(gulp.dest('dist/images'))
});

// Cleaning Tasks

// Clean Distribution Folder
gulp.task('clean:dist', function(){
	return dl.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Watch Tasks

gulp.task('watch', ['browser-sync', 'sass'] ,function(){
	gulp.watch('dev/scss/**/*.scss', ['sass']);
	gulp.watch('dev/*.html', bs.reload);
	gulp.watch('dev/js/**/*.js', bs.reload);
});

// Build Tasks

gulp.task('build', function(callback){
	rs('clean:dist', 'sass', ['css', 'fonts', 'images', 'js'], callback)
});

// Default Task

gulp.task('default', function(callback){
	rs(['sass', 'browser-sync', 'watch'], callback)
});






