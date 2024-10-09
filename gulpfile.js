const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const path = require('path');
const fs = require('fs');

const paths = {
    scripts: {
        src: 'src/**/*.js',  // This will match all .js files in src and its subdirectories
        bundleSrc: [
            'src/new_form_handler-main.js',
            'src/accordion.js',
            'src/new_trial/shared_utils.js',
            'src/new_trial/two_step_trial.js',
            'src/form_helper.js',
            'src/global-data.js',
            'src/animations.js',
            'src/intercom_helper.js',
            'src/navigation.js',
            'src/afiliant.js',
            'src/valueTrack.js'
        ],
        dest: 'bundle/',
        minDest: 'min/'
    }
};

function bundle() {
    return gulp.src(paths.scripts.bundleSrc)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(paths.scripts.dest));
}

function cleanMin(cb) {
    if (fs.existsSync(paths.scripts.minDest)) {
        fs.rm(paths.scripts.minDest, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(err);
            }
            cb();
        });
    } else {
        cb();
    }
}

function createMinDir(cb) {
    if (!fs.existsSync(paths.scripts.minDest)) {
        fs.mkdir(paths.scripts.minDest, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            }
            cb();
        });
    } else {
        cb();
    }
}

function minifyAllFiles() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest(paths.scripts.minDest));
}

function watchFiles() {
    gulp.watch(paths.scripts.src, gulp.series(bundle, cleanMin, createMinDir, minifyAllFiles));
}

const build = gulp.series(bundle, cleanMin, createMinDir, minifyAllFiles, watchFiles);

exports.bundle = bundle;
exports.watch = watchFiles;
exports.default = build;
