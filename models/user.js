
var mongoose = require('mongoose');

var userSchema =  mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  facebook: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema, 'Users');
