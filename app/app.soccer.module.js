(function () {
    'use strict';
    angular.module('appVideoSuite.mdl',
    [
        //app modules

        //infrastructure modules
        'llaSpinner.drtvmdl',
        'llaVideoRecorder.drtvmdl',

        'imageManagement.ftrymdl',
        'lodash.ftrymdl',
        'utilities.ftrymdl',
        'currentUser.ftrymdl',
        'localStorage.ftrymdl',
        'requestCounter.ftrymdl',

        //third party modules
        'ui.router',
        'ngResource',
        'ngMessages',
        'ngSanitize',
        'ui.bootstrap',
        'ui.utils',
        'ui.select',
        'images-resizer',
        'FredrikSandell.worker-pool'

    ]);
})();