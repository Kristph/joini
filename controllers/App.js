
module.exports = {
	index:function (request, reply) {
	    reply.view('index', {
            route: null,
            user: request.auth.credentials.name
	    });
	},
    user:function(request, reply){
        reply.view('index', {
            route: request.params.user,
            user: request.auth.credentials.name
        });
    }
   

};