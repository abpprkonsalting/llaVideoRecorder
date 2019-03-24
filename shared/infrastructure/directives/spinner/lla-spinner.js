(function () {
    'use strict';

    angular.module('llaSpinner.drtvmdl', []);
    angular.module('llaSpinner.drtvmdl').directive('llaSpinner', llaSpinner);

    llaSpinner.$inject = ['requestCounter.ftry'];
    function llaSpinner(requestCounterFtry) {

        var directive = {
            restrict: "EAC",
            transclude: true,
            scope: {},
            template: "<ng-transclude ng-show='requestCount > 0'></ng-transclude>",
            link: function (scope) {

                scope.$watch(function () {
                    return requestCounterFtry.getRequestCount();
                }, function (requestCount) {
                    scope.requestCount = requestCount;
                });

            }
        };

        return directive;
    }
})();
