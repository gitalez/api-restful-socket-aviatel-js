'use strict'

// los clientes se regsitraran y loguearan desde una app de un celular en forma verdadera
// y en forma falas desde este  cliente 

const express = require('express');

const BusquedaController = require('../controllers/busquedas'); // cargamos el controlador usuarios.js

const { verificaToken } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// BusquedaController  es una referencia a busquedas.js
// es decir podra acceder a todos los metodos de busquedas.js

// rutas 
// [verificaToken, verificaAdmin_Role_Super],
api.get('/busquedas/todo/:bus', verificaToken, BusquedaController.buscarAlgo);
api.get('/busquedas/coleccion/:tabla/:bus', verificaToken, BusquedaController.buscarPorColeccion);


module.exports = api;