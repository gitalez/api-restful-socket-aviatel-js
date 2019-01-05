'use strict'

const express = require('express');

const ControlController = require('../controllers/controles'); // cargamos el controlador controles.js

const { verificaToken, verificaAdmin_Role_Super } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// ControlController  es una referencia a controles.js
// es decir para poder acceder a todos los metodos de controles.js

// rutas 

// obtiene un control mediante su id
api.get('/control/:id', [verificaToken, verificaAdmin_Role_Super], ControlController.getControl);

// crea un control y lo guarda en DB
api.post('/control', [verificaToken], ControlController.crearControl);

//obtiene todos los controles
api.get('/controles', [verificaToken, verificaAdmin_Role_Super], ControlController.getControles);

//obtiene todos los controles
api.get('/cantidad-controles', [verificaToken, verificaAdmin_Role_Super], ControlController.cantidadDeControles);

//obtiene todos los modulos, contiene parametros opcionales desde limite
api.get('/mis-controles/:consumerId', verificaToken, ControlController.getMisControles);

// actualiza un control mediante su id
api.put('/control/:id', [verificaToken], ControlController.updateControl);

//borra fisicamente de la base un  control, mediante el id
api.delete('/control/:id', [verificaToken, verificaAdmin_Role_Super], ControlController.borrarControl);

//no lo borra fisicamente de la base el control , mediante el id
// solo lo anula, lo cambia de estado
api.put('/control-disable/:id', [verificaToken, verificaAdmin_Role_Super], ControlController.disableControl);

// busca controles con un termino (palabra clave ) como opcion
api.get('/controles/buscar/:termino', [verificaToken], ControlController.buscarControles);

module.exports = api;