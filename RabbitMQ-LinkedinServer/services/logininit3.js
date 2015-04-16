var express = require('express');
var mysql = require('./mysql');
var exce = require('./customExceptions');

var localSession = [];
function handle_request(msg, callback){
	
	var res = {};
	console.log("RMQS:In handle request:"+ msg.login_message);
	var email=msg.email;
	var password=msg.password;
	if(msg.login_message==="signin"){
		console.log("Inside signIn function");
		console.log("login " + email);
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"validateUser", request: req, response: res});
		} else 
		{
			var query = dbConn.query("select * from users where email_id=? and password=?", [email, password], function(err, rows) {
				
				process.nextTick(function(){
					mysql.waitConnPool(null);
				});
				console.log(rows);
				if (err)
				{
					console.log(err);
					exce.mySqlException(err, res);
					// If no sql specific ecxeption then control comes to
					// below statement.
					exce.customException('Something went wrong. Please try again later',res);
				} else 
				{
					if (rows.length >= 1)
					{
						localSession.user_id = rows[0].user_id;
						
						res.session = localSession;
						localSession.lastLogin = rows[0].lastLogin;
						localSession.name = "praveeen";
						res.user_id= localSession.user_id;
						res.lastLogin = rows[0].lastLogin;
						res.first_name = rows[0].first_name;
						res.last_name = rows[0].last_name;
						//console.log(localSession.lastLogin);
						console.log(res.lastLogin + "FROM RMQ");						
						getSummary(localSession.user_id, msg, res, callback);
						//callback(null, res);
				}
				mysql.returnDBconn(dbConn);
				}
			});
			
		}
	}
	else{
		res.code = "401";
		res.value = "Failed Login";
		callback(null, res);
	}
	//callback(null, res);
}

function getSummary(user_id, req, res, callback)
{
	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"getSummary"});
	} else 
	{
		var query = dbConn.query("select summary from users where user_id = ? ", [ user_id ], function(err, rows) {
			
			process.nextTick(function() {
				mysql.waitConnPool(null);
			});
			//console.log(rows);
			if (err) 
			{
				console.log("failed to get summary" + err);
			} else 
			{
				if(rows.length >= 1)
				{
					//console.log(rows[0].summary);
					localSession.summary = rows;
					//getExperience(localSession.user_id, req, res);
					//console.log("printing from getsummary ");
					//console.log(localSession);
				}
				else
				{
					localSession.summary = [{summary:""}];
				}
				res.login  = "Success";
				console.log("Printing res::");
				console.log(res);
//				callback(null, res);
			}
			getExperience(localSession.user_id, req, res);
			callback(null, res);
			
			mysql.returnDBconn(dbConn);
		});
	}
}
function getExperience(user_id, req, res)
{
	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"getExperience"});
	} else 
	{
		var query = dbConn.query("select * from experience where user_id = ? ", [ user_id ], function(err, rows) {
			
			process.nextTick(function(){
				mysql.waitConnPool(null);
			});
			if (err) 
			{
				console.log("failed to getexperience" + err);
			} else 
			{
				if(rows.length >= 1)
				{
					localSession.experience = rows;
					console.log(rows);
				}
				else
				{
					localSession.experience = [{idExperience:0,
												company_name:"",
						                        title:"",
						                        location:"",
						                        start_date:"",
						                        end_date:"",
						                        descirption:""}];
				}
			}
//			getEducation(localSession.user_id, req, res);
//			getConnections(localSession.user_id, req, res);
			mysql.returnDBconn(dbConn);
		});
	}
}
function getConnections(user_id, req, res)
{
	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"getConnections"});
	} else 
	{
		var query = dbConn.query("SELECT from_user_id, first_name, last_name, connection_status FROM connections inner join users on connections.from_user_id = users.user_id where to_user_id = ? and connection_status = ?", [ user_id,0 ], function(err, rows) {
			
			process.nextTick(function(){
				mysql.waitConnPool(null);
			});
			if (err) 
			{
				console.log("failed to getexperience" + err);
			} else 
			{
				console.log(rows);
				if(rows.length >= 1)
				{
					res.connections = rows;

				}
				
			}
			mysql.returnDBconn(dbConn);
		});
	}
}

function getEducation(user_id, req, res)
{
	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"getEducation"});
	} else 
	{
		var query = dbConn.query("select * from education where user_id = ? ", [ user_id ], function(err, rows) {
			
			process.nextTick(function(){
				mysql.waitConnPool(null);
			});
			if (err) 
			{
				console.log("failed to get education" + err);
			} else 
			{
				if(rows.length >= 1)
				{
					res.education = rows;
					
				}
				else
				{
					res.education = [{idEducation:0,
												level:"",
						                        univ_name:"",
						                        field:"",
						                        grade:"",
						                        start_date:"",
						                        end_date:"",
						                        descirption:""}];
				}
			}
			getSkills(dbConn, localSession.user_id, req, res);
			mysql.returnDBconn(dbConn);
		});
	}
}

function getSkills(dbConn, user_id, req, res)
{
	var query = dbConn.query("select * from skills where user_id = ?", [ user_id ], function(err, rows) {
			
		/*process.nextTick(function(){
			mysql.waitConnPool(null);
		});*/
		if (err) 
		{
			console.log("failed to get skills" + err);
		} else 
		{
			if(rows.length >= 1)
			{
				res.skills = rows;
				//res.login  = "Success";
			}
			else
			{
				res.skills = [{idSkills:0,user_id:0,skill_name:""},
				                       {idSkills:0,user_id:0,skill_name:""},
									   {idSkills:0,user_id:0,skill_name:""},
									   {idSkills:0,user_id:0,skill_name:""},
									   {idSkills:0,user_id:0,skill_name:""}];
			}
			
		}
		// check available connections
		//checkInvitations(dbConn, user_id, req, res);
		//res.send({"login":"Success"});
		//mysql.returnDBconn(dbConn);
	});
}

function checkInvitations(dbConn, user_id, req, res)
{
	var query = dbConn.query("select * from connections where to_user_id = ?", [ user_id ], function(err, rows) {
		if (err) 
		{
			console.log("failed to get invitations" + err);
			process.nextTick(function(){mysql.waitConnPool(null);});
			//res.send({"login":"Success"});
//			mysql.returnDBconn(dbConn);
		} else 
		{
			if(rows.length >= 1)
			{
				for(var i = 0; i<rows.length;i++)
				{
					if(rows[i].connection_status === 0)
					{
						res.invitations = rows[0];
					}
				}
				if(localSession.invitations === undefined ||
						res.invitations === null ||
						res.invitations === "")
				{
					console.log("no invitations to accept");
					process.nextTick(function(){mysql.waitConnPool(null);});
					//res.send({"login":"Success"});
					mysql.returnDBconn(dbConn);
				}
				else
				{
					//console.log(localSession.invitations);
					var query = dbConn.query("select first_name,last_name from users where user_id = ?", [ localSession.invitations.from_user_id ], 
							function(err, rows) {
						if (err) 
						{
							console.log("failed to get invitee details" + err);
						} else 
						{
							//console.log(rows);
							if(rows.length>1){
								res.invite_first_name = rows[0].first_name;
								res.invite_last_name = rows[0].last_name;
							}
						}
						process.nextTick(function(){mysql.waitConnPool(null);});
						
						mysql.returnDBconn(dbConn);
					});
				}
			}
			else
			{
				res.invitations = [ { idConnection: 0,
										       to_user_id: 0,
										       from_user_id: 0,
										       connection_status: 0} ];
				res.invite_first_name = "";
				res.invite_last_name = "";
				process.nextTick(function(){mysql.waitConnPool(null);});
				//res.send({"login":"Success"});
				mysql.returnDBconn(dbConn);
			}
		}
	});
}



exports.handle_request = handle_request;
