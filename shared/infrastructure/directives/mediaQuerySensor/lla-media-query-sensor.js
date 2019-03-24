(function () {
    'use strict';

    angular.module('llaMediaQuerySensor.drtvmdl', ['mediaQuery.ftrymdl']);
    angular.module('llaMediaQuerySensor.drtvmdl').directive('llaMediaQuerySensor', llaMediaQuerySensor);

    llaMediaQuerySensor.$inject = ['$window', 'getMediaQuery.ftry'];
    function llaMediaQuerySensor($window, getMediaQueryFtry) {

        var directive = {
            restrict: 'A',
            scope: {
                sensedValues: '=sensedValues',
                sensorResponse: '=sensorResponse',
            },
            link: function (scope, element, attrs, ctrl) {

                var w = angular.element($window);

                function getSensorResponse() {
                    var mediaQueryValue = getMediaQueryFtry.getMedia();

                    if (mediaQueryValue != getMediaQueryFtry.currentValue) {
                        if (getMediaQueryFtry.currentValue === null) {
                            getMediaQueryFtry.currentValue = mediaQueryValue;
                            updateSensor(mediaQueryValue);
                        } else {
                            getMediaQueryFtry.currentValue = mediaQueryValue;
                            scope.$apply(function () {
                                updateSensor(mediaQueryValue);
                            });
                        }
                    }
                }

                function updateSensor(mediaQueryValue) {
                    if (scope.sensedValues === undefined) {
                        scope.sensorResponse = false;
                    } else {
                        var index = scope.sensedValues.indexOf(mediaQueryValue);
                        if (index === -1) {
                            scope.sensorResponse = false;
                        } else {
                            scope.sensorResponse = true;
                        }
                    }
                }

                getMediaQueryFtry.currentValue = null;
                getSensorResponse();

                w.bind('resize', getSensorResponse);
                element.on('$destroy', function () {
                    angular.element($window).off('resize', getSensorResponse);
                });
            }
        };

        return directive;
    }



})();