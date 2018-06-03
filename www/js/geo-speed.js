let prevSpeed;
let speed;
let readingSpeed = false;
let gpsTimestamp;
let launched = false;
let launchStartTime;
let launchFinishTime;

function createSpeedWatcher() {
    return navigator.geolocation.watchPosition(
        (position) => {
            prevSpeed = speed;
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

function enableSpeedWatching() {
    readingSpeed = true;
    speedWatcher = createSpeedWatcher();
}

function disableSpeedWatching() {
    readingSpeed = false;
    navigator.geolocation.clearWatch(speedWatcher);
}