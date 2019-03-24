(function () {
    'use strict';
    angular.module('appVideoSuite.mdl').factory('gameData.ftry', gameDataFtry);

    gameDataFtry.$inject = ['$resource', '$q', 'appSettingsCnt'];
    function gameDataFtry($resource, $q, appSettingsCnt) {

        var repository = {
            getSeasonByCompetition: getSeasonByCompetition,
            getGames: getGames,
            getMatchdaysBySeason: getMatchdaysBySeason,
        };

        return repository;

        function getGames(matchdayId, seasonId) {
            var resultSet = $resource(appSettingsCnt.serverPathApi + 'api/SoccerMngGameDataApi/getGames/', {}, { query: { isArray: false, params: { matchdayId: matchdayId, seasonId: seasonId } } });
            return resultSet.query().$promise.then(function (data) {
                return data;
            }).catch(function (data) {
                return $q.reject(data);
            });
        }

        function getMatchdaysBySeason(seasonId) {
            var resultSet = $resource(appSettingsCnt.serverPathApi + 'api/SoccerMngGameDataApi/getMatchdaysBySeason/', {}, { query: { isArray: false, params: { seasonId: seasonId } } });
            return resultSet.query().$promise.then(function (data) {
                return data;
            }).catch(function (data) {
                return $q.reject(data);
            });
        }

        function getMatchdaysBySeason(seasonId) {
            var resultSet = $resource(appSettingsCnt.serverPathApi + 'api/SoccerMngGameDataApi/getMatchdaysBySeason/', {}, { query: { isArray: false, params: { seasonId: seasonId } } });
            return resultSet.query().$promise.then(function (data) {
                return data;
            }).catch(function (data) {
                return $q.reject(data);
            });
        }

        function getSeasonByCompetition(competitionId) {
            var resultSet = $resource(appSettingsCnt.serverPathApi + 'api/SoccerMngGameDataApi/getSeasonByCompetition/', {}, { query: { isArray: false, params: { competitionId: competitionId } } });
            return resultSet.query().$promise.then(function (data) {
                return data;
            }).catch(function (data) {
                return $q.reject(data);
            });
        }
    }
})();