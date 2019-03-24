(function () {
    "use strict";

    angular.module('currentUser.ftrymdl', []);
    angular.module("currentUser.ftrymdl").factory("currentUser.ftry", currentUserFtry);

    currentUserFtry.$inject = ['localStorage.ftry', 'imageManagement.ftry'];
    function currentUserFtry(localStorageFtry, imageManagementFtry) {

        var repository = {
            setProfile: setProfile,
            logout: logout,
            profile: null
        };

        var userKey = "utoken";

        function initialize() {

            var user = {
                type: "",
                username: "",
                token: "",
                pricePlan: 0,
                name: { value: "", modifiable: true },
                lastName: { value: "", modifiable: true },
                //birthDate: { value: moment.utc().toObject(), modifiable: true },
                birthDate: { value: "", modifiable: true },
                sex: { value: 0, modifiable: true },
                email: { value: "", modifiable: false },
                fileNameConversion: { value: null, modifiable: true },
                image: { value: null, modifiable: true },
                keepSession: false,
                get loggedIn() {
                    return this.token;
                },
                get nameToShow() {
                    var self = this;
                    if (self.name && self.name.value !== "") return self.name.value + " " + self.lastName.value;
                    else return self.username.value;
                },
                get userImage() {
                    if (this.image && this.image.value != null) {
                        if (this.fileNameConversion && this.fileNameConversion.value != null) return imageManagementFtry.imgb64ToFile(this.image.value, this.fileNameConversion.value.OriginalName);
                        else return imageManagementFtry.imgb64ToFile(this.image.value, "");
                    }
                    return null;
                }
            };

            var localUser = localStorageFtry.get(userKey);
            if (localUser) {
                user.type = localUser.type;
                user.username = localUser.username;
                user.token = localUser.token;
                user.pricePlan = localUser.pricePlan;
                user.name = localUser.name;
                user.lastName = localUser.lastName;

                user.birthDate = localUser.birthDate;
                user.sex = localUser.sex;

                user.email = localUser.email;
                if (localUser.fileNameConversion) user.fileNameConversion = localUser.fileNameConversion;
                if (localUser.image) user.image= localUser.image;
                user.keepSession = localUser.keepSession;
            }
            return user;
        };

        repository.profile = initialize();

        function setProfile(type, username, token, pricePlan, keepSession, name, lastName, email, birthDate, sex, fileNameConversion, image) {
            if (type != null) repository.profile.type = type;
            if (username != null) repository.profile.username = username;
            if (token != null) repository.profile.token = token;
            if (pricePlan != null) repository.profile.pricePlan = pricePlan;
            if (keepSession != null) repository.profile.keepSession = keepSession;
            if (name != null) repository.profile.name = name;
            if (lastName != null) repository.profile.lastName = lastName;

            if (birthDate && birthDate != null && birthDate != "") {

                repository.profile.birthDate.value = moment.utc(birthDate.value, ["DD-MM-YYYY H:mm:ss", "YYYY-MM-DD HH:mm:ss"]).toObject();
                repository.profile.birthDate.value.months++;
            }

            if (sex != null) repository.sex = sex;
            if (email != null) repository.profile.email = email;
            if (fileNameConversion != null) {
                repository.profile.fileNameConversion = fileNameConversion;
            }
            if (image != null) repository.profile.image = image;

            console.dir(repository.profile);
            localStorageFtry.remove(userKey);
            localStorageFtry.add(userKey, repository.profile);
        };

        function logout() {
            repository.profile.type = '';
            repository.profile.username = '';
            repository.profile.token = '';
            repository.profile.pricePlan = 0;
            repository.profile.name = { value: "", modifiable: true };
            repository.profile.lastName = { value: "", modifiable: true };
            repository.profile.birthDate = { value: "", modifiable: true };
            repository.sex = { value: 0, modifiable: true };
            repository.profile.email = { value: "", modifiable: false };
            repository.profile.fileNameConversion = { value: null, modifiable: true };
            repository.profile.image = { value: null, modifiable: true };

            localStorageFtry.remove(userKey);
            localStorageFtry.add(userKey, repository.profile);
        };

        return repository;
    }

})();
