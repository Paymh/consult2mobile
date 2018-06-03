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

let speedWatcher;

let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

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
                enableSpeedWatching(speedWatcher);
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

function valueChangedCallback(values) {
    for(let j = 0; j < elements.length; j++) {
        for(let i = 0; i < values.length; i++) {
			if(values[i][elements[j].dataType] !== undefined) {
                elements[j].element.innerText = elements[j].prefix + values[i][elements[j].dataType] + elements[j].suffix;
			}
		}
    }
}

app.initialize();