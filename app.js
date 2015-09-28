'use strict'

var hapi = require('hapi');
var server = new hapi.Server();
var weather = require('./weather.js');

server.connection( {
  host: 'localhost',
  port: '8080'
});

server.route({
  path: '/weather/{zip}',
  method: 'GET',
  handler: function (request, reply) {
    console.log("Getting weather for " + request.params.zip);

    weather.retrieveByZip(request, reply, request.params.zip);
  }
});

server.route({
  path: '/weather/clear',
  method: 'POST',
  handler: function(request, reply) {
    console.log("Clearing cache");
    weather.clearCache(request, reply);
  }
});

server.start(function() {
  console.log('Server running at: ', server.info.uri);
});
