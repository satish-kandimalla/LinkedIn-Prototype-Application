var ejs = require("ejs");
var user = require('./user');

exports.home = function(req, res){
	
	console.log("loading fuckiniiig home page res");
	//console.log(req);
	console.log(req.session.user_id);
	if(req.session !== null || req.session !== undefined)
	{
		if(req.session.user_id === null || req.session.user_id === undefined)
		{
			req.session.destroy(function(err){
				if(err)
				{
					console.log(err);
				}
			});
			res.render('signin', { title: 'Express' });
		}
		else
		{
			//console.log(res.session);
			res.render('home', { title:'Express', session:req.session});
		}
	}
	else
	{
		res.render('signin', { title: 'Express' });
	}
};

exports.addConnections = function(req, res){
	  
	if(req.session !== null || req.session !== undefined)
	{
		if(req.session.user_id === null || req.session.user_id === undefined)
		{
			req.session.destroy(function(err){
				if(err)
				{
					console.log(err);
				}
			});
			res.render('signin', { title: 'Express' });
		}
		else
		{
			res.render('addConnections', { title: 'Express' });
			//res.render('home', { title:'Express', session:req.session});
		}
	}
	else
	{
		res.render('signin', { title: 'Express' });
	}
};

exports.searchResults = function(req, res){
	  
	if(req.session !== null || req.session !== undefined)
	{
		if(req.session.user_id === null || req.session.user_id === undefined)
		{
			req.session.destroy(function(err){
				if(err)
				{
					console.log(err);
				}
			});
			res.render('signin', { title: 'Express' });
		}
		else
		{
			//console.log(req.session);
			res.render('searchResults', { title: 'SearchResults' , session:req.session});
		}
	}
	else
	{
		res.render('signin', { title: 'Express' });
	}
};

exports.displayProfile = function(req, res){
	
	console.log("loading guest profile page");
	if(req.session !== null || req.session !== undefined)
	{
		if(req.session.user_id === null || req.session.user_id === undefined)
		{
			req.session.destroy(function(err){
				if(err)
				{
					console.log(err);
				}
			});
			res.render('signin', { title: 'Express' });
		}
		else
		{
			console.log(req.session);
			res.render('displayProf', { title:'Express', session:req.session});
		}
	}
	else
	{
		res.render('signin', { title: 'Express' });
	}
};