var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users'])
var ObjectId = mongojs.ObjectId;

var app = express();

// var logger = function(req, res, next) {
//     console.log('Logging...');
//     next();
// }

// app.use(logger);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

app.get('/', function(req, res){
    db.users.find(function (err, docs) {
        console.log(docs);
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    })
});

app.post('/users/add', [
    check('first_name', 'First Name is Required').isLength({ min:1 }),
    check('last_name', 'Last Name is Required').isLength({ min:1 }),
    check('email', 'Email is Required').isLength({ min:1 })
],
 function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            console.log(error.msg);
        });
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors
        });
    } else {
        var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
        }

        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
});

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, function(){
    console.log('Server Started on Port 3000...')
});
