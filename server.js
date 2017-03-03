/**
 * Created by lykovartem on 2/27/2017.
 */

// set up ========================
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');                     // log requests to the console (express4)
let bodyParser = require('body-parser');            // pull information from HTML POST (express4)
let methodOverride = require('method-override');    // simulate DELETE and PUT (express4)

// configuration =================
const PORT = 8080;

mongoose.connect('mongodb://admin:admin@ds163699.mlab.com:63699/wunderlist');     // connect to mongoDB database

app.use(express.static(__dirname + '/'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(methodOverride());

// define model ==================
let TaskModel = mongoose.model('TaskModel', {
    name: String,
    description: String,
    hours: Number,
    taskState: String,
    id: Number,
    createTime: Date,
});

// routes ========================
app.get('/api/all-tasks', function (req, res) {
    TaskModel.find(function (err, tasks) {
        if (err) return handleError(err);
        res.json(tasks);
    });
});

app.post('/api/create-task', function (req, res) {
    let data = req.body;
    let newTask = new TaskModel(data);
    newTask.save(function (err) {
        if (err) return handleError(err);
    });
});

app.put('/api/update-task/:_id', function (req, res) {
    let data = req.body;
    TaskModel.update({_id: req.params._id}, {
        name: data.name,
        description: data.description,
        hours: data.hours,
        taskState: data.taskState
    }, function (err) {
        if (err) return handleError(err);
    })
});

app.delete('/api/delete-task/:_id', function (req, res) {
    TaskModel.remove({_id: req.params._id},
        function (err) {
            if (err) return handleError(err);
        });
});

app.listen(PORT);
console.log(`App listening on port ${PORT}`);
