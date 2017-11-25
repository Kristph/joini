var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

//mongoose.connect('mongodb://localhost/joini',options);
mongoose.connect('mongodb://juser:juser@localhost/joini',options);
//mongoose.connect('mongodb://admin:admin@159.203.179.167/joini', { useMongoClient: true });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
