let express = require('express')
let app = express()
let path = require('path')
let http = require('http');
let proxy = require("http-proxy-middleware");

// app.get('/', function (req, res) {
//   res.send('hello world')
// })

// app.use(function (req, res) {
//   res.send('Hello')
// })
// // 解决刷新页面后 页面404
let history = require('connect-history-api-fallback');
// app.use(history({ verbose: true, index: '/index.html'}));
app.use(history());

let bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api",
    proxy.createProxyMiddleware({
        // 代理目标地址
        // target: 'http://10.0.88.77:8080',
        target: 'http://10.0.90.204:9999',
        changeOrigin: true,
        // ws: true,   
        // xfwd:true,
        // 地址重写
        pathRewrite: {
            '^/api': ""
        }
    })
);


app.use(express.static(path.join(__dirname, 'web')))



//解决跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.header('X-Powered-By', '3.2.1');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});



// 创建服务
let server = http.createServer(app);
server.listen(3002)
server.on('error', function () {
    console.log("service startup failed！");
});
server.on('listening', function () {
    console.log("server listening at http://localhost:3002/");
});