'use strict'

const mongoose = require('mongoose');

/*
Todo en Mongoose comienza con un Esquema.
Cada esquema se asigna a una colección MongoDB
y define la forma de los documentos dentro de esa colección.
*/

let Schema = mongoose.Schema; // lo declaro como una variable aprte 


// declaramos un nuevo schema
// definimos las reglas y campos que el espSchema  va a tener 

let espSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    lugar: {
        type: String,
        required: false,
        default: 'desconocido'
    },
    descripcion: {
        type: String,
        required: false,
        default: 'sin descripcion'
    },
    tipo: {
        type: String,
        required: [true, 'el tipo es requerido']
    },
    lat: {
        type: String,
        required: [true, 'la latitud es necesaria']
    },
    lng: {
        type: String,
        required: [true, 'la longitud es necesaria']
    },
    estado: {
        type: String,
        required: false,
        default: 'activo'
    },
    ssid: {
        type: String,
        required: [true, 'el ssid del router es requerido']
    },
    passwordRouter: {
        type: String,
        required: [true, 'el password del router es requerido']
    },
    mac: {
        type: String,
        unique: true, // para que no se repita la mac address
        required: [true, 'la mac address es necesaria']
    },
    creadoEl: {
        type: Date,
        required: false
    },
    esVerdadero: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// exportamos este modelo como Favorito que va a tener toda la configuracion de espSchema
module.exports = mongoose.model('ModulosEsp', espSchema);