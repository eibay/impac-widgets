// Widget type #0: Maps
var map;
function initMap(id) {
    map = new google.maps.Map(document.getElementById('widget' + id), {
        center: { lat: 10, lng: -160 },
        zoom: 2,
        styles: mapStyle
    });

    map.data.setStyle(styleFeature);
    var script = document.createElement('script');
    script.setAttribute('src', '/cities');
    document.getElementsByTagName('head')[0].appendChild(script);

    var infoWindow = new google.maps.InfoWindow({
        content: "<div>Hello! World</div>",
        maxWidth: 500
    });

    map.data.addListener('click', function(event) {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
        infoWindow.setContent(event.feature.getProperty('title') + ": " + event.feature.getProperty('count') + " employees");
    });
}

// Defines the callback function referenced in the jsonp file.
function eqfeed_callback(data) {
    map.data.addGeoJson(data);
}

function styleFeature(feature) {
    var low = [151, 83, 34];   // color of mag 1.0
    var high = [5, 69, 54];  // color of mag 6.0 and above
    var minMag = 1.0;
    var maxMag = 5.0;

    // fraction represents where the value sits between the min and max
    var fraction = (Math.min(feature.getProperty('count'), maxMag) - minMag) / (maxMag - minMag);

    var color = interpolateHsl(low, high, fraction);

    return {
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 5,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 2 / feature.getProperty('count'),
            // while an exponent would technically be correct, quadratic looks nicer
            scale: Math.pow(feature.getProperty('count'), 2)
        },
        zIndex: Math.floor(feature.getProperty('count'))
    };
}

function interpolateHsl(lowHsl, highHsl, fraction) {
    var color = [];
    for (var i = 0; i < 3; i++) {
        // Calculate color based on the fraction.
        color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
    }

    return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

var mapStyle = [{
    'featureType': 'all',
    'elementType': 'all',
    'stylers': [{'visibility': 'off'}]
}, {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
}, {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [{'visibility': 'off'}]
}, {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
}];
//--------------------------------------------------------------------------------
// Widget type #1: Barchart
google.load("visualization", "1.1", {packages:["bar"]});

function drawChart(id) {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'San Francisco', 'Sydney'],
        ['2015', 5, 1]
    ]);

    var options = {
        chart: {
            title: 'Employees location'
        },
        bars: 'horizontal' // Required for Material Bar Charts.
    };

    var chart = new google.charts.Bar(document.getElementById('widget' + id));

    chart.draw(data, options);
}
//--------------------------------------------------------------------------------
// Widget type #2: Countries map
google.load("visualization", "1", {packages:["geochart"]});
function drawCountriesMap(id, jsonData) {
    dict = {};
    for (i = 0; i < jsonData['content']['entities'].length; i++) {
        var country = jsonData['content']['entities'][i]['country_code'];
        var amount = jsonData['content']['entities'][i]['total_invoiced'];
        if (dict[country]) {
            dict[country] += amount;
        } else {
            dict[country] = amount;
        }
    }

    keys = Object.keys(dict);
    result = [["Country", "Total invoices"]];
    for (j = 0; j < keys.length; j++) {
        result[j+1] = [keys[j], dict[keys[j]]];
    }

    var data = google.visualization.arrayToDataTable(result);

    var options = {
    };

    var chart = new google.visualization.GeoChart(document.getElementById('widget' + id));

    chart.draw(data, options);
}
//--------------------------------------------------------------------------------
// Widget type #3: Cities map
function drawMarkersMap(id, jsonData) {
    result = [["City", "Total invoices"]];
    for (j = 0; j < jsonData['content']['entities'].length; j++) {
        result[j+1] = [jsonData['content']['entities'][j]['city'], jsonData['content']['entities'][j]['total_invoiced']];
    }

    var data = google.visualization.arrayToDataTable(result);

    var options = {
        region: 'world',
        displayMode: 'markers',
        colorAxis: {colors: ['green', 'blue']}
    };

    var chart = new google.visualization.GeoChart(document.getElementById('widget' + id));
    chart.draw(data, options);
}
//--------------------------------------------------------------------------------
// Widget type #4: Cities piechart
google.load("visualization", "1", {packages:["corechart"]});

function drawPieChart(id, jsonData) {
    result = [["City", "Total invoices summary by cities"]];
    for (j = 0; j < jsonData['content']['entities'].length; j++) {
        result[j+1] = [jsonData['content']['entities'][j]['city'] + ", " + jsonData['content']['entities'][j]['country_code'],
            jsonData['content']['entities'][j]['total_invoiced']];
    }

    var data = google.visualization.arrayToDataTable(result);

    var options = {
        title: 'Total invoices summary',
        legend: 'none',
        pieSliceText: 'label',
        slices: {
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('widget' + id));
    chart.draw(data, options);
}