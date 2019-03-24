(function () {
    'use strict';

    var timeReference = Date.now();
    angular.module('llaVideoRecorder.drtvmdl', []);
    angular.module('llaVideoRecorder.drtvmdl').directive('llaVideoRecorder', llaVideoRecorder);
    angular.module('llaVideoRecorder.drtvmdl').directive('llaVideoRecorderControl', llaVideoRecorderControl);
    angular.module('llaVideoRecorder.drtvmdl').factory('llaVideoRecorder.ftry', llaVideoRecorderFtry);

    llaVideoRecorder.$inject = ['llaVideoRecorder.ftry', '$timeout','_','$window'];
    function llaVideoRecorder(llaVideoRecorderFtry, $timeout,_,$window) {

        var directive = {
            restrict: 'E',
            templateUrl: 'lla-video-recorder.html',
            replace: true,
            scope: {
                id: '@id',
                state: '=llaVideoState',
                videoDevices: '=llaVideoVideoDevices',
            },
            controller: videoRecorderCtrl,
            controllerAs: 'videoRecorderCtrl',
            link: videoRecorderLink
        };

        function videoRecorderLink(scope, element, attrs) {
            
            llaVideoRecorderFtry.registerRecorder(scope.id).then(function (response) {
                if (response != null) {

                    scope.state = response.state;
                    scope.videoDevices = response.deviceCapabilities.videoDevices;

                    llaVideoRecorderFtry.registerCallBackFunction(response.callBackFunctions, exportState,
                        [scope,response], 'changeState', 'videoRecorder(' + response.id + '):Link');

                    function exportState(scope,recorder) {
                        
                        $timeout(function () {
                            scope.state = recorder.state;
                        });
                    }

                    if ($(element[0].parentElement).width() > response.mediaConstraints.video.width.min) {
                        response.mediaConstraints.video.width.ideal = $(element[0].parentElement).width();
                    } else {
                        response.mediaConstraints.video.width.ideal = response.mediaConstraints.video.width.min;
                    }
                    if ($(element[0].parentElement).height() > response.mediaConstraints.video.height.min) {
                        response.mediaConstraints.video.height.ideal = $(element[0].parentElement).height();
                    } else {
                        response.mediaConstraints.video.height.ideal = response.mediaConstraints.video.height.min;
                    }
                    response.videoElement = {
                        'element':$(element[0].firstChild),
                        'originalDisplayValue': $(element[0].firstChild).css('display')
                    };
                    response.previewElement = {
                        'element': $(element[0].lastElementChild),
                        'originalDisplayValue': $(element[0].lastElementChild).css('display'),
                        'previews': $(_.map($(element[0].lastElementChild)[0].children, function (children) {
                            return children.firstChild;
                        }))
                    };
                    response.previewElement.previews.on('timeupdate', null,null, function () {
                        if (this.currentTime >= 1) {
                            this.currentTime = 0;
                        }
                    });
                    if (attrs.touchAction != undefined) {

                        switch (attrs.touchAction) {
                            case 'takeSnapShotThenPreviewFromCodeThenSend':
                                element.on('click', null, null, function (event) {
                                    if (response.state == 1 && event.target == this.children[0]) { 
                                        response.takeVideoSnapShot();
                                    }
                                });
                            case 'previewFromCodeThenSendSnapShot':
                                element.on('llavideoshowpreviews', null, null, function (event) {
                                    if (response.state == 2) {
                                        //console.log.timed('videoRecorder(' + response.id + ')_function(click event handler)', 'showing previews');
                                        response.showPreview();
                                    }
                                    //else {
                                    //    console.log.timed('videoRecorder(' + response.id + ')_function(click event handler)', 'device not in capture state, nothing to preview');
                                    //}
                                });
                            case 'sendSnapShot':
                                response.previewElement.previews.on('click', null, null, function (event) {
                                        response.saveVideoSnapShot(Number(($(this)[0].id).slice(7)), JSON.parse(attrs.llaVideoParams));
                                });
                                break;
                            case 'takeThenSendSnapShot':
                                break;
                            default:
                                break;
                        }
                    }
                    element.on('llavideoselectdevice', null, null, function () {
                        
                        if ((response.deviceSelected + 1) < response.deviceCapabilities.videoDevices.length) response.deviceSelected++;
                        else response.deviceSelected = 0;

                        response.mediaConstraints.video.deviceId = response.deviceCapabilities.videoDevices[response.deviceSelected].deviceId;

                        if (response.state > 0) {
                            response.restart = true;
                            response.stopRecording();
                        }

                    });
                    element.on('llavideostop', null, null, function () {
                        response.stopRecording();
                    });

                } else {
                    element.css("display", 'none');
                }
            });
        };

        videoRecorderCtrl.$inject = ['$scope'];
        function videoRecorderCtrl($scope) {
            
            $scope.$on("$destroy", function () {
                
                console.log(document.URL);
                console.log(document.URL.search('videosuite'));
                console.log(document.URL.substring(0, document.URL.search('videosuite') + 11));
                $window.location.href = document.URL.substring(0, document.URL.search('videosuite') + 11);
            });

        }

        return directive;
    }

    llaVideoRecorderControl.$inject = ['llaVideoRecorder.ftry'];
    function llaVideoRecorderControl(llaVideoRecorderFtry) {
        var directive = {
            restrict: 'A',
            scope: {
                type: '@llaVideoRecorderControl',
                templateRecorders: '@llaVideoRecorders',
                hideWhenInactive: '@llaVideoHideWhenInactive',
                triggerEvent: '@llaVideoTriggerEvent',
                //params: '<llaVideoParams'
            },
            link: link,
            controller: videoRecorderControlCtrl
        };
       
        function link(scope, element, attrs) {
            scope.originalDisplayValue = element.css("display");
            scope.myAttrs = attrs;
            if (scope.recorders.length > 0) {

                // At least one recorder object has been registered in the scope of this directive. The method binRecorders is run to bind the
                // directive to those recorders.

                bindRecorders(scope, element);
            }

            /*
            A callback is registered in the scope of this directive with the purpose of, in the next execution of "registerControl", binRecorders
            is invoqued again.

            When the function Ctrl of this directive is run, in the callback array of the factory is registered the function "registerControl" of this
            directive so each time a parent directive registers a new recorder in the factory, the former is run. This solution is for dealing with the
            asyncronism on the registering processes of the directives: <lla-video-recorder> and <lla-video-control>; and for the possibility of one 
            control directive managing several recorder directives.
            */

            llaVideoRecorderFtry.registerCallBackFunction(scope.callBackFunctions, bindRecorders,
                [scope, element], 'registerControl', 'Link');

            function bindRecorders(param0, param1) {
                if (param0.hideWhenInactive == 'true') showHideControl(param0, param1);

                var realBindFunction;
                switch (param0.type) {
                    case 'Record':
                        realBindFunction = bindRecord;
                        break;
                    case 'Stop':
                        realBindFunction = bindStop;
                        break;
                    case 'Capture':
                        realBindFunction = bindCapture;
                        break;
                    case 'ShowPreview':
                        realBindFunction = bindShowPreview;
                    default:

                }
                param0.recorders.forEach(function (recorder) {
                    if (!recorder.binded) {
                        param1.on(param0.triggerEvent, null, { 'recorder': recorder.realRecorder, 'scope': param0}, realBindFunction);
                        if (param0.hideWhenInactive == 'true') llaVideoRecorderFtry.registerCallBackFunction(recorder.realRecorder.callBackFunctions, showHideControl,
                        [param0, param1], 'changeState', 'videoRecorder' + param0.type + 'Control_binRecorders:' + param0.$id);
                        recorder.binded = true;
                    }
                });

                function bindRecord(event) {
                    if (event.data.recorder.state == 0) {
                        //console.log.timed('videoRecorder' + event.data.scope.type +
                        //    'Control(' + event.data.scope.$id + ')_function(bindRecord)', 'recording started');
                        event.data.recorder.startRecording();
                    }
                    //else {
                    //    console.log.timed('videoRecorder' + event.data.scope.type +
                    //        'Control(' + event.data.scope.$id + ')_function(bindRecord)', 'device not in stoped state, nothing to start');
                    //}
                }

                function bindStop(event) {
                    if (event.data.recorder.state > 0) {
                        //console.log.timed('videoRecorder' + event.data.scope.type +
                        //    'Control(' + event.data.scope.$id + ')_function(bindStop)', 'recording stopped');
                        event.data.recorder.stopRecording();
                    }
                    //else {
                    //    console.log.timed('videoRecorder' + event.data.scope.type +
                    //        'Control(' + event.data.scope.$id + ')_function(bindStop)', 'device not in recording state, nothing to stop');
                    //}
                }

                function bindCapture(event) {
                    if (event.data.recorder.state == 1) {
                        //console.log.timed('videoRecorder' + event.data.scope.type +
                            //'Control(' + event.data.scope.$id + ')_function(bindCapture)', 'interval captured');
                        event.data.recorder.takeVideoSnapShot();
                    }
                    //else {
                    //    console.log.timed('videoRecorder' + event.data.scope.type +
                    //        'Control(' + event.data.scope.$id + ')_function(bindCapture)', 'device not in recording state, nothing to capture');
                    //}
                }

                function bindShowPreview(event) {
                    if (event.data.recorder.state == 2) {
                        //console.log.timed('videoRecorder' + event.data.scope.type +
                        //    'Control(' + event.data.scope.$id + ')_function(bindShowPreview)', 'showing previews');
                        event.data.recorder.showPreview();
                    }
                    //else {
                    //    console.log.timed('videoRecorder' + event.data.scope.type +
                    //        'Control(' + event.data.scope.$id + ')_function(bindShowPreview)', 'device not in capture state, nothing to preview');
                    //}
                }
            }

            function showHideControl(scope, element) {
                var result = 'none';
                scope.recorders.some(function (recorder) {
                    if (scope.showCondition.indexOf(recorder.realRecorder.state) == -1) {
                        result = scope.originalDisplayValue;
                        return true;
                    }
                    else return false;
                });
                element.css('display', result);
            }
        }

        videoRecorderControlCtrl.$inject = ['$scope'];
        function videoRecorderControlCtrl($scope) {
            $scope.callBackFunctions = [];
            $scope.recordersNames = $scope.templateRecorders.split(",");
            $scope.recorders = [];

            switch ($scope.type) {
                case 'Record':
                    // The Record elements will be shown when the recorder is not in states: "recording", "capturing", o "previewing".
                    $scope.showCondition = [1,2,3];
                    break;
                case 'Stop':
                    // The Stop elements will be shown when the recorder is not in states: "stopped".
                    $scope.showCondition = [0];
                    break;
                case 'Capture':
                    // The Capture elements will be shown when the recorder is not in states: "stopped", "capturing", o "previewing".
                    $scope.showCondition = [0,2,3];
                    break;
                case 'ShowPreview':
                    // The ShowPreview elements will be shown when the recorder is not in states: "stopped", or "recording".
                    $scope.showCondition = [0,1,3];
                    break;
                default:
                    // Nothing to show.
                    $scope.showCondition = [0,1,2,3];
                    break;
            }

            registerControl($scope);

            llaVideoRecorderFtry.registerCallBackFunction(llaVideoRecorderFtry.getInternalCallBackFunctionsArray(), registerControl,
                [$scope], 'registerRecorder', 'videoRecorder' + $scope.type + 'Control_Ctrl:' + $scope.$id);
        };

        function registerControl(param) {

            // registerInternalRecorderControl returns the recorder objects that have been previously registered in the factory and which
            // names are included in the array recordersNames. This array is the list on this directive "Control" that indicates which
            // recorders this control affects.

            var result = llaVideoRecorderFtry.registerInternalRecorderControl(param.recordersNames, param.type);

            // For each registered recorder in the factory, and that can be controlled by this directive it's checked that it has not been
            // previously registered in the scope of this directive. If it's not, then it is registered.

            result.forEach(function (recorder) {
                var exist = false;
                param.recorders.some(function (rec) {
                    if (rec.realRecorder.id == recorder.id) {
                        exist = true;
                        return true;
                    }
                    else return false;
                });
                if (!exist) param.recorders.push({ 'binded': false, 'realRecorder': recorder });
            });

            param.callBackFunctions.forEach(function (element) {
                if (element.functionName === 'registerControl') {
                    element.callback(element.params[0], element.params[1]);
                }
            });
        };

        return directive;
    }

    /***************************************************************************************************/
    /***********************************             FACTORY           *********************************/

    llaVideoRecorderFtry.$inject = ['WorkerService'];
    function llaVideoRecorderFtry(WorkerService) {

        
        var repository = {

            registerRecorder: registerRecorder,
            unregisterRecorder: unregisterRecorder,
            registerInternalRecorderControl: registerInternalRecorderControl,
            getInternalCallBackFunctionsArray: getInternalCallBackFunctionsArray,
            registerCallBackFunction: registerCallBackFunction,
            unRegisterCallBackFunction: unRegisterCallBackFunction,
        };

        // Recorder object constructor
        var recorder = function (id, deviceCapabilities, factoryWorker) {

            // Properties
            this.id = id;
            this.deviceCapabilities = deviceCapabilities;
            this.deviceSelected = this.deviceCapabilities.videoDevices[0] ? 0: undefined;
            this.mediaConstraints = {
                'audio': false,
                'video': {
                    'deviceId': this.deviceCapabilities.videoDevices[this.deviceSelected].deviceId,
                    'width': { 'min': 240, 'ideal': 1024 },
                    'height': { 'min': 120, 'ideal': 768 },
                    'frameRate': { 'min': 20, 'ideal': 30 }
                }
            };

            // 0 -> stopped.
            // 1 -> recording.
            // 2 -> capture.
            // 3 -> showPreview.
            this.state = 0;
            this.restart = false;
            

            this.stream = null;
            this.videoElement = {};
            this.previewElement = {};
            this.previousSnapShotTime;

            // These two parameters should be parametrized in the directive html.
            this.intervalsDuration = 3;    // Interval duration.
            this.intervals = 9;            // Intervals count.
            this.waitingForCompletionOfCycleTimer = null;

            this.videoSemaphore = false;
            this.orderVideoSnapShot = false;
            this.blobs = [];
            this.videoSnapShot = [];

            this.factoryWorker = factoryWorker;
            this.callBackFunctions = [];

            // Methods

            this.startRecording = startRecording;
            this.stopRecording = stopRecording;
            this.changeState = changeState;
            this.recordingCycle = recordingCycle;
            this.takeVideoSnapShot = takeVideoSnapShot;
            this.takeVideoSnapShotPosponed = takeVideoSnapShotPosponed;
            this.showPreview = showPreview;
            this.saveVideoSnapShot = saveVideoSnapShot;
        }
        var recorders = [];
        var callBackFunctions = [];
        var angularWorker = undefined;

        activate();

        return repository;

        function activate() {

            var webWorkersGeneralLibrariesURL = URL.createObjectURL(new Blob([
            'var snapShots = [];' +
            'snapShots.semaphore = true;' +
            'var sendingCycle = undefined;' +
            'var currentSendingSnapShotState = {\'chunksSendedCountDown\' :0,\'error\' :false, \'sendingTimeOutCounter\': 0};' +
            'var sendingTimer = undefined;' +
            'var addSnapShot = undefined;' +
            'var addSnapShotDelayed;' +
            'var addSnapShotTimer = undefined;' +
            'var snapShotsQueue = [];'

            ], { type: 'application/javascript' }));

            WorkerService.addLibrary(webWorkersGeneralLibrariesURL);

            WorkerService.createAngularWorker(['input', 'output', '$resource', webWorkerFunction]).then(function (response) {
                angularWorker = response;
                recorders.forEach(function (recorder) {
                    recorder.factoryWorker = response;
                });
                return angularWorker.run('initializeWebWorker');
            }).then(function success(result) {
                console.log('result: ' + result);
            }, function error(reason) {
                //handle error  
                console.log('webWorker error');
                console.log(reason);
            }, function notify(update) {

                // Events handler for the webworker updates to the invoquer (factory in this case).
                // Not used for now. 

                //utilitiesFtry.logToConsole({
                //    'category': 'webworker',
                //    'factory': 'mediaRecorderFtry',
                //    'function': 'activate',
                //    'message from worker': update
                //});
            });
        }

        function registerRecorder(id) {

            recorders.some(function (recorder) {
                if (recorder.id == id) {
                    if (recorder.state != 0) recorder.stopRecording();
                    recorders.splice(recorders.indexOf(recorder), 1);
                    return true;
                }
                else return false;
            });
            return getDeviceCapabilities().then(function (response) {

                // If the device has camera then the recorder object is created and registered.
                if (response != null && response.videoDevices.length > 0) {
                    var newRecorder = new recorder(id, response, angularWorker);
                    recorders.push(newRecorder);
                    callBackFunctions.forEach(function (callBackFunction) {
                        if (callBackFunction.functionName === 'registerRecorder') {
                            callBackFunction.callback(callBackFunction.params[0]);
                        }
                    });
                    return newRecorder;
                }
                else return null;
            }).catch(function () {
                console.log(err.name + ": " + error.message);
                return null;
            });
        }

        function unregisterRecorder(id) {
            recorders.some(function (recorder) {
                if (recorder.id == id) {

                    if (recorder.state != 0) recorder.stopRecording();
                    recorders.splice(recorders.indexOf(recorder), 1);
                    return true;
                }
                else return false;
            });
        }

        function getDeviceCapabilities() {

            // List cameras and microphones.
            return navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                var deviceCapabilities = {
                    'videoDevices': [],
                    'audioDevices':[]
                }
                devices.forEach(function (device) {
                    
                    if (device.kind === 'videoinput') {
                        deviceCapabilities.videoDevices.push(device);
                    }
                    else if (device.kind === 'audioinput') {
                        deviceCapabilities.audioDevices.push(device);
                    }
                });
                return deviceCapabilities;
            })
            .catch(function (err) {
                console.log(err.name + ": " + error.message);
                return null;
            });
        };

        function registerInternalRecorderControl(videoRecorders, type) {
            var recordersCollection=[];
            recorders.forEach(function (recorder) {
                videoRecorders.forEach(function (videoRecorder) {
                    if (recorder.id == videoRecorder) {
                        recordersCollection.push(recorder)
                    };
                });
            });
            return recordersCollection;
        }

        function getInternalCallBackFunctionsArray() {
            return callBackFunctions;
        }

        function registerCallBackFunction(callbacksArray,callback,params, localFunction, registerer) {
            callbacksArray.push({ 'functionName': localFunction, 'params': params, 'callback': callback, 'registerer': registerer });
            callbacksArray[callbacksArray.length - 1].index = callbacksArray.length - 1;
            //console.log.timed('registerCallBackFunction', registerer);
            //console.dir.timed('registerCallBackFunction', callbacksArray);
        }

        function unRegisterCallBackFunction(callbacksArray, registerer) {
            callbacksArray.some(function (element) {
                if (element.registerer === registerer) {
                    callbacksArray.splice(element.index, 1);
                    return true;
                }
                else return false;
            });
        }

        function recordingCycle(stop, recorder) {

            if (recorder.videoSemaphore == true) {
                console.log('**************************************************************************');
                console.warn('the semaphore was true entering recordingCycle')
                console.log('**************************************************************************');
            }
            recorder.videoSemaphore = true;
            var now = Date.now();
            var timeThisSnapShot = Math.floor( (now - recorder.previousSnapShotTime)/1000);
            recorder.previousSnapShotTime = now;
            recorder.audioVideoRecorder.stopRecording(function (url) {

                
                if (recorder.blobs.index < recorder.intervals) {
                    if (recorder.blobs.length < recorder.intervals) recorder.blobs.push(angular.copy(recorder.audioVideoRecorder.getBlob()));
                    else recorder.blobs[recorder.blobs.index] = angular.copy(recorder.audioVideoRecorder.getBlob());
                    recorder.blobs[recorder.blobs.index].index = recorder.blobs.index;
                    recorder.blobs.index++;
                }
                else {
                    recorder.blobs.index = 0;
                    recorder.blobs[recorder.blobs.index] = angular.copy(recorder.audioVideoRecorder.getBlob());
                    recorder.blobs[recorder.blobs.index].index = recorder.blobs.index;
                    recorder.blobs.index++;
                }

                if (recorder.orderVideoSnapShot == true) {

                    recorder.videoSnapShot = angular.copy(recorder.blobs);
                    recorder.videoSnapShot.index = recorder.blobs.index - 1;
                    var start = recorder.videoSnapShot.slice(recorder.videoSnapShot.index + 1);
                    var final = recorder.videoSnapShot.slice(0, recorder.videoSnapShot.index + 1);
                    recorder.videoSnapShot = start.concat(final);
                    recorder.videoSnapShot.index = 0;
                    recorder.videoElement.element[0].pause();
                    recorder.videoElement.element.css('opacity', '0.4');
                    for (var x = 0; x < 9; x++) {
                        if (recorder.videoSnapShot[x]) {
                            recorder.previewElement.previews[x].src = URL.createObjectURL(recorder.videoSnapShot[x]);
                            recorder.previewElement.previews[x].muted = true;
                            recorder.previewElement.previews[x].controls = false;
                            recorder.previewElement.previews[x].play();

                            recorder.previewElement.previews[x].nextSibling.innerText = (timeThisSnapShot + ((recorder.videoSnapShot.length - 1 - x) * recorder.intervalsDuration)) + 's' ;
                        }
                        else {
                            recorder.previewElement.previews[x].src = '';
                        }
                    }
                    recorder.changeState(2);
                    recorder.orderVideoSnapShot = false;
                    
                }
                if (!stop) {
                    recorder.audioVideoRecorder = new RecordRTC(recorder.stream, {
                        type: 'video',
                        disableLogs: true
                    });
                    recorder.audioVideoRecorder.startRecording();
                }
                recorder.videoSemaphore = false;
            });
        }

        function startRecording() {
            var recorder = this;
            navigator.mediaDevices.getUserMedia(this.mediaConstraints)
                .then(function (mediaStream) {

                    recorder.stream = mediaStream;

                    // This is because chrome deprecated URL.createObjectURL with streams
                    recorder.videoElement.element[0].srcObject = mediaStream;
                    //recorder.videoElement.element[0].src = URL.createObjectURL(mediaStream);
                    
                    recorder.videoElement.element[0].muted = true;
                    recorder.videoElement.element[0].controls = false;
                    recorder.videoElement.element[0].play();
                    recorder.blobs = [];
                    recorder.blobs.index = 0;

                    recorder.audioVideoRecorder = new RecordRTC(mediaStream, {
                        type: 'video',
                        disableLogs: true
                    });
                    recorder.audioVideoRecorder.startRecording();
                    recorder.videoElement.element.css('display', 'block');
                    recorder.videoElement.element.css('opacity', '1');
                    recorder.previewElement.element.css('display', 'none');
                    recorder.recordingTimer = setInterval(recorder.recordingCycle, recorder.intervalsDuration * 1000, false,recorder);
                    recorder.changeState(1);

                })
                .catch(function (err) { console.log(err.name + ": " + err.message) });
            
        };

        function stopRecording() {
            var recorder = this;

            // Stop timer of recordingCycle.
            clearInterval(this.recordingTimer);

            // Stop recording RTC object

            if (recorder.audioVideoRecorder != undefined) {
                recorder.audioVideoRecorder.stopRecording(function (url) {
                    recorder.stream.stop();
                    recorder.videoElement.element[0].src = '';
                    recorder.changeState(0);
                    if (recorder.restart == true) {
                        recorder.restart = false;
                        recorder.startRecording();
                    }
                });
            }

            // Clear previews and hide them;
            for (var x = 0; x < 9; x++) {
                recorder.previewElement.previews[x].src = "";
            }
            recorder.videoElement.element.css('display', 'none');
            recorder.previewElement.element.css('display', 'none');

            this.blobs = [];
            this.videoSnapShot = [];
            
        };

        function changeState(state) {
            
            this.state = state;
            this.callBackFunctions.forEach(function (callBackFunction) {
                if (callBackFunction.functionName === 'changeState') {
                    callBackFunction.callback(callBackFunction.params[0], callBackFunction.params[1]);
                }
            });
            //console.log.timed('changeState', this.state);
        }

        function takeVideoSnapShot() {
            if (this.state == 1) {
                if (this.videoSemaphore == true) {
                    this.waitingForCompletionOfCycleTimer = setInterval(this.takeVideoSnapShotPosponed, 100);
                }
                else {
                    this.orderVideoSnapShot = true;
                    this.recordingCycle(false, this);
                }
            }
        };

        function takeVideoSnapShotPosponed() {
            if (this.videoSemaphore == true) {
                this.orderVideoSnapShot = true;
                this.recordingCycle(false,this);
                if (this.waitingForCompletionOfCycleTimer != null) {
                    clearInterval(this.waitingForCompletionOfCycleTimer);
                    this.waitingForCompletionOfCycleTimer = null;
                }
                return true;
            } else return false;
        }

        function showPreview() {
            if (this.state == 2) {
                this.previewElement.element.css('display', 'block');
                this.changeState(3);
            }
        }

        function saveVideoSnapShot(id, params) {
            for (var x = 0; x < 9; x++) {
                this.previewElement.previews[x].src = "";
            }
            this.videoElement.element.css('display', 'block');
            this.videoElement.element[0].play();
            this.videoElement.element.css('opacity', '1');
            this.previewElement.element.css('display', 'none');
            this.changeState(1);

            /*************************************************************************************************************************/
            /* In the following block the original code passed the blobs to the webworker so they will be uploaded to the backEnd
            where they get concatenated and saved. For the purpose of showing the working in the frontEnd a function for concatenating
            and saving in the user PC was added */
            
            
            /*this.factoryWorker.run({
                'blobsToSend': this.videoSnapShot.slice(id),
                'extraInfo': params
            });*/

            concatenateBlobs(this.videoSnapShot.slice(id), 'video/webm', function(resultingBlob) {
                saveAs(resultingBlob);
            });
            /*************************************************************************************************************************/

        }

        /* This function was added with purposes of saving the result of the capture from the browser to user file system */
            
        function concatenateBlobs (blobs, type, callback) {
            var buffers = [];
    
            var index = 0;
    
            function readAsArrayBuffer() {
                if (!blobs[index]) {
                    return concatenateBuffers();
                }
                var reader = new FileReader();
                reader.onload = function(event) {
                    buffers.push(event.target.result);
                    index++;
                    readAsArrayBuffer();
                };
                reader.readAsArrayBuffer(blobs[index]);
            }
    
            readAsArrayBuffer();
    
            function concatenateBuffers() {
                var byteLength = 0;
                buffers.forEach(function(buffer) {
                    byteLength += buffer.byteLength;
                });
                
                var tmp = new Uint16Array(byteLength);
                var lastOffset = 0;
                buffers.forEach(function(buffer) {
                    // BYTES_PER_ELEMENT == 2 for Uint16Array
                    var reusableByteLength = buffer.byteLength;
                    if (reusableByteLength % 2 != 0) {
                        buffer = buffer.slice(0, reusableByteLength - 1)
                    }
                    tmp.set(new Uint16Array(buffer), lastOffset);
                    lastOffset += reusableByteLength;
                });
    
                var blob = new Blob([tmp.buffer], {
                    type: type
                });
    
                callback(blob);
            }
        }

        /************************************************************************************************/
        /************************   webWorker    *************************/

        function webWorkerFunction(input, output, $resource) {

            if (input == 'initializeWebWorker' && sendingCycle == undefined) {

                sendingCycle = function () {

                    runSnapShotsQueue = function (snapShot) {
 
                        currentSendingSnapShotState.chunksSendedCountDown = snapShot.blobsToSend.length;
                        currentSendingSnapShotState.sendingTimeOutCounter = 0;
                        currentSendingSnapShotState.chunksCount = new Array(snapShot.blobsToSend.length);
                        currentSendingSnapShotState.chunksCount.fill(0);

                        for (var x = 0; x < snapShot.blobsToSend.length; x++) {

                            angular.extend(snapShot.extraInfo, { currentVideoChunk: x + 1, totalVideoChunks: snapShot.blobsToSend.length });
                            var resultSet = $resource(serverAddress,snapShot.extraInfo,actions);
                            currentSendingSnapShotState.chunksCount[x] = x;
                            postChunk(resultSet, snapShot.blobsToSend[x], x);
                        }
                        sendingTimer = setInterval(checkSnapShotSend, 1000);
                    };

                    postChunk = function (promise, chunk, id) {
                        var id = id;
                        promise.post(chunk).$promise.then(function (data) {
                            currentSendingSnapShotState.chunksSendedCountDown--;
                        }).catch(function (data) {
                            currentSendingSnapShotState.chunksCount[id]++;
                            if (currentSendingSnapShotState.chunksCount[id] < 10) postChunk(promise, chunk, id);
                            else currentSendingSnapShotState.error = true;
                        });
                    }
                    
                    checkSnapShotSend = function () {

                        var clear = false;
                        if (currentSendingSnapShotState.chunksSendedCountDown == 0) {
                            if (snapShots.semaphore == true) {

                                snapShots.semaphore = false;
                                snapShots.shift();
                                snapShots.semaphore = true;
                                clear = true;
                                if (snapShots.length != 0) runSnapShotsQueue(snapShots[0]);
                            }
                        }
                        else {
                            if (currentSendingSnapShotState.repeat == true || (currentSendingSnapShotState.sendingTimeOutCounter == 180)) {

                                clear = true;
                                currentSendingSnapShotState.repeat = false;
                            } else {
                                currentSendingSnapShotState.sendingTimeOutCounter++;
                            }
                        }
                            
                        if (clear) {
                            clearInterval(sendingTimer);
                            sendingTimer = undefined;
                            currentSendingSnapShotState.chunksCount = undefined;
                        }
                    }

                    runSnapShotsQueue(snapShots[0]);
                };

                addSnapShot = function (snapShot) {
                    if (addSnapShotDelayed(snapShot)) {
                        if (snapShots.length == 1) sendingCycle();
                    }
                    else {
                        snapShotsQueue.push(snapShot);
                        if (addSnapShotTimer == undefined) {
                            addSnapShotTimer = setInterval(function () {
                                if (addSnapShotDelayed(snapShotsQueue[0])) {
                                    snapShotsQueue.shift();
                                    if (snapShotsQueue.length == 0) {
                                        clearInterval(addSnapShotTimer);
                                        addSnapShotTimer = undefined;
                                    }
                                    if (snapShots.length == 1) sendingCycle();
                                }
                            }, 100);
                        }
                    }
                }

                addSnapShotDelayed = function (snapShot) {
                    if (snapShots.semaphore == true) {
                        snapShots.semaphore = false;
                        snapShots.push(snapShot);
                        snapShots.semaphore = true;
                        return true;
                    } else return false;
                }

            } 
            else if (input == 'stopWebWorker') {
            }
            else if (input.blobsToSend) {
                
                addSnapShot(input);

            }
        }

        /************************************************************************************************/
        /************************************************************************************************/

    };

    angular.module("llaVideoRecorder.drtvmdl").run(["$templateCache", function ($templateCache) {
        $templateCache.put("lla-video-recorder.html",
            "<div style=\"position: absolute;top:0;left:0;width:100%;height:100%;\">" +
                "<video style=\"position: absolute;top:0;left:0;width:100%;height:100%;object-fit: fill;display:none\"id=\"{{id + '_videoElement'}}\"></video>" +
                "<div style=\"position: absolute;top:0;left:0;width:100%;height:100%;font-size: 0;display:none\">" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-top: none;border-left: none;\">" +
                        "<video id=\"preview0\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-top: none;\">" +
                        "<video id=\"preview1\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-top: none;border-right: none;\">" +
                        "<video id=\"preview2\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-left: none;\">" +
                        "<video id=\"preview3\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\">s</span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;\">" +
                        "<video id=\"preview4\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-right: none;\">" +
                        "<video id=\"preview5\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-bottom: none;border-left: none;\">" +
                        "<video id=\"preview6\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-bottom: none;\">" +
                        "<video id=\"preview7\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +

                    "<div style=\"display: inline-block;width:33.3333333%;height:33.3333333%;position:relative;" +
                                "border-style: solid;border-width: thin;border-bottom: none;border-right: none;\">" +
                        "<video id=\"preview8\" style=\"width:100%;height:100%;font-size: 0;object-fit: fill;\"></video>" +
                        "<span style=\"position: absolute;left: 0;top: 0;margin-top: 5px;margin-left:5px;font-size:14px;\"></span>" +
                    "</div>" +
                "</div>" +
            "</div>");
    }]);

    //Helpers:

    function logTimed(param1,param2) {
        console.log((Date.now() - timeReference) + ': ' + param1 + ': ' + param2);
    }
    function dirTimed(param1, param2) {
        console.log((Date.now() - timeReference) + ': ' + param1 + ': ');
        console.dir(param2);
    }
    console.log.timed = logTimed;
    console.dir.timed = dirTimed;


})();