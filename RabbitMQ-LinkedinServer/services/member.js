var express = require('express');
var mysql = require('./mysql');
var exce = require('./customExceptions');
var localSession={} ;

function handle_request(msg, callback){

	var res = {};
	var text = msg.text;
	console.log("In RMQS member Q handle request:"+ msg.member_message);
	if(msg.member_message==="searchmember")
	{
		console.log("In RMQS Member Q:Inside searchMember function");
			var dbConn = mysql.getDBConn();
	if(dbConn === "empty")
	{
		mysql.waitConnPool({name:"searchMember", request: req, response: res});
	} else 
	{
		var query = dbConn.query("select * FROM users  WHERE first_name like ? or last_name like ? or email_id like ? ",
					[ "%" + text + "%", "%" + text + "%", "%" + text + "%" ],function(err, rows) {
						
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
				// req.session.searchResult = rows;
				// res.send({"SearchResult" : rows});
				res.searchmember = "Success";
			
						var ret = { "res":res, "rows":rows};
						
						console.log("Sending call back");
						console.log(ret);
						callback(null, ret);
			}
			mysql.returnDBconn(dbConn);
		});
	}
	}
	else if(msg.member_message==="sendinvitation")
	{
		console.log("In RMQS:In handle request SendInvitation:"+ msg);
		var toEmailID=msg.toEmailID;
		var fromId = msg.fromId;
		
		var dbConn = mysql.getDBConn();
		if(dbConn === "empty")
		{
			mysql.waitConnPool({name:"sendinvitation", request: req, response: res});
		} else 
		{
			checkConnection(dbConn, 'send', msg, res, callback);
			process.nextTick(function(){
				mysql.waitConnPool(null);
				});
		}
	}
	else
	{
		res.code = "401";
		res.value = "Failed Search";
		callback(null, res);
	}
}

//*************************************************************************

function checkInvitations(dbConn, user_id, req, res, callback)
{
	var query = dbConn.query("select * from connections where to_user_id = ?", [ user_id ], function(err, rows) {
		if (err) 
		{
			console.log("failed to get invitations" + err);
			process.nextTick(function(){mysql.waitConnPool(null);});
			//res.send({"login":"Success"}); "Commented by Me"
//			mysql.returnDBconn(dbConn);
		} else 
		{
			if(rows.length >= 1)
			{
				for(var i = 0; i<rows.length;i++)
				{
					if(rows[i].connection_status === 0)
					{
						localSession.invitations = rows[0];
					}
				}
				if(localSession.invitations === undefined ||
						localSession.invitations === null ||
						localSession.invitations === "")
				{
					console.log("no invitations to accept");
					process.nextTick(function(){mysql.waitConnPool(null);});
					//res.send({"login":"Success"});  "Commented by me"
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
								localSession.invite_first_name = rows[0].first_name;
								localSession.invite_last_name = rows[0].last_name;
							}
						}
						process.nextTick(function(){mysql.waitConnPool(null);});
						//res.send({"login":"Success"}); "Commented by me"
						mysql.returnDBconn(dbConn);
					});
				}
			}
			else
			{
				localSession.invitations = [ { idConnection: 0,
										       to_user_id: 0,
										       from_user_id: 0,
										       connection_status: 0} ];
				localSession.invite_first_name = "";
				localSession.invite_last_name = "";
				process.nextTick(function(){mysql.waitConnPool(null);});
				res.send({"login":"Success"});
				mysql.returnDBconn(dbConn);
			}
			res.sendinvitation = "Success";
			
			var ret = {"res":res};
			ret.session = localSession;
			console.log("Sending call back");
			console.log(ret);
			callback(null, ret);
		}
	});
}
exports.handle_request=handle_request;                    
