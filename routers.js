var express = require('express');
var router = express.Router();
var ArticleModel = require('./Models/Article');
var Utils = require('./utils/common-utils');


/**
 * test api
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {	res.send('hello world!');} [description]
 * @return {[type]}      [description]
 */
router.get("/", function(req, res) {
	res.send('hello world!');
})
router.get("/hello", function(req, res) {
		res.json({
			hello: "world"
		});
	})
	/**
	 * 分页查找列表
	 * @param  {[type]} req  [description]
	 * @param  {[type]} res) 
	 * @return {[type]}      [description]
	 */
router.post("/admin/article", async function(req, res) {
	var count = 0;
	var page = req.body.page || 1;
	var rows = req.body.rows || 10;
	page = page > 0 ? page : 1;
	// var stuname=req.body.username;
	// console.log(stuname);
	var query = ArticleModel.find({
		deleted: false
	});
	query.skip((page - 1) * rows);
	query.limit(rows);
	/**
	 * User.find({}).sort('create_at').exec(callback)
	 * User.find({}).sort('-create_at').exec(callback)
	 * User.find({}).sort({ create_at: 'asc' }).exec(callback)
	 * User.find({}).sort({ create_at: -1 }).exec(callback)
	 * http://mongoosejs.com/docs/api.html#query_Query-sort
	 * sort by "field" ascending and "test" descending
	 * query.sort({ field: 'asc', test: -1 });
		// equivalent
		query.sort('field -test');
	 */
	query.sort({publishDate:-1});
	var rows = await query.exec(function(err, rs) {	
		if (err) {
			console.log(error);
			return [];
		} else {
			return rs;
		}
	});
	ArticleModel.find({deleted: false},function(err, result) {
		if(err){
			console.log(error);
			res.json({
				result:0,
				data:{},
				message:""
			});
		}else{
			jsonArray = {
				rows: rows,
				total: result.length
			};
			res.json({
				result:0,
				data:jsonArray,
				message:""
			});
		}
	});
});
/**
 * 新增文章
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {	var        article [description]
 * @return {[type]}      [description]
 */
router.post("/admin/article/put", function(req, res) {
	var article = req.body;
	new ArticleModel(article).save(function(error) {
		if (error) {
			throw error;
		} else {
			res.json({
				result: 'ok'
			});
		}
	})
});
router.post("/admin/article/edit", function(req, res) {
	var article = req.body;
	ArticleModel.update({
		id: article.id,
		deleted: false
	}, {
		$set: {
			title: article.title,
			author: article.author,
			origin: article.origin,
			content: article.content,
			before: article.before,
		}
	}, {
		multi: false
	}, function(err, _article) {
		if (err || !_article) {
			res.json({
				result: 0,
				msg: "未找到该文章"
			});
		} else {
			res.json({
				result: 1,
				msg: ""
			});
		}
	});
});
/**
 * 通过id查找文章
 * @param  {[type]} req           [description]
 * @return {[type]}               [description]
 */
router.get("/admin/article/:id", function(req, res) {
	ArticleModel.findOne({
		id: req.params.id||"",
		deleted: false
	}, function(err, article) {
		if (err) {
			res.json({
				data: {
					title: '文章不存在',
					meta: '文章不存在',
					before: '文章不存在',
					content: '文章不存在'
				},
				result:1,
				msg:"文章不存在"
			});
		} else {
			if (article) {
				var date = Utils.dateToStr(article.publishDate, 'Y-M-D');
				res.json({
					result: 1,
					data: {
						title: article.title,
						meta: `${article.author} | ${date}`,
						author: article.author,
						origin: article.origin,
						publishDate: article.publishDate,
						id: article.id,
						content: article.content,
						before: article.before,
					},
					msg: ""
				});
			} else {
				res.json({
					result: 0,
					data: {},
					msg: "无此数据"
				});
			}
		}
	});
});
router.delete("/admin/article/delete/:id", function(req, res) {
	ArticleModel.update({
		id: req.params.id||""
	}, {
		$set: {
			deleted: true
		}
	}, {
		multi: true
	}, function(err) {
		if (err) {
			console.error(err.message);
			res.json({
				result: 0,
				msg: err.message
			});
		} else {
			res.json({
				result: 1,
				msg: ""
			});
		}
	})
});
module.exports = router;