var mongoose = require('mongoose');
var uuid = require('node-uuid')
var DB = require('./index');

/**
 * console.log(uuid.v1())
 * console.log(uuid.v4())
 * v1 是基于时间戳生成uuid
 * v4是随机生成uuid
 */
var ArticleSchema = new mongoose.Schema({
	id: {
		type: String,
		default: uuid.v4()
	},
	title: {
		type: String,
	},
	author: {
		type: String
	},
	before: {
		type: String
	},
	publishDate: {
		type: Date,
		default: Date.now
	},
	content: {
		type: String
	},
	origin: {
		type: String
	},
	deleted: {
		type: Boolean,
		default: false
	}
});

module.exports = DB.db.model('Article', ArticleSchema);