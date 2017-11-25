
var mongoose = require('mongoose');

var eventSchema =  mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    require: true
  },
  hashtag: {
    type: String,
    required: true
  },
  posicion: {
    type: String,
    required: true
  },
  inicio: {
    type: String,
    required: true
  },
  fin: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  tipo: {
    type: String,
    required: true
  },
  posicion: {
    type: String,
    required: true
  },
  invitados: {
    type: Array,
    required: true
  }

});

module.exports = mongoose.model('Event', eventSchema, 'Events');
