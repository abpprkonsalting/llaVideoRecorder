(function () {
    'use strict';
    angular.module('appVideoSuite.mdl').controller('IndexVideoSuite.ctrl', indexVideoSuiteCtrl);

    indexVideoSuiteCtrl.$inject = ['$window', 'appSettingsCnt'];
    function indexVideoSuiteCtrl($window, appSettingsCnt) {
        var vm = this;

        vm.gotoStat = gotoStat;
        vm.gotoMng = gotoMng;
        vm.logout = logout;
        vm.userName = null;
        vm.userImage = null;

        activate();

        function activate() {
            vm.userName = "test user";
            vm.userImage = "";
        }

        function gotoStat() {
            $window.location.href = appSettingsCnt.sitePathSoccerStat;
        }

        function gotoMng() {
            $window.location.href = appSettingsCnt.sitePathSoccerMng;
        }

        function logout() {
            $window.location.href = appSettingsCnt.sitePath;
        }
    }
})();