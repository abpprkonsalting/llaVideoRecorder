(function () {
    "use strict";

    angular.module('localStorage.ftrymdl', []);
    angular.module("localStorage.ftrymdl").factory("localStorage.ftry", localStorageFtry);

    localStorageFtry.$inject = ['$window'];
    function localStorageFtry($window) {

        var repository = {
            add: add,
            get: get,
            remove: remove
        };

        var store = $window.localStorage;

        return repository;

        function add(key, value) {
            value = angular.toJson(value);
            store.setItem(key, value);
        }

        function get(key) {
            var value = store.getItem(key);
            if (value) {
                value = angular.fromJson(value);
            }
            return value;
        }

        function remove(key) {
            store.removeItem(key);
        }
    }
})();
