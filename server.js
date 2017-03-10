/**
 * Created by lykovartem on 2/27/2017.
 */

// set up ========================
let express = require('express');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let app = express();
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let morgan = require('morgan');                     // log requests to the console (express4)
let bodyParser = require('body-parser');            // pull information from HTML POST (express4)
let methodOverride = require('method-override');    // simulate DELETE and PUT (express4)
let connect = require('connect');
let MongoStore = require('connect-mongo')(session);

let bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// configuration =================
const PORT = 8080;

mongoose.connect('mongodb://admin:admin@ds163699.mlab.com:63699/wunderlist');     // connect to mongoDB

app.use(express.static(__dirname + '/'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {
        httpOnly: false
    }
}));

app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(methodOverride());

// define model ==================

let TaskSchema = new Schema({
    name: String,
    description: String,
    hours: Number,
    taskState: String,
    id: Number,
    createTime: Date,
});

let TaskModel = mongoose.model('TaskModel', TaskSchema);

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    tasks: [TaskSchema]
});

UserSchema.pre('save', function (next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

let UserModel = mongoose.model('UserModel', UserSchema);

// routes ========================
app.post('/api/log-in', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let cookie = req.cookies;

    UserModel.findOne({username}, function (err, user) {
        if (err) throw err;
        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    req.session.currentUser = user._id;
                    console.log(req.session.cookie);
                    if (!res.cookie['logintoken']) {
                        res.cookie('logintoken', user._id, {maxAge: 900000, httpOnly: false});
                    }
                    else {
                        console.log(res.cookie['logintoken']);
                    }
                    res.send(user.username);
                }
                else res.sendStatus(404);
            })
        }
        else res.sendStatus(404);
    });
});

app.get('/api/log-out', function (req, res) {
    req.session.destroy(function (err) {
        if (err) throw err;
    });
    res.end();
});

app.post('/api/register', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let newUser;

    if (username && password) {
        UserModel.findOne({username: username}, function (err, user) {
            if (err) throw err;
            if (user) {
                res.sendStatus(409);
            }
            else {
                newUser = new UserModel({username, password});
                newUser.save(function (err) {
                    if (err) throw err;
                    res.sendStatus(200);
                });
            }
        });
    }
    else res.sendStatus(404);


});

app.get('/api/all-tasks', function (req, res) {
    console.log(req.session.currentUser);
    UserModel.findOne({_id: req.session.currentUser}, function (err, user) {
        if (err) throw err;
        res.json(user.tasks);
    });
});

app.post('/api/create-task', function (req, res) {
    let data = req.body;
    UserModel.update({_id: req.session.currentUser}, {
        $push: {'tasks': data}
    }, function (err) {
        if (err) throw err;
    })
});

app.put('/api/update-task/:_id', function (req, res) {
    let data = req.body;
    let _id = req.params._id;
    UserModel.update({_id: req.session.currentUser, 'tasks._id': _id}, {
        $set: {
            'tasks.$.name': data.name,
            'tasks.$.description': data.description,
            'tasks.$.hours': data.hours,
            'tasks.$.taskState': data.taskState,
        },
    }, function (err) {
        if (err) throw err;
    })
});

app.delete('/api/delete-task/:_id', function (req, res) {
    let _id = req.params._id;
    /*    TaskModel.remove({_id: req.params._id},
     function (err) {
     if (err) throw err;
     });*/
    UserModel.update({_id: req.session.currentUser}, {
        $pull: {'tasks': {_id}},
    }, function (err) {
        if (err) throw err;
    })
});

app.listen(PORT);
console.log(`App listening on port ${PORT}`);
