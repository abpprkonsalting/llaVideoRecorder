(function () {
    'use strict';

    angular
        .module('appVideoSuite.mdl')
        .value('statFilterVle', {
            currentCompetition: null,
            currentSeason: null,
            currentMatchday: null,
            currentGame: null
        });
})();