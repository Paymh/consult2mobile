# consult2mobile
Cordova based smart phone app that allows access to Nissan Consult protocol data. Being Cordova based means android and iOS apps can be developed along-side each other. 

Consult is Nissan's old-school OBD protocol used in their earlier cars such as Nissan Skylines, 180SX's, pulsars etc and is able to be read using a Consult adapter which usually outputs to a serial port on a computer. I set out to make a digital dash replacement for my own car that also could show/clear error codes, show 0-100kph times and eventually inbuild a navigation system directly into the dash. Further features that could be interesting is being able to tell if the wheels are spinning (loss of traction) by comparing to GPS and computer speed signals and eventually could inbuild track layouts with lap time monitoring using GPS.

This project got pushed aside by other commitments but at the time I was working on it I had got the data being sent from the ECU to the adapter to the android via USB On-The-Go protocol and being displayed on screen. This was done by leveraging the 'fr.drangies.cordova.serial' plugin for cordova which made reading of serial data possible.
