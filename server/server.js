'use strict'

require('../config/config'); // al ser este el primer archivo lo va a ejecutar primero

const socketIO = require('socket.io');

const express = require('express');

const mongoose = require('mongoose');

const http = require('http'); // lo importamos para tener  el metodo createserver

const path = require('path');

const app = require('../app');

const logger = require('morgan');

const cors = require('cors');

const errorhandler = require('errorhandler');


if (process.env.NODE_ENV === 'dev') {
    app.use(logger('dev'));
    app.use(errorhandler());

}

const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

app.use(cors({ origin: true, credentials: true }));


// socket no trabaja directamente con express . trabaja con un servidor http que trae node 
let server = http.createServer(app);

mongoose.Promise = global.Promise;

mongoose.connect(process.env.URLDB,{ useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err; // se muere y no sigue el programa
    console.log('base de datos ONLINE');
});


server.listen(process.env.PORT, (err) => {

    if (err) throw err; // se muere y no sigue el programa
    console.log(`server escuchando en el puerto ${process.env.PORT}`);
});

module.exports.io = socketIO(server);
require('./sockets/socket-server');