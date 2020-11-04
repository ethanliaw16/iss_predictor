var express = require('express');
var request = require('request')
var app = express();

// define routes here..

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Index.html');
});

app.get('/ext-api', function(req, res, next) {
    request('http://www.mapquestapi.com/geocoding/v1/address?key=gHRAeLz8w9bYZ05A4pVgdiGTGPGAzCuV&street=1600+Pennsylvania+Ave+NW&city=Washington&state=DC&postalCode=20500', function(err, res, body){
        if (!err && res.statusCode == 200) {
            console.log(JSON.parse(body).results[0].locations[0].latLng) // Show the HTML for the Google homepage. 
          }
        })
  });


app.post('/submit-address', function(req, res) {
    var addr = '&street=' + req.body.addrLine1.replace(/\s/g, '+') + '+' + req.body.addrLine2.replace(/\s/g, '+') + '&city=' + req.body.city + '&state=' + req.body.state + '&postalCode=' + req.body.zip;
    var geocodeEndpoint = 'http://www.mapquestapi.com/geocoding/v1/address?key=gHRAeLz8w9bYZ05A4pVgdiGTGPGAzCuV' + addr
    console.log('endpoint to geocode is ', geocodeEndpoint)
    request(geocodeEndpoint, function(err, geores, body){
        if (!err && geores.statusCode == 200) {
            lat = JSON.parse(body).results[0].locations[0].latLng.lat
            lng = JSON.parse(body).results[0].locations[0].latLng.lng
            console.log('Latitude of Address: ', lat)
            console.log('Longitude of Address: ', lat)

            issEndpoint = 'http://api.open-notify.org/iss-pass.json?'
            issEndpoint += 'lat=' + lat
            issEndpoint += '&lon=' + lng
            console.log('ISS endpoint is ', issEndpoint)
            request(issEndpoint, function(err, response, body){
                if (!err && response.statusCode == 200) {
                    console.log('Response from ISS api: ')
                    console.log(JSON.parse(body).response) // Show the HTML for the Google homepage. 
                    res.send(JSON.parse(body).response)
                  }
                })
          }
        })
    //res.send('Failure:(');
});

app.post('/submit-to-iss-api',function (req, res) {
    var endpoint = 'http://api.open-notify.org/iss-pass.json?' //lat=LAT&lon=LON'
    //console.log('submitted coords')
    lat = req.body.latitude
    lng = req.body.longitude
    endpoint += 'lat=' + lat
    endpoint += '&lon=' + lng
    console.log('endpoint is ', endpoint)
    request(endpoint, function(err, response, body){
        if (!err && response.statusCode == 200) {
            console.log('Response from ISS api: ')
            console.log(JSON.parse(body).response) 
            res.send(JSON.parse(body).response)
          }
        })

    //res.send('Failure:(');
});

var server = app.listen(4200, function () {
    console.log('Node server is running..');
});