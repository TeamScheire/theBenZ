var mqtt = {
    hostname: 'test.mosquitto.org',
    port: 8080,
    clientid: 'accViz',
    topic: 'accViz/acc',
    connected: false,
    connectionOptions: {
        timeout: 3,
        onSuccess: function () {
            debug.log("mqtt connection succesfull", 'success');
            mqtt.connected = true;
        },
        onFailure: function (message) {
            debug.log("mqtt connection failed: " + message.errorMessage, 'error');
            mqtt.connected = false;
        }
    },

    initialize: function () {
        debug.log('Initialising mqtt ...');

        try {
            mqtt.client = new Paho.MQTT.Client(mqtt.hostname, mqtt.port, mqtt.clientid);
            mqtt.client.onConnectionLost = mqtt.onConnectionLost;
            mqtt.client.onMessageArrived = mqtt.onMessageArrived;
            debug.log('Mqtt Initialised', 'success');
        } catch (exception) {
            debug.log('Mqtt Initialising failed', 'error');
            console.log(exception);
        }
    },

    connect: function () {
        mqtt.client.connect(mqtt.connectionOptions);
    },

    disconnect: function () {
        debug.log("Mqtt client is disconnecting...");
        try {
            mqtt.client.disconnect();
            mqtt.connected = false;
            debug.log('Mqtt client disconnected', 'success');
        } catch (exception) {
            debug.log('Mqtt client disconnecting failed', 'error');
            console.log(exception);
        }
    },

    sendMessage: function (message, destinationName) {
        message = new Paho.MQTT.Message(message);
        message.destinationName = destinationName;
        try {
            mqtt.client.send(message);
            debug.log('Mqtt Message sent', 'success');
        } catch (exception) {
            debug.log('Mqtt sendMessage failed', 'error');
            console.log(exception);
        }
    },

    connectAndSendMessage: function (deviceId, data) {
        // refresh gps data
        gps.getLocation();

        // prepare payload
        var payload = {
            deviceId: deviceId,
            data: data,
            gpsCoords: gps.coords,
            timestamp: moment().format()
        };

        if (!mqtt.connected) {
            mqtt.connect();
        }

        setTimeout(function () {
            if (mqtt.connected) {
                mqtt.sendMessage(JSON.stringify(payload), mqtt.topic);
                setTimeout(function () {
                    mqtt.disconnect();
                }, 500);
            } else {
                debug.log('Could not connect to mqtt', 'error');
            }
        }, 500);
    },

    onConnectionLost: function (responseObject) {
        mqtt.connected = false;
        console.log("mqtt connection lost: " + responseObject.errorMessage);
    },

    onMessageArrived: function (message) {
        debug.log('received message: ' + message.destinationName, ' -- ', message.payloadString);
    }
};