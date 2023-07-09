const fs = require('fs');
const mqtt = require('mqtt');
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process');
/****************************************************/
/* pass to model */
/****************************************************/
const passToAIModel = async (data, id) => {
  const pyPro = spawn('python', [
    './deep_model/model.py',
    JSON.stringify(data),
  ]);
  pyPro.stdout.on('data', function (result) {
    // let localSwimmerStatus = result.toString().replace(/(\r\n|\n|\r)/gm, '');
    // console.log(result.toString());
    // take the string after thw word out
    let localSwimmerStatus = result.toString().split('out')[1];
    // convert the string to array
    // convert the string to array
    // remove [ and ] from the string
    if (localSwimmerStatus) {
      localSwimmerStatus = localSwimmerStatus.trim().replace(/[\[\]']+/g, '');
    }
    // devicesBuffer[id].swimmerStatusDescription = localSwimmerStatus;
    if (localSwimmerStatus == '1' || localSwimmerStatus == '2') {
      console.log('🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥');
      console.log(`⚓⚓ Status | 🟥🟥 Drowning 🟥🟥 `);
      console.log('🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥');
      return 'Drowning';
    } else if (localSwimmerStatus == '0') {
      console.log('🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥');
      console.log(`⚓⚓ Status | 🟩🟩 Normal 🟩🟩 `);
      console.log('🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥🚥');
      return 'Normal';
    }
  });
  pyPro.stderr.on('data', function (data) {
    console.error(data.toString());
  });
};

let AccData = [];
// Define the MQTT broker URL and topic to subscribe to
const brokerUrl = 'mqtt://localhost';
const topic = 'GW1/SWIDRO1/ACC';
let counterValid = 0;
let counterValidPassed = 0;
let counterInvalid = 0;
// Define the headers for the CSV file
const headers = ['Timestamp', 'X', 'Y', 'Z'];
// ****************************************************************
// ****************************************************************
// pool_swimming_n
// pool_drowning_n
// pool_idle_n
const label = 'cap/c_0';
// ****************************************************************
// ****************************************************************
// Connect to the MQTT broker and subscribe to the topic
const client = mqtt.connect(brokerUrl);
client.on('connect', () => {
  console.log(`Connected to ${brokerUrl}`);
  client.subscribe(topic, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Subscribed to topic ${topic}`);
    }
  });
});

// Define the callback function to handle received messages
client.on('message', async (topic, message) => {
  const data = parseMessage(message.toString());
  if (data) {
    // const timestamp = Date.now();
    // every 100 readings pass to AI model and readings clear the array
    if (counterValidPassed == 100) {
      AccData.push([data.X, data.Y, data.Z]);
      passToAIModel(AccData, 'id');
      counterValidPassed = 0;
      AccData = [];
    }
    const csvRow = [data.timestamp, data.X, data.Y, data.Z].join(',');
    counterValidPassed;
    counterValid += 1;
    const dataLog = `TS: ${data.timestamp} , X: ${data.X} , Y: ${data.Y} , Z: ${data.Z}`;
    console.log(
      '-----------------------------------------------------------------------'
    );
    console.log(`✅✅ valid (${counterValid}) | ${dataLog}`);
    writeCsv(csvRow);
  }
});

function parseMessage(message) {
  //  const regex = /^(\d+),X:(-?\d+\.\d+),Y:(-?\d+\.\d+),Z:(-?\d+\.\d+)/;
  const regex = /^(\d+),(-?\d+\.\d+),(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = message.match(regex);
  if (match) {
    return {
      timestamp: parseInt(match[1]),
      X: parseFloat(match[2]),
      Y: parseFloat(match[3]),
      Z: parseFloat(match[4]),
    };
  } else {
    if (message.includes('DONE')) {
      console.log(
        '-----------------------------------------------------------------------'
      );
      console.error(`🆗🆗 ${message}`);
    } else {
      counterInvalid++;
      console.log(
        '-----------------------------------------------------------------------'
      );
      console.error(`⛔⛔ Invalid (${counterInvalid}) | ${message}`);
    }
    return null;
  }
}

// Write a CSV row to a file
function writeCsv(row) {
  const filename = `${label}.csv`;
  const csv = fs.existsSync(filename) ? '' : headers.join(',') + '\n';
  fs.appendFileSync(filename, csv + row + '\n');
}

// ****************************************************************
let data = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

// passToAIModel(data, 'id');
