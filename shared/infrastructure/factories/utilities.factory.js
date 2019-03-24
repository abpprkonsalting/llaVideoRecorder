(function () {
    'use strict';
    var timeReference = Date.now();
    angular.module('utilities.ftrymdl', []);
    angular.module('utilities.ftrymdl').factory('utilities.ftry', utilitiesFtry);

    utilitiesFtry.$inject = ['_', 'modal.ftry', '$translate'];
    function utilitiesFtry(_, modalFtry, $translate) {

        var repository = {
            searchByPattern: searchByPattern,
            logToConsole: logToConsole,
            logCategoriesAllowed: {
                'general information':true,
                'errors': true,
                'communication': false,
                'webworker': true,
                'webworker message': true,
                'puntual debug': true
            },
            getUsedLanguage: getUsedLanguage,
            confirm_resource_delete: confirm_resource_delete
        };

        return repository;

        function searchByPattern(source, searchPattern) {
            var result = [];

            if (searchPattern !== "") {
                result = _.filter(source, function (n) {
                    return n.Name.toLowerCase().indexOf(searchPattern.toLowerCase()) > -1;
                });
            } else {
                result = source;
            }

            return result;
        }

        function logToConsole(messages) {

            if (messages.category && repository.logCategoriesAllowed[messages.category] == true) {
                console.log('**********************************************************************************************');
                console.log('time: ' + (Date.now() - timeReference));
                for (var name in messages) {
                    if (messages[name] != undefined) {
                        var body;
                        if (typeof (messages[name]) != 'object') body = messages[name];
                        else body = JSON.stringify(messages[name]);
                        console.log(name + ': ' + body);
                    }
                }
            }
        }

        function getUsedLanguage() {
            return _.includes($translate.getAvailableLanguageKeys(), $translate.preferredLanguage()) ? $translate.preferredLanguage() : $translate.fallbackLanguage();
        }

        function confirm_resource_delete(ConfirmTextResourceToDelete, arrayClear, APIfunction,arrayResources,resourcesTotal,
                                        InformTextResourceDeleted,InformTextErrorDeleting) {

            $translate(ConfirmTextResourceToDelete, { NUMBER: arrayClear.length }, 'messageformat').then(

                    function (translated) {
                        var promise = modalFtry.open("confirmation", { text: translated });
                        promise.then(
                            function handleResolve() {
                                APIfunction(arrayClear).then(function (data) {
                                    angular.forEach(arrayClear, function (row) {
                                        _.remove(arrayResources, { 'SponsorId': row });
                                        resourcesTotal = arrayResources.length;
                                    });
                                    $translate(InformTextResourceDeleted, { NUMBER: arrayClear.length }, 'messageformat').then(
                                        function (translated) {
                                            //toastr.success(translated);
                                        });
                                    vm.clearSelectedRows = [];
                                }).catch(function (error) {
                                    $translate(InformTextErrorDeleting, { NUMBER: arrayClear.length }, 'messageformat').then(
                                        function (translated) {
                                            if (error.data.Message) {
                                                //toastr.error('Server Error: ' + error.data.Message);
                                            }
                                            //toastr.error(translated);
                                        });
                                });
                            },
                            function handleReject(error) {
                                if (error) {
                                    $translate(InformTextErrorDeleting, { NUMBER: arrayClear.length }, 'messageformat').then(
                                        function (translated) {
                                            //toastr.error(error.data.Message);
                                            //toastr.error(translated);
                                        });
                                }
                            });
                    }).catch(function (error) {
                        //toastr.error(error);
                    });
        }
    }
})();