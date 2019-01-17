'use strict'

const express = require('express');

const LoginUsuarioController = require('../controllers/login_usuarios'); // cargamos el controlador usuarios.js

const { verificaToken } = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// UsuarioController  es una referencia a usuario.js
// es decir podra acceder a todos los metodos de usuario.js

// rutas 

// hace log de un usuario y devuelve un ID
api.post('/login-usuario', LoginUsuarioController.loginUsuario);

api.post('/login-usuario-google', LoginUsuarioController.loginUsuarioGoogle);

api.get('/login-renovar-token', verificaToken, LoginUsuarioController.renovarToken);


module.exports = api;