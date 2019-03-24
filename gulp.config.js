module.exports = function () {

    var shared = './shared';
    var sharedConstants = '/infrastructure/constants/';
    var sharedDirectives = '/infrastructure/directives/';
    var sharedFactories = '/infrastructure/factories/';
    var sharedThirdPartyComp = '/infrastructure/third_party_components/';
    var sharedInfrastructure = '/infrastructure/';
    var sharedCustomTemplate = '/infrastructure/customTemplates/';
    var buildRoot = './gulp_build/';
    var buildCss = './gulp_build/content/css/';
    var buildJs = './gulp_build/content/js/';
    var temp = './gulp_build/temp/';
    var img = './gulp_build/content/img/';
    var fonts = './gulp_build/content/fonts/';
    var glyphs = './gulp_build/fonts/';
    var appRoot = './app/';
    var siteRoot = './';
    var siteContent = './content/';

    var config = {

        siteRoot: siteRoot,
        appRoot: appRoot,
        siteContent: siteContent,

        htmltemplates: [
           appRoot + '**/*.html',
           '!' + appRoot + 'index.html'
        ],

        htmltemplatesShared: [
            shared + sharedInfrastructure + '**/**/**/*.html',
            shared + sharedInfrastructure + '**/*.html'
        ],

        /**
        * template cache
        */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'appVideoSuite.mdl',
                standAlone: false,
                root: 'app/',
                transformUrl: function (url) {
                    return url.replace('app', '/app');
                }
            }
        },

        templateCacheShared: {
            file: 'templates1.js',
            options: {
                module: 'appVideoSuite.mdl',
                standAlone: false,
                root: 'shared/',
                transformUrl: function (url) {
                    return url.replace('shared', '/shared/infrastructure');
                }
            }
        },

        build: {
            'root': buildRoot,
            'css': buildCss,
            'js': buildJs,
            'temp': temp,
            'img': img,
            'fonts': fonts,
            'glyphs': glyphs
        },

        buildCssTemp: temp + '*.css',

        alljs: [
            './app/**/*.js',
            './*.js'
        ],

        input: {
            'less': [
                shared + '/content/css/less/boostraplla/lla.custom.boostrap.less',
                shared + '/content/css/less/lla.utilities.less',
                shared + '/content/css/less/lla.webFont.less',
                shared + '/content/css/less/shared_lements/lla.comp.ui-select.less',
                shared + '/content/css/less/shared_lements/lla.comp.ui-select.form.less',
                shared + '/content/css/less/shared_lements/lla.comp.custom.checkandradio.less',
                shared + '/content/css/less/shared_lements/lla.comp.input-number.less',
                shared + '/content/css/less/shared_lements/lla.comp.spinner.less',
                shared + '/content/css/less/lla_widgets/lla.info-message.less',
                shared + '/content/css/less/mixins.less',
                shared + '/content/css/less/lla.mng.forms-style.less',
                shared + '/content/css/less/lla.messages.less',
                './content/css/less/**/*.*'
            ],
            'images': siteContent + 'img/*.*',
            'fonts': shared + '/bower_components/font-awesome/fonts/**/*.*',
            'glyphicons': shared + '/content/css/less/fonts/**/*.*',
            'index': appRoot + 'index.html'
        },

        optimized: {
            app: 'app.js',
            thirdParty: 'thirdParty.js',
            shared: 'shared.js',
            lib: 'lib.js',
            head: 'head.js',
            others: 'others.js'
        },

        otherPlainCss: siteContent + 'css/*.css',
        appThirdPartyCss: [
            shared + 'content/css/animate.css',
            shared + 'content/css/lightbox.css',
            shared + '/bower_components/font-awesome/css/font-awesome.css'
        ],

        appJs: [
            './app/**/*.module.js',
            './app/**/*.js',
            './infrastructure/**/*.js'
        ],

        appJsShared: [
            shared + sharedFactories + 'getMediaQuery.factory.js',
            shared + sharedFactories + 'utilities.factory.js',
            shared + sharedFactories + 'currentUser.factory.js',
            shared + sharedFactories + 'localStorage.factory.js',
            shared + sharedFactories + 'imageManagement.factory.js',
            shared + sharedFactories + 'lodash.factory.js',
            shared + sharedFactories + 'requestCounter.factory.js',

            shared + sharedDirectives + 'spinner/lla-spinner.js',
            shared + sharedDirectives + 'videoRecorder/lla-video-recorder.js',
            shared + sharedCustomTemplate + 'ui-select/ui-select-down-arrow.js',
        ],

        appHeadJs: [
            shared + '/bower_components/jquery/dist/jquery.js',
            shared + '/bower_components/modernizr/modernizr.js'
        ],

        appThirdPartyJs: [
           shared + sharedThirdPartyComp + 'angular-bootstrap/ui-bootstrap-0.14.3.js',
           shared + '/content/js/bootstrap.js',
           shared + '/bower_components/angular-img-cropper/dist/angular-img-cropper.min.js',
           shared + sharedThirdPartyComp + 'media-recorder/recordRtc.js',
           shared + sharedThirdPartyComp + 'angular-workers-master/dist/angular-workers.js'
        ],

        othersJs: [
        ],

        bower: {
            json: require(shared + '/bower.VideoSuite/bower.json'),
            directory: shared + '/bower_components/',
            ignorePath: '../..'
        }
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
