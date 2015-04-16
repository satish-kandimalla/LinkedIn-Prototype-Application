var ejs = require("ejs");
var express = require('express');

var sessions = require('./sessions');
var mysql = require('./connections');
var exce = require('./customExceptions');
var mq_client = require('../rpc/client');
var localSession;



/*******************************************************************************
 * 
 * local get DB functions
 * 
 * 
 */
//function checkInvitations(dbConn, user_id, req, res)
//{
//	var query = dbConn.query("select * from connections where to_user_id = ?", [ user_id ], function(err, rows) {
//		if (err) 
//		{
//			console.log("failed to get invitations" + err);
//			process.nextTick(function(){mysql.waitConnPool(null);});
//			res.send({"login":"Success"});
////			mysql.returnDBconn(dbConn);
//		} else 
//		{
//			if(rows.length >= 1)
//			{
//				for(var i = 0; i<rows.length;i++)
//				{
//					if(rows[i].connection_status === 0)
//					{
//						localSession.invitations = rows[0];
//					}
//				}
//				if(localSession.invitations === undefined ||
//						localSession.invitations === null ||
//						localSession.invitations === "")
//				{
//					console.log("no invitations to accept");
//					process.nextTick(function(){mysql.waitConnPool(null);});
//					res.send({"login":"Success"});
//					mysql.returnDBconn(dbConn);
//				}
//				else
//				{
//					//console.log(localSession.invitations);
//					var query = dbConn.query("select first_name,last_name from users where user_id = ?", [ localSession.invitations.from_user_id ], 
//							function(err, rows) {
//						if (err) 
//						{
//							console.log("failed to get invitee details" + err);
//						} else 
//						{
//							//console.log(rows);
//							if(rows.length>1){
//								localSession.invite_first_name = rows[0].first_name;
//								localSession.invite_last_name = rows[0].last_name;
//							}
//						}
//						process.nextTick(function(){mysql.waitConnPool(null);});
//						res.send({"login":"Success"});
//						mysql.returnDBconn(dbConn);
//					});
//				}
//			}
//			else
//			{
//				localSession.invitations = [ { idConnection: 0,
//										       to_user_id: 0,
//										       from_user_id: 0,
//										       connection_status: 0} ];
//				localSession.invite_first_name = "";
//				localSession.invite_last_name = "";
//				process.nextTick(function(){mysql.waitConnPool(null);});
//				res.send({"login":"Success"});
//				mysql.returnDBconn(dbConn);
//			}
//		}
//	});
//}


/*******************************************************************************
 * 
 * local get DB functions
 * 
 * 
 */

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
				localSession.skills = rows;
			}
			else
			{
				localSession.skills = [{idSkills:0,user_id:0,skill_name:""},
				                       {idSkills:0,user_id:0,skill_name:""},
									   {idSkills:0,user_id:0,skill_name:""},
									   {idSkills:0,user_id:0,skill_name:""},
									   {idSkills:0,user_id:0,skill_name:""}];
			}
		}
		// check available connections
		checkInvitations(dbConn, user_id, req, res);
		//res.send({"login":"Success"});
		//mysql.returnDBconn(dbConn);
	});
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
					localSession.education = rows;
					
				}
				else
				{
					localSession.education = [{idEducation:0,
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

//function getExperience(user_id, req, res)
//{
//	var dbConn = mysql.getDBConn();
//	if(dbConn === "empty")
//	{
//		mysql.waitConnPool({name:"getExperience"});
//	} else 
//	{
//		var query = dbConn.query("select * from experience where user_id = ? ", [ user_id ], function(err, rows) {
//			
//			process.nextTick(function(){
//				mysql.waitConnPool(null);
//			});
//			if (err) 
//			{
//				console.log("failed to getexperience" + err);
//			} else 
//			{
//				if(rows.length >= 1)
//				{
//					localSession.experience = rows;
//					console.log(rows);
//					//getEducation(localSession.user_id, req, res);
//					/*localSession.company_name = rows[0].company_name;
//					localSession.title = rows[0].title;
//					localSession.location = rows[0].location;
//					localSession.exp_start_date = rows[0].start_date;
//					localSession.exp_end_date = rows[0].end_date;
//					localSession.exp_description = rows[0].description;*/
//				}
//				else
//				{
//					localSession.experience = [{idExperience:0,
//												company_name:"",
//						                        title:"",
//						                        location:"",
//						                        start_date:"",
//						                        end_date:"",
//						                        descirption:""}];
//				}
//			}
//			getEducation(localSession.user_id, req, res);
//			mysql.returnDBconn(dbConn);
//		});
//	}
//}

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
			getEducation(localSession.user_id, req, res);
			getConnections(localSession.user_id, req, res);
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
					localSession.connections = rows;

				}
				
			}
			mysql.returnDBconn(dbConn);
		});
	}
}
function getSummary(user_id, req, res)
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
			}
			getExperience(localSession.user_id, req, res);
			mysql.returnDBconn(dbConn);
		});
	}
}


/*******************************************************************************
 * 
 * Inserts sign up data into DB
 * 
 * 
 */
exports.insertUser = function(req, res) {

	var fname = req.param("fname"), lname = req.param("lname");
	var email = req.param("email"), pswd = req.param("pswd");
	
	if(!ValidateEmail(email)){
		res.send({
			'error':"Invalid email."
		});
	}
	
	if ((fname !== undefined && pswd !== undefined && lname !== undefined && email !== undefined) &&
			(fname !== "" && pswd !== "" && lname !== "" && email !== "")) 
	{
		var data = 
		{
			user_id    : null,
			first_name : fname,
			last_name  : lname,
			email_id   : email,
			password   : pswd,
			summary    : null,
			lastLogin  : null
		};
		var msg_payload={"data": data,"login_message":"signup"};
		mq_client.make_request('login_queue',msg_payload, function(err,results){
		if(err){
				throw err;
			}
			else 
			{
				console.log("In RMQC: Got return call from RMQ for Signup"+ JSON.stringify(results));	
				if(results.res.signup ==="Success"){
					res.send({"Status" : "Success"});
				}				
		}});
		// var dbConn = mysql.getDBConn();
		// if(dbConn === "empty")
		// {
			// mysql.waitConnPool({name:"insertUser", request: req, response: res});
		// } else 
		// {
			// var query = dbConn.query("INSERT INTO users set ? ", data, function(err, rows) {
				
				// process.nextTick(function(){
					// mysql.waitConnPool(null);
				// });
				
				// if (err) 
				// {
					// console.log(err);
					// exce.mySqlException(err, res);
				// } else 
				// {
					// res.send({"Status" : "Success"});
					// console.log("succeess");
				// }
				// mysql.returnDBconn(dbConn);
			// });
		
	} else 
	{
		exce.customException('Please fill all the mandatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Add Last login to users table while signing out
 * 
 * 
 */
// TODO both validations and sessions
exports.signout = function(req, res) {

	var userid = req.session.user_id;

	if ((userid !== undefined && userid !== "")) 
	{
		
		var msg_payload={"userid":userid, "login_message":"signout"};
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			if(err){
					throw err;
				}
				else 
				{
					console.log("In RMQC: Got return call from RMQ for Signout"+ JSON.stringify(results));	
					if(results.res.signout ==="Success"){
						
						req.session.destroy(function(err){
							if(err)
							{
								console.log(err);
							}
						});
						res.send({"Status" : "Success"});
					}				
			}});
//		var dbConn = mysql.getDBConn();
//		if(dbConn === "empty")
//		{
//			mysql.waitConnPool({name:"signout", request: req, response: res});
//		} else 
//		{
//			var query = dbConn.query("Update users set ? where user_id=? ", [ data,userid ], function(err, rows) {
//				process.nextTick(function(){
//					mysql.waitConnPool(null);
//				});
//				if (err) 
//				{
//					console.log(err);
//					exce.mySqlException(err, res);
//					// If no sql specific exception then control comes to below statement.
//					exce.customException('Something went wrong. Please try again later', res);
//				} else 
//				{
//					if (rows.affectedRows > 0)
//					{
//						console.log("signout successful");
//						req.session.destroy(function(err){
//							if(err)
//							{
//								console.log(err);
//							}
//						});
//						res.send({"Status" : "Success"});
//					}	
//					else 
//					{
//						exce.customException('User already logged out.', res);
//					}
//				}
//				mysql.returnDBconn(dbConn);
//			});
//			console.log(query);
//		}
	}
};

function ValidateEmail(mail) 
{
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return (true);
	}
	return (false);
}



/**
 * For login
 */
// TODO sessions
exports.validateUser = function(req, res) {
	var pwd      = req.param("password");
	var email    = req.param("email");
	localSession = req.session;
	if(!ValidateEmail(email)){
		res.send({
			'error':"Invalid email."
		});
	}
	
	
	if ((pwd !== undefined && email !== undefined) &&
			(pwd !== "" && email !== "")) 
	{
		var msg_payload={"email": email,"password": pwd,"login_message":"signin"};
		//var msg_payload={"req": req,"res": res,"login_message":"signin"};
		console.log("login queuegffff");
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			console.log("login queue");
//			console.log(results.lastLogin+" "+results.login);
			if(err){
				throw err;
			}
			else 
			{
				console.log("Got return call from RMQ"+ JSON.stringify(results) + "FROM RMQ Client");
				console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
				console.log(results);
				if(results.res.login ==="Success"){
					console.log("valid Login");
					 //res.send({"userId":results.userId,"lastLogin":results.lastLogin,"emailId":results.emailId,"login":"Success"});	  
					    req.session.user_id = results.session.user_id;
						req.session.lastLogin = results.session.lastLogin;
						req.session.first_name = results.session.first_name;
						req.session.last_name = results.session.last_name;
						req.session.summary = results.session.summary;
						req.session.experience=results.session.experience;
						req.session.connections=results.session.connections;
						req.session.education=results.session.education;
						req.session.skills=results.session.skills;
						req.session.invitations=results.session.invitations;
						req.session.invite_first_name=results.session.invite_first_name;
						req.session.invite_last_name=results.session.invite_last_name;
						console.log("*****************respose rabbit mq********"+req.session.user_id+req.session.first_name);
						console.log(req.session.lastLogin);
						//req = results.req;
						//res = results.res;
						res.send({"login":"Success"});
						//getSummary(localSession.user_id, req, res);
				}
				else {    	
					console.log("Invalid Login");
					res.send({"login":"Fail"});
				}
			}  
		});
		// console.log("login " + email);
		// var dbConn = mysql.getDBConn();
		// if(dbConn === "empty")
		// {
			// mysql.waitConnPool({name:"validateUser", request: req, response: res});
		// } else 
		// {
			// var query = dbConn.query("select * from users where email_id=? and password=?", [email, pwd], function(err, rows) {
				
				// process.nextTick(function(){
					// mysql.waitConnPool(null);
				// });
				// console.log(rows);
				// if (err)
				// {
					// console.log(err);
					// exce.mySqlException(err, res);
					// // If no sql specific ecxeption then control comes to
					// // below statement.
					// exce.customException('Something went wrond. Please try again later',res);
				// } else 
				// {
					// if (rows.length >= 1)
					// {
						// localSession.user_id = rows[0].user_id;
						// localSession.lastLogin = rows[0].lastLogin;
						// localSession.first_name = rows[0].first_name;
						// localSession.last_name = rows[0].last_name;
						// console.log(localSession.lastLogin);
						// getSummary(localSession.user_id, req, res);
						
		
					// }else
					// {
						// exce.customException('Invalid login details', res);
					// }
				// }
				// mysql.returnDBconn(dbConn);
			// });
		// }
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Inserts Summary Info into DB
 * 
 * 
 */

exports.insertSummary = function(req, res) {
	
	var summary   = req.param("summary");
	var userId    = req.session.user_id;
	
	if ((summary !== undefined && userId !== undefined) &&
			(summary !== "" && userId !== "")) 
	{
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
						res.send({"Status" : "Success"});
						localSession.summary = summary;
					}else
					{
						res.send({"error" : "Invalid user_id"});
					}
				}
				mysql.returnDBconn(dbConn);
			});
		}	
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Inserts Experience Info into DB
 * 
 * 
 */

function insertExperience(req, res) {

	var company   = req.param("companyName"); // getting company name parameter
	var title     = req.param("title"); // getting job title from http request
	var location  = req.param("location") === undefined ? null : req.param("location"); // not a manadatory field
	var strDate   = req.param("startdate"), endDate = req.param("enddate");
	var desc      = req.param("description") === undefined ? null : req.param("description"); // not a manadatory field
	var uid       = req.session.user_id;
	
	console.log(company,title,location,strDate,desc,uid);
	if ((company !== undefined && title !== undefined && strDate !== undefined && uid !== undefined) &&
			(company !== "" && title !== "" && strDate !== "" && uid !== "")) 
	{
		var data = 
		{
			idExperience : null,
			company_name : company,
			user_id : uid,
			title : title,
			location : location,
			start_date : strDate,
			end_date : endDate,
			description : desc
		};
		var msg_payload={"data": data, "profile_message":"insertExperience"};
		mq_client.make_request('profile_queue',msg_payload, function(err,results){
			if(err){
					throw err;
				}
				else 
				{
					console.log("In RMQC: Got return call from RMQ for InsertExperience"+ JSON.stringify(results));	
					if(results.res.insertExperience ==="Success"){
						res.send({"Status" : "Success"});
					}				
			}});
//		var dbConn = mysql.getDBConn();
//		if(dbConn === "empty")
//		{
//			mysql.waitConnPool({name:"insertExperience", request: req, response: res});
//		} else 
//		{
//			var query = dbConn.query("INSERT INTO experience set ? ", data,function(err, rows) {
//				process.nextTick(function(){
//					mysql.waitConnPool(null);
//				});
//					if (err) 
//					{
//						console.log(err);
//						exce.mySqlException(err, res);
//					} else 
//					{
//						res.send({"Status" : "Success"});
//					}
//					mysql.returnDBconn(dbConn);
//				});
//		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
}

/*******************************************************************************
 * 
 * Update Experience Info in DB
 * 
 * 
 */

exports.updateExperience = function(req, res) {

	var company       = req.param("companyName"); // getting company name parameter
	var title         = req.param("title"); // getting job title from http request
	var location      = req.param("location") === undefined ? null : req.param("location"); // not a manadatory field
	var strDate       = req.param("startdate"), endDate = req.param("enddate");
	var desc          = req.param("description") === undefined ? null : req.param("description"); // not a manadatory field
	var idExperience  = req.param("id");
	var user_id       = req.session.user_id;
	
	//testing to print session details
	console.log(idExperience);
	if(idExperience === "0")
	{
		insertExperience(req,res);
	}
	else
	{
		if ((company !== undefined && company !== "") &&
				(user_id !== undefined && user_id !== "") &&
				(title !== undefined && title !== "") &&
				(idExperience !== undefined && idExperience !== "") &&
				(strDate !== undefined && strDate !== "")) 
		{
			var msg_payload={"company": company, "title": title , "location": location, "strDate": strDate,"endDate":endDate, "desc": desc, "idExperience": idExperience, "user_id": user_id, "profile_message":"updateExperience"};
			mq_client.make_request('profile_queue',msg_payload, function(err,results){
				if(err){
						throw err;
					}
					else 
					{
						console.log("In RMQC: Got return call from RMQ for Update Experience"+ JSON.stringify(results));	
						if(results.res.updateExperience ==="Success"){
							res.send({"Status" : "Success"});
						}				
				}});
			// var dbConn = mysql.getDBConn();
			// if(dbConn === "empty")
			// {
				// mysql.waitConnPool({name:"updateExperience", request: req, response: res});
			// } else 
			// {
				// var query = dbConn.query(
					// "update experience set ? where idExperience=?", [ {
						// company_name : company,
						// title : title,
						// location : location,
						// start_date : strDate,
						// end_date : endDate,
						// description : desc}, 
						// idExperience ], function(err, rows) {
	
						// process.nextTick(function(){
							// mysql.waitConnPool(null);
						// });
						// if (err) 
						// {
							// console.log(err);
							// exce.mySqlException(err, res);
							// // If no sql specific ecxeption then control comes to
							// // below statement.
							// exce.customException('Something went wrong. Please try again later',res);
						// } else 
						// {
							// console.log(rows);
							// if (rows.affectedRows > 0)
							// {
								// res.send({"Status" : "Success"});
							// }							
							// else
							// {
								// exce.customException('Invalid exprerience id.',res);
							// }
						// }
						// mysql.returnDBconn(dbConn);
					// });
			// }
		} else 
		{
			console.log("error");
			exce.customException('Please fill all the manidatory fields', res);
		}
	}
};

/*******************************************************************************
 * 
 * Inserts Education Info into DB
 * 
 * 
 */

function insertEducation(req, res) {

	var level       = req.param("level") === undefined ? null : req.param("level");
	var univ_name   = req.param("univName");
	var field       = req.param("studyfield") === undefined ? null : req.param("studyfield"); // not a manadatory field
	var grade       = req.param("grade") === undefined ? null : req.param("grade"); // not a manadatory field
	var strDate     = req.param("startdate"), endDate = req.param("enddate");
	var desc        = req.param("description") === undefined ? null : req.param("description"); // not a manadatory field
	var uid         = req.session.user_id;

	if ((univ_name !== undefined && uid !== undefined && strDate !== undefined)&& 
			(univ_name !== "" && uid !== "" && strDate !== "")) 
	{
		var data = 
		{
			idEducation : null,
			level : level,
			univ_name : univ_name,
			field : field,
			grade : grade,
			start_date : strDate,
			end_date : endDate,
			description : desc,
			user_id : uid
		};
		var msg_payload={"data": data, "profile_message":"insertEducation"};
		mq_client.make_request('profile_queue',msg_payload, function(err,results){
			if(err){
					throw err;
				}
				else 
				{
					console.log("In RMQC: Got return call from RMQ for insertEducation"+ JSON.stringify(results));	
					if(results.res.insertEducation ==="Success"){
						res.send({"Status" : "Success"});
					}				
			}});
//		var dbConn = mysql.getDBConn();
//		if(dbConn === "empty")
//		{
//			mysql.waitConnPool({name:"insertEducation", request: req, response: res});
//		} else 
//		{
//			var query = dbConn.query("INSERT INTO education set ? ", data,function(err, rows) {
//				
//				process.nextTick(function(){
//					mysql.waitConnPool(null);
//				});
//				if (err) 
//				{
//					console.log(err);
//					exce.mySqlException(err, res);
//					// If no sql specific ecxeption then control comes to
//					// below statement.
//					exce.mySqlException(err, res);
//				} else 
//				{
//					if (rows.affectedRows > 0)
//					{
//						res.send({
//							"Status" : "Success"
//						});
//					}
//					else
//					{
//						exce.customException('Invalid user id.', res);
//					}
//							
//				}
//					mysql.returnDBconn(dbConn);
//			});
//		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
}

/*******************************************************************************
 * 
 * Update Eduction Info in DB
 * 
 * 
 */

exports.updateEducation = function(req, res) {

	var level       = req.param("level") === undefined ? null : req.param("level");
	var univ_name   = req.param("univName");
	var field       = req.param("studyfield") === undefined ? null : req.param("studyfield"); // not a manadatory field
	var grade       = req.param("grade") === undefined ? null : req.param("grade"); // not a manadatory field
	var strDate     = req.param("startdate"), endDate = req.param("enddate");
	var desc        = req.param("description") === undefined ? null : req.param("description"); // not a manadatory field
	var uid         = req.session.user_id;
	var idEducation = req.param("id");

	console.log(level, univ_name, field, grade, strDate, desc, uid, idEducation);
	if(idEducation === "0")
	{
		insertEducation(req,res);
	}
	else
	{
	
		if ((univ_name !== undefined && idEducation !== undefined) && 
				(univ_name !== "" && idEducation !== "")) 
		{
			var msg_payload={"level": level, "univ_name": univ_name , "field": field, "grade": grade,"strDate":strDate,"endDate":endDate, "desc": desc, "idEducation": idEducation, "uid": uid, "profile_message":"updateEducation"};
			mq_client.make_request('profile_queue',msg_payload, function(err,results){
				if(err){
						throw err;
					}
					else 
					{
						console.log("In RMQC: Got return call from RMQ for Update education"+ JSON.stringify(results));	
						if(results.res.updateEducation ==="Success"){
							res.send({"Status" : "Success"});
						}				
				}});
			//			var dbConn = mysql.getDBConn();
//			if(dbConn === "empty")
//			{
//				mysql.waitConnPool({name:"updateEducation", request: req, response: res});
//			} else 
//			{
//				var query = dbConn.query("Update education set ? where idEducation=? ",
//							[ {
//								level : level,
//								univ_name : univ_name,
//								field : field,
//								grade : grade,
//								start_date : strDate,
//								end_date : endDate,
//								description : desc
//							}, idEducation ],
//							function(err, rows) {
//	
//								process.nextTick(function(){mysql.waitConnPool(null);});
//								if (err) 
//								{
//									console.log(err);
//									exce.mySqlException(err, res);
//								} else 
//								{
//									if (rows.affectedRows > 0)
//									{
//										res.send({"Status" : "Success"});
//									}
//									else
//									{
//										exce.customException('Something went wrond. Please try again later.',res);
//									}
//								}
//								mysql.returnDBconn(dbConn);
//				});
//			}
		} else 
		{
			exce.customException('Please fill all the manidatory fields', res);
		}
	}
};

/*******************************************************************************
 * 
 * insert skills Info in DB
 * 
 * 
 */

function insertSkills(req, res) {
	
}

/*******************************************************************************
 * 
 * Update skills Info in DB
 * 
 * 
 */
exports.updateSkills = function(req, res){
	var userId = req.session.user_id;
	
	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"updateSkills", request: req, response: res});
	} else 
	{
		
		var data =
		{
			user_id : userId,
			skill_name : req.param("skill")
		};
		var query = dbConn.query("INSERT INTO skills set ? ",data,function(err, rows) {
			if (err) 
			{
				console.log(err);
				exce.mySqlException(err, res);
				// If no sql specific ecxeption then
				// control comes to below statement.
				exce.customException('Something went wrond. Please try again later',res);
			} else 
			{
				res.send({"Status" : "Success"});
			}
			mysql.returnDBconn(dbConn);
		});
		
	}
	

	console.log(skills);
};

function connection(dbConn, task, connectionStatus, toId, fromId, res){
	if (task !== undefined && task === 'send') 
	{
		if (connectionStatus === undefined || connectionStatus === -1) 
		{
			var data =
			{
				idConnection : null,
				to_user_id : toId,
				from_user_id : fromId
			};
			var query = dbConn.query("INSERT INTO connections set ? ",data,function(err, rows) {
				if (err)
				{
					console.log(err);
					exce.mySqlException(err, res);
					// If no sql specific ecxeption then
					// control comes to below statement.
					exce.customException('Something went wrond. Please try again later',res);
				} else 
				{
					console.log("send request successfull");
					res.send({"Status" : "Success"});
				}
				mysql.returnDBconn(dbConn);
			});
		} else if (connectionStatus === 0) 
		{
			exce.customException('Conncetion request already sent.', res);
		} else if (connectionStatus === 1) 
		{
			exce.customException('User is already in your connections.', res);
		} else 
		{
			exce.customException('Something went wrond. Please try again later', res);
		}
	} else if (task !== undefined && task === 'accept') 
	{
		if (connectionStatus !== undefined && connectionStatus === 0) 
		{
			var data = 
			{
					connection_status : 1
			};
			var query = dbConn.query("Update connections set ? WHERE from_user_id = ? and to_user_id = ? ",
					[ data, req.param("sender"), req.param("receiver") ],function(err, rows) {
								
				if (err) 
				{
					console.log(err);
					exce.mySqlException(err, res);
					mysql.returnDBconn(dbConn);
					// If no sql specific ecxeption then control
					// comes to below statement.
					exce.customException('Something went wrond. Please try again later',res);
				} else 
				{
					if (rows.affectedRows > 0) 
					{
						mysql.returnDBconn(dbConn);
						res.send({"Status" : "Success"});
					} else 
					{
						var query2 = dbConn.query("Update connections set ? WHERE from_user_id = ? and to_user_id = ? ",
										[data,toId,fromId],function(err, rows) {
											
							mysql.returnDBconn(dbConn);
							if (err) 
							{
								console.log(err);
								exce.mySqlException(err,res);
								// If no sql specific ecxeption then control comes to
								// below statement.
								exce.customException('Something went wrond. Please try again later',res);
							} else 
							{
								if (rows.affectedRows > 0) 
								{
									res.send({"Status" : "Success"});
								} else 
								{
									exce.customException('Something went wrond. Please try again later',res);
								}
							}
						});
					}
				}

			});
		} else if (connectionStatus !== undefined && connectionStatus === 1) 
		{
			exce.customException('User is already connected.', res);
		} else 
		{
			exce.customException('Connection request isn\'t pending.', res);
		}
	} else if (task !== undefined && task === 'reject') 
	{
		if (connectionStatus !== undefined && connectionStatus === 0) 
		{
			var data = 
			{
				flag_connection : 0
			};
			var query = dbConn.query("DELETE FROM CONNECTIONS WHERE from_user_id = ? and to_user_id = ?",
							[ fromId, toId ],function(err, rows) {
								
				if (err) 
				{
					console.log(err);
					exce.mySqlException(err, res);
					mysql.returnDBconn(dbConn);
					// If no sql specific ecxeption then control
					// comes to below statement.
					exce.customException('Something went wrond. Please try again later',res);
				} else 
				{
					if (rows.affectedRows > 0) 
					{
						mysql.returnDBconn(dbConn);
						res.send({"Status" : "Success"});
					} else 
					{
						var query2 = dbConn.query("DELETE FROM CONNECTIONS WHERE from_user_id = ? and to_user_id = ?",
										[toId,fromId ],function(err, rows) {
											
							mysql.returnDBconn(dbConn);
							if (err) 
							{
								console.log(err);
								exce.mySqlException(err,res);
								exce.customException('Something went wrond. Please try again later',res);
							} else 
							{
								if (rows.affectedRows > 0) 
								{
									res.send({"Status" : "Success"});
								} else 
								{
									exce.customException('Something went wrond. Please try again later',res);
								}
							}
						});
					}
				}
			});
		} else if (connectionStatus !== undefined && connectionStatus === 1) 
		{
			exce.customException('User already connected.', res);
		} else 
		{
			exce.customException('Connection request isn\'t pending.', res);
		}
	} else if (task !== undefined && task === 'remove') 
	{
		if (connectionStatus !== undefined && connectionStatus === 1) 
		{
			var data = 
			{
				connection_status : -1
			};
			var query = dbConn.query("Update connections set ? WHERE from_user_id = ? and to_user_id = ? ",
							[ data, fromId, toId ],function(err, rows) {
								
				if (err) 
				{
					console.log(err);
					exce.mySqlException(err, res);
					mysql.returnDBconn(dbConn);
					// If no sql specific ecxeption then control comes to below statement.
					exce.customException('Something went wrond. Please try again later',res);
				} else 
				{
					if (rows.affectedRows > 0) 
					{
						mysql.returnDBconn(dbConn);
						res.send({"Status" : "Success"});
					} else 
					{
						var query = dbConn.query("Update connections set ? WHERE from_user_id = ? and to_user_id = ? ",
														[data,toId,fromId ],function(err, rows) {
															
							mysql.returnDBconn(dbConn);
							if (err) 
							{
								console.log(err);
								exce.mySqlException(err,res);
								// If no sql specific ecxeption then control comes to below statement.
								exce.customException('Something went wrond. Please try again later',res);
							} else 
							{
								if (rows.affectedRows > 0) 
								{
									res.send({"Status" : "Success"});
								} else 
								{
									exce.customException('Something went wrond. Please try again later',res);
								}
							}
						});
					}
				}
			});
		} else 
		{
			exce.customException('User is not connected.', res);
		}
	} else 
	{
		exce.customException('Something went wrond. Please try again later.',res);
	}
}


/**
 * Checks for duplicate invitations.
 * 
 * @param req
 * @param res
 */
function checkConnection(dbConn,task, req, res) {
	var toEmailID    = req.param("receiver");
	var fromId       = req.session.user_id;
	var  toId		 = 0;
	if (task !== undefined && task === 'send')
	{
		if ((toEmailID !== undefined && fromId !== undefined) && 
				(toEmailID !== "" && fromId !== "")) 
		{
			var query = dbConn.query("SELECT user_id FROM users where email_id = ? ",[ toEmailID ], function(err, rows) {
				if (err) 
				{
					console.log(err);
					exce.mySqlException(err, res);
					// If no sql specific ecxeption then control
					// comes to below statement.
					exce.customException('Something went wrond. Please try again later',res);
					mysql.returnDBconn(dbConn);
				} else 
				{
					if(rows.length > 0)
					{
						console.log("got the guest userid as " + rows[0].user_id);
						toId = rows[0].user_id;
					}
				}
			});
		}
	}
	else
	{
		toId = toEmailID;
	}
	if ((toId !== undefined && fromId !== undefined) && 
			(toId !== "" && fromId !== "")) 
	{	
		var query = dbConn.query("SELECT * FROM connections where to_user_id = ? AND from_user_id = ? ",[ toId, fromId ], function(err, rows) {
			if (err) 
			{
				console.log(err);
				exce.mySqlException(err, res);
				// If no sql specific ecxeption then control
				// comes to below statement.
				exce.customException('Something went wrond. Please try again later',res);
				mysql.returnDBconn(dbConn);
			} else 
			{
				console.log(rows);
				if (rows.length > 0) 
				{
					//mysql.returnDBconn(dbConn);
					connection(dbConn, task, rows[0].connection_status,toId, fromId, res);
				} else 
				{
					var query = dbConn.query("SELECT * FROM connections where to_user_id = ? AND from_user_id = ? ",
									[ fromId, toId ],function(err, rows) {
										
						if (err) 
						{
							console.log(err);
							exce.mySqlException(err,res);
							mysql.returnDBconn(dbConn);
							exce.customException('Something went wrond. Please try again later',res);
						} else 
						{
							//mysql.returnDBconn(dbConn);
							if (rows.length > 0) 
							{
								connection(dbConn, task,rows[0].connection_status,toId, fromId,res);
							} else 
							{
								connection(dbConn, task,undefined,toId, fromId,res);
							}
						}
					});
				}
			}
		});
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
}

/*******************************************************************************
 * 
 * send invitations
 * 
 * 
 */

exports.sendinvitation = function(req, res) {

	var toEmailID    = req.param("receiver");
	var fromId       = req.session.user_id;
//	var fromId       = req.param("sender");
	var msg_payload={"toEmailID": toEmailID,"fromId": fromId, "member_message":"sendinvitation"};
	
	console.log("got the emailID as " + toEmailID);
	if ((toEmailID !== undefined && fromId !== undefined) && 
			(toEmailID !== "" && fromId !== "")) 
	{
		mq_client.make_request('member_queue',msg_payload, function(err,results){
			if(err){
					throw err;
				}
				else 
				{
					console.log("In RMQC: Got return call from RMQ for SendInvitation"+ JSON.stringify(results));	
					if(results.res.sendinvitation ==="Success"){
						
						res.send({"login":"Success"});
						localSession = results.res.session;
					}				
			}});
//		var dbConn = mysql.getDBConn();
//		if(dbConn === "empty")
//		{
//			mysql.waitConnPool({name:"sendinvitation", request: req, response: res});
//		} else 
//		{
//			checkConnection(dbConn, 'send', req, res);
//			process.nextTick(function(){
//				mysql.waitConnPool(null);
//				});
//		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};


/*******************************************************************************
 * 
 * Accept invitations
 * 
 * 
 */

exports.acceptinvitation = function(req, res) {

	// var idConnection = req.param("ConnectionId");
	var toId   = req.param("receiver");
	var fromId = req.param("sender");

	if ((toId !== undefined && fromId !== undefined) && 
			(toId !== "" && fromId !== "")) 
	{
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"acceptinvitation", request: req, response: res});
		} else 
		{
			checkConnection(dbConn, 'accept', req, res);
			process.nextTick(function(){
				mysql.waitConnPool(null);
				});
		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Remove Invitation
 * 
 * 
 */

exports.rejectinvitation = function(req, res) {

	// var idConnection = req.param("ConnectionId");
	var toId   = req.param("receiver");
	var fromId = req.param("sender");

	if ((toId !== undefined && fromId !== undefined) && 
			(toId !== "" && fromId !== "")) 
	{
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"rejectinvitation", request: req, response: res});
		} else 
		{
			checkConnection(dbConn, 'reject', req, res);
		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};

/*******************************************************************************
 * 
 * Remove Connection
 * 
 * 
 */

exports.removeconnection = function(req, res) {

	// var idConnection = req.param("ConnectionId");
	var toId   = req.param("receiver");
	var fromId = req.param("sender");

	if ((toId !== undefined && fromId !== undefined) && 
			(toId !== "" && fromId !== "")) 
	{
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"removeconnection", request: req, response: res});
		} else 
		{
			checkConnection(dbConn, 'remove', req, res);
			process.nextTick(function(){
				mysql.waitConnPool(null);
				});
		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};



exports.getProfile = function(req, res){
	var user_id = req.param("user_id");
	console.log("loading the search result profile page " + user_id);
	var last_name = "", first_name = "", summary = "";
	var company_name = "", title = "", location = "", exp_start_date= "", exp_end_date = "", exp_description = "";
	var level = "", univ_name = "", field = "", grade = "", edu_start_date = "", edu_end_date = "", edu_description = "";
	
	if ((user_id !== undefined) && 
		(user_id !== "")) 
	{
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"getProfile", request: req, response: res});
		} else
		{
			//get the user summary data
			var query = dbConn.query("select * from users where user_id=?", [user_id], function(err, rows) {
				
				if (err)
				{
					console.log(err);
					exce.mySqlException(err, res);
					// If no sql specific ecxeption then control comes to
					// below statement.
					exce.customException('Something went wrond. Please try again later',res);
				} else 
				{
					if (rows.length >= 1)
					{
						first_name = rows[0].first_name;
						last_name = rows[0].last_name;
						summary = rows[0].summary;
					}else
					{
						console.log("no valid profile");
					}
				}
			});
			//get the guest profile experience
			var query = dbConn.query("select * from experience where user_id = ? ", [ user_id ], function(err, rows) {
				if (err)
				{
					console.log("failed to getexperience" + err);
				} else 
				{
					if(rows.length >= 1)
					{
						company_name = rows[0].company_name;
						title = rows[0].title;
						location = rows[0].location;
						exp_start_date= rows[0].start_date;
						exp_end_date = rows[0].end_date;
						exp_description = rows[0].description;
						
					}
					else
					{
						 console.log("no valid experience for this user");
					}
				}
			});
			// get the guest profile education
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
						level = rows[0].level;
						univ_name = rows[0].univ_name;
						field = rows[0].field;
						grade = rows[0].grade;
						edu_start_date = rows[0].start_date;
						edu_end_date = rows[0].end_date;
						edu_description = rows[0].description;
						
					}
					else
					{
						console.log("no valid education details for this user");
					}
				}
				

						var query = dbConn.query(
												"select * from connections where (from_user_id = ? and to_user_id = ?) or (from_user_id = ? and to_user_id = ?) ",
												[ user_id, localSession.user_id, localSession.user_id,user_id ],
												function(err, rows) {

													process
															.nextTick(function() {
																mysql
																		.waitConnPool(null);
															});
													if (err) {
														console
																.log("failed to get education"
																		+ err);
													} else {
														
														if (rows.length >= 1) {
															connection_status = rows[0].connection_status;

														} else {
															var connection_status = undefined;
														}
													}

													req.session.guestprofile = [ {
														last_name : last_name,
														first_name : first_name,
														summary : summary,
														company_name : company_name,
														title : title,
														location : location,
														exp_start_date : exp_start_date,
														exp_end_date : exp_end_date,
														exp_description : exp_description,
														level : level,
														univ_name : univ_name,
														field : field,
														grade : grade,
														edu_start_date : edu_start_date,
														edu_end_date : edu_end_date,
														edu_description : edu_description,
														connection_status : connection_status
													} ];

													console
															.log(req.session.guestprofile);
													mysql.returnDBconn(dbConn);
													res
															.send({
																"guestProfile" : "Success"
															});
												});
				
			});
		}
	} else 
	{
		exce.customException('Please fill all the manidatory fields', res);
	}
};

exports.searchMember = function(req, res) {

	var text = req.param("enteredText");
	var data = 
	{
		connection_status : 0,
		flag_connection : 0
	};
	var msg_payload={"text": text,"member_message":"searchmember"};
	mq_client.make_request('member_queue',msg_payload, function(err,results){
			if(err){
					throw err;
				}
				else 
				{
					console.log("In RMQC: Got return call from RMQ for searchmember"+ JSON.stringify(results));	
					if(results.res.searchmember ==="Success"){
						
					req.session.searchResult = results.rows;
				    res.send({"SearchResult" : results.rows});
					}				
			}});
	// var dbConn = mysql.getDBConn();
	// if(dbConn === "empty")
	// {
		// mysql.waitConnPool({name:"searchMember", request: req, response: res});
	// } else 
	// {
		// var query = dbConn.query("select * FROM users  WHERE first_name like ? or last_name like ? or email_id like ? ",
					// [ "%" + text + "%", "%" + text + "%", "%" + text + "%" ],function(err, rows) {
						
			// process.nextTick(function(){
							// mysql.waitConnPool(null);
							// });
			// if (err) 
			// {
				// console.log(err);
				// exce.mySqlException(err, res);
				// // If no sql specific ecxeption then control comes to below statement.
				// exce.customException('Something went wrond. Please try again later',res);
			// } else 
			// {
				// req.session.searchResult = rows;
				// res.send({"SearchResult" : rows});
			// }
			// mysql.returnDBconn(dbConn);
		// });
	// }
};

exports.displayConnections = function(req, res) {

	var id = req.param("userid");

	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"displayConnections", request: req, response: res});
	} else 
	{
		var query = dbConn.query("select * FROM connections WHERE ( to_user_id  = ? or from_user_id = ?) and connection_status=?",
					[ id, id, 1 ],function(err, rows) {
						
			process.nextTick(function(){
							mysql.waitConnPool(null);
							});
			if (err) 
			{
				console.log(err);
				exce.mySqlException(err, res);
				// If no sql specific ecxeption then control comes to below statement.
				exce.customException('Something went wrond. Please try again later',res);
			} else 
			{
				res.send({"CoonectionsList" : rows});
			}
			mysql.returnDBconn(dbConn);
		});
	}
};

exports.dispalyInvitations = function(req, res) {

	var id = req.param("userid");
	var data = 
	{
		connection_status : 0,
		flag_connection : 0
	};
	var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"dispalyInvitations", request: req, response: res});
	} else 
	{
		var query = dbConn.query("select * FROM connections WHERE to_user_id  = ? and flag_connection=? and connection_status=?",
					[ id, 1, 0 ],function(err, rows) {
						
			process.nextTick(function(){
							mysql.waitConnPool(null);
							});
			if (err) 
			{
				console.log(err);
				exce.mySqlException(err, res);
				// If no sql specific ecxeption then control comes to below statement.
				exce.customException('Something went wrond. Please try again later',res);
			} else 
			{
				res.send({"CoonectionsList" : rows});
			}
			mysql.returnDBconn(dbConn);
		});
	}
};

/*exporting get functions to access in wait queue for connection pooilng*/
exports.insertExperience = insertExperience;
exports.insertEducation = insertEducation;