'use strict';
const Hapi = require('hapi');

const server = new Hapi.Server();
//server.connection({ port: 8080, host: '192.168.1.62' });


server.connection({ port: 8080, routes: { cors: true } });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'GET',
    path: '/user/{name}',
    handler: function (request, reply) {
        reply('Hello user, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'POST',
    path: '/user/{name}',
    handler: function (request, reply) {
        reply('Hello user, ' + encodeURIComponent(request.params.name) + '!');
    }
});



server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});