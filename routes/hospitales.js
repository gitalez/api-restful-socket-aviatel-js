'use strict'

const express = require('express');

const HospitalController = require('../controllers/hospitales'); // cargamos el controlador hospitales.js

const { verificaToken, verificaSuper, verificaAdmin_Role_Super } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// UsuarioController  es una referencia a usuario.js
// es decir podra acceder a todos los metodos de usuario.js

// rutas 

// obtiene un hospital mediante su id, [verificaToken, verificaAdmin_Role_Super],
api.get('/hospital/:id', verificaToken, HospitalController.getHospital);

// crea un hospital y lo guarda en DB
api.post('/hospital', verificaToken, HospitalController.crearHospital);

//obtengo todos los hospitales [verificaToken, verificaAdmin_Role_Super],
api.get('/hospitales', HospitalController.getHospitales);

// actualiza un hospital mediante su id [verificaToken, verificaAdmin_Role_Super],
api.put('/hospital/:id', verificaToken, HospitalController.updateHospital);

//borra fisicamente de la base el hospital , mediante el id [verificaToken, verificaSuper],
api.delete('/hospital/:id', verificaToken, HospitalController.borrarHospital);

// busca hospitales con un termino (palabra clave ) como opcion [verificaToken, verificaAdmin_Role_Super],
api.get('/hospitales/buscar/:termino', verificaToken, HospitalController.buscarHospitales);

module.exports = api;