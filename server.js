var express = require("express");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());
var path = require("path");
app.use(express.static(__dirname + "./static"));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/first_mongoose_db');


var InformationSchema = new mongoose.Schema({
 name: String,
 data: String,
 gender: String,
 babies: Number
})
mongoose.model('Information', InformationSchema); // We are setting this Schema in our Models as 'User'
var Information = mongoose.model('Information'); // We are retrieving this Schema from our Models, named 'User'


app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render("index");
})
// Add User Request 
app.post('/main', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    var information = new Information({name: req.body.name, data:req.body.data, gender:req.body.gender, 
        babies:req.body.babies});
    information.save(function(err){
    	if (err) {
    		console.log('something went wrong');
    	}else{
    		console.log('successfully added a user!');
    		res.redirect('/main');
    	}

    
     })
});

app.get('/main', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Information.find({}, function(err, users) {
        if (err) {
            console.log("we did not get the user data");
        }else{
            
            res.render("main", {all_data:users});
            
        }
    
     });

    
});


// add the route to the index.js file
app.get('/info/:id', function (req, res){
    // first parameter is the query document.  Second parameter is the callback
    console.log(req.params.id);
    Information.findOne({_id: req.params.id}, function (err, users){
        // loads a view called 'user.ejs' and passes the user object to the view!
        if (err) {
            console.log("we did not get the one user data");
        }else{
        console.log(users);
        res.render("info", {user: users});
    }
    });
})


app.post('/edit/:id', function (req, res){
    // first parameter is the query document.  Second parameter is the callback
    console.log(req.params.id);
    Information.update({_id: req.params.id}, req.body, function (err){
        // loads a view called 'user.ejs' and passes the user object to the view!
        res.redirect('/main');
    
    });
})

app.get('/edit/:id', function(req, res) {
    Information.findOne({_id: req.params.id}, function(err, data){
           res.render('update',{mon_data:data});
    })
})

app.post('/destroy/:id', function (req, res){
    // first parameter is the query document.  Second parameter is the callback
    console.log(req.params.id);
    Information.remove({_id: req.params.id}, function (err,user){
        // loads a view called 'user.ejs' and passes the user object to the view!
       
        // console.log(users);
        res.redirect('/main');
    
    });
})




// The root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.listen(8000, function() {
    console.log("listening on port 8000");
})