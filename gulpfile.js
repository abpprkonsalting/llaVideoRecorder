var gulp = require('gulp');
var args = require('yargs').argv;
var del = require('del');
//var sprity = require('sprity');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({ lazy: true });
var series = require('stream-series');

gulp.task('fonts', ['glyphs'], function () {
    log('Copying fonts');

    return gulp
        .src(config.input.fonts)
        .pipe(gulp.dest(config.build.fonts));
});

gulp.task('glyphs', function () {
    log('Copying glyphs');

    return gulp
        .src(config.input.glyphicons)
        .pipe(gulp.dest(config.build.glyphs));
});

gulp.task('less-watcher', function () {
    gulp.watch([config.input.less], ['styles']);
});

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.input.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.build.temp));
});

gulp.task('copyIndex', function () {
    log('Copy Index to site root');

    return gulp
        .src(config.input.index)
        .pipe(gulp.dest(config.siteRoot));
});

gulp.task('wiredepDev', ['copyIndex'], function () {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    var appJs = gulp.src(config.appJs, { read: false });
    var appJsShared = gulp.src(config.appJsShared, { read: false });
    var appHeadJs = gulp.src(config.appHeadJs, { read: false });
    var othersJs = gulp.src(config.othersJs, { read: false });
    var appThirdPartyJs = gulp.src(config.appThirdPartyJs, { read: false });

    return gulp
        .src('index.html')
        .pipe(wiredep(options))
        .pipe($.inject(appHeadJs, { starttag: '<!-- inject:head:js -->', addRootSlash: false }))
        .pipe($.inject(othersJs, { starttag: '<!-- inject:others:js -->', addRootSlash: false }))
        .pipe($.inject(appThirdPartyJs, { starttag: '<!-- inject:thirdParty:js -->', addRootSlash: false }))
        .pipe($.inject(appJsShared, { starttag: '<!-- inject:shared:js -->', addRootSlash: false }))
        .pipe($.inject(series(appJs), { addRootSlash: false }))
        .pipe(gulp.dest(config.siteRoot));
});

gulp.task('injectDev', ['wiredepDev', 'styles'], function () {
    log('Wire up the app css into the html, and call wiredep ');
    var compiledBoostrapCss = gulp.src(config.build.temp + 'lla.custom.boostrap.css', { read: false });
    var compiledCss = gulp.src([config.buildCssTemp, '!' + config.build.temp + 'lla.custom.boostrap.css'], { read: false });
    var appThirdPartyCss = gulp.src(config.appThirdPartyCss, { read: false });

    return gulp
        .src('index.html')
        .pipe($.inject(compiledBoostrapCss, { starttag: '<!-- inject:boostrap:css -->', addRootSlash: false }))
        .pipe($.inject(appThirdPartyCss, { starttag: '<!-- inject:thirdParty:css -->', addRootSlash: false }))
        .pipe($.inject(series(compiledCss), { addRootSlash: false }))
        .pipe(gulp.dest(config.siteRoot));
});

gulp.task('templatecache', function () {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
            ))
        .pipe(gulp.dest(config.build.temp));
});

gulp.task('templatecacheShared', function () {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplatesShared)
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.angularTemplatecache(
            config.templateCacheShared.file,
            config.templateCacheShared.options
            ))
        .pipe(gulp.dest(config.build.temp));
});

gulp.task('injectRelease', ['injectDev', 'templatecache', 'templatecacheShared', 'clean-code'], function () {
    log('Preparing css and js files to optimize, obtimizing html and cleaning js/css build folder');
});

gulp.task('optimize', ['injectRelease'], function () {
    log('Optimizing the javascript, css, injecting html templates');

    var assets = $.useref.assets();
    var cssFilter = $.filter('**/*.css', { restore: true });
    var jsHeadFilter = $.filter('**/' + config.optimized.head, { restore: true });
    var jsLibFilter = $.filter('**/' + config.optimized.lib, { restore: true });
    var jsthirdPartyFilter = $.filter('**/' + config.optimized.thirdParty, { restore: true });
    var jsSharedFilter = $.filter('**/' + config.optimized.shared, { restore: true });
    var jsAppFilter = $.filter('**/' + config.optimized.app, { restore: true });

    return gulp
        .src('index.html')
        .pipe($.plumber())
        .pipe($.inject(
             gulp.src(config.build.temp + 'templates.js', { read: false }), {
                 starttag: '<!-- inject:templates:js -->'
             }))
         .pipe($.inject(
             gulp.src(config.build.temp + 'templates1.js', { read: false }), {
                 starttag: '<!-- inject:templates1:js -->'
             }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsHeadFilter)
        .pipe($.uglify())
        .pipe(jsHeadFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        .pipe(jsthirdPartyFilter)
        .pipe($.uglify())
        .pipe(jsthirdPartyFilter.restore)
        .pipe(jsSharedFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsSharedFilter.restore)
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.siteRoot));
});

gulp.task('buildDev', ['injectDev'], function () {
    log('Create build for Develop');

    return gulp
        .src('index.html')
        .pipe($.replace('./shared/', '/shared/'))
        .pipe(gulp.dest(config.siteRoot));
});

gulp.task('buildRelease', ['optimize'], function (done) {
    log('Performing cleaning temp files after build');
    var delconfig = [].concat(config.build.temp);
    del(delconfig, done);
});

gulp.task('clean-temp', function (done) {
    var delconfig = [].concat(config.build.temp);
    del(delconfig, done);
});

gulp.task('clean-styles', function (done) {
    var files = config.build.css + '**/*.css';
    clean(files, done);
});

gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.build.js + '**/*.js',
        config.build.css + '**/*.css'
    );
    clean(files, done);
});

gulp.task('clean', ['clean-code', 'clean-styles', 'clean-temp']);

gulp.task('clean-images', function (done) {
    clean(config.build.img + '**/*.*', done);
});

gulp.task('clean-fonts', function (done) {
    clean(config.build.fonts + '**/*.*', done);
});

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
