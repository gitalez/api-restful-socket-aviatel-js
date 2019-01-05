'use strict'

const mongoose = require('mongoose');

// importado por npm
const uniqueValidator = require('mongoose-unique-validator');

// con este objeto permito los tipos siguientes
let tiposValidos = {
    values: ['bidue', 'nux3', 'nux5', 'dc75'],
    messages: '{VALUE} no es un tipo valido' // value es lo que la persona escribe
};


let Schema = mongoose.Schema;

let controlesSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    tipo: {
        type: String,
        enum: tiposValidos // le digo los tipos validos 
    },
    descripcion: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: false,
        default: "activo"
    },
    codigo: {
        type: Array,
        //unique: true, // no puede haber dos codigos iguales
        //required: [true, 'El codigo es necesario']
    },
    creadoEl: {
        type: Date,
        required: false
    },
    file: {
        type: String,
        required: false
    },
    modulo: {
        type: Array,
        required: false
    },

    lapso: {
        type: Array,
        required: false
    },

    operadores: {
        type: Array,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// le decimos al usuarioschema que use el plugin unique mediante el mensaje 
controlesSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
});

module.exports = mongoose.model('Controles', controlesSchema);