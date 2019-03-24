(function () {
    'use strict';
    angular.module('requestCounter.ftrymdl', []);
    angular.module('requestCounter.ftrymdl').factory('requestCounter.ftry', requestCounterFtry);

    requestCounterFtry.$inject = ['$window', '$q'];
    function requestCounterFtry($window, $q) {

        var requests = 0;

        var request = function (config) {
            requests += 1;
            return config;
        };

        var requestError = function (error) {
            requests -= 1;
            return $q.reject(error);
        };

        var response = function (data) {
            requests -= 1;
            return $q.when(data);
        };

        var responseError = function (error) {
            requests -= 1;
            return $q.reject(error);
        };

        var getRequestCount = function () {
            return requests;
        };

        return {
            request: request,
            response: response,
            requestError: requestError,
            responseError: responseError,
            getRequestCount: getRequestCount
        };
    }
})();
