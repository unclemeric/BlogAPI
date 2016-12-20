var mongoose = require('mongoose');
var dbConfig = require('./DBConfig');

var options = {
	'user': dbConfig.userName,
	'pass': dbConfig.password
}
console.log(dbConfig);
/**
 * 连接
 */
var db = mongoose.connect(dbConfig.dbUrl, options);

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

var mongooseSchema = new mongoose.Schema({
	username: {
		type: String,
		default: '匿名用户'
	},
	title: {
		type: String
	},
	content: {
		type: String
	},
	time: {
		type: Date,
		default: Date.now
	},
	age: {
		type: Number
	}
});

var mongooseModel = db.model('mongoose', mongooseSchema);

var doc = {
	username: 'emtity_demo_username',
	title: 'emtity_demo_title',
	content: 'emtity_demo_content'
};

// new mongooseModel(doc).save(function (error) {
//     if(error) {
//         console.log(error);
//     } else {
//         console.log('saved OK!');
//     }
//     // 关闭数据库链接
//     db.close();
// })
console.log(db)
var disconnect = function() {
	db.disconnect(function(error) {
		if (error) {
			throw error;
		}
		console.log("close successful")
	});
}

disconnect();