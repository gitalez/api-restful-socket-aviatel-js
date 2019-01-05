'use strict'

const express = require('express');

const GroupController = require('../controllers/chat-group'); // cargamos el controlador chat-group.js

//const { verificaToken, verificaAdmin_Role_Super } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// GroupController  es una referencia a chat-group.js
// es decir para poder acceder a todos los metodos de chat-group.js

// rutas 



// crea un grupo de chat y lo guarda en DB
api.post('/crear-grupo', GroupController.crearGrupo);
api.get('/groups', GroupController.getGroups);
api.get('/group/:id', GroupController.getGroup);

module.exports = api;