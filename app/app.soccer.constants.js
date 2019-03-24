(function () {
    'use strict';

    angular
        .module('appVideoSuite.mdl')
        .constant('appVideoSuiteTplBaseUrlCnt', '/app/')
        .constant("appSettingsCnt",
        {
            sitePath: "/",
            serverPathApi: "/services/",
            sitePathSoccerStat: "/soccerstat/",
            sitePathSoccerMng: "/soccermng/",
            sitePathSoccerPref: "/soccerpref/",
            sitePathShared: "/shared/"
        });
})();