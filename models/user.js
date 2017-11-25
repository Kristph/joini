
var mongoose = require('mongoose');

var userSchema =  mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  name: {
    type: String,
    require: false
  },
  lastname: {
    type: String,
    require: false
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  creationDate: {
    type: Date,
    required: false,
    default: Date.now
  },
  facebook: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema, 'Users');
