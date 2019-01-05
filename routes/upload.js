'use strict'

const express = require('express');

const UploadController = require('../controllers/upload'); // cargamos el controlador usuarios.js

const { verificaToken, verificaAdmin_Role_Super } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta ( es lo que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a esa ruta
// UploadController  que es una referencia a upload.js
// es decir podra acceder a todos los metodos de upload.js

// rutas , lo hacemos por put porque ya esta todo creado 

api.put('/upload/:tipo/:id', UploadController.upload);

// tipo  es la coleccion : hospital , medico , controles etc 

// tuve que sacar  verificaToken, para que funcione 
module.exports = api;