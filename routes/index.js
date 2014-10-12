var express = require('express');
var Firebase = require("firebase");

var router = express.Router();


// Reading html file


/* GET home page. */
router.get('/', function(req, res) {
  res.render('presentation', { title: 'Express' });
});


router.get('/teste',function(req, res){
  res.render('testePost', { title: 'Token' })
});

// GET presentation 
router.get('/presentation/:presentationId', function(req, res){

  var presentationId = req.params.presentationId;
  var db = req.db;
  
  var collection = db.get('presentations');
  
  collection.findOne({_id: presentationId}, function(err, presentation) 
    {
	  if( err || !presentation) console.log("No presentation found !");
	  else {
		  
		 res.render('presentation', { presentation: presentation.content });
	  };
	});

});


/* POST user token and presentation content. */
router.post('/user', function(req, res){
	var token = req.body.token;
	var content = req.body.content;
	var title = req.body.title;
	var ref = new Firebase("https://dazzling-fire-6309.firebaseio.com/");
	console.log(ref);
	ref.authWithCustomToken(token, function(err, authData) {
	if(err)
	{ 
	  res.status(500).end();
	}
	else
	{
		console.log("Connection with success!");
		
		var db = req.db;

		// Get our form values. These rely on the "name" attributes
		var userId = authData.uid;

		var collection = db.get('presentations'); //??

		// Submit to the DB
		collection.insert({
			"owner" : userId,
			"content" : content 
		}, function (err, doc) {
			if (err) {
				// erreur
				res.send("There was a problem adding the information to the database.");
			}
			else {
				console.log("Presentation added in mongoDB");
				var presentationId = doc._id;
	            var userPresentations = new Firebase("https://dazzling-fire-6309.firebaseio.com/user/"+userId+"/presentations/"+presentationId);
				
				 userPresentations.set({
					title : title
				  });
				
				 var presentation  = new Firebase("https://dazzling-fire-6309.firebaseio.com/presentation/"+presentationId);
				 presentation.set({
				    slideNum : 1,
					owner : userId
				 });
				 
				console.log("Presentation added in Firebase !");				
			}
		});
	}
	});
});



module.exports = router;
