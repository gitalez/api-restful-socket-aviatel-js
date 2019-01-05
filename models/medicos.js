'use strict'

//un modelo es un obj de mongoose que nos permite 
//realizar inserciones , actualizaciones etc

const mongoose = require('mongoose');

/*
Todo en Mongoose comienza con un Esquema.
Cada esquema se asigna a una colección MongoDB
y define la forma de los documentos dentro de esa colección.
*/

let Schema = mongoose.Schema; // define el modelo

// declaramos un nuevo schema
// definimos las reglas y campos que el usuarioschema va a tener 

let medicoSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    imagen: {
        type: String,
        required: false,
        default: null
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'el id hospital es un campo obligatorio']
    },
});

// exportamos este modelo como Usuario que va a tener toda la configuracion de usuarioSchema
module.exports = mongoose.model('Medico', medicoSchema);