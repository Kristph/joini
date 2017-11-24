var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/joini');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
