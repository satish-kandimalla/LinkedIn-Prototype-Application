var ejs = require("ejs");


exports.index = function(req, res){
	  res.render('signin', { title: 'Express' });
	};