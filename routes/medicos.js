'use strict'

const express = require('express');

const MedicoController = require('../controllers/medicos'); // cargamos el controlador medicos.js

const { verificaToken, verificaSuper, verificaAdmin_Role_Super } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// UsuarioController  es una referencia a usuario.js
// es decir podra acceder a todos los metodos de usuario.js

// rutas 

// obtiene un medico mediante su id, [verificaToken, verificaAdmin_Role_Super],
api.get('/medico/:id', verificaToken, MedicoController.getMedico);

// crea un medico y lo guarda en DB
api.post('/medico', verificaToken, MedicoController.crearMedico);

//obtengo todos los medicos [verificaToken, verificaAdmin_Role_Super],
api.get('/medicos', MedicoController.getMedicos);

// actualiza un medico mediante su id [verificaToken, verificaAdmin_Role_Super],
api.put('/medico/:id', verificaToken, MedicoController.updateMedico);

//borra fisicamente de la base el medico , mediante el id [verificaToken, verificaSuper],
api.delete('/medico/:id', verificaToken, MedicoController.borrarMedico);

// busca medicos con un termino (palabra clave ) como opcion [verificaToken, verificaAdmin_Role_Super],
api.get('/medicos/buscar/:termino',verificaToken, MedicoController.buscarMedicos);

module.exports = api;