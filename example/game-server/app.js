var pomelo = require('pomelo');
var fs = require('fs');

var webconnector = require('../../lib/webconnector');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'example');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : webconnector.webconnector,
      useSSL:true,
      ssl:{
          key:fs.readFileSync('../shared/server.key'),
          cert:fs.readFileSync('../shared/server.crt')
      }
    });
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
