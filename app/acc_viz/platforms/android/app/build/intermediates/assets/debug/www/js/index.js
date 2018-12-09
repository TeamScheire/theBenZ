var app = {
  /*
  Application Constructor
  */
  initialize: function () {
      app.showMainPage();
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
      //document.addEventListener("pause", this.onDevicePause.bind(this), false);
      //document.addEventListener("resume", this.onDeviceResume.bind(this), false);
  },
  /*
  device ready and loaded
  */
  onDeviceReady: function () {
      this.bindEvents();
      //mqtt.initialize();
      gps.getLocation();
      bluetooth.initialize();
      //var formatted = (new Date()).toISOString();
      
      //chart.load();
      // setTimeout(function () {
      //     mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'app,1');
      // }, 500);
  },
  // onDevicePause: function() {
  //     mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'app,2');
  // },
  // onDeviceResume: function() {
  //     mqtt.connectAndSendMessage(bluetooth.connectedDevice.id, 'app,3');
  // },
  /*
  events in ui
  */
  bindEvents: function () {
      $(document).on('click', '#refreshDeviceList', function (e) {
          bluetooth.refreshDeviceList(false);
      });
      $(document).on('click', '#recordStartStop', function (e) {
        storage.startStop(false);
    });
      $('#deviceList').on('click', 'li', function (e) {
          bluetooth.connectDevice($(this).attr("data-device-id"), $(this).attr("data-device-name"));
      });
      $(document).on('click', '#disconnectDevice', function (e) {
          bluetooth.disconnectDevice(e);
      });
  },
  /*
  Show connected device
  */
  showDeviceDetailPage: function () {
      $('#deviceName').html('Connected to ' + bluetooth.connectedDevice.name);
      $('#deviceMessageList').empty();
      $('#main-page').hide();
      $('#device-detail-page').show();
  },
  /*
  Show connected device
  */
  showMainPage: function () {    
      $('#deviceList').empty();
      $('#main-page').show();
      $('#device-detail-page').hide();
  },
  /*
  general error logging
  */
  onError: function (error) {
      debug.log(JSON.stringify(error), 'error');
  }
};

app.initialize();