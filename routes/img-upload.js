// este servicio sirve para ver una imagen que esta subida 
// tipo es la coleccion 
// img es la imagen que quieren buscar 
'use strict'

const express = require('express');

const ImgUploadController = require('../controllers/img-upload'); // cargamos el controlador usuarios.js


var api = express.Router(); // cargamos el router de express
// asi poedmos crear rutas

// rutas 

api.get('/img/:tipo/:img', ImgUploadController.imgUpload);

// ver le saque verificatoken para que funcione
module.exports = api;