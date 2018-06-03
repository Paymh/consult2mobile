//Elements
let logElem;
let coolantElem;
let rpmElem;
let speedElem;
let voltageElem;
let elements;
let timerResultsElem;
let btnTimerElem;
let btnSpeedElem;
let testElem;

let speed;
let speedWatcher;
let readingSpeed = false;
let gpsTimestamp;
let launched = false;
let launchStartTime;
let launchFinishTime;

let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        logElem = document.getElementById("log");
        coolantElem = document.getElementById("coolant");
        rpmElem = document.getElementById("rpm");
        speedElem = document.getElementById("speed");
        voltageElem = document.getElementById("voltage");
        timerResultsElem = document.getElementById("timer-results");
        btnTimerElem = document.getElementById("start-timer");
        btnSpeedElem = document.getElementById("speed-toggle");
        testElem = document.getElementById("lol");
        btnSpeedElem.onclick = () => {
            if(readingSpeed) {
                readingSpeed = false;
                navigator.geolocation.clearWatch(speedWatcher);
                btnSpeedElem.innerText = "Start watching speed.";
            } else {
                readingSpeed = true;
                speedWatcher = createSpeedWatcher();
                btnSpeedElem.innerText = "Stop watching speed.";
            }
        };

        btnTimerElem.onclick = () => {
            if(!readingSpeed) {
                readingSpeed = true;
                speedWatcher = createSpeedWatcher();
                isLaunching = true;
                btnSpeedElem.innerText = "Stop watching speed.";
            }
        }
        elements = [
            {
                element: coolantElem,
                dataType: Parameters.COOLANTTEMP.toString(),
                prefix: "Coolant Temp: ", //Used for setting the displays prefix
                suffix: "c", //Used for setting the displays prefix
            },
            {
                element: rpmElem,
                dataType: Parameters.RPM.toString(),
                prefix: "Rpm: ",
                suffix: "",
            },
            {
                element: voltageElem,
                dataType: Parameters.VOLTAGE.toString(),
                prefix: "Voltage: ",
                suffix: "v",
            },
            
        ];

        let watchedParameters = [Parameters.COOLANTTEMP,Parameters.RPM,Parameters.VOLTAGE];
        setupConsultConnection(watchedParameters,valueChangedCallback);
    }
};

function msToTime(ms) {
    var duration = ms;
    var milliseconds = (duration % 1000);
    duration = Math.floor(duration/1000);
    var seconds = (duration % 60); 
    duration = Math.floor(duration/60);
    return seconds + "s " + milliseconds + "ms";
}

function createSpeedWatcher() {
    return navigator.geolocation.watchPosition(
        (position) => {
            let prevSpeed = speed;
            if(position.coords.speed && position.coords.speed > 0) {
                let kmh = Math.round((position.coords.speed * 18) / 5);
                speedElem.innerText = "Speed: " + kmh + "km/h";
                speed = kmh;
                timestamp = position.timestamp;
            } else {
                speedElem.innerText = "Speed: 0km/h";
            }
            if(isLaunching) {
                if(speed === 0) {
                    launched = false;
                } else if(prevSpeed == 0 && speed > 0) {
                    launchStartTime = timestamp;
                    launched = true;
                }

                if(launched) {
                    if(speed >= 2) {
                        launchFinishTime = timestamp;
                        
                        let timeTaken = launchStartTime - launchFinishTime;
        
                        timerResultsElem.innerText += "Time Taken: " + msToTime(timeTaken) + "\n"; 
                        isLaunching = false;
                        launched = false;
                    }
                }
            }
        },
        (error) => {
            alert("Please turn on location settings and restart app");
        },
        { maximumAge: 0, timeout: 5000, enableHighAccuracy: true });
}
function valueChangedCallback(values) {
	debugger
    for(let j = 0; j < elements.length; j++) {
        for(let i = 0; i < values.length; i++) {
			if(values[i][elements[j].dataType] !== undefined) {
                elements[j].element.innerText = elements[j].prefix + values[i][elements[j].dataType] + elements[j].suffix;
			}
		}
        
    }
}

app.initialize();