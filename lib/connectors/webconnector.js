/**
 *  为支持pomelo http https协议 自建连接
 * @type {exports}
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var http = require('http');
var https = require('https');
var express = require('express');
var url = require('url');
var qs = require('querystring');
var pomelo = require('pomelo');

var ws = require('./websocket');

var curID = 1;
/**
 * connector 构造
 * @param port
 * @param host
 * @returns {Connector}
 * @constructor
 */
var Connector  = function( port, host ){
    if( !(this instanceof Connector ) ){
        return new Connector(port, host);
    }
    EventEmitter.call( this );

    this.host = host;
    this.port = port;
}

util.inherits(Connector,EventEmitter);
module.exports = Connector;

/**
 * 启动服务 ( pomelo 内置规范接口 )
 * @param cb
 */
Connector.prototype.start = function( cb ){
    var self = this;
    var exp = express();
    exp.use( bodyParser );
    var congigure = pomelo.app.get('connectorConfig');
    if( congigure.useSSL ){
        https.createServer( congigure.ssl, exp).listen(this.port);
    }else{
        http.createServer( exp).listen( this.port );
    }
    var req_process = function( request, response ){
        var websocket = new ws( curID++, response );
        self.emit('connection',websocket);
        websocket.emit('message',request);
    }
    var methods = congigure.methods || 'all';
    if( methods === 'all' ){
        exp.all('*',req_process);
    }else if(methods === 'post'){
        exp.post('*',req_process);
    }else if( methods === 'get'){
        exp.get('*',req_process);
    }else{
        throw new Error('Listen method error for:'+methods);
    }
    process.nextTick(cb);
}

/**
 * 停止服务 ( pomelo 内置规范接口 )
 * @param force
 * @param cb
 */
Connector.prototype.stop = function( force, cb ){
    process.nextTick(cb);
}

/**
 * 发送消息编码 ( pomelo 内置规范接口 )
 * @type {encode}
 */
Connector.encode = Connector.prototype.encode = function( reqId, route, msg ) {
    if(reqId) {
        return composeResponse(reqId, route, msg);
    } else {
        return composePush(route, msg);
    }
};

/**
 * 收到消息解码 ( pomelo 内置规范接口 )
 * @type {decode}
 */
Connector.decode = Connector.prototype.decode = function(msg) {
    return {
        id: msg.body.id,
        route: msg.body.route,
        body: {
            query:msg.body.query,
            params:msg.body.body
        }
    };
};

/**
 * 发送消息 ( pomelo 内置规范接口 )
 * @param msg
 */
Connector.prototype.send = function(msg) {
    this.msg = msg;
};

var composeResponse = function( msgId, route, msgBody ) {
    return {
        id: msgId,
        body: msgBody
    };
};

var composePush = function( route, msgBody ) {
    return JSON.stringify({route: route, body: msgBody});
};

/**
* http 协议体解析
* @param request
* @param response
* @param next
*/
var bodyParser = function( request, response, next ){
    var timeout = setTimeout( function(){
        next(new Error('request time out'));
    },1000);

    var body = '';
    request.addListener('data',function( chunk ){
        body += chunk;
    });
    request.addListener('end',function(){
        clearTimeout(timeout);
        try{
            var u = url.parse(request.url);
            var query = qs.parse(u.query);
            body = body === '' ? '{}':body;
            request.body = {
                id:query.id || 0,
                route:u.pathname.slice(1,u.pathname.length),
                body:{
                    body:JSON.parse(body),
                    query:query
                }
            };
        }catch( exception ){
            console.log('request has an exception:',exception);
            next(new Error('request error'));
            return;
        }
        next(null,request,response);
    });
}