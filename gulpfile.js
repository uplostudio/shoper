const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const minifyJs = require( 'gulp-uglify' );
const sourcemaps = require('gulp-sourcemaps');


const watchJS = () => {
    return gulp.src( '*.js' )
    .pipe(sourcemaps.init())
        .pipe( concat( 'app.js' ) )
    .pipe(sourcemaps.write(''))
    .pipe( gulp.dest( 'dist/') );
}

const watch = () => {
    gulp.watch( '*.js', watchJS);
}

const build = () => {
    return gulp.src( '*.js' )
    .pipe( minifyJs() )
    .pipe( concat( 'app.min.js' ) )
    .pipe( gulp.dest( 'dist/') );
}


exports.watch = watch;
exports.build = build;