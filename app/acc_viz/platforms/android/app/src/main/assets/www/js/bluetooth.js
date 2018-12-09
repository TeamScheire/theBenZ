'use strict';

var timestamp = 0;
var prevtimestamp = 0;

var bluetooth = {
  serviceUuids: { // Nordic's UART service
    serviceUUID: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
    txCharacteristic: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', // transmit is from the phone's perspective
    rxCharacteristic: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E' // receive is from the phone's perspective    
  },
  writeWithoutResponse: true,
  connectedDevice: {},
  heartbeatInterval: false,
  initialize: function () {
    debug.log('Initialising bluetooth ...');
    bluetooth.refreshDeviceList();
    debug.log('Bluetooth Initialised', 'success');
  },
  refreshDeviceList: function () {
    // force always true
    var onlyUART = true;
    $('#deviceList').empty();
    var characteristics = (onlyUART) ? [bluetooth.serviceUuids.serviceUUID] : [];
    ble.scan(characteristics, 5, bluetooth.onDiscoverDevice, app.onError);
  },
  onDiscoverDevice: function (device) {
    var previousConnectedDevice = storage.getItem('connectedDevice');

    //if (device.name.toLowerCase().replace(/[\W_]+/g, "").indexOf('cme') > -1) {
    var listItem = document.createElement('li');
    var html = '<div class="deviceName">' + device.name + '</div>' +
      '<div class="deviceId">' + device.id + '</div>' +
      '<div class="deviceRssi">rssi: ' + device.rssi + '</div>';

    listItem.dataset.deviceId = device.id;
    listItem.dataset.deviceName = device.name;
    listItem.innerHTML = html;
    $('#deviceList').append(listItem);
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

      storage.setItem('connectedDevice', bluetooth.connectedDevice);

      // subscribe for incoming data
      ble.startNotification(deviceId,
        bluetooth.serviceUuids.serviceUUID,
        bluetooth.serviceUuids.rxCharacteristic,
        bluetooth.onData,
        bluetooth.onError);

      debug.log('Connected to ' + deviceId, 'success');
      //mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'device,1');

      //bluetooth.heartbeatInterval = setInterval(bluetooth.heartbeat, 5000);
      app.showDeviceDetailPage();
    };


   //acc_chart.series[0].remove(false);
    //acc_chart.series[1].remove(false);
    //acc_chart.series[2].remove(false);

    ble.connect(deviceId, onConnect, bluetooth.onError);
  },
  // heartbeat: function () {
  //     if (bluetooth.connectedDevice) {
  //         try {
  //             ble.isConnected(bluetooth.connectedDevice.id, function() {
  //                 debug.log('still connected');
  //                 mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'heartbeat,1');
  //             }, function() {
  //                 bluetooth.connectedDevice = {};
  //                 mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'device,0');
  //                 debug.log('Automatically disconnected from ' + bluetooth.connectedDevice.id, 'success');
  //                 clearInterval(bluetooth.heartbeatInterval);
  //             });
  //         } catch (error) {
  //             ble.onError(error);
  //         }
  //     }
  // },
  onDisconnectDevice: function () {
    storage.removeItem('connectedDevice');
    //mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'device,0');
    debug.log('Disconnected from ' + bluetooth.connectedDevice.id, 'success');
    bluetooth.connectedDevice = {};
    //clearInterval(bluetooth.heartbeatInterval);
    app.showMainPage();
  },
  disconnectDevice: function (event) {
    debug.log('Disconnecting from ' + bluetooth.connectedDevice.id);

    try {
      ble.disconnect(bluetooth.connectedDevice.id, bluetooth.onDisconnectDevice, bluetooth.onError);
    } catch (error) {
      debug.log('Disconnecting failed', 'error');
      console.log(error);
    }
  },
  onData: function (data) {
    //mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, bytesToString(data));
    try {
      var values = new Int16Array(data);
      //console.log(values.length + " data received: " + values.toString());

      console.log(" data received: " + values[0] + "->" + (values[0] & 0x00FF) + " + " + ((values[0] & 0xFF00) >> 8) )

      if ((values[0] & 0x00FF) == 0) { //data
        var x = 0, y = 0, z = 0;

        var i;
        var valuesStr = "";

        var newtimestamp = (values[1] & 0xFFFF);
        
        var timestep = (values[0] & 0xFF00) >> 8;

        if (newtimestamp > prevtimestamp)
          timestamp = timestamp + (newtimestamp - prevtimestamp);
        

        console.log("timestamp: " + timestamp);

        for (i = 2; i < values.length; i = i + 3) {
          x += values[i];
          y += values[i + 1];
          z += values[i + 2];

          valuesStr += timestamp + "," + values[i] + "," + values[i + 1] + "," + values[i + 2] + "\n";
          timestamp += timestep;
          // var shift = acc_chart.series[0].data.length > 1000;
          // acc_chart.series[0].addPoint([timestamp, values[i]], true, shift);
          // acc_chart.series[1].addPoint([timestamp, values[i+1]], true, shift);
          // acc_chart.series[2].addPoint([timestamp, values[i+2]], true, shift);
          // timestamp += 10;
        }

        prevtimestamp = newtimestamp;

        //var valuesStr = values.toString();

        // var messageLine = '<div>' +
        //   '<div class="timestamp">' + moment().format() + '</div>' +
        //   '<div>' + values.length + ' values</div>' +
        //   '<div>' + values[0] + ': ' + values.toString() + ' </div>' +
        //   '</div>';

        // $('#deviceMessageList').empty();
        // $('#deviceMessageList').append(messageLine);

        //debug.log('add data: ' + messageLine, 'debug');



        x /= (values.length / 3);
        y /= (values.length / 3);
        z /= (values.length / 3);
        var shift = acc_chart.series[0].data.length > 100;
        acc_chart.series[0].addPoint([timestamp, x], false, shift);
        acc_chart.series[1].addPoint([timestamp, y], false, shift);
        acc_chart.series[2].addPoint([timestamp, z], false, shift);

        acc_chart.redraw();

        if (storage.recording)
          storage.writeFile(valuesStr, 'values');
      } else if ((values[0] & 0x00FF) == 1) { //mean and r
        var newtimestamp = (values[1] & 0xFFFF);

        var mean_x = values[2];
        var mean_y = values[3];
        var mean_z = values[4];

        var r0 = ((values[5]  & 0x00ff) << 24) | ((values[6]  & 0xff00) << 8) | ((values[7]  & 0x00ff) << 8) | ((values[8] & 0xff00) >> 8);
        var r1 = ((values[9]  & 0x00ff) << 24) | ((values[10] & 0xff00) << 8) | ((values[11] & 0x00ff) << 8) | ((values[12] & 0xff00) >> 8);
        var r2 = ((values[13] & 0x00ff) << 24) | ((values[14] & 0xff00) << 8) | ((values[15] & 0x00ff) << 8) | ((values[16] & 0xff00) >> 8);

        if (storage.recording)
          storage.writeFile(valuesStr, 'meanr');
      }
      //debug.log("series length: " + acc_chart.series[0].data.length, 'succes');
    } catch (error) {
      debug.log('onData failed ' + error, 'error');
      console.log(error);
    }

  },
  onError: function (reason) {
    debug.log("BLE error: " + JSON.stringify(reason), 'error');
  }
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