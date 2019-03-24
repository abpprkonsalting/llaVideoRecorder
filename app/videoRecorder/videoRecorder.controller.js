(function () {
    'use strict';
    angular.module('appVideoSuite.mdl').controller('VideoRecorder.ctrl', videoRecorderCtrl);

    videoRecorderCtrl.$inject = ['statFilterVle'];
    function videoRecorderCtrl(statFilterVle) {
        var vm = this;

        vm.awayPlayers = [{NameToShow: "Player 1",Number: 1,PlayerId: 1},{NameToShow: "Player 2",Number: 2,PlayerId: 2}];;
        vm.homePlayers = [{NameToShow: "Player 3",Number: 3,PlayerId: 3},{NameToShow: "Player 4",Number: 4,PlayerId: 4}];
        vm.game = null;

        vm.sendingState = 0;
        vm.markEvent = markEvent;
        vm.setTeam = setTeam;
        vm.setPlayer = setPlayer;


        /******************************   Video Send Related   ******************************/
        vm.videoDevices = [];
        vm.videoDeviceSelected = undefined;
        vm.videoDeviceId;
        vm.audioDeviceId;
        vm.videoParams = {};
        vm.audioParams = {};
        vm.videoRecorderState;
        vm.changeVideoDevice = changeVideoDevice;
        //vm.onRecorderStateChanged = onRecorderStateChanged;
        /************************************************************************************/

        activate();

        function activate() {

            if (statFilterVle.currentCompetition != null && statFilterVle.currentSeason != null && statFilterVle.currentMatchday != null && statFilterVle.currentGame != null) {
                vm.game = statFilterVle.currentGame;
                vm.videoParams.GameId = vm.game.GameId;
                vm.videoParams.Minute = 0;
            }
        }

        function changeVideoDevice() {
            var event = new CustomEvent('llavideoselectdevice');
            var elem = document.getElementById('videocapture');
            elem.dispatchEvent(event);
        }

        function markEvent(event) {
            vm.videoParams.GameEventTypeId = event;
            vm.sendingState++;
        }

        function setTeam(team) {
            vm.Right = [];
            if (team === 'Home') {
                vm.videoParams.TeamId = vm.game.HomeTeamId;
                vm.Right = angular.copy(vm.homePlayers);
            }
            else {
                vm.videoParams.TeamId = vm.game.VisitorTeamId;
                vm.Right = angular.copy(vm.awayPlayers);
            }

            if (vm.Right.length > 0) vm.Left = vm.Right.splice(0, Math.ceil(vm.Right.length / 2));
            vm.sendingState++;
        }

        function setPlayer(player) {
            vm.videoParams.PlayerId = player.PlayerId;
            vm.sendingState = 0;

            /****************************************************************************************/
            /* This section has been simplified to account on the lack of backEnd. It's supposed that
            when the last parameter is set (the player), the frontEnd ask the backEnd for an GUID to
            identify the video to upload and then generate an event to signal the directive it can
            start uploading the video with the help of the webworker. The following commented code do that.
            The next 4 uncomented lines are the temp fix.
            
            gameDataFtry.getUniqueVideoId().then(function (data) {

                vm.videoParams.videoId = data;

                //$scope.$emit('lla_media_recorder_message_directive', {
                //    message: 'show_preview',
                //    deviceId: vm.videoDeviceId,
                //    deviceType: 'videoinput',
                //    args: null
                //});

                var event = new CustomEvent('llavideoshowpreviews');
                var elem = document.getElementById('videocapture');
                elem.dispatchEvent(event);

            });*/

            vm.videoParams.videoId = "d3fb42ed-fc2f-4841-a7af-0a3910ff4e6d";
            var event = new CustomEvent('llavideoshowpreviews');
            var elem = document.getElementById('videocapture');
            elem.dispatchEvent(event);
        }
    }
})();