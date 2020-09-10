const {src, dest, watch, series, task} = require('gulp');
const ts = require('gulp-typescript');
const del = require('delete');
var tslint = require("gulp-tslint");

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

function runTSlint(){
    src('src/**/*.ts')
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report())
}
task("tslint", () =>
    src('src/**/*.ts')
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

task('default', series(clearDist, compileTypescript, moveRemaining));

task('watch', () => {
    watch('**/*.ts', compileTypescript);
    watch(['src/**/*', '!src/**/*.ts'], moveRemaining());
});

task('watchtslint', () => {
    watch('**/*.ts', runTSlint);
    watch('**/*.ts', compileTypescript);
    watch(['src/**/*', '!src/**/*.ts'], moveRemaining());
});