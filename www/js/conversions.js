function convertRPM(mostSignificantBit, leastSignificantBit){
    // combine most significant bit and least significant bit and convert to RPM
    return ((mostSignificantBit << 8) + leastSignificantBit) * 12.5;
  }
  
function convertCoolantTempC(data){
    // Subtract 50 for Celsius
    let celciusCoolantTemp = data - 50;
    // Convert celcius to fahrenheit
    let fahrenheitCoolantTemp = celciusCoolantTemp * 1.8 + 32;
  
    return celciusCoolantTemp;
  }

function convertCoolantTempF(data){
    let fahrenheitCoolantTemp = convertCoolantTempC(data) * 1.8 + 32;

    return fahrenheitCoolantTemp;
  }

function convertKPH(data){
    // data * 2 gives KPH
    return data * 2;
  }
  
function convertMPH(data){
    // data * 2 gives KPH
    return convertKPH(data) * 0.6213711922;
  }

function convertVoltage(data) {
    // data * 80 gives mV
    return (data * 80) / 1000;
}

function convertTiming(data) {
  // 110 - data gives degrees BTDC
  return 110 - data;
}