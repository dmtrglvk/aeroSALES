var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	autoprefixer = require('autoprefixer'),
	pug = require('gulp-pug'),
	svgmin = require('gulp-svgmin'),
	svgstore = require('gulp-svgstore'),
	browserSync = require('browser-sync').create(),
	watch = require('gulp-watch'),
	rupture = require('rupture'),
	copy = require('gulp-copy'),
	poststylus = require('poststylus');
	reload = browserSync.reload;

var config = {
	pugSrc: './source/pug/pages/*.pug',
	stylusSrc: './source/stylus/app.styl',
	svgSrc: './source/images/svg/*.svg',
	fontsSrc: './source/fonts/*.css'
};

gulp.task('views', function buildHTML() {
	return gulp.src(config.pugSrc)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./web/'))
		.pipe(reload({stream:true}));
});

gulp.task('styles', function () {
	return gulp.src(config.stylusSrc)
		.pipe(stylus({
			use: [poststylus([autoprefixer({ browsers: ['last 5 versions'] })]), rupture()]
		}))
		.pipe(gulp.dest('./web/css/'))
		.pipe(reload({stream:true}));
});

gulp.task('svg', function() {
	function transformSvg($svg, done) {
		// remove all fill attributes
		$svg.find('[fill]').removeAttr('fill');
		done(null, $svg)
	}
	return gulp.src(config.svgSrc)
		.pipe(svgmin())
		.pipe(svgstore({
			fileName: 'icons.svg',
			prefix: 'icon-',
			transformSvg: transformSvg
		}))
		.pipe(gulp.dest('./web/images/svg/'))
});

gulp.task('copy', function () {
	gulp.src(config.fontsSrc)
		.pipe(gulp.dest('./web/fonts/'));
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./web/"
		}
	});
});

gulp.task('watch', function() {
	gulp.watch('./source/stylus/**/*.styl', ['styles']);
	gulp.watch('./source/pug/**/*.pug', ['views']);
});

gulp.task('default', ['views', 'styles', 'svg', 'copy', 'watch', 'browser-sync']);