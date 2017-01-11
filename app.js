var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var svgCaptcha = require('svg-captcha');
var roters = require('./routers');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

var config = require('./config');

app.disable('x-powered-by'); //X-Powered-By是网站响应头信息其中的一个，出于安全的考虑，一般会修改或删除掉这个信息。如果你用的node.js express框架，那么X-Powered-By就会显示Express
app.use(favicon(config.SERVER.favicon));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(cookieParser());

app.use(session({
    secret: "appCat", //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 30}, // 过期时间（毫秒）
    resave: false,
    saveUninitialized: true,
}));

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://127.0.0.1');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (req.method == 'OPTIONS') {
		res.send(200); //让options请求快速返回
	} else {
		/**
		 *  node.js 下著名web框架 express ,对于解析json格式数据之前低版本需要依赖 bodyParser .
			后来的版本把 bodyParser 继承进去.
			使用的时候需要在express 配置项里
			user(express.bodyParser({ keepExtensions: true, uploadDir: ‘/tmp’ }))
			如下代码:
			var express = require('express'),
			    app = express();
			app.configure(function () {
			    app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/tmp' }));
			});
			Express 升级到4.x版本以后
			 升级以后的Express 所有的依赖包都拿出来了.
			所以,如果你用了  Express 4.x 的某个版本来解析 json 方式的post请求数据
			如果你的接口要求post 上来的数据格式是这样的:
			{"data":{"name":"一介布衣","url":"http://yijiebuyi.com"}}
			 后端express 进过 bodyParser 的解析后,可以这样读取到数据
			req.body.data.name    获取到  一介布衣
			req.body.data.url      获取到 http://yijiebuyi.com
			这里是有前提的,客户端请求接口时必须指名请求头类型 Content-Type=application/json
			 bodyParser 发现这样类型的请求头后,会自动将 body 里的 json 格式数据正确解析,否则 req.body.data 为 undefined
			传统的服务器端语言可能会接收post上传的流,然后转成字符串最后在格式化成 json ,这样加不加application/json 请求头都是没有问题的
			 但是Express 中间件在解析body中的post参数会检查 Content-Type 类型,所以没有指定正确格式导致中间件解析参数出错.
			 那如何处理呢?
				因为好多地方都在调用你的接口,你无法保证所有的人都在请求头里面加了 Content-Type=application/json
			解决思路是:
				 服务器端 先用 req.body.data 参数获取参数,如果成功,说明 bodyParser 正确解析了json 参数. 还是按照之前的方法读取.
				 如果 req.body.data 参数无值或者undefined 那么我们也用流来读取post 数据,然后转成字符串再解析成 json 格式来使用.
		    详情见：https://cnodejs.org/topic/54929c5561491ead0cc7bff2
		 */
		if (req.body.data) {
			//能正确解析 json 格式的post参数
			next();
		} else {
			//不能正确解析json 格式的post参数
			var body = '',
				jsonStr;
			req.on('data', function(chunk) {
				body += chunk; //读取参数流转化为字符串
			});
			req.on('end', function() {
				//读取参数流结束后将转化的body字符串解析成 JSON 格式
				try {
					jsonStr = JSON.parse(body);
				} catch (err) {
					jsonStr = null;
				}
				req.body = jsonStr;
				next();
			});
		}
	}
});

/**
 * 验证码
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               var captcha [description]
 * @return {[type]}      [description]
 */
app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.createMathExpr(
	    {
		  size: 4, // 验证码长度
		  ignoreChars: '0oO1iIl', // 验证码字符中排除 0o1i
		  noise: 1, // 干扰线条的数量
		  color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
		  background: '#cc9966', // 验证码图片背景颜色
		}
	);
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});
app.get('/captchaVal', function (req, res) {
    res.status(200).json({captcha:req.session.captcha});
});

app.use("/", roters);


app.listen(config.SERVER.port, function(req, res, error) {
	if (error) {
		throw error;
	}
	console.log('server listen on port %d', config.SERVER.port);
});