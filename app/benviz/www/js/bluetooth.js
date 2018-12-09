var bluetooth = {
    serviceUuids: { // Nordic's UART service
        serviceUUID: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
        txCharacteristic: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', // transmit is from the phone's perspective
        rxCharacteristic: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E' // receive is from the phone's perspective    
    },
    writeWithoutResponse: true,
    connectedDevice: {},
    lastConnectedDeviceId: false,
    messages: [],
    initialize: function () {
        debug.log('Initialising bluetooth ...');
        bluetooth.refreshDeviceList();
        debug.log('Bluetooth Initialised', 'success');
    },
    refreshDeviceList: function () {
        debug.log('refreshing devicelist ...');
        var onlyUART = true;
        $('#ble-found-devices').empty();
        var characteristics = (onlyUART) ? [bluetooth.serviceUuids.serviceUUID] : [];
        ble.scan(characteristics, 5, bluetooth.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function (device) {
        var previousConnectedDevice = storage.getItem('connectedDevice');

        //if (device.name.toLowerCase().replace(/[\W_]+/g, "").indexOf('cme') > -1) {
        var html = '<ons-list-item modifier="chevron" data-device-id="' + device.id + '" data-device-name="' + device.name + '" tappable>' +
            '<span class="list-item__title">' + device.name + '</span>' +
            '<span class="list-item__subtitle">' + device.id + '</span>' +
            '</ons-list-item>';

        $('#ble-found-devices').append(html);
        //}

        if (previousConnectedDevice) {
            if (device.id == previousConnectedDevice.id) {
                debug.log('discovered previous device ' + previousConnectedDevice.name, 'success');
                bluetooth.connectDevice(previousConnectedDevice.id, previousConnectedDevice.name);
            }
        }

    },
    connectDevice: function (deviceId, deviceName) {
        debug.log('connecting to ' + deviceId);

        var onConnect = function (peripheral) {
            bluetooth.connectedDevice = {
                id: deviceId,
                name: deviceName
            };

            // used to send disconnected messages 
            bluetooth.lastConnectedDedviceId = deviceId;

            storage.setItem('connectedDevice', bluetooth.connectedDevice);

            // subscribe for incoming data
            ble.startNotification(deviceId,
                bluetooth.serviceUuids.serviceUUID,
                bluetooth.serviceUuids.rxCharacteristic,
                bluetooth.onData,
                bluetooth.onError);

            debug.log('Connected to ' + deviceId, 'success');

            bluetooth.toggleConnectionButtons();
            navigator.notification.beep(1);


        };

        ble.connect(deviceId, onConnect, bluetooth.onError);
    },
    onDisconnectDevice: function () {
        storage.removeItem('connectedDevice');
        debug.log('Disconnected from ' + bluetooth.lastConnectedDeviceId, 'success');
        bluetooth.connectedDevice = {};
        bluetooth.toggleConnectionButtons()();

        navigator.notification.beep(2);
    },
    disconnectDevice: function (event) {
        debug.log('Disconnecting from ' + bluetooth.connectedDevice.id);

        try {
            ble.disconnect(bluetooth.connectedDevice.id, bluetooth.onDisconnectDevice, bluetooth.onError);
            bluetooth.toggleConnectionButtons();
        } catch (error) {
            debug.log('Disconnecting failed', 'error');
            console.log(error);
        }
    },
    onData: function (data) {
        // bluetooth.messages.push({
        //    data: bytesToString(data),
        //    timestamp: moment().format()
        //})

        //debug.log(bytesToString(data), 'ble');

        try {
            var values = new Int16Array(data);
        
            console.log(" data received: " + values[0] + "->" + (values[0] & 0x00FF) + " + " + ((values[0] & 0xFF00) >> 8) )
        
            if ((values[0] & 0x00FF) == 0) { //data
        
            } else if ((values[0] & 0x00FF) == 1) { //mean and r
                var newtimestamp = (values[1] & 0xFFFF);

                var mean_x = values[2];
                var mean_y = values[3];
                var mean_z = values[4];
        
                var r0 = ((values[5]  & 0x00ff) << 24) | ((values[6]  & 0xff00) << 8) | ((values[7]  & 0x00ff) << 8) | ((values[8] & 0xff00) >> 8);
                var r1 = ((values[9]  & 0x00ff) << 24) | ((values[10] & 0xff00) << 8) | ((values[11] & 0x00ff) << 8) | ((values[12] & 0xff00) >> 8);
                var r2 = ((values[13] & 0x00ff) << 24) | ((values[14] & 0xff00) << 8) | ((values[15] & 0x00ff) << 8) | ((values[16] & 0xff00) >> 8);
        
                debug.log('calibration: mean ('+ mean_x + ',' + mean_y + ',' + mean_z + '), r (' + r0 + ',' + r1 + ',' + r2 + ')' ,  'ble');
            } else if ((values[0] & 0x00FF) == 2) { //peak and total
                var newtimestamp = (values[1] & 0xFFFF);

                var peak = values[2];
                var total = values[3];
                debug.log('peak:'+ peak + ' -> ' + total ,  'ble');
                runningdata.addData(peak, total);
            }
        } catch (error) {
            debug.log('onData failed ' + error, 'error');
            //console.log(error);
        }

        //bluetooth.refreshSentMessageList();
    },
    onError: function (reason) {
        debug.log("BLE error: " + JSON.stringify(reason), 'error');
        ble.isConnected(bluetooth.connectedDevice.id, function () {
            debug.log('error, but still connected');
        }, function () {
            bluetooth.connectedDevice = {};
            debug.log('error and disconnected from ' + bluetooth.lastConnectedDeviceId, 'success');
            bluetooth.toggleConnectionButtons();
            navigator.notification.beep(2);
        });
    },
    toggleConnectionButtons: function () {
        var connected = (bluetooth.connectedDevice.id !== undefined);
        console.log('current ble connection status: ' + ((connected) ? 'connected' : 'not connected'));

        if (connected) {
            var html = '<ons-list-item>' +
                '<span class="list-item__title">' + bluetooth.connectedDevice.name + '</span>' +
                '<span class="list-item__subtitle">' + bluetooth.connectedDevice.id + '</span>' +
                '</ons-list-item>';
            $('#ble-connected-device').html(html);

            $('.ble-not-connected').hide();
            $('.ble-connected').show();

            $('#button_ble').css('color', 'green');
        } else {
            $('#ble-connected-device').html('no device connected');
            $('.ble-not-connected').show();
            $('.ble-connected').hide();

            $('#button_ble').css('color', 'red');
        }
    }
    /*
    refreshSentMessageList: function () {
        $('#ble-received-messages').empty();

        if (bluetooth.messages.length > 20) {
            bluetooth.messages.shift();
        }

        $.each(bluetooth.messages, function (index, data) {
            var messageLine = '<ons-list-item>' +
                '<span class="list-item__title">' + data.data + '</span>' +
                '<span class="list-item__subtitle">' + data.timestamp + '</span>' +
                '</ons-list-item>';

            $('#ble-received-messages').prepend(messageLine);
        });
    }
    */
};

/*
helpers
*/
// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}