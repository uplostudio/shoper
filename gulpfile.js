const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const path = require('path');

const paths = {
    scripts: {
        src: 'src/**/*.js',  // Adjust the source path as needed
        dest: 'min/'
    }
};

function minify() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(paths.scripts.dest));
}

function watchFiles() {
    gulp.watch(paths.scripts.src, minify);
}

const build = gulp.series(minify, watchFiles);

exports.minify = minify;
exports.watch = watchFiles;
exports.default = build;
