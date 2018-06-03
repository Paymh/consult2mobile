let open = false;
let bytesRequested;

let currentData= [];
let frameStarted = false;
let lengthByte;

let currentParameters;

const Parameters = Object.freeze({
  COOLANTTEMP: ["08"],
  RPM:  ["00","01"],
  VOLTAGE: ["0c"],
  TIMING: ["16"],
  KPH: ["0b"],
  MPH: ["0b"]
});

function handleData(data, bytesExpected) {
  // create an array of the size of requested data length and fill with requested data
  for(let i = 0; i < data.length; i++) {
    // read just 1 byte at a time of the stream
    let char = data[i].toString(16);
    if(char === "ff"){
      // Beginning of data array, the frame has started
      frameStarted = true;
      // Get rid of last frame of data
      currentData = [];
      // remove last lengthByte number so that we can check what this frame's byte should be
      lengthByte = undefined;
    }else if(frameStarted) {
      // frame has started
      if(!lengthByte) {
        // read lengthByte from the ECU
        lengthByte = parseInt(char, 16);
      } else {
        // push byte of data onto our array
        currentData.push(parseInt(char, 16));
      }
    }
  }
  if(currentData.length === bytesExpected) {
    // End of data, return the array of data
    frameStarted = false;
    return currentData.slice();
  }
}
  
function parseData(data,callback) {
  if(data !== undefined) {
    let result = [];
    let count = 0;
    for(let i = 0; i < data.length; i++) {
      if(currentParameters[count] !== undefined) {
        let paramName = currentParameters[count].toString();
        let value;
        if(paramName == Parameters.COOLANTTEMP.toString()) {
          value = convertCoolantTempC(data[i]);
        } else if(paramName == Parameters.RPM.toString()) {
          value = convertRPM(data[i],data[i+1]);
          //Since this is a double byte return value skip the next data attrib
          i++;
        } else if(paramName == Parameters.KPH.toString()) {
          value = convertKPH(data[i]);
        } else if(paramName == Parameters.MPH.toString()) {
          value = convertMPH(data[i]);
        } else if(paramName == Parameters.TIMING.toString()) {
          value = convertTiming(data[i]);
        } else if(paramName == Parameters.VOLTAGE.toString()) {
          value = convertVoltage(data[i]);
        }
        result.push({
          [paramName]: value
        });
      }
      count++;
    }
    callback(result);     
  }
}

function createQuery(params) {
  let commandString = "";
  let bytes = 0;
  for(let i = 0; i < params.length; i++) {
    for(let j = 0; j < params[i].length; j++) {
      bytes++;
      commandString += "5a" + params[i][j];
    }
  }
  commandString += "f0";

  return {string: commandString,bytes: bytes};
}

function setupConsultConnection(params,callback) {
  let errorCallback = function(message) {
    alert('Error: ' + message);
  };
  // request permission first - default connection options are fine
  // except we need to use Ftdi driver
  serial.requestPermission({driver: 'FtdiSerialDriver'},
    // if user grants permission 
    function(successMessage) {
        // open serial port 
        serial.open({},
            // if port is succesfuly opened 
            function(successMessage) {
                //Send connection authorisation to ecu
                serial.writeHex('ffffef', () => {},() =>{});
                // register the read callback 
                serial.registerReadCallback(
                    function success(data){
                        // decode the received message 
                        let view = new Uint8Array(data);
                        if(view.length > 0) {
                            //16 is Ecu acceptance byte
                            if(!open && view.toString(16) === "16") {
                                open = true;
                                currentParameters = params;
                                let commandQuery = createQuery(params);
                                bytesRequested = commandQuery.bytes;
                                serial.writeHex(commandQuery.string,() => {
                                },() => {});
                            } else if(!open) {
                              //We didn't connect to ecu properly try connecting again
                              setupConsultConnection(params,callback);
                            } else {
                              parseData(handleData(view, bytesRequested),callback);
                            }
                        }
                    },
                    // error attaching the callback 
                    errorCallback
                );
            },
            // error opening the port 
            errorCallback
        );
    },
    // user does not grant permission 
    errorCallback
  );
}
