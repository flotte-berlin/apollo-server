const {src, dest, watch, series, task} = require('gulp');
const ts = require('gulp-typescript');
const del = require('delete');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
/**
 * Clears the dist folder by deleting all files inside.
 * @param cb
 */
function clearDist(cb) {
    del('dist/*', cb);
}

/**
 * Typescript compilation task.
 * @returns {*}
 */
function compileTypescript() {
    let tsProject = ts.createProject('tsconfig.json');
    let tsResult = tsProject.src().pipe(tsProject());
    return tsResult
    //.pipe(minify())
        .pipe(dest('dist'));
}

/**
 * Task for moving all remaining file from source to dist that don't need procession.
 * @returns {*}
 */
function moveRemaining() {
    return src(['src/**/*', '!src/**/*.ts'])
        .pipe(dest('dist'));
}

function runEslint() {
    return src(['scripts/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
}
task('eslint', () => {
    return src(['scripts/*.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

task('default', series(clearDist, compileTypescript, moveRemaining));

task('watch', () => {
    watch('**/*.ts', runEslint);
    watch('**/*.ts', compileTypescript);
    watch(['src/**/*', '!src/**/*.ts'], moveRemaining());
    nodemon({
        script: 'dist/index.js',
        watch: ['dist/**/*.js'],
        ext: 'js'
  });
});

task('watchnolint', () => {
    watch('**/*.ts', compileTypescript);
    watch(['src/**/*', '!src/**/*.ts'], moveRemaining());
    nodemon({
        script: 'dist/index.js',
        watch: ['dist/**/*.js'],
        ext: 'js'
  });
});