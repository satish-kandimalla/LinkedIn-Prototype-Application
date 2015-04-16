var HashMap = require('hashmap').HashMap;
var map = new HashMap();

function addSessionToMap(user_id, session_data)
{
	if(map !== null)
	{
		console.log("user_id in sessions " + user_id);
		map.set(user_id, session_data);
	}
}

function getSessionFromMap(user_id)
{
	if(map !== null)
	{
		map.get(user_id);
	}
}

function removeSessionFromMap(user_id)
{
	if(map !== null)
	{
		map.remove(user_id);
	}
}

exports.addSessionToMap = addSessionToMap;
exports.getSessionFromMap = getSessionFromMap;
exports.removeSessionFromMap = removeSessionFromMap;