
/*
 * GET users listing.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

exports.list = function(req, res){
  res.send("respond with a resource");
};


function connect()
{
	var connection = mysql.createConnection({
		host     : 'test.cgcitoidtcqx.us-east-1.rds.amazonaws.com',
		user     : 'root',
		password : 'password',
		port: '3306',
		database: 'test'
	});

	connection.connect();

	return connection;
}

exports.createUser = function createUser(firstName,lastName,email,password,logintime)
{
	var query = "INSERT INTO users VALUES('" + firstName + "','" +lastName + "','" + email + "','" + password + "','" + logintime + "')";
	console.log("query running is " + query);
	connect().query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
};

exports.pay = function pay(fullname,address,city,location,zip,country,phno,cardno,cvc)
{
	var query = "INSERT INTO payment VALUES('" + fullname + "','" +address + "','" +city + "','" + location + "','" + zip + "','" + country + "','" + phno + "','" + cardno + "','" + cvc + "')";
	console.log("query running is " + query);
	connect().query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
};

exports.shipdetails = function createUser(firstName,lastName,email,password,logintime)
{
	var query = "SELECT * from payment " ;
	console.log("query running is " + query);
	connect().query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
};

function validateUser(callback,email,password)
{
	var query = "SELECT * from users where email='" + email +  "'AND password='" + password + "'";
	connect().query(query,function(err,rows,fields){
		if (err) {
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
}

exports.index = function(req, res){
	res.redirect('/store');

	console.log('Redirected to Store index page');
	};

exports.store = function(req, res){
	res.render('index');
	console.log('Rendered index page');
	};

exports.products = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('products',{"userlist":docs,username:req.session.username});
		});
};

exports.tv = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('tv1');
	collection.find({},{},function(e,docs){
		res.render('tv1',{"userlist":docs,username:req.session.username});
		});
};

exports.ip = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('ip');
	collection.find({},{},function(e,docs){
		res.render('ip',{"userlist":docs,username:req.session.username});
		});
};


exports.testtv =  function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		console.log(req.session.username);
		res.render('test',{"userlist":docs,username:req.session.username});
		});
};


exports.ph = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('ph');
	collection.find({},{},function(e,docs){
		console.log(req.session.username);
		res.render('ph1',{"userlist":docs,username:req.session.username});
		});  
};



exports.np = function(req,res){
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('np');
	collection.find({},{},function(e,docs){
		console.log(req.session.username);
		res.render('np',{"userlist":docs,username:req.session.username});
		});
};

exports.rdisplay = function(req,res){
	var iddata = req.params.id;
	var db = req.db;
	console.log("my db name is " + db);
	var collection = db.get('np');
	collection.find({Item1:iddata},function(err,docs){
		console.log(req.session.username);
	res.render('idr',{"userlist":docs,username:req.session.username});
	// res.write(req.params.id);
	});
	};
	
	exports.idisplay = function(req,res){
		var iddata = req.params.id;
		var db = req.db;
		console.log("my db name is " + db);
		var collection = db.get('ip');
		collection.find({Item1:iddata},function(err,docs){
			console.log(req.session.username);
		res.render('idr',{"userlist":docs,username:req.session.username});
		// res.write(req.params.id);
		});
		};

		exports.pdisplay = function(req,res){
			var iddata = req.params.id;
			var db = req.db;
			console.log("my db name is " + db);
			var collection = db.get('ph');
			collection.find({Item1:iddata},function(err,docs){
				console.log(req.session.username);
			res.render('idr',{"userlist":docs,username:req.session.username});
			// res.write(req.params.id);
			});
			};
	
			exports.tdisplay = function(req,res){
				var iddata = req.params.id;
				var db = req.db;
				console.log("my db name is " + db);
				var collection = db.get('tv1');
				collection.find({Item1:iddata},function(err,docs){
					console.log(req.session.username);
				res.render('idr',{"userlist":docs,username:req.session.username});
				// res.write(req.params.id);
				});
				};
				
				exports.addtocart = function(req,res){
					var data = req.params.id;
					var temp=req.params.id1;
					var Quantity=req.params.id2;
					var db = req.db;
					console.log("my item name is " + data);
					console.log("i reached to cart");
					var collection = db.get('addtocart');
					collection.update({Item1:req.params.id.toString(),"user" : req.session.username},{ $inc: { "quantity" : 1 },
					     $setOnInsert: {"user" : req.session.username}},
					{upsert: true}
					,function(err,docs){});
                     backURL=req.header('Referer') || '/';

					res.redirect(backURL);
					};
					
					
					
					exports.removefromcart = function(req,res){
						var data = req.params.id;
						var temp=req.params.id1;
						var Quantity=req.params.id2;
						var db = req.db;
						console.log("my item name is " + data);
						console.log("i reached to cart");
						var collection = db.get('addtocart');
						collection.remove({Item1:req.params.id.toString()}
						,function(err,docs){});
	                     backURL=req.header('Referer') || '/';

						res.redirect(backURL);
						};
					
					
					exports.cartdisplay = function(req,res){
						var iddata = req.params.id;
						var db = req.db;
						console.log("my db name is " + db);
						var collection = db.get('addtocart');
						collection.find({'user':req.session.username},function(err,docs){
							console.log(req.session.username);
						res.render('addtocart',{"userlist":docs,username:req.session.username});
						// res.write(req.params.id);
						});
						};	
					
						exports.checkout = function(req,res){
							var data = req.params.id;
							var temp=req.params.id1;
							var Quantity=req.params.id2;
							var db = req.db;
							console.log("my item name is " + data);
							console.log("i reached to cart");
							var collection = db.get('addtocart');
							collection.find({"user" : req.session.username}
							,function(err,docs){res.render('payment',{username:req.session.username});
							});
							};

							
							exports.adminpost = function(req, res){
								res.render('admin');

								console.log('Redirected to Store Admin page');
								};
					
								exports.addproduct = function(req,res){
									var data = req.params.id;
									//var e = document.getElementById("add");
									//var strUser = e.options[e.selectedIndex].value;
									var temp=req.params.id1;
									var Quantity=req.params.id2;
									var db = req.db;
									console.log("my item name is " + req.body.selectpicker);
									console.log("i reached to cart");
									var collection = db.get('strUser');
									collection.insert({}
									,function(err,docs){});
		
									};
					
						
					
    
exports.validateUser=validateUser;	
//exports.addtocart=addtocart;


