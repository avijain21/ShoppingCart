
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

aws.config.update({accessKeyId: 'AKIAJ4MURIQ4SDWZ2BDQ', secretAccessKey: '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'});
var mysql = require('mysql');
var ejs = require('ejs');
var moment = require('moment');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('54.172.79.196:27017/test');
var bodyParser = require('body-parser');
var app = express();
var cookieParser = require('cookie-parser');

var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'catand dog',
    store: new MongoStore({
     url:'mongodb://54.172.79.196:27017/test'
    })
  }));//var connect=require('connect');

module.exports = db;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());




app.use(function(req, res, next){
	req.db = db;
	next();

});

app.set('port', process.env.PORT || 3000);
app.set('port', 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', user.index);
app.get('/store', user.store);
app.get('/users', user.list);
app.get('/signup', function(req, res){
	res.render('signup', { title: 'SignUp' });
});

app.get('/store/test',user.testtv);
app.get('/store/addtocart',user.cartdisplay);
app.get('/store/ph1', user.ph);
app.get('/store/tv', user.tv);
app.get('/store/ph', user.ph);
app.get('/store/tv1', user.tv);
app.get('/store/ip', user.ip);
app.get('/store/np', user.np);	
app.post('/store/addtocart/:id', user.addtocart);
app.post('/store/removefromcart/:id', user.removefromcart);
app.get('/store/payment', user.checkout);
app.post('/store/payment', user.pay);
//app.get('/store/addtocart',user.cartdisplay);
app.get('/store/np/:id',user.rdisplay);
app.get('/store/tv1/:id',user.tdisplay);
app.get('/store/ip/:id',user.idisplay);
app.get('/store/ph1/:id',user.pdisplay);
app.get('/store/ship',user.shipdetails);
//app.get('/store/adminpage',user.admin);
app.post('/store/adminpage',user.adminpost);
app.post('/store/admin',user.addproduct);



app.post('/register', function (req, res) {
	if(!('firstname'))
	{
		res.statusCode = 400;
		return res.send('Error 400: FirstName cannot be empty');
	}
	else if(!('lastname'))
	{
		res.statusCode = 400;
		return res.send('Error 400: LastName cannot be empty');
	}

	else
	{
		var now = moment(new Date());
		user.createUser(req.param('firstname'),req.param('lastname'),req.param('email'),req.param('password'),now.format("D MMM YYYY") + ' ' + now.format("HH:mm"));
		 res.render('index', { title: 'Home' ,message: 'SignUp Successful.Please Login to Continue'});
	}
});	

app.post('/store/payment', function (req, res) {
	if(!('fullname'))
	{
		res.statusCode = 400;
		return res.send('Error 400: FirstName cannot be empty');
	}
	else if(!('cardno'))
	{
		res.statusCode = 400;
		return res.send('Error 400: LastName cannot be empty');
	}

	else
	{
		user.pay(req.param('fullname'),req.param('address'),req.param('city'),req.param('location'),req.param('zip'),req.param('country'),req.param('phno'),req.param('cardno'),req.param('cvc'));
		 res.render('ship', { title: 'Home' ,message: 'Payment Successful'});
	}
});

app.post('/validate', function(req, res){
	if(!req.param('email') ||!req.param('password'))
	{
		res.statusCode = 400;
		console.log('UserName/Password Missing');
		return res.render('index',{
			errormsg:'Error 400: UserName/Password field Missing'});
	}
	else
	{
		user.validateUser(function(err,results){
			if(err)
			{
				ejs.renderFile('./views/index.ejs',{message :"Authentication Failed .Invalid UserName/Password"},	function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					else {
						console.log(err);
					}
				});
			}
			else
			{
				console.log("from app.js" + req.body.email);
				req.session.username=req.body.email;
				//console.log(req.session.username);
				res.redirect('/store/test');
				
			}
		},req.param('email'),req.param('password'));
	}
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


  
  

