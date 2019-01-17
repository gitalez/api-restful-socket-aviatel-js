// npm install serve-index --save

'use strict'

const fileUpload = require('express-fileupload')

const express = require('express');

const app = express(); // llama al express

//opciones de default del fileupload lo usa upload.js
app.use(fileUpload());


/// server-index config 
// esto sirve para ver el contenido del folder upload
// hacemos localhost:3000/uploads
// nos abre un navegador , para navegar entre los  folders
// sirve o no sirve , 
// cualquier chabon podra ver y modificar esas imagenes 

//var serveIndex = require('serve-index');
//app.use(express.static(__dirname +'/'));
//app.use('/uploads', serveIndex(__dirname + '/uploads'));


const api_modulos_esp = require('./routes/modulos-esp'); // esto carga todo lo que hay en esp

const api_usuarios = require('./routes/usuarios'); // esto carga todo lo que hay en usuarios

const api_controles = require('./routes/controles'); // esto carga todo lo que hay en esp

const api_busquedas = require('./routes/busquedas');

const api_upload_routes = require('./routes/upload');

const login_usuario_routes = require('./routes/login_usuarios');

const api_img_upload_routes = require('./routes/img-upload');

const api_ChatGroup = require('./routes/chat-group');

const app_routes = require('./routes/app');

const api_hospitales = require ('./routes/hospitales');

const api_medicos = require ('./routes/medicos');

// body parser nos permite recibir culaquier parametro por http 
// y cuando  recibe la peticion convierte esos datos  a un obj en json js


//el body parser es
// middle ware es una funcionalidad que se ejecuta antes la funcion http

var bodyParser = require('body-parser')

// disparamos el middle use

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // lo convierte a json



// introducimos un middle propio  para cuando trabajemos con nuestro cliente rest y no postman 
// so para no tener problemas con las cabeceras put y delete

// buscar cors en enable-cors.org ,
//https://enable-cors.org/server_expressjs.html,  pestaña server 

// 


app.use((req, resp, next) => { // se carga siempre y cuando se haga una peticion a nuestra api

    // el parametro next nos permite salir de la funcion cuando termine

    resp.header('Access-Control-Allow-Origin', '*'); //  cualquiera puede hacer peticiones a nuestra api
    // si solo se permitiria hacer peticiones desde un dominio especifico , en lugar de * le indicamos la url

    // configuramos los headers
    // las cabeceras permitidas son :
    resp.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

    // configuramos los metodos que nos pueden llegar ( permitidos )
    resp.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');

    resp.header('Allow', 'GET,POST,OPTIONS,PUT,DELETE');

    // ejecutamos la funcion next para salir de esta funcion

    next();

});




/*
// server index config 

let serveIndex = require('serve-index');

// para que podamos conocer o que cualquera pueda llegar a localhost:3000/uploads,
// debemos hacer 

app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/

// aqui se cargan todas las rutas /api ... todas empiezan por api y va a cargar lo que devuelva que tenga api
//  en api.get se definiran las rutas y este middle se encarga  de cargarlas 

//  /api es la ruta, 

//cada vez que cualquier peticion haga match con /api quiero que use api_modulos_esp
app.use('/api', api_modulos_esp);

app.use('/api', api_controles);

app.use('/api', api_usuarios);

app.use('/api', login_usuario_routes);

app.use('/api', api_busquedas);

app.use('/api', api_upload_routes);

app.use('/api', api_img_upload_routes);

app.use('/api', api_ChatGroup);

app.use('/api', api_hospitales);

app.use('/api', api_medicos);

app.use('/', app_routes); // debe ser la ultima 

module.exports = app;

/*

// cuando cargues la ruta /,  carga una ruta estatica client
app.use('/', express.static('client', { redirect: false }));

// aqui se cargan todas las rutas /api ... todas empiezan por api y va a cargar lo que devuelva que tenga api
//  en api.get se definiran las rutas y este middle se encarga  de cargarlas 
app.use('/api', api);

// para que funcione el cliente

app.get('*', function(req, res, next) {
    res.sendFile(path.resolve('client/index.html'));
    next();
});
*/