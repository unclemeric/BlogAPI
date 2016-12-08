var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var roters = require('./routers');
var app = express();

var config = require('./config');


app.use(favicon(config.SERVER.favicon));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/",roters);


app.listen(config.SERVER.port,function(req,res,error){
	if(error){
		throw error;
	}
	console.log('server listen on port %d',config.SERVER.port);
});