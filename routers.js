var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
	res.send('hello world!');
})
router.get("/hello",function(req,res){
	res.json({hello:"world"});
})

module.exports = router;