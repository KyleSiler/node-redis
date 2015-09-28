'use strict'

var Redis = require('redis');
var redisClient = Redis.createClient();

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
      reply(redisReply);
    } else {
      console.log("Reply is from service");
      redisClient.set(zip, "Future cached endpoint to get weather for " + zip);
      reply("Future non-cached endpoint to get weather for " + zip);
    }
  });
}
