var mongoose = require('mongoose');
var dbConfig = require('../DBConfig');

mongoose.Promise = global.Promise;
/**
 * 连接
 */
var DB = {};
var options = {
	'user': dbConfig.userName,
	'pass': dbConfig.password
}
DB.db = mongoose.connect(dbConfig.dbUrl, options);

mongoose.connection.once('connected', function() {
	console.log('Mongoose connection open to ' + dbConfig.dbUrl);
});

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose connection disconnected');
});
DB.disconnect = function() {
    db.disconnect(function(error) {
        if (error) {
            throw error;
        }
        console.log("close successful")
    });
}

module.exports = DB;