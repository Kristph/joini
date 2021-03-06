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

//mongoose.connect('mongodb://localhost:7070/joini',options);
mongoose.connect('mongodb://juser:juser@159.203.179.167/joini',options);



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
