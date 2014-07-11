pomelo-webconnector

基于pomelo架构自定义connector 让pomelo支持http https协议

安装: npm install pomelo-webconnector

创建pomelo项目 替换pomelo在connectorConfig中定义的connector

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

参数支持 useSSL:true 代表使用https协议 必须加载ssl证书 userSSL:false 代表使用http协议

设置完成后即可使用任意语言的http通信服务器
注意问题:
因为需求短连接,这种方式驱动pomelo会导致pomelo的sessionService失效(session生命周期伴随http消息的返回或者断开后销毁)
而不能使用pomelo的channelService做消息推送(因本人接触js node express pomeo时间不久暂时无法编码兼容pomelo的session 这个demo也是第一次使用git 第一次上传npm项目 如有bug 错误 或者 有朋友高论赐教也好 探讨也好 请联系我 QQ:332850358)

使用须知:
1. http请求的头规范
  url 可传递参数 例如 http://127.0.0.1:3010/connector.entryHandler.entry?id=1&passport="..."
  其中 /connector.entryHandler.entry 会在服务器解析后用作pomelo的路由进行rpc调用(会调用到connector的entryHandler内的entry函数)
  ? 号以后部分 作为 handler message 参数中的query传递
  示例中的id 是客户端请求的编号,有客户端管理,若不传递相当于pomelo的notify请求
2. 消息正文 body 
  必须为JSON格式的字符串传递
