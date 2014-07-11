var http = require('http');

var querystring = require('querystring');

var query = {
    id:1,
    token:"adadfajlkfja"
};
var params = [
    {
        a:1,
        b:2
    },
    {
        "name":"test",
        "card":"123456789"
    }
];

var options = {
    hostname: '127.0.0.1',
    port: 3010,
    path: "/connector.entryHandler.publish?"+querystring.stringify(query),
    method: 'POST',
    headers:{
        'Content-Length':JSON.stringify(params).length
    }
};
var req = http.request(options,function( res ){
    res.on('data',function( data ){
        console.log("response:",data.toString());
    });
});
req.on('error',function( error ){
    console.log( error );
});

req.write( JSON.stringify(params) );

req.end();