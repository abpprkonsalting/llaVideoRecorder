# llaVideoRecorder || <a href="https://abpprkonsalting.github.io/llaVideoRecorder/" rel="nofollow">Demo</a>

General description
=======================

This is an angularjs directive designed as part of a more general system for recording short videos related to sport events (in football: gols, red card, yellow cards, faults, etc.)

The idea is to give the user the opportunity to capture those events with the minimum lost of time in the process, as he is recording the actions in the field, following it with it's phone. 

When the event happens and the user decides to record it (touching the screen), he is given the possibility to choose a back "start moment" from which save the video. Those "start" moments are at specific intervals of time (tipically 3s), so the video could be "from" 3s, 6s, 9s, an so on backward.

The directive is used in the following way:

1- The user select some parameters corresponding with the game he wants to record: Competition, MatchDay, Season, Game.

![image](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/228978f8-dec6-4905-ba57-c4c335025796)

2- The user start to follow the action running in the field with his device, pressing the button "Video". 

![image](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/8fb97ef2-a4a9-419e-b074-77af32816aac)

3- The interface for management of the recording / pausing the video is shown.

![image](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/1473b496-9b85-45a9-8a99-2b4b4ba0f0b0)

4- When the user press "Record", the device shows the recorded video at full screen, so the user could follow the action.

![zz4](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/574e7cfe-67b1-4a2c-b4fd-6da249ced11b)

5- When an event happens (gol, red card, yellow card), and the user decide to save it, he makes a touch in the screen
and the app presents options to the user so he can choose which kind of event was (gol, red card, yellow card).

![zz5](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/0260fd86-c0a3-4976-8a3f-8f2eca328dff)

6- The app presents more options to the user for some variables related with the event (team, player, etc.) 
These variable usually came from the backend and are part of the broader system for registering the events of the 
competition.

![zz6](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/0b92b8b7-1174-4e1a-b518-fcaa5cd376c4)

8- When the user had selected the variables (with the minimum interaction as possible), then it's shown a portfolio of
back "start" moments on three seconds intervals (this could be configured, on the amount of intervals and on its durations).
This means that the first start moment is 3 seconds back from the moment the user touched the screen, the second one is
6 seconds back, and so forth up to 24s for this example.

This portfolio is made of short videos as well, so the user have the possibility to make a quick determination of the
moment he wants to use as the start of the action to record.

![zz7](https://github.com/abpprkonsalting/llaVideoRecorder/assets/32166875/bddcd624-f09e-4891-9587-6719c2578fee)

9- When the user select the start moment, the system inmediatelly returns to the recording state (so a new eventcould be captured),
and in the background using a webworker sends the captured video to the backend, where it's processed and stored. 

The images shown as examples on this readme are doctored, and it's purpose is to show how the directive works. For a demostration
of how it works in real life, the reader is invited to use the demo on a mobile device with a camera.

This solution, implemented ussing the browser capabilities to access camera and audio devices, was a first approach
for convincing the investors the factibility of the idea, and as such the need to expand the project to use mobile
devices, and hire new programmers with those skills.

The solution shown here includes some basic template and code from the original project, but it was stripped to the
minimum necessary to showcase the functionallity of the directive for recording the event videos.

This directive was part of a project for implementing a social network for sports currently active as of July 2024 (laliguilla.com).

This code use other available code from github, such as:

1- RecordRTC library. https://github.com/muaz-khan/RecordRTC

2- ConcatenateBlobs. https://github.com/muaz-khan/ConcatenateBlobs

3- Angular Workers. https://github.com/FredrikSandell/angular-workers

4- File Saver. https://github.com/eligrey/FileSaver.js

Thanks to all the programmers of those contributions.

Directive description
=======================

The directive in fact is composed by three elements:

1- A directive, llaVideoRecorder, which is the one that encapsulate the video elements to show the action. The full screen
one that shows the real action been followed, as well as the small ones where the back start points for selection are shown in the showcase.

2- A directive, llaVideoRecorderControl, which is the one for controlling the video recording devices. This directive could be
used several times in the same template, and could be use each time in one of several configurable functions: Record, Stop, Capture and ShowPreview. The whole system was designed in such a way that in the same template could be included several Control directives that can manage several Recorders at the same time. Yet that functions were never fully tested.

3- A factory, llaVideoRecorder, where the real action takes place. Here the recorder objects are created and registered. The webworker functions for sending the blobs to the back end are created and instantiated here as well.

In this stripped version the webworker code does nothing, and it was replaced with a single function to save the captured blobs to the user computer using the browser capabilities.

The function used in the front end to concatenate the blobs before saving was taken from https://github.com/muaz-khan/ConcatenateBlobs and was not fully tested, so the final blob that is saved to the user computer not always play correctly in all media players. In some of them, even when all the intervals are concatenated, it only shows the first one.

One media player that shows the result correctly is "Elmedia Player", in its version for MacOS.



