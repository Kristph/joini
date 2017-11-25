var Boom    = require('boom');                                  // HTTP Errors
var Joi = require('joi');
var mongoose = require('mongoose');


let uuid = 1;       // Use seq instead of proper unique identifiers for demo only


var users;
var Mouser = require('../models/user');

Mouser.find(function(err, data) {
  if (err)
    console.log(err);
  console.log(data);
  users = data;
});

const login = function (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }
    let message = '';
    let account = null;
    if (request.method === 'post') {

        if (!request.payload.username ||
            !request.payload.password) {

            message = 'Missing username or password';
        }
        else {
            var usr;
            Mouser.findOne({ username: request.payload.username }, function (err, user) {
                if (err) {
                    console.log(err)
                }
                usr = user
                //console.log(user);
                if(user!=null && user.username != null){

                    if(user || user.username==request.payload.username){
                        console.log('ok username ok'+user.username+'-'+user.username);
                    }else{
                        message = 'Invalid username ';
                        return reply('<html><head><title>Login page</title></head><body>' +
                        (message ? '<h3>' + message + '</h3><br/>' : '') +
                        '<form method="post" action="/login">' +
                        'Username: <input type="text" name="username"><br>' +
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
                            'Username: <input type="text" name="username"><br>' +
                            'Password: <input type="password" name="password"><br/>' +
                            '<input type="submit" value="Login"></form></body></html>');            
                        }
                    }else{
                                
                    }

                }else{
                    message = 'Invalid username ';
                    return reply('<html><head><title>Login page</title></head><body>' +
                        (message ? '<h3>' + message + '</h3><br/>' : '') +
                        '<form method="post" action="/login">' +
                        'Username: <input type="text" name="username"><br>' +
                        'Password: <input type="password" name="password"><br/>' +
                        '<input type="submit" value="Login"></form></body></html>');
                }

            });
        }
    }//post
    if (request.method === 'get' || message) {
        return reply.view('login', {message:message});

    }

};

const logout = function (request, reply) {
    request.cookieAuth.clear();
    return reply.redirect('/');
};

module.exports = exports = function (server) {
    console.log('cargando rutas');
    exports.index(server);
};

var App = require('../controllers/App');

exports.index = function (server) {


    server.route([
        {
            path: '/',
            config: {
                auth: 'session'
            },
            method: 'GET',
            handler: App.index
        },{ 
            path: '/login',
            method: ['GET', 'POST'],
            config: { 
                handler: login, 
                auth: { mode: 'try', strategy: 'session' }, 
                plugins: { 'hapi-auth-cookie': { redirectTo: false } } 
            } 
        },{ 
            path: '/logout', 
            method: 'GET',
            config: { handler: logout } 
        },{
            method: 'GET',
            path: '/auth/facebook',
            config: { 
                auth: {strategy: 'facebook', mode: 'try' },
                handler: function (request, reply) {

                    if (!request.auth.isAuthenticated) {
                        return reply('Authentication failed due to: ' + request.auth.error.message);
                    }
                    //console.log('facebook');
                    //console.log(request.auth.credentials);
                    //reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
                    const profile = request.auth.credentials.profile;
                    //console.log(profile.id);
                    Mouser.findOne({ facebook: profile.id }, function (err, user) {
                        sid = profile.id;
                        console.log(user)
                        server.app.cache.set(sid, { account: user }, 0, (err) => {
                            if (err) {
                                console.log(err);
                                //reply(err);
                            }
                            request.cookieAuth.set({
                                sid:sid,
                                facebookId: profile.id,
                                username: profile.username,
                                displayName: profile.displayName
                            });
                            return reply.redirect('/');
                        });
                    });
                }
            }
        }

    ]);

};

