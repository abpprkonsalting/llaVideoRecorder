(function () {
    'use strict';

    angular
    .module('appVideoSuite.mdl')
    .config(configRoutes);

    configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'appVideoSuiteTplBaseUrlCnt'];
    function configRoutes($stateProvider, $urlRouterProvider, $locationProvider, appVideoSuiteTplBaseUrlCnt) {

        $stateProvider
            .state('video',
            {
                abstract: true,
                url: '/',
                resolve: {
                    gameUpdateFiltersSupdata: [
                        'gameData.ftry', 'statFilterVle', function (gameDataFtry, statFilterVle) {
                            statFilterVle.currentCompetition = null;
                            statFilterVle.currentSeason = null;
                            statFilterVle.currentMatchday = null;
                            statFilterVle.currentGame = null;
                            var result = {};//gameDataFtry.getGameUpdateFilters();
                            return result;
                        }
                    ]
                }
            })
            .state('video.gameSelector',
            {
                url: 'gameSelector',
                views: {
                    "content@": {
                        templateUrl: appVideoSuiteTplBaseUrlCnt + 'gameSelector/gameSelector.html',
                        controller: 'GameSelector.ctrl',
                        controllerAs: 'gameSelectorCtrl'
                    }
                }
            })
            .state('video.videoRecorder',
            {
                url: 'videoRecorder/:gameId',
                views: {
                    "content@": {
                        templateUrl: appVideoSuiteTplBaseUrlCnt + 'videoRecorder/videoRecorder.html',
                        controller: 'VideoRecorder.ctrl',
                        controllerAs: 'videoRecorderCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/gameSelector');
    }

    angular
    .module('appVideoSuite.mdl')
    .run(['$state', '$rootScope', function ($state, $rootScope) {
    }]);
})();