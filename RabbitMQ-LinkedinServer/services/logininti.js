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
		//var getUser="select * from users where emailId='"+email+"' and password='"+password+"'";
		//console.log(getUser);
//		mysql.fetchData(function(err,results){
//				if(err){
//					console.log(getUser);
//					throw err;
//				}
//				else 
//				{
//					//console.log(session.userId);
//					session.userId=results[0].userId;
//					session.emailId=email;
//					var date=new Date();
//					var lastLogin=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
//				  	var userid=results[0].userId;
//				  	console.log(lastLogin);
//					console.log(session.emailId);
//			    	console.log(session.userId);
//				    console.log("In function - signIn - Updating timestamp"+userid);
//				    session.lastLogin=lastLogin;
//							res.userId=results[0].userId;
//							res.lastLogin=results[0].lastLogin;
//							res.emailId=session.emailId;
//							res.login="Success";
//							console.log(res);
//							console.log("before callback");
//							callback(null, res);
//				}	
//			},getUser);	
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
	// else if(msg.login_message==="signup"){
		
		// var firstName=msg.firstName;
		// var lastName=msg.lastName;
		// var summary=null;
		// var lastLogin=null;
		// console.log("Inside signUp function");
		// var insertUser="INSERT INTO users set firstName='"+firstName+"',lastName='"+lastName+"',emailId='"+email+"'," +
				// "password='"+password+"',summary='"+summary+"',lastLogin='"+lastLogin+"'";
		// mysql.fetchData(function(err,results){
			// if(err){
				// throw err;
			// }
			// else{
			// //res.send({"userId":results[0].userId,"lastLogin":results1[0].lastLogin,"emailId":session.emailId,"login":"Success"});
			// session.emailId=email;
				// res.login="Success";
				// callback(null, res);
			// }
			// },insertUser);			
	// }
	// // To do
	// else if(msg.login_message==="signout"){
		
		// var userid=session.userId;
		// if((userid!==undefined && userid!=="") )  
		// {			
		// var date=new Date();	
		// var logOutTime=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();  
		// console.log("In function - signout"+userid);
		// var signout="Update users set logOutTime='"+logOutTime+"', lastLogin='"+session.lastLogin+"' where userId='"+userid+"' ";
		// mysql.fetchData(function(err,results){
			// if(err){
				// throw err;
			// }
			// else{
			// //res.send({"userId":results[0].userId,"lastLogin":results1[0].lastLogin,"emailId":session.emailId,"login":"Success"});
			// session.userId=null;
			// session.emailId=null;
			// session.lastLogin=null;
			// //session.destroy();
			// console.log("destroyed");
			// //res.send({"Status":"Logged out successfully"});	
			// res.login="Success";
			// callback(null, res);
			// }
			// },signout);	
		
		// }
	// }
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
