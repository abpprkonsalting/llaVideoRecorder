(function () {
    'use strict';
    angular.module('modal.drtvmdl', []);
    angular.module('modal.drtvmdl').factory('modal.ftry', modalFtry);
    angular.module('modal.drtvmdl').directive('llaModalWindow', llaModalWindow);

    modalFtry.$inject = ['$rootScope', '$q'];
    function modalFtry($rootScope, $q) {

        var modal = {
            deferred: null,
            params: null
        };

        var repository = {
            open: open,
            params: params,
            proceedTo: proceedTo,
            reject: reject,
            resolve: resolve
        };

        return repository;

        function open(type, localParams, pipeResponse) {
            var previousDeferred = modal.deferred;
            modal.deferred = $q.defer();
            modal.params = localParams;
            if (previousDeferred && pipeResponse) {
                modal.deferred.promise.then(previousDeferred.resolve, previousDeferred.reject);
            } else if (previousDeferred) {
                previousDeferred.reject();
            }

            $rootScope.$emit("modals.open", type);
            return (modal.deferred.promise);
        }

        function params() {
            return (modal.params || {});
        }

        function proceedTo(type, localParams) {
            return (open(type, localParams, true));
        }

        function reject(reason) {
            if (!modal.deferred) {
                return;
            }
            modal.deferred.reject(reason);
            modal.deferred = modal.params = null;
            $rootScope.$emit("modals.close");
        }

        function resolve(response) {
            if (!modal.deferred) {
                return;
            }
            modal.deferred.resolve(response);
            modal.deferred = modal.params = null;
            $rootScope.$emit("modals.close");
        }
    }

    llaModalWindow.$inject = ['$rootScope', 'modal.ftry'];
    function llaModalWindow($rootScope, modalFtryLocal) {

        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                scope.subview = null;

                function handleClickEvent(event) {
                    //console.log(event.target);
                    //console.log(element[0]);
                    if (element[0] !== event.target) {
                        //console.log('click adentro');
                        return;
                    }

                    scope.$apply(modalFtryLocal.reject);
                }

                $rootScope.$on("modals.open", function handleModalOpenEvent(event, modalType) {
                    scope.subview = modalType;
                });

                $rootScope.$on("modals.close", function handleModalCloseEvent(event) {
                    scope.subview = null;
                });

                element.bind('click', handleClickEvent);
                element.on('$destroy', function () {
                    element.off('click', handleClickEvent);
                });
            }
        };

        return directive;

    }
})();

