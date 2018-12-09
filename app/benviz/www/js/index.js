/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        console.log('app initialize');
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        debug.log('onDeviceReady');
        //this.receivedEvent('deviceready');
        bluetooth.initialize();
        bluetooth.toggleConnectionButtons();

        $('#home').on('click', '#refreshDeviceList', function (e) {
            bluetooth.refreshDeviceList();
        });

        $('#ble-found-devices').on('click', 'ons-list-item', function (e) {
            bluetooth.connectDevice($(this).attr("data-device-id"), $(this).attr("data-device-name"));
        });

        $('#home').on('click', '#disconnectDevice', function (e) {
            bluetooth.disconnectDevice(e);
        });

        // settings
        runningdata.settings = storage.getItem('runSettings', runningdata.defaultSettings);
        debug.log('maxBenZ ' + runningdata.settings.maxBenZ);
        document.getElementById('settings-maxbenz').value = runningdata.settings.maxBenZ;

        $('#home').on('click', '.savebutton', function (e) {
            var newSettings = {
                maxBenZ: Number($('#settings-maxbenz').val())
            };

            //todo: vallidate settings

            storage.setItem('runSettings', newSettings);

            ons.notification.alert({
                message: 'New settings saved.',
                title: 'Settings'
            });

            runningdata.settings.maxBenZ = newSettings.maxBenZ;
            runningdata.showData();
        });

        $('#home').on('click', '#button_home', function (e) {
            $('#contentcard').show("slow");
            $('#settingscard').hide("slow");
            $('#blecard').hide("slow");
            $('#debugcard').hide("slow");
            $('#logcard').hide("slow");
        });
        $('#home').on('click', '#button_logs', function (e) {
            $('#contentcard').hide("slow");
            $('#settingscard').hide("slow");
            $('#blecard').hide("slow");
            $('#debugcard').hide("slow");
            $('#logcard').show("slow");
        });
        $('#home').on('click', '#button_settings', function (e) {
            $('#contentcard').hide("slow");
            $('#settingscard').show("slow");
            $('#blecard').hide("slow");
            $('#debugcard').hide("slow");
            $('#logcard').hide("slow");
        });
        $('#home').on('click', '#button_debug', function (e) {
            $('#contentcard').hide("slow");
            $('#settingscard').hide("slow");
            $('#blecard').hide("slow");
            $('#debugcard').show("slow");
            $('#logcard').hide("slow");
        });

        $('#home').on('click', '#button_ble', function (e) {
            $('#contentcard').hide("slow");
            $('#settingscard').hide("slow");
            $('#blecard').show("slow");
            $('#debugcard').hide("slow");
            $('#logcard').hide("slow");
        });

        runningdata.initialize();
        
    },
    onDeviceResume: function () {
        debug.log('out of pause');
        bluetooth.refreshDeviceList();
    },
};

app.initialize();