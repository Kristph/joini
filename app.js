'use strict';
const Hapi = require('hapi');

var Boom    = require('boom');                                  // HTTP Errors
var Joi = require('joi');
var mongoose = require('mongoose');

//const Hapiauthcookie = require('hapi-auth-cookie');

const Path = require('path');

const Vision = require('vision');
const internals = {};
const Inert = require('inert');

const Bcrypt = require('bcrypt');
const Hapiauthcookie = require('hapi-auth-cookie');
const Bell = require('bell');


//var routes = require('./routes');
var routes = require('./routes');

require('./bd');



var Mouser = require('./models/user');

var nModel = new Mouser(); 
//console.log(Mouser);


const server = new Hapi.Server();
//server.connection({ port: 8080, host: '192.168.1.62' });

server.connection({ port: 7070, routes: { cors: true } });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply) {
        Mouser.find(function(err, data) {
          if (err)
            console.log(err);
          reply(data);
        });
    }
});

server.route({
    method: 'POST',
    path: '/user',
    handler: function (req, rep) {
        //console.log(req.payload);
        for(var index in req.payload) { 
            eval("nModel."+index+" = req.payload."+index+";");
        }
        nModel.save(function(err) {
          if (err)
            rep(err);
          rep({ message: ' ok' });
        });
    }
});


server.route({
    method: 'GET',
    path: '/user/{item_id}',
    handler: function (req, rep) {
        //reply('ok');
        Mouser.findById(req.params.item_id, function(err, data) {
            console.log(data);
          if (err)
            rep(err);
          rep(data);
        });
    }
});

server.route({
    method: 'PUT',
    path: '/user/{item_id}',
    handler: function (req, rep) {
        Mouser.findById(req.params.item_id, function(err, item) {
          if (err)
            rep(err);
          for(var index in req.payload) { 
            eval("item."+index+" = req.payload."+index+";");
          }
          item.save(function(err) {
            if (err)
              rep(err);
            rep({ message: 'item updated!' });
          });
        });
    }
});

server.route({
    method: 'DELETE',
    path: '/user/{item_id}',
    handler: function(req, rep){
        Mouser.remove({
        _id: req.params.item_id
        }, function(err, data) {
          if (err)
            rep(err);
          rep({ message: 'Successfully deleted' });
        });     
    }
});



server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});