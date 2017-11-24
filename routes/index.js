exports.init = function(server) {
  console.log('cargando rutas...');

  require('./routes')(server);
  
};


