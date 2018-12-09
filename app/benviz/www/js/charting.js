
Highcharts.theme = {
    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
                [0, '#2a2a2b'],
                [1, '#3e3e40']
            ]
        },
        style: {
            fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
    },
    title: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '12px'
        }
    },
    subtitle: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase'
        }
    },
    xAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: '#A0A0A3'

            }
        }
    },
    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};

Highcharts.setOptions({
  global: {
      useUTC: false
  }
});

Highcharts.setOptions(Highcharts.theme);

var impact_chart = Highcharts.chart({
    chart: {
      type: 'line',
      animation: true, 
      marginRight: 10,
      zoomType: 'x',
      renderTo: 'plotcurrent_container'
  },
  navigator: {
    enabled: false
  },
  title: {
      text: 'Impact (Benz)'
  },
  xAxis: {
      type: 'datetime',
      /*tickPixelInterval: 150*/
  },
  yAxis: {
      title: {
          text: null /*'Impact (BenZ)'*/
      },
      plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
      }]
  },
  legend: {
      enabled: false
  },
  exporting: {
      enabled: true
  }, 
  plotOptions: {
    series: {
        marker: {
            enabled: false   
        }
    }
  },

  series: [{
      name: 'X',
      data: [],
      type: 'areaspline',
      fillColor: {
        linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
        },
        stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
    }
  }],
  "credits": {
      "enabled":false
  }
});

var total_chart = Highcharts.chart({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        type: 'pie',
        renderTo: 'plottotal_container'
    },
    title: {
        text: 'Total BenZ Today',
        align: 'center',
        verticalAlign: 'top',
        y: 40
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    legend: {
        enabled: true
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -10,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '100%']
        }
    },
    series: [{
        type: 'pie',
        name: 'BenZ',
        innerSize: '60%',
        data: [
                {
                    name: 'Used',
                    y: 0,
                    color: '#90ed7d',
                    dataLabels: {
                        enabled: true
                    }
                },
                {
                    name: 'Available',
                    y: 100,
                    color: '#434348',
                    dataLabels: {
                        enabled: true
                    }
                },
                {
                    name: 'Excess',
                    y: 100,
                    color: '#f15c80',
                    dataLabels: {
                        enabled: false
                    }
                },
                {
                    name: null,
                    y: 0,
                    color: '#f0b75b',
                    dataLabels: {
                        enabled: false
                    }
                }
        ]
    }],
    "credits": {
        "enabled":false
    }
});


var daily_chart = Highcharts.chart({
    chart: {
      type: 'line',
      animation: true, 
      marginRight: 10,
      zoomType: 'x',
      renderTo: 'plotdaily_container'
  },
  navigator: {
    enabled: false
  },
  title: {
      text: 'Daily impact'
  },
  xAxis: {
      type: 'datetime'
  },
  yAxis: {
      title: {
          text: null /*'Impact (BenZ)'*/
      },
      plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
      }]
  },
  legend: {
      enabled: false
  },
  exporting: {
      enabled: true
  }, 
  plotOptions: {
    series: {
        marker: {
            enabled: true   
        }
    }
  },

  series: [{
      name: 'X',
      data: [],
      type: 'column',
      fillColor: {
        linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
        },
        stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
    }
  }],
  "credits": {
      "enabled":false
  }
});