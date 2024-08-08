const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const path = require('path');

const paths = {
    scripts: {
        src: [
            'src/new_form_handler-main.js',
            'src/accordion.js',
            'src/new_trial/shared_utils.js',
            'src/new_trial/new_step_one.js',
            'src/new_trial/new_step_two.js',
            'src/new_trial/new_step_three.js',
            'src/form_helper.js',
            'src/global-data.js',
            'src/animations.js',
            'src/intercom_helper.js',
            'src/navigation.js',
            'src/afiliant.js',
            'src/valueTrack.js'
        ],
        dest: 'bundle/'
    }
};

function bundle() {
    return gulp.src(paths.scripts.src)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(paths.scripts.dest));
}

function watchFiles() {
    gulp.watch(paths.scripts.src, bundle);
}

const build = gulp.series(bundle, watchFiles);

exports.bundle = bundle;
exports.watch = watchFiles;
exports.default = build;
