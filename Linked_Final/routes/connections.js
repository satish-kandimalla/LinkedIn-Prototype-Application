var mysql = require('mysql');
var queue = require('queue');
var conPool = require('./enableConnectionPooling');
var user = require('./user');

var connPool = new queue();
var waitQueue = new queue();

function dbConnect()
{
	var dbCon = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database: 'test'
	});
	dbCon.connect();
	return dbCon;
}

function addConnection(dbCon)
{
	if(connPool !== null)
	{
		connPool.push(dbCon);
	}
}

function getConnection()
{
	if(connPool.length >= 1)
	{
		var dbConn = connPool.pop();
		return dbConn;
	}
}

function initializeConnPool(poolSize)
{
	if(connPool !== null)
	{
		connPool.start();
		for(var cnt = 0; cnt < poolSize; cnt++)
		{
			addConnection(dbConnect());
		}
	}
	if(waitQueue !== null)
	{
		waitQueue.start();
	}
}


function getPoolSize()
{
	if(connPool !== null)
	{
		return connPool.length;
	}
}

function waitConnPool(userRequest)
{
	// if connection pooling is not enabled return.
	if(conPool.isConnPool === false)
	{
		return;
	}
	if(connPool !== null){
		if(connPool.length <= 0){
			//add user request to wait queue here
			if(userRequest !== null)
			{
				waitQueue.push(userRequest);
			}
		}
		else{
			//process request from wait queue here
			if(waitQueue.length <= 0)
			{
				return;
			}
			waitQueue.reverse();
			var userReq = waitQueue.pop();
			waitQueue.reverse();
			console.log("got user request " + userReq.name);
			
			switch(userReq.name){
				case "insertUser":
					user.insertUser(userReq.request, userReq.response);
					break;
				case "validateUser":
					user.validateUser(userReq.request, userReq.response);
					break;
				case "dispalyInvitations":
					user.dispalyInvitations(userReq.request, userReq.response);
					break;
				case "displayConnections":
					user.displayConnections(userReq.request, userReq.response);
					break;
				case "searchMember":
					user.searchMember(userReq.request, userReq.response);
					break;
				case "updateEducation":
					user.updateEducation(userReq.request, userReq.response);
					break;
				case "insertEducation":
					user.insertEducation(userReq.request, userReq.response);
					break;
				case "updateExperience":
					user.updateExperience(userReq.request, userReq.response);
					break;
				case "insertExperience":
					user.insertExperience(userReq.request, userReq.response);
					break;
				case "insertSummary":
					user.insertSummary(userReq.request, userReq.response);
					break;
				case "sendinvitation":
					user.sendinvitation(userReq.request, userReq.response);
					break;
				case "acceptinvitation":
					user.acceptinvitation(userReq.request, userReq.response);
					break;
				case "rejectinvitation":
					user.rejectinvitation(userReq.request, userReq.response);
					break;
				case "removeconnection":
					user.removeconnection(userReq.request, userReq.response);
					break;
				case "getProfile":
					user.getProfile(userReq.request, userReq.response);
					break;
				case "getSummary":
					user.getSummary();
					break;
				case "getExperience":
					user.getExperience();
					break;
				case "getEducation":
					user.getEducation();
					break;
			}
		}
	}
}

function terminateConnPool()
{
	if(connPool !== null)
	{
		connPool.stop();
	}
	if(waitQueue !== null)
	{
		waitQueue.stop();
	}
}

/*DB helper functions*/
/*
 * This function return a database connection.
 * either a fresh connection if connection is 
 * not enabled or existing connection from
 * the pool.
 * it checks if the connection pooling is
 * enabled or not using the "isConnPool" variable
 * 
 * */
function getDBConn()
{
	var dbConn;
	if(conPool.isConnPool === true)
	{
		if(getPoolSize() <= 0)
		{
			dbConn = "empty";
		}
		else{
			dbConn = getConnection();
		}
	}
	else
	{
		dbConn = dbConnect();
	}
    return dbConn;
}


function returnDBconn(dbConn)
{
	console.log(conPool.isConnPool);
	if(conPool.isConnPool === true)
	{
		console.log("returning connection");
		addConnection(dbConn);
	}
	else
	{
		dbConn.end();
	}
}


exports.initializeConnPool = initializeConnPool;
exports.getDBConn = getDBConn;
exports.returnDBconn = returnDBconn;
exports.waitConnPool = waitConnPool;