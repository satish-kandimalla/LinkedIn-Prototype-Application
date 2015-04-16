/**
 * Module dependencies.
 */

var express = require('express'), 
routes = require('./routes'),
user = require('./routes/user'),
home = require('./routes/home'),
http = require('http'), 
path = require('path');

var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: '12345', cookie: { maxAge: 600000 }}));

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/home', home.home);
app.get('/addConnections', home.addConnections);
app.get('/displayProfile', home.displayProfile);

app.post('/getProfile', user.getProfile);

app.post('/signup', user.insertUser);
app.post('/signout', user.signout);
app.post('/signin', user.validateUser);

app.post('/insertSummary', user.insertSummary);
app.post('/experience', user.insertExperience);
app.post('/updateexperience', user.updateExperience);
app.post('/education', user.insertEducation);
app.post('/updateeducation', user.updateEducation);
app.post('/updateskills', user.updateSkills);

app.post('/sendinvitation', user.sendinvitation);
app.post('/acceptinvitation', user.acceptinvitation);
app.post('/rejectinvitation', user.rejectinvitation);
app.post('/removeconnection', user.removeconnection);
app.post('/Connections', user.displayConnections);
app.post('/Invitations', user.dispalyInvitations);

app.post('/search', user.searchMember);
app.get('/searchResults', home.searchResults);

var connPool = require('./routes/connections');
// initializing the pool size to 100 connections.
connPool.initializeConnPool(100);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});