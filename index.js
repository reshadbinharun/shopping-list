const path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000);

//setting up mongo
const mongo = require('mongodb').MongoClient,
url = 'mongodb://reshadbinharun:login-112400@ds123259.mlab.com:23259/groceries';
// mongo.connect(url, function (err, db){
//  	if (err){
//  		console.log("unable to connect");
//  	}else {
//  		console.log("connected");
//  	}
// });

app.use(express.static('public')); //added to try to enable js use; this allows client.js to run!

//var db = mongo.connect(url);
//setting actual collection in use:

//var DB = db.db('groceries').collection('groceries');
var db; //setting var with global scope
mongo.connect(url, (err, database) => {
  // ... start the server
  if (err) console.log("Could not start db");
  else {
  	console.log("DB connection opened");
  	db = database.db('groceries'); //settign db to groceries
  }
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


//post route
app.post('/addFood', function(req, res){
	console.log('addFood route hit');
	console.log(req.body);
	//mongo methods to overwrite data
	var item = req.body.item; //get name of item
	var quantity = Number(req.body.quantity); //positive if + button hit, but -ve if - button hit
	var perish = req.body.perish;
	var per_bool = perish === 'perishable'?1:0;
	// db.collection('groceries').insert({item: item, quantity: quantity, perishable : per_bool});
	// res.send(db.collection('groceries').find().toArray());//update operations have to be atomic
	/*
	ATTEMPTED TO make 2 mongo requests by chaining via promises
	new Promise(function(resolve, reject) {
	  setTimeout(() => resolve(1), 1000); // (*)
	  db.collection('groceries').insert({item: item, quantity: quantity, perishable : per_bool});
	}).then(setTimeout(function() { // (**)
	  res.send(db.collection('groceries').find().toArray());//update operations have to be atomic
	}, 1000))
	*/
	db.collection('groceries').insert({item: item, quantity: quantity, perishable : per_bool});
	res.send("food added, time to update display");
})


//post route
app.post('/needFood', function(req, res){
	console.log('needFood route hit');
	console.log(req.body);
	//mongo methods to overwrite data
	var item = req.body.item; //get name of item
	var quantity = Number(req.body.quantity); //positive if + button hit, but -ve if - button hit
	//db.collection('groceries').update({item: item}, {$inc : {quantity: quantity}}); //find item and updates quantity by 1 or -1
	db.collection('groceries').updateMany({item: item, perishable: true}, {$inc : {quantity: quantity}}); //db.collection.update({update filter}, {update values})
	res.send("updated groceries");
	//db.users.update ({_id: '123'}, { '$set': {"friends.0.emails.1.email" : '2222'} })
})

//testing mongo connection
app.get('/testDB', function (req, res){
	console.log("testDB route hit");
	var cursor = db.collection('groceries').find(); //this is a mongo object and cannot be returned
	var db_data = cursor.toArray(function(err,dat){
		console.log("getting data");
		console.log(dat);
		res.send(dat);
	});
	//console.log(cursor);
})