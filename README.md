pomelo-webconnector
===================

http or https connector for pomelo

安装
npm install pomelo-webconnect

使用
创建pomelo工程完成后 修改game-server中的app.js

var webconnector = require('pomelo-webconnector');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : webconnector.webconnector,
        useSSL:false,
        ssl:{
            //key:fs.readFileSync('./config/server.key'),
            //cert:fs.readFileSync('./config/server.crt')
        }
    });
});

如果使用ssl的https协议 设置useSSL:true 然后ssl配置读取ssl证书
