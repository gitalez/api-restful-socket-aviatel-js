'use strict'

const express = require('express');

const EspController = require('../controllers/modulos-esp'); // cargamos el controlador controles.js

const { verificaToken, verificaAdmin_Role_Super, verificaCliente } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi podemos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// EspController  es una referencia a modulos-esp.js
// es decir para poder acceder a todos los metodos de modulos-esp.js

// rutas 

// obtiene un modulo mediante su id
api.get('/esp/:id', [verificaToken, verificaAdmin_Role_Super], EspController.getEsp);

// crea un modulo y lo guarda en DB  
api.post('/esp', [verificaToken], EspController.crearEsp);

//obtiene todos los modulos, contiene parametros opcionales desde limite
api.get('/esps', [verificaToken, verificaAdmin_Role_Super], EspController.getEsps);

//obtiene todos los modulos, contiene parametros opcionales desde limite
api.get('/cantidad-modulos', [verificaToken, verificaAdmin_Role_Super], EspController.cantidadDeModulos);

//obtiene todos los modulos, contiene parametros opcionales desde limite
api.get('/mis-esps/:consumerId', verificaToken, EspController.getMisEsps);

// actualiza un modulo mediante su id
api.put('/esp/:id', [verificaToken], EspController.updateEsp);

//borra fisicamente de la base un modulo, mediante el id
api.delete('/esp/:id', [verificaToken, verificaAdmin_Role_Super], EspController.borrarEsp);

//no lo borra fisicamente de la base el modulo , mediante el id
// solo lo anula, lo cambia de estado
api.put('/esp-disable/:id', [verificaToken, verificaAdmin_Role_Super], EspController.disableEsp);

// busca modulos con un termino (palabra clave ) como opcion
api.get('/esp/buscar/:termino', [verificaToken, verificaAdmin_Role_Super], EspController.buscarEsp);

module.exports = api;