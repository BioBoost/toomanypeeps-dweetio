var settings = require('./settings.json');
var mqtt  = require('mqtt').connect({ host: settings.mqtt.host, port: settings.mqtt.port });
var dweetRequest = require('request');


mqtt.on('connect', function () {
    console.log("MQTT connected");
    mqtt.subscribe('toomanypeeps/demo/counter');
});

mqtt.on('message', function(topic, message) {
  // Message looks like {"value": 3} (json)
  console.log("Message received " + topic + ": " + message);

  dweetRequest("https://dweet.io/dweet/for/" + settings.dweetio.name,
    { json: true,
      body: JSON.parse(message),
      method: "POST",
      headers: {
          "content-type": "application/json"
      }
    },
    function(err, res, dweet) {
      console.log("Thing: " + dweet.with.thing);
      console.log("Content: " + JSON.stringify(dweet.with.content));
      console.log("Timestamp: " + dweet.with.created);
      console.log("Errors? " + err);
    }
  );
});
