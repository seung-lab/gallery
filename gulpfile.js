var argv = require('yargs').argv,
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    es = require('event-stream'),
    through2 = require('through2'),
    replace = require('gulp-replace'),
    include = require('gulp-include'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require("gulp-babel"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    mocha = require('gulp-mocha'),
    print = require('gulp-print'),
    mergeStream = require('merge-stream'),
    templateCache = require('gulp-angular-templatecache');

var fs = require('fs');
var del = require('del');
var path = require('path');
var extend = require('node.extend');

var SOURCEMAPDEST = '../source-maps/';

if (argv.help) {
    console.log("Major tasks: js, css, clean, watch");
    console.log("Flags:");
    console.log("--production: Minify and generate sourcemaps. Does not deploy to production.");
    process.exit();
}

function transpileES6 () {
    return through2.obj(function (file, encoding, done) {
        var filepath = file.history[0];
        var ext = path.extname(filepath);

        if (ext === '.es6') {
            babel({
                presets: [ 'es2015' ],
            })
            .on('data', function (data) {
                done(null, data);
            })
            .write(file);
        }
        else {
            done(null, file);
        }
    })
}

gulp.task('images', function () {
    var s1 = gulp
        .src('app/images/**')
        .pipe(gulp.dest('dist/public/images/'));

    var s2 = gulp.src('app/icons/**')
        .pipe(gulp.dest('dist/public/icons'))

   var s3 = gulp
        .src('app/images/favicon*')
        .pipe(gulp.dest('dist/public/'));

    return mergeStream(s1, s2, s3);
});

gulp.task('bower', function () {
    return gulp.src('app/bower_components/**')
        .pipe(gulp.dest('dist/public/bower_components/'));
});


gulp.task('scripts', function () {
    var glp = gulp.src([
            "app/bower_components/jquery/dist/jquery.js",
            // "app/bower_components/lodash/lodash.js",
            "app/bower_components/threejs/build/three.js",
            "app/bower_components/d3/d3.js",
            "app/bower_components/c3/c3.js",
            "app/bower_components/angular/angular.js",
            "app/bower_components/js-openctm/src/CTMLoader.js",
            "app/bower_components/angular-resource/angular-resource.js",
            "app/bower_components/angular-cookies/angular-cookies.js",
            "app/bower_components/angular-mocks/angular-mocks.js",
            "app/bower_components/angular-scenario/angular-scenario.js",
            "app/bower_components/angular-ui-router/release/angular-ui-router.js",
            "app/bower_components/angular-animate/angular-animate.js",
            "app/bower_components/angular-aria/angular-aria.js",
            "app/bower_components/angular-material/angular-material.js",
            "app/bower_components/trianglify/dist/trianglify.min.js",
            "app/bower_components/angular-cache/dist/angular-cache.js",
            'app/scripts/**/*.js',
            'app/scripts/**/*.es6',
          //  'dist/public/templates.js',
        ])
        .pipe(transpileES6())
        .pipe(concat('app.js'));

    if (argv.production) {
        glp = glp.pipe(sourcemaps.init())
                .pipe(uglify())
            .pipe(sourcemaps.write(SOURCEMAPDEST));
    }

    return glp.pipe(gulp.dest('dist/public/js'));
});

gulp.task('templates', function () {
    // combine all template files of the app into a js file
    return gulp.src([
            'app/views/*.html'
        ])
        .pipe(gulp.dest('dist/public/templates/'))
        .pipe(templateCache('templates.js', { standalone: true }))
        .pipe(gulp.dest('dist/public/'))
});

gulp.task('styles', function () {
    var stream = gulp.src([
        'app/styles/normalize.css',
        'app/styles/*.css',
        'app/styles/main.styl'
    ])
        .pipe(concat('all.styl'))
        .pipe(stylus())
        .pipe(autoprefixer({
            browser: "> 1%, last 2 versions, Firefox ESR"
        }));

    var stream2 = gulp.src([
        'app/bower_components/angular-material/angular-material.css'
    ]);

    stream = mergeStream(stream, stream2).pipe(concat('all.css'));

    if (argv.production) {
        stream.pipe(cssnano());
    }
    
    return stream.pipe(gulp.dest('dist/public/css/'));
});

gulp.task('copy-index', function() {
    gulp.src('app/index.html')    
        .pipe(gulp.dest('dist'));
});

gulp.task('watch',function (done) {
    gulp.watch([
        'app/**/*.js',
        'app/**/*.es6',
    ], [ 'scripts' ]);

    gulp.watch([
        '!app/index.html',
        'app/**/*.html'
    ], [ 'templates' ]);

    gulp.watch([
        'app/index.html'
    ], [ 'copy-index' ]);
    
    gulp.watch([
        './app/**/*.css',
        './app/**/*.styl'
    ], [ 'styles' ]);
});

gulp.task('test', [ 'default' ], function () {
    return gulp.src([
            'server/**/*.spec.js'
        ], { read: false })
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('clean', function () {
    del([
        'build/**',
        'dist/**'
    ]);
});

gulp.task('default', [ 'scripts', 'bower', 'templates', 'images', 'styles', 'copy-index' ]);

