(function () {
    'use strict';
    angular.module('lodash.ftrymdl', []);
    angular.module('lodash.ftrymdl').factory('_', _);

    _.$inject = ['$window'];

    function _($window) {

        var lodash = $window._;
        delete ($window._);

        return (lodash);
    }
})();