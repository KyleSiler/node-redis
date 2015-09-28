'use strict'

var Redis = require('redis');
var redisClient = Redis.createClient();
var credentials = require('./credentials.js');
var http = require('http');

redisClient.on("error", function(err) {
  console.log("Error starting redis " + err);
});

exports.clearCache = function(request, reply) {
  redisClient.flushall();
  reply('Cleared cache');
};

exports.retrieveByZip = function(request, reply, zip) {
  var zip = request.params.zip;
  redisClient.get(zip, function(err, redisReply) {
    if(redisReply) {
        console.log("Reply is from cache");
        reply(JSON.parse(redisReply)).header('X-Cached', true);
    } else {
        console.log("Reply is from service");
        getWeatherFromService(zip, reply);
    }
  });
};

function getWeatherFromService(zip, reply) {
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?zip=' + zip + ',us&AAPID=' + credentials.aapid
  }
  http.get(options, function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      redisClient.set(zip, str);
      reply(JSON.parse(str)).header('X-Cached', false);
    })
  })
};
