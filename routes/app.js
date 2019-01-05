'use strict'

const express = require('express');

const AppController = require('../controllers/app'); // cargamos el controlador app.js



var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// ControlController  es una referencia a controles.js
// es decir para poder acceder a todos los metodos de controles.js






// rutas 

// obtiene un control mediante su id
api.get('/', AppController.getApp);


module.exports = api;