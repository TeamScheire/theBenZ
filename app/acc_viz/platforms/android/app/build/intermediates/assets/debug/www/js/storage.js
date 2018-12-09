var filePath = {};

var storage = {
  _recording: false,
  _tempFileData: {},
  get tempFileData() {
    return this._tempFileData;
  },
  set tempFileData(value) {
    this._tempFileData = value;
  },
  get recording() {
    return this._recording;
  },
  set recording(value) {
    this._recording = value;
  },
    setItem: function (referenceName, object) {
        try {
            var objectAsString = JSON.stringify(object);
            window.localStorage.setItem(referenceName, objectAsString);
        } catch (error) {
          debug.log(error,'error');
        }
    },
    getItem: function (referenceName) {
        try {
            var objectAsString = window.localStorage.getItem(referenceName);
            var object = JSON.parse(objectAsString);
            return object;
        } catch (error) {
          debug.log(error,'error');
        }
    },
    removeItem: function (referenceName) {
        try {
            window.localStorage.removeItem(referenceName);
            return true;
        } catch (error) {
          debug.log(error,'error');
        }
    },

    setFileName: function(fileName, key) {
      var absPath = cordova.file.externalRootDirectory;
      var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');
      filePath[key] = fileDir + fileName;

      function gotFileEntry(fileEntry) {
        debug.log("Logfile: <a href='" + fileEntry.toURL() + "'>" + fileEntry.toURL() + "</a>",'debug');
        console.log('gotFileEntry');
        console.log("fileEntry fullPath " + fileEntry.fullPath);
        console.log("fileEntry toURL " + fileEntry.toURL());
      }

      var fail = function (error) {        
        debug.log("setFileName Error : " + errpr,'error');
        deferred.reject(error);
      };

      var gotFileSystem = function (fileSystem) {
        fileSystem.root.getFile(filePath[key], { create: true, exclusive: false }, gotFileEntry, fail);
      };

      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, gotFileSystem, fail);
      tempFileData = "";
    },

    flushFile: function(key) {
      var deferred = $.Deferred();
   
      var fail = function (error) {
        debug.log("writeFile Error : " + errpr,'error');
        deferred.reject(error);
      };
   
      var gotFileSystem = function (fileSystem) {
        console.log('gotFileSystem');
        fileSystem.root.getFile(filePath[key], { create: true, exclusive: false }, gotFileEntry, fail);
      };
   
      var gotFileEntry = function (fileEntry) {
        console.log('gotFileEntry');
        
        console.log("fileEntry toURL " + fileEntry.toURL());
        fileEntry.createWriter(gotFileWriter, fail);
      };
   
      var gotFileWriter = function (writer) {
        console.log('gotFileWriter');
        writer.onwrite = function () {
          console.log('written');
          tempFileData = "";
          deferred.resolve();
        };
        writer.onerror = fail;

        writer.seek(writer.length);
        
        console.log('writing' + tempFileData);
        writer.write(tempFileData);
        
      }
   
      window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, gotFileSystem, fail);
      return deferred.promise();
    },

    writeFile: function (data, key) {
      tempFileData[key] += data;
      if (tempFileData[key].length > 100000)
        this.flushFile(key);
    },

    startStop: function() {
      if (this.recording)
      {
        this.recording = false;
        debug.log("Stop recording",'succes');
        $('#recordStartStop').html('Start Recording');

        // Looping through
        for (var key in tempFileData) {
          if (tempFileData[key].length > 0)
            this.flushFile(key);
        }

        
      } else {
        this.recording = true;
        var formatted = moment(new Date()).format("YYYYMMDD-HHmmss");
        console.log("DateTime " + formatted);
        storage.setFileName(formatted + "_values.csv", 'values');
        storage.setFileName(formatted + "_meanr.csv", 'meanr');
        storage.setFileName(formatted + "_benz.csv", 'benz');
        $('#recordStartStop').html('Stop Recording');
        debug.log("Start recording",'succes');
      }
    }
    
}