'use strict'

const express = require('express');

const UsuarioController = require('../controllers/usuarios'); // cargamos el controlador usuarios.js

const { verificaToken, verificaSuper, verificaAdmin_Role_Super , verificaAdmin_Role_Super_MismoUsuario} = require('../middlewares/autenticacion');

var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// le cargamos la ruta o el path ( es el que debe cargar el cliente o postman)
// y a continuacion el metodo que se cargara cuando el cliente haga una peticion a este path
// UsuarioController  es una referencia a usuario.js
// es decir podra acceder a todos los metodos de usuario.js

// rutas 

// obtiene un usuario mediante su id [verificaToken, verificaAdmin_Role_Super]
api.get('/usuario/:id', verificaToken , UsuarioController.getUsuario);

// crea un usuario y lo guarda en DB
api.post('/usuario', UsuarioController.crearUsuario);

//obtengo todos los usuarios [verificaToken, verificaAdmin_Role_Super],
api.get('/usuarios', verificaToken, UsuarioController.getUsuarios);

// actualiza un usuario mediante su id 
api.put('/usuario/:id', [verificaToken, verificaAdmin_Role_Super_MismoUsuario ], UsuarioController.updateUsuario);

//borra fisicamente de la base el usuario , mediante el id 
api.delete('/usuario/:id', [verificaToken, verificaSuper], UsuarioController.borrarUsuario);

//no borra fisicamente de la base el usuario , mediante el id[verificaToken, verificaSuper],
// solo lo anula, lo cambia de estado
api.put('/usuario-disable/:id', [verificaToken, verificaSuper], UsuarioController.disableUsuario);

// busca usuarios con un termino (palabra clave ) como opcion [verificaToken, verificaAdmin_Role_Super]
api.get('/usuarios/buscar/:termino', verificaToken, UsuarioController.buscarUsuarios);

module.exports = api;