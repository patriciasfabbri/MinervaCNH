const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');


const typeScriptProject = ts.createProject('tsconfig.json');


// HELPERS 
function onError(taskName) {
	return () => {
		console.log(`Error running task ${taskName}.`);
		process.exit(1);
	};
}

// TASKS
gulp.task('transpile', function () {
	const config = { includeContent: false, sourceRoot: '' };

	return typeScriptProject.src()
		.pipe(sourcemaps.init())
		.pipe(typeScriptProject())
		.on('error', onError('transpile'))
		.js
		.pipe(sourcemaps.write('.', config))
		.pipe(gulp.dest('app/'));
});


gulp.task('clean', function () {
	return gulp.src(['./app/**/*.*'], { read: false })
		.pipe(clean());
}); 

gulp.task('watch', function () {
	return gulp.watch('./src/**/*.ts', ['build']);
});


gulp.task('build', function (callback) {
	runSequence('clean', 'transpile', callback);
});