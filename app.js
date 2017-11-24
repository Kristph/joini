'use strict';
const Path = require('path');
const Hapi = require('hapi');
const Vision = require('vision');
const internals = {};
const Inert = require('inert');

const Bcrypt = require('bcrypt');
const Hapiauthcookie = require('hapi-auth-cookie');
const Bell = require('bell');

//var routes = require('./routes');
var routes = require('./routes');

require('./bd');



const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});


internals.main = function () {

   //const server = new Hapi.Server();
    const server = new Hapi.Server({
        connections: {
            routes: {
                files: {
                    relativeTo: Path.join(__dirname, 'public')
                }
            }
        }
    });
    server.connection({ port: 8080, routes: { cors: true } });



    server.register([Hapiauthcookie,Vision,Inert,Bell],  (err) => {
        if (err) {
            throw err;
        }

        const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
        server.app.cache = cache;

        server.auth.strategy('session', 'cookie', true, {
            password: 'password-should-be-32-characters',
            cookie: 'session',
            redirectTo: '/login',
            //redirectTo: false,
            isSecure: false,
            validateFunc: function (request, session, callback) {
                //console.log(session);
                cache.get(session.sid, (err, cached) => {
                    if (err) {
                        return callback(err, false);
                    }
                    if (!cached) {
                        return callback(null, false);
                    }
                    return callback(null, true, cached.account);
                });
            }
        });

        console.log('uri');
        console.log(server.info.uri);
   
        server.auth.strategy('facebook', 'bell', {
            provider: 'facebook',
            password: 'password-should-be-32-characters',
            isSecure: false,
            // You'll need to go to https://developers.facebook.com/ and set up a
            // Website application to get started
            // Once you create your app, fill out Settings and set the App Domains
            // Under Settings >> Advanced, set the Valid OAuth redirect URIs to include http://<yourdomain.com>/bell/door
            // and enable Client OAuth Login
            clientId: '863689683671851',
            clientSecret: '94095c2f21d1fcc6f1565b9831d99edb',
            location: 'http://localhost:8080'
            //location: server.info.uri
        });


        server.views({
            engines: { ejs: require('ejs') },
            relativeTo: __dirname,
            path: 'templates/'
        });

        //server.register(Inert, () => {});
        //server.route(routes);
        routes.init(server);


        server.start((err) => {

            if (err) {
                throw err;
            }
            console.log('Server is listening at ' + server.info.uri);
        });
    });
};

internals.main();
