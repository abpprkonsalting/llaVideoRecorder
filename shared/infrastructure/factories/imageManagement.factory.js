(function () {
    'use strict';
    angular.module('imageManagement.ftrymdl', []);
    angular.module('imageManagement.ftrymdl').factory('imageManagement.ftry', imageManagementFtry);

    imageManagementFtry.$inject = ['$q', 'resizeService'];
    function imageManagementFtry($q, resizeService) {

        var repository = {
            imgb64ToFile: imgb64ToFile,
            fileToImgb64: fileToImgb64,
            imageResizeByDimension: imageResizeByDimension
        };

        return repository;

        function imgb64ToFile(image, name) {

            var deferred = $q.defer();

            if (image) {
                var dataUri = image;
                var binary = atob(dataUri.split(',')[1]);
                var mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }

                var file = new Blob([new Uint8Array(array)], { type: mimeString });
                file.name = name;
                file.lastModifiedDate = new Date();
                //console.log(file);

                deferred.resolve(file);

            } else {
                deferred.reject('Debe seleccionar una imagen');
            }

            return deferred.promise;
           
        }

        function fileToImgb64(file) {

            var deferred = $q.defer();

            if (!file) {
                deferred.reject('No file selected');
            }
            else {
                if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                    deferred.reject('Your browser do not support reading file');
                }

                var reader = new FileReader();
                reader.onload = function (e) {
                    deferred.resolve(e.target.result);
                };
                reader.onabort = function (e) {
                    deferred.reject('Fail to convert file in base64img, aborted: ');
                };
                reader.onerror = function (e) {
                    deferred.reject('Fail to convert file in base64img, error: ');
                };

                reader.readAsDataURL(file);
            }

            return deferred.promise;
        }

        function imageResizeByDimension(imgb64, targetWidth, targetHeight) {

            var deferred = $q.defer();

            resizeService.resizeImage(imgb64, { width: targetWidth, height: targetHeight }, function (err, image) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(image);
            });

            return deferred.promise;
        }
    }
})();