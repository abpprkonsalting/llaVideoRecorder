(function () {
    'use strict';
    angular.module('mediaQuery.ftrymdl', []);
    angular.module('mediaQuery.ftrymdl').factory('getMediaQuery.ftry', getMediaQueryFtry);

    getMediaQueryFtry.$inject = ['$window'];
    function getMediaQueryFtry($window) {

        var repository = {
            getMedia: getMedia,
            currentValue: null,
        };

        return repository;

        function getMedia() {
            var windowWidth = $window.innerWidth;

            if (windowWidth >= 320 && windowWidth <= 359) {
                return 'Phone XSmall';

            } else if (windowWidth >= 360 && windowWidth < 479) {
                return 'Phone Small';

            } else if (windowWidth >= 480 && windowWidth < 619) {
                return 'Phone XSmall Inverse';

            } else if (windowWidth >= 620 && windowWidth < 767) {
                return 'Phone Small Inverse';

            } else if (windowWidth >= 768 && windowWidth < 991) {
                return 'Tablet';

            } else if (windowWidth >= 992 && windowWidth < 1119) {
                return 'Desktop';

            } else if (windowWidth >= 1200) {
                return 'Large Desktop';
            }

            return 'Large Desktop';
        }
    }
})();