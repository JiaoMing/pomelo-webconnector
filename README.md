pomelo-webconnector

基于pomelo架构自定义connector 让pomelo支持http https协议

安装: npm install pomelo-webconnector

创建pomelo项目 替换pomelo在connectorConfig中定义的connector

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : webconnector.webconnector,
        methods:'all', /// 'get' or 'post' and 'all' = 'get' & 'post'
        useSSL:false,
        ssl:{
            //key:fs.readFileSync('./config/server.key'),
            //cert:fs.readFileSync('./config/server.crt')
        }
    });
});

参数支持 useSSL:true 代表使用https协议 必须加载ssl证书 userSSL:false 代表使用http协议

设置完成后即可使用任意语言的http通信服务器


使用须知:

1. http请求的头规范

  url 可传递参数 例如 http://127.0.0.1:3010/connector.entryHandler.entry?id=1&passport="..."
  其中 /connector.entryHandler.entry 会在服务器解析后用作pomelo的路由进行rpc调用(会调用到connector的entryHandler内的entry函数)
  ? 号以后部分 作为 handler message 参数中的query传递
  示例中的id 是客户端请求的编号,有客户端管理,若不传递相当于pomelo的notify请求
  
2. 消息正文 body 

  必须为JSON格式的字符串传递
  
3. 本包内包含了几个库的版本,使用前请确认和项目的版本一致:
  pomelo : '1.0.3'
  如果和pomelo项目版本不一致会启动不起来的,解决办法是到modules的pomelo-webconnector目录的node-modules删除pomelo文件夹
  pomelo-logger: '0.1.5'
  如果版本不一致,日志不能刷新到本地日志文件内
  express: '4.8.1'
  
  
