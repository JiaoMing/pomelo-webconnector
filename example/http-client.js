
var http = require('http');
var querystring = require('querystring');

var query = {
    id:1,
    passport:"abcd"
};

var body = {
    a:1,
    b:2
}

var request = http.request({
    hostname: '127.0.0.1',
    port: 3010,
    path: '/connector.entryHandler.entry?'+querystring.stringify(query),
    method: 'POST',
    headers:{
        'Content-Length':JSON.stringify(body).length
    }
},function( response ){
    response.on('data',function( data ){
        console.log("response:",data.toString());
    });
});
request.on('error',function( error ){
    console.log('error:',error);
});
request.write( JSON.stringify(body) );
request.end();
