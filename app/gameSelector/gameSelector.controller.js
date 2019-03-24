(function () {
    'use strict';
    angular.module('appVideoSuite.mdl').controller('GameSelector.ctrl', gameSelectorCtrl);

    gameSelectorCtrl.$inject = ['statFilterVle'];
    function gameSelectorCtrl(statFilterVle) {
        var vm = this;

        vm.onCompetitionChanged = onCompetitionChanged;
        vm.onSeasonChanged = onSeasonChanged;
        vm.onMatchdayChanged = onMatchdayChanged;
        vm.onGamechange = onGameChange;

        vm.competitions = [];
        vm.competition = null;
        vm.seasons = [];
        vm.season = null;
        vm.matchdays = [];
        vm.matchday = null;
        vm.games = [];
        vm.game = null;

        /*************************************************************************************************************************/
        /* the real parameters should come from the backEnd using the methods of the factory gameDataFtry, here they have been 
        hardcoded for showcase purposes in the frontEnd */

        var constCompetitions = [{Name:"Test Competition",CompetitionId:1},{Name:"Test Competition1",CompetitionId:2}];
        var constSeasons = [{Edition:"Test Season",SeasonId:1},{Edition:"Test Season1",SeasonId:2}];
        var constMatchdays = [{MatchdayNumber:1,MatchdayId:1},{MatchdayNumber:2,MatchdayId:2}];
        var constGames = [  {CombinedName:"TeamA vs TeamB",GameId:1,HomeName:"Home Team",VisitorName:"Visitor Team",HomeTeamId:1,VisitorTeamId:2},
                            {CombinedName:"TeamC vs TeamD",GameId:2,HomeName:"Home Team",VisitorName:"Visitor Team",HomeTeamId:1,VisitorTeamId:2}];

        /*************************************************************************************************************************/
        activate();

        function activate() {
            if (statFilterVle.currentCompetition != null && statFilterVle.currentSeason != null && statFilterVle.currentMatchday != null) {

                vm.competition = statFilterVle.currentCompetition;
                vm.season = statFilterVle.currentSeason;
                vm.matchday = statFilterVle.currentMatchday;
                getStartUpdata(vm.competition, vm.season, vm.matchday);

            } else {
                /*gameUpdateFiltersSupdata.$promise.then(function (response) {
                    vm.competitions = response.competitions;
                    vm.seasons = response.seasons;
                    vm.matchdays = response.matchdays;
                    vm.competition = statFilterVle.currentCompetition = response.competitions[0];
                    vm.season = statFilterVle.currentSeason = response.seasons[0];
                    vm.matchday = statFilterVle.currentMatchday = response.matchdays[0];

                    getStartUpdata(vm.competition, vm.season, vm.matchday);

                }).catch(function (err) {
                    toastr.error(err);
                });*/
                vm.competitions = constCompetitions;
                vm.seasons = constSeasons;
                vm.matchdays = constMatchdays;
                vm.competition = statFilterVle.currentCompetition = vm.competitions[0];
                vm.season = statFilterVle.currentSeason = vm.seasons[0];
                vm.matchday = statFilterVle.currentMatchday = vm.matchdays[0];
                getStartUpdata(vm.competition, vm.season, vm.matchday);
            }
        }

        function onCompetitionChanged(competition) {
            statFilterVle.currentCompetition = competition;
            statFilterVle.currentSeason = vm.season = null;
            statFilterVle.currentMatchday = vm.matchday = null;

            /*gameDataFtry.getSeasonByCompetition(competition.CompetitionId).then(function (response) {
                vm.seasons = response.seasons;
                if (vm.seasons && vm.seasons.length > 0) {
                    vm.season = statFilterVle.currentSeason = vm.seasons[0];
                    return gameDataFtry.getMatchdaysBySeason(vm.season.SeasonId);
                } else {
                    throw 'La competición no tiene una temporada asociada';
                }
            }).then(function (data) {
                vm.matchdays = data.matchdays;
                if (vm.matchdays && vm.matchdays.length > 0) {
                    vm.matchday = statFilterVle.currentMatchday = vm.matchdays[0];
                    return gameDataFtry.getGames(vm.matchday.MatchdayId, vm.season.SeasonId);
                } else {
                    throw 'No existe un calendario para la temporada. Ir a TEMPORADAS -> CALENDARIO para crear uno';
                }
            }).then(function (data) {
                vm.games = data.leagueCalendar;
                if (vm.games && vm.games.length > 0) {
                    vm.game = statFilterVle.currentGame = vm.games[0];
                } else {
                    throw 'No se encuentran partidos para los datos proporcionados';
                }
            }).catch(function (err) {
                toastr.error(err);
            });*/

            vm.seasons = constSeasons;
            vm.matchdays = constMatchdays;
            vm.games = constGames;
        }

        function onSeasonChanged(season) {
            statFilterVle.currentCompetition = vm.competition;
            statFilterVle.currentSeason = season;
            statFilterVle.currentMatchday = vm.matchday = null;

            /*gameDataFtry.getMatchdaysBySeason(vm.season.SeasonId).then(function (response) {
                vm.matchdays = response.matchdays;
                if (vm.matchdays && vm.matchdays.length > 0) {
                    vm.matchday = statFilterVle.currentMatchday = vm.matchdays[0];
                    return gameDataFtry.getGames(vm.matchday.MatchdayId, vm.season.SeasonId);
                } else {
                    throw 'No existe un calendario para la temporada. Ir a TEMPORADAS -> CALENDARIO para crear uno';
                }
            }).then(function (data) {
                vm.games = data.leagueCalendar;
                if (vm.games && vm.games.length > 0) {
                    vm.game = statFilterVle.currentGame = vm.games[0];
                } else {
                    throw 'No se encuentran partidos para los datos proporcionados';
                }
            }).catch(function (err) {
                toastr.error(err);
            });*/

            vm.matchdays = constMatchdays;
            vm.games = constGames;
        }

        function onMatchdayChanged(matchday) {
            statFilterVle.currentCompetition = vm.competition;
            statFilterVle.currentSeason = vm.season;
            statFilterVle.currentMatchday = matchday;
            getStartUpdata(vm.competition, vm.season, vm.matchday);
        }

        function getStartUpdata(competition, season, matchday) {
            if (matchday && matchday.MatchdayId > 0 && season && season.SeasonId > 0) {

                /*return gameDataFtry.getGames(matchday.MatchdayId, season.SeasonId).then(function (response) {
                    vm.games = response.leagueCalendar;
                    if (vm.games && vm.games.length > 0) {
                        vm.game = statFilterVle.currentGame = vm.games[0];
                        //console.log(vm.game);
                    } else {
                        throw 'No se encuentran partidos para los datos proporcionados';
                    }
                }).catch(function (err) {
                    toastr.error(err);
                });*/

                vm.games = constGames;

            } else {
                throw 'No existe un calendario para la temporada. Ir a TEMPORADAS -> CALENDARIO para crear uno';
            }
        }

        function onGameChange(game) {
            statFilterVle.currentGame = vm.game;
        }
    }
})();