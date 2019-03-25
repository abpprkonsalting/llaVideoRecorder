# llaVideoRecorder || <a href="https://abpprkonsalting.github.io/llaVideoRecorder/" rel="nofollow">Demo</a>

General description
=======================

This is an angularjs directive designed as part of a more general system for recording short videos related to sport events.

The idea is to give the user the opportunity to capture those events (gols, red card, yellow cards, faults, etc.) in real time with the minimum lost of time in the process, yet provide the possibility to choose a back "start moment" for the saving of the video.

It was part of a project for implementing a social network for sports (currently active as to 2019 March).

It is used in the following way:

1- The user is following the action running in the field with his device. This one is working in a state in which it
showns the recorded video at full screen in the device, so the user could follow the action.

2- When an event happens, and the user decide to save it, he makes a touch in the screen.

3- The app give the user some variables related with the event (team, player, etc.). These variable usually came from
the back end and are part of the broader system for registering the events of the competition. In this stripped version for
showcase the values used are fixed and hardcoded in the front end.

4- When the user had selected the variables (with the minimum interaction as possible), then it's shown a portfolio of
back start moments on three seconds intervals (this could be configured, in the intervals counts and on its durations).
This means that the first start point is 3 seconds back from the moment the user touched the screen, the second one is
6 seconds back, and so forth.

This portfolio is made of short videos as well, so the user have the possibility to make a quick determination of the
moment he wants to use as the start of the action to record.

5- When the user select the start moment, the system inmediatelly returns to the following state, and in the background
using a webworker, sends the captured video to the back end, where it's processed and stored related to the sport event. 

This solution, implemented ussing the browser capabilities to access camera and audio devices, was a first approach
for convincing the investors the factibility of the idea, and as such the need to expand the project to use mobile
devices. Eventually, when there was not need for this, the functionallity was removed from the front end code.

The solution shown here include some basic template and code from the original project, but it was stripped to the
minimum necessary to show the functionallity of the directive.


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



