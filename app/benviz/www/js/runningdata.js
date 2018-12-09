
var runningdata = {
  defaultSettings: {
      maxBenZ: '100',
      lastDay: ''
  },
  settings: {},
  currentBenZ: 0,
  lastDataTimestamp: 0,
  totalBenZ:0,
  initialBenz :0,
  history: {},
  todayTimeStamp : 0,
  storeCounter : 0,

  initialize: function () {
    $('#home').on('click', '#button-simulate', function (e) {
      runningdata.testData();
    });
    $('#home').on('click', '#button-cleartoday', function (e) {
      runningdata.clearToday();
    });
    $('#home').on('click', '#button-clearall', function (e) {
      runningdata.clearAllData();
    });
    $('#home').on('click', '#button-clearhistoric', function (e) {
      runningdata.clearHistory();
    });

    this.initHistoricData();
    this.showData();
  },
  initHistoricData: function() {
    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.todayTimeStamp = (startOfDay / 1000).toString();

    var initdict = {};  
    initdict[this.todayTimeStamp] = 0;
    this.history = storage.getItem('runhistory', initdict);

    if (!(this.todayTimeStamp in this.history)) {
      this.history[this.todayTimeStamp] = 0;
      this.saveHistory();
    }

    this.totalBenZ = this.history[this.todayTimeStamp];
    this.initialBenz = this.totalBenZ;
    this.storeCounter = this.totalBenZ;

    console.log(JSON.stringify(this.history));
    console.log("today: " + this.history[this.todayTimeStamp]);

    for(var key in this.history) {
      var value = this.history[key];
      console.log(new Date(Number(key)*1000));
      daily_chart.series[0].addPoint([(Number(key)*1000), value], false, false);
    }

    daily_chart.redraw();
  },
  saveHistory: function()
  {
    storage.setItem('runhistory', this.history);
  },
  clearHistory: function()
  {
    var initdict = {};  
    initdict[this.todayTimeStamp] = 0;
    this.history = storage.getItem('runhistory', initdict);
    this.saveHistory();

    while(daily_chart.series[0].data.length > 0)
      daily_chart.series[0].data[0].remove(false);

    this.initHistoricData();
  },
  clearToday: function () {
    // Remove all data from impact chart
    while(impact_chart.series[0].data.length > 0)
    impact_chart.series[0].data[0].remove(false);

    impact_chart.redraw();

    // set benz of today = 0
    this.totalBenZ = 0;
    this.currentBenZ = 0;
    this.history[this.todayTimeStamp] = this.initialBenz;
    this.saveHistory();

    this.showData();
  },
  clearAllData: function () {
    while(daily_chart.series[0].data.length > 0)
      daily_chart.series[0].data[0].remove(false);

    this.initHistoricData();  
    this.clearToday();    
  },
  testData: function () {
    debug.log('Adding Random data');
    // fill with simulation data
    var now = new Date();
    var timestamp = now.getTime();

    var i;
    var total = 0;
    for (i = 0; i < 5; i++) { 
        var peak = Math.floor(Math.random() * 5000);
        total += peak/ 1000;
        runningdata.addTimedDate(peak, total, timestamp);
        timestamp += 500 + Math.floor(Math.random() * 500);
    }

    if (!(daily_chart.series[0].data.lenght >= 3))
    {
      daily_chart.series[0].addPoint([Number(new Date(now.getFullYear(), now.getMonth(), now.getDate()-1)), 100], false, false);
      daily_chart.series[0].addPoint([Number(new Date(now.getFullYear(), now.getMonth(), now.getDate()-2)), 200], false, false);
      daily_chart.redraw();
    }

  },
  addData: function(peak,total) {
    var date = new Date();
    var timestamp = date.getTime();
    this.addTimedDate(peak, total, timestamp);
  },
  addTimedDate: function(peak, total, timestamp) { 
    this.currentBenZ = peak / 1000;
    this.totalBenZ += this.currentBenZ ;
    this.lastDataTimestamp = timestamp;
    this.history[this.todayTimeStamp] = this.totalBenZ;

    debug.log('Current ' + peak + ' BenZ / ' + total + ' AppTotal:' + this.totalBenZ);
    var shift = impact_chart.series[0].data.length > 100;
    impact_chart.series[0].addPoint([this.lastDataTimestamp, this.currentBenZ], false, shift);
    this.showData();

    
    if (this.totalBenZ  - this.storeCounter > 100)
    {
      this.saveHistory();
      this.storeCounter =this.totalBenZ;
      if (this.totalBenZ > this.settings.maxBenZ) navigator.notification.beep(1);
    }
  },
  showData: function() { 
    // impact chart
    impact_chart.redraw();

    // total chart
    var totalPerc = 100 * this.totalBenZ / this.settings.maxBenZ;
    var availablePerc = 100 - totalPerc;
    var extendedPerc = availablePerc < 0 ? -availablePerc : 0;
    var otherPerc = 100-extendedPerc;
    if (totalPerc > 100) {
      totalPerc = 0;
      availablePerc = 0;

      total_chart.series[0].data[0].update({dataLabels:{enabled: false}}); 
      total_chart.series[0].data[1].update({dataLabels:{enabled: false}}); 
      total_chart.series[0].data[2].update({dataLabels:{enabled: true}}); 

      $('#overview').text('Today: '+ Math.floor(this.totalBenZ) +' / '+this.settings.maxBenZ+' BenZ');
      $('#overview').css('color', 'red');
    } else {
      extendedPerc = 0;
      otherPerc = 0;

      total_chart.series[0].data[0].update({dataLabels:{enabled: true}}); 
      total_chart.series[0].data[1].update({dataLabels:{enabled: true}}); 
      total_chart.series[0].data[2].update({dataLabels:{enabled: false}}); 

      $('#overview').text('Today: '+ Math.floor(this.totalBenZ)+' / '+this.settings.maxBenZ+' BenZ');
      $('#overview').css('color', '#606063');
    }

    total_chart.series[0].data[0].update({y:totalPerc}); 
    total_chart.series[0].data[1].update({y:availablePerc}); 
    total_chart.series[0].data[2].update({y:extendedPerc}); 
    total_chart.series[0].data[3].update({y:otherPerc});

    //daily chart
    daily_chart.series[0].data[daily_chart.series[0].data.length-1].update({y:this.totalBenZ});
    daily_chart.redraw();
  }
};