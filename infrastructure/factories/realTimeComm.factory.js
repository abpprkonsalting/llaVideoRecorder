(function () {
    'use strict';
    angular.module('appVideoSuite.mdl').factory('realTimeComm.ftry', realTimeCommFtry);

    function realTimeCommFtry() {

        var repository = {
            start: start,
            getProxy: getProxy
        };

        return repository;

        function start() {
            $.connection.hub.start();
        }

        function getProxy() {
            return $.connection.realTimeUpdate;
        }
    }
})();