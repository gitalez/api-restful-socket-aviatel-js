'use strict'

const mongoose = require('mongoose');

/*
Todo en Mongoose comienza con un Esquema.
Cada esquema se asigna a una colección MongoDB
y define la forma de los documentos dentro de esa colección.
*/

let Schema = mongoose.Schema;


// declaramos un nuevo schema
// definimos las reglas y campos que el  ChatGroupSchemna va a tener 

let ChatGroupSchema = new Schema({

    name: {
        type: String
    }
});

// exportamos este modelo como  que va a tener toda la configuracion de ChatGroupSchema
module.exports = mongoose.model('ChatGroup', ChatGroupSchema);