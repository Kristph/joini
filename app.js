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
//var nModel = new Mouser(); 
//console.log(Mouser);


const server = new Hapi.Server();

    server.connection({ port: 80, routes: { cors: true } });
 	
 
    server.register([Hapiauthcookie,Vision,Inert,Bell],  (err) => {
   	 if (err) {
        	throw err;
    		}
	});

    //server.connection({ port: 8080, host: '192.168.1.62' });
    
    server.views({
        engines: { ejs: require('ejs') },
        relativeTo: __dirname,
        path: 'templates/'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            return reply.view('indext', {
		title: 'Joini | Home',
		message:'ok'
		});
            //reply('Hello, world!');
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
            var nModel = new Mouser(); 
            //console.log(req.payload);
            //reply('hi');
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
        method: 'POST',
        path: '/login',
        handler: function (request, reply) {
            if (request.auth.isAuthenticated) {
                //return reply.redirect('/');
                reply('ok');
            }

            let message = '';
            let account = null;

            if (request.method === 'post') {

                if (!request.payload.email ||
                    !request.payload.password) {

                    message = 'Missing email or password';
                }
                else {
                    //console.log('email: '+request.payload.email)
                    var usr;
                    Mouser.findOne({ email: request.payload.email }, function (err, user) {
                        if (err) {
                            console.log(err)
                        }
                        usr = user
                        //console.log(user);
                        if(user!=null && user.email != null){

                            if(user || user.email==request.payload.email){
                                console.log('ok email ok'+user.email+'-'+user.email);
                            }else{
                                message = 'Invalid email ';
                                return reply('<html><head><title>Login page</title></head><body>' +
                                (message ? '<h3>' + message + '</h3><br/>' : '') +
                                '<form method="post" action="/login">' +
                                'email: <input type="text" name="email"><br>' +
                                'Password: <input type="password" name="password"><br/>' +
                                '<input type="submit" value="Login"></form></body></html>');
                            }
                            if(user){
                                if(user.password==request.payload.password){
                                    //console.log('ok pass ok'+user.password+'-'+request.payload.password);
                                    const sid = String(++uuid);
                                    request.server.app.cache.set(sid, { account: user }, 0, (err) => {

                                        if (err) {
                                            reply(err);
                                        }

                                        request.cookieAuth.set({ sid: sid });
                                        return reply.redirect('/');
                                    });
                                }else{
                                    message = 'Invalid pass ';
                                    return reply('<html><head><title>Login page</title></head><body>' +
                                    (message ? '<h3>' + message + '</h3><br/>' : '') +
                                    '<form method="post" action="/login">' +
                                    'email: <input type="text" name="email"><br>' +
                                    'Password: <input type="password" name="password"><br/>' +
                                    '<input type="submit" value="Login"></form></body></html>');            
                                }
                            }else{
                                        
                            }

                        }else{
                            message = 'Invalid email ';
                            return reply('<html><head><title>Login page</title></head><body>' +
                                (message ? '<h3>' + message + '</h3><br/>' : '') +
                                '<form method="post" action="/login">' +
                                'email: <input type="text" name="email"><br>' +
                                'Password: <input type="password" name="password"><br/>' +
                                '<input type="submit" value="Login"></form></body></html>');
                        }

                    });
                }
            }//post
            if (request.method === 'get' || message) {
                //return reply.view('login', {message:message});
                reply(message);
            }

        }
    });
    server.route({
        method: 'POST',
        path: '/registro',
        handler: function (request, reply) {
            var nModel = new Mouser(); 
            var usr;
            Mouser.findOne({ email: request.payload.email }, function (err, user) {
                if (err) {
                    console.log(err)
                }
                if(user!=null && user.email != null){
                    if(user || user.email==request.payload.email){
                        reply({ message: ' 1' });
                    }
                }
            });

            for(var index in request.payload) { 
                eval("nModel."+index+" = request.payload."+index+";");
            }
            nModel.save(function(err) {
              if (err)
                console.log(err);
              reply({ message: ' ok' });
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

    /********************************************************/
    var Moevent = require('./models/event');

    server.route({
        method: 'GET',
        path: '/events',
        handler: function (request, reply) {
            Moevent.find(function(err, data) {
              if (err)
                console.log(err);
              reply(data);
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/event',
        handler: function (req, rep) {
            var eModel = new Moevent(); 
            //console.log(req.payload);
            for(var index in req.payload) { 
                eval("eModel."+index+" = req.payload."+index+";");
            }
            eModel.save(function(err) {
              if (err)
                rep(err);
              rep({ message: ' ok' });
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/event/{item_id}',
        handler: function (req, rep) {
            //reply('ok');
            Moevent.findById(req.params.item_id, function(err, data) {
                //console.log(data);
              if (err)
                rep(err);
              rep(data);
            });
        }
    });
    server.route({
        method: 'PUT',
        path: '/event/{item_id}',
        handler: function (req, rep) {
            Moevent.findById(req.params.item_id, function(err, item) {
              if (err)
                console.log(err);
              for(var index in req.payload) { 
                eval("item."+index+" = req.payload."+index+";");
              }
              item.save(function(err) {
                if (err)
                  console.log(err);
                rep({ message: 'item updated!' });
              });
            });
        }
    });
    server.route({
        method: 'DELETE',
        path: '/event/{item_id}',
        handler: function(req, rep){
            Moevent.remove({
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
//});
