'use strict'

//un modelo es un obj de mongoose que nos permite 
//realizar inserciones , actualizaciones etc

const mongoose = require('mongoose');

// importado por npm
const uniqueValidator = require('mongoose-unique-validator');

// con este objeto permito los roles siguiente
let rolesValidos = {
    values: ['consumer', 'cliente', 'empleado', 'admin', 'super', 'iot'],
    messages: '{VALUE} no es un role valido' // value es lo que la persona escribe
};

let estadosValidos = {
    values: [ 'activo', 'suspendido'],
    messages: '{VALUE} no es un estado valido' // value es lo que la persona escribe
};
/*
Todo en Mongoose comienza con un Esquema.
Cada esquema se asigna a una colección MongoDB
y define la forma de los documentos dentro de esa colección.
*/

let Schema = mongoose.Schema; // define el modelo

// declaramos un nuevo schema
// definimos las reglas y campos que el usuarioschema va a tener 

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // para que no se repita el correo
        required: [true, 'el correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    imagen: {
        type: String,
        required: false,
        default: null
    },
    role: {
        type: String,
        required:[true, 'el rol es necesario'],
        enum: rolesValidos, // le digo los roles validos
     
    },
    estado: {
        type: String,
        required: false,
        required:[true, 'el estado es necesario'],
        enum: estadosValidos, // le digo los  estados validos
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});


// optamos por nunca devolver el password
// este objeto no tiene la contraseña
// no usamos la funcion flecha para no perder el this 

// exclusion de devolver la contraseña del modelo  mediante el schema 
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;
    return userObject;
}

// OTRA FORMA 
// es colocar el find  en el controller asi 
//Usuario.find({}, 'nombre email img role')
//.exec((err,usaurio)=>)

// importamos con npm el unique validator
// le decimos al usuarioschema que use el plugin unique mediante el mensaje 
// path reemplaza la propiedad del campo 
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya registrado'});

// exportamos este modelo como Usuario que va a tener toda la configuracion de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);