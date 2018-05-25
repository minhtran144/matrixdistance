
// Copyright 2018, Minh Tran (minhtran144).
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
*HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.


* http://maps.googleapis.com/maps/api/distancematrix/outputFormat?parameters
* If HTTPS is not possible, to access the Google Maps Distance Matrix API over HTTP, use:

* Certain parameters are required while others are optional.
		*Required parameter: origins, destinations, and key.

* Sample https://maps.googleapis.com/maps/api/distancematrix/xml?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Vancouver+BC&mode=bicycling&language=fr-FR&key=YOUR_API_KEY
* This example requests rthe distance matrix data between Washington DC and New York City in xml format.
https://maps.googleapis.com/maps/api/distancematrix/json?origins=New+York&destinations=San+Francisco&key=AIzaSyDtcZjwNKEMoUWZ3PnGsGBGG3m979OLyvM
*/

'use strict';

const https = require('https');
const host = 'maps.googleapis.com';
const GoogleApiKey = 'AIzaSyDtcZjwNKEMoUWZ3PnGsGBGG3m979OLyvM';

exports.S3Support = (req, res) => {
// Get the origin and destination from the request
 let origin = req.body.result.parameters['origin']; // origin is a required parameter
 
let destination = req.body.result.parameters['destination']; // destination is a required parameter

// Call Google API

callGoogleApi(origin, destination).then((output) => {
 
// Return the results of the Google API to Dialogflow	
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
}).catch((error) => {

// If there is an error let the user know
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
 });
  };  
    
function callGoogleApi (origin, destination) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the distance from Google Api service
    let path = '/maps/api/distancematrix/json?origins=' + encodeURIComponent(origin) + '&destinations=' + encodeURIComponent(destination) + '&key=' + GoogleApiKey;
    console.log('API Request: ' + host + path);
	 // Make the HTTP request to get the distance
    https.get({host: host, path: path}, (res) => {
      let body = ''; 																// var to store the response chunks
      res.on('data', (d) => { body += d; });  						// store each response chunk
      res.on('end', () => {
// After all the data has been received parse the JSON for desired data        
	         
		  let response = JSON.parse(body);
		  let resulta = response.rows[0];
		  let resultb = resulta.elements[0];
		  let result = resultb.distance.text;
		  
		  var answer = "The distance between " + origin + " and " + destination + " is" + " " + result;
  		 		  		       
// Create response
		let output = answer;
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}