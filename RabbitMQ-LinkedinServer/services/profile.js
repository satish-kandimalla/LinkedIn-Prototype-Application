var express = require('express');
var mysql = require('./mysql');
var exce = require('./customExceptions');
var localSession={} ;

function handle_request(msg, callback){
	console.log("In RMQS profile Q handle request:"+ msg.member_message);
	var res={};
	if(msg.profile_message==="insertSummary")
	{
		var summary = msg.summary;
		var userId = msg.userId;
		console.log("In RMQS Profile Q:Inside InsertSummary function");
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"insertSummary", request: req, response: res});
		} else 
		{
			var query = dbConn.query("update users set ? where user_id=?", [ {summary : summary}, userId ], function(err, rows) {
				process.nextTick(function(){
					mysql.waitConnPool(null);
				});
				if (err) 
				{
					console.log(err);
					exce.mySqlException(err, res);
					// If no sql specific ecxeption then control comes to below
					// statement.
					exce.customException('Something went wrond. Please try again later', res);
				} else 
				{
					if (rows.length >= 1){
						//res.send({"Status" : "Success"}); "Commented by me"
						res.insertSummary = "Success";
						localSession.summary = summary;
					}else
					{
						//res.send({"error" : "Invalid user_id"}); "Commented by me"
						res.insertSummary = "Invalid user_id";
					}
					
			
						var ret = { "res":res};
						ret.session = localSession;
						console.log("Sending call back");
						console.log(ret);
						callback(null, ret);
				}
				mysql.returnDBconn(dbConn);
			});
		}	
	}
	else if(msg.profile_message==="insertExperience")
	{
		console.log("In RMQS:In handle request InsertExperiece:"+ msg);
		var data = msg.data;
		
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"insertExperience", request: req, response: res});
		} else 
		{
			var query = dbConn.query("INSERT INTO experience set ? ", data,function(err, rows) {
				process.nextTick(function(){
					mysql.waitConnPool(null);
				});
					if (err) 
					{
						console.log(err);
						exce.mySqlException(err, res);
					} else 
					{
						// res.send({"Status" : "Success"});
						res.insertExperience = "Success";
			
						var ret = {"res":res};
						
						console.log("Sending call back");
						console.log(ret);
						callback(null, ret);
					}
					mysql.returnDBconn(dbConn);
				});
		}
	}
	else if(msg.profile_message==="updateExperience")
	{
		
		var company=msg.company;
		var title = msg.title;
		var location=msg.location;
		var strDate=msg.strDate;
		var endDate=msg.endDate;
		var desc=msg.desc;
		var idExperience=msg.idExperience;
		var user_id=msg.user_id;
		console.log("In RMQS:In handle request updateExperience:"+ company+title+location+idExperience);
		var dbConn = mysql.getDBConn();
			if(dbConn === "empty")
			{
				mysql.waitConnPool({name:"updateExperience", request: req, response: res});
			} else 
			{
				var query = dbConn.query(
					"update experience set ? where idExperience=?", [ {
						company_name : company,
						title : title,
						location : location,
						start_date : strDate,
						end_date : endDate,
						description : desc}, 
						idExperience ], function(err, rows) {
	
						process.nextTick(function(){
							mysql.waitConnPool(null);
						});
						console.log("rows in updateExperience"+rows);
						if (err) 
						{
							console.log(err);
							exce.mySqlException(err, res);
							// If no sql specific ecxeption then control comes to
							// below statement.
							exce.customException('Something went wrong. Please try again later',res);
						} 
						else 
						{
							console.log("else of query in updateExperience"+rows);
							if (rows.affectedRows > 0)
							{
								//res.send({"Status" : "Success"});
								res.updateExperience = "Success";
											console.log("In RMQS:success updateExperience");
								
								console.log("Sending call back");
								console.log(ret);
								
							}							
							else
							{
								exce.customException('Invalid exprerience id.',res);
							}
						}
						mysql.returnDBconn(dbConn);
						var ret = {"res":res};
						callback(null, ret);
					});
					
			}
	}
	else if(msg.profile_message==="insertEducation")
	{
		var dbConn = mysql.getDBConn();
		var data = msg.data;
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"insertEducation", request: req, response: res});
		} else 
		{
			var query = dbConn.query("INSERT INTO education set ? ", data,function(err, rows) {
				
				process.nextTick(function(){
					mysql.waitConnPool(null);
				});
				if (err) 
				{
					console.log(err);
					exce.mySqlException(err, res);
					// If no sql specific ecxeption then control comes to
					// below statement.
					exce.mySqlException(err, res);
				} else 
				{
					if (rows.affectedRows > 0)
					{
						// res.send({
							// "Status" : "Success"
						// });
						res.insertEducation = "Success";
						console.log("In RMQS:success insertEducation");
					}
					else
					{
						exce.customException('Invalid user id.', res);
					}
							
				}
					mysql.returnDBconn(dbConn);
						var ret = {"res":res};
						callback(null, ret);
			});
		}
	}
	else if(msg.profile_message==="updateEducation")
	{
		var level=msg.level;
		var univ_name = msg.univ_name;
		var field=msg.field;
		var grade=msg.grade;
		var strDate=msg.strDate;
		var endDate=msg.endDate;
		var desc=msg.desc;
		var idEducation=msg.idEducation;
		var uid=msg.uid;
		var dbConn = mysql.getDBConn();
			if(dbConn === "empty")
			{
				mysql.waitConnPool({name:"updateEducation", request: req, response: res});
			} else 
			{
				var query = dbConn.query("Update education set ? where idEducation=? ",
							[ {
								level : level,
								univ_name : univ_name,
								field : field,
								grade : grade,
								start_date : strDate,
								end_date : endDate,
								description : desc
							}, idEducation ],
							function(err, rows) {
	
								process.nextTick(function(){mysql.waitConnPool(null);});
								if (err) 
								{
									console.log(err);
									exce.mySqlException(err, res);
								} else 
								{
									if (rows.affectedRows > 0)
									{
										//res.send({"Status" : "Success"});
										res.updateEducation = "Success";
											console.log("In RMQS:success updateEducation");
								
								console.log("Sending call back");
								console.log(ret);
									}
									else
									{
										exce.customException('Something went wrond. Please try again later.',res);
									}
								}
								var ret = {"res":res};
								callback(null, ret);
								mysql.returnDBconn(dbConn);
				});
			}
	}
	else{
		
		res.code = "401";
		res.value = "Failed Update";
		callback(null, res);
	}
	
}
exports.handle_request=handle_request;                                          