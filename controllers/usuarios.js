'use strict'

// usamos la encriptacion  de una sola via . por mas que la obtenga no va a poder 
//reconstruir la origibnal
const bcrypt = require('bcrypt');

let Usuario = require('../models/usuarios'); // cargamos el modelo


// req es lo que recibe la callback
// si al parametro lo terminamos con ? es opcional y en el nav te deja pasasr sin el nombre
// el metodo recibe una req y uns res
//la req es lo que recibe en la peticion del usuario  , y res es lo que responde 


/////////////////////////////////////////////////////
//
// metodo GET
// getUsuario : obtener el usuario mediante su Id
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/usuario/123


function getUsuario(req, res) {

    let getUsuarioId = req.params.id;

    Usuario.findById(getUsuarioId, (err, usuario) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: `no se encuentra el usuario con el id: ${id}`
            });
        }
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'no hay usuario'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'usuario encontrado',
            usuario: usuario
        })
    });
}

//////////////////////////////////////////////////
//
// metodo : GET
// getUsuarios: obtenemos todos los usuarios de la base con parametros opcionales desde, hsta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/usuarios

//http: //localhost:3000/api/usuarios?desde=3
function getUsuarios(req, res) {

    // los query son los optativos en la url 

    // o es 0 o el parametro desde 
    let desde = req.query.desde || 0;
    desde = Number(desde);


    let hasta = req.query.hasta || 5;
    hasta = Number(5); // siempre muestra los siguientes 5 

    // el err y usuarios pueden ir dentro de este () con un {} en caso que los 
     // metodos skip limit y sort no existan ... van ahora en .exec

     // el segundo parametro es lo que quiero traer  mombre email  etc etc 
     // no triago  el password 
    Usuario.find({}, 'nombre email imagen estado role google') 
       
    // le lee asi desde , hasta los siguientes 5
        .skip(desde)
        .limit(hasta)
        .sort('-nombre')
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({ // internal error server
                    ok: false,
                    mensaje: 'error en base de datos de usuarios',
                    error: err
                })
            }
            if (!usuarios) {
                return res.status(404).json({ // not found
                    ok: false,
                    mensaje: 'no hay usuarios en la base de datos'
                })
            }
            Usuario.count({}, (err, conteo) => {

                res.status(200).json({ // ok 
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                })
            })

        });
};



/////////////////////////////////////////////////////
//
// metodo POST
// crearUsuario: crea y guarda un usuario por el metodo post
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/usuario
// en el body llenamos distintas key y values en formato urlencoded

// para obtener la informacion la vamos a codificar en x-wwww-form-urlencoded en el cliente
// y para obtener los datos que se envian desde el cliente 
// pero existe una lib que toma la info se envia  y crea un obj de js : body-parser que es un middle
// si no usamos el bcrypt , en la BD vamos a ver la contraseña que coloco el usuario y eso es bad 
// encriptar en una sola via significa que si aun alguien obtuviera la cadena encriptada no sera posible 
// volverla a su estado original

function crearUsuario(req, res) {


    console.log("estamos creando un usuario");
    // metodo post ... que llegan por body
    let params = req.body;

    // role y estado son requeridos en la db , si no vienen en el body los seteo aqui
    // nombre , email y pasword  no los seteo , tiene que venir 
    
    if (!params.role) {
        params.role = 'consumer'; 
    }
    if (!params.estado) {
        params.estado = 'activo'; 
    }

    // imagen  estado  tiene defalut en el modelo 
    let usuario = new Usuario({ // new Usuario hace ref al modelo

        nombre: params.nombre,
        email: params.email,
        role: params.role,
        estado: params.estado,
        password: bcrypt.hashSync(params.password, 10)
    });

    usuario.save((err, usuarioDB) => {

        if (err) { // colocando el return se sale y no sigue 
            return res.status(400).json({ // bad request
                ok: false,
                mensaje: 'error al crear un usuario',
                error: err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({ // not found 
                ok: false,
                mensaje: 'no se pudo crear el usuario',
            });
        }
        res.status(201).json({ // recurso creado
            ok: true,
            usuario: usuarioDB,
            usuarioSolicitante: req.usuario // es el usuario que esta en el token 
        })
    });

};

/////////////////////////////////////////////////////
//
// metodo PUT
// updateUsuario: actualiza y guarda un usuario por el metodo put , mediante id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/usuario/121
// en el body llenamos distintas key y values en formato urlencoded

function updateUsuario(req, res) {
    // metodo put  ...llega por body

    var update = req.body;

    //console.log('el update es : ');
    //console.log(update);

    //console.log('el nombre es : ');
    let nombre = update.nombre
    console.log(nombre);

    //console.log('up', up);

    var usuarioId = req.params.id;

    Usuario.findById(usuarioId, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({ // internal server
                ok: false,
                mensaje: 'el usuario con el id' + usuarioId + 'no existe',
                errors: err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({ // bad request
                ok: false,
                mensaje: 'no se pudo actualizar el usuario con el id :' + usuarioId
            });
        }
        // actualizo 4 propiedades obligatorias 
        // sino da error 

        usuarioDB.nombre = update.nombre;
        usuarioDB.email = update.email;

        // validamos role y estado 
        // ya que lo puede actulizar solo admin 

        if (update.role) {
            usuarioDB.role = update.role; 
        }

        if (update.estado) {
            usuarioDB.estado = update.estado; 
        }

        usuarioDB.save((err, usuarioUpdated) => {

            if (err) {
                return res.status(400).json({ // bad request
                    ok: false,
                    mensaje: 'error al actualizar el usuario',
                    error: err
                });
            }
            usuarioUpdated.password = ':)';
            res.status(200).json({ // OK
                update: true,
                usuario: usuarioUpdated,
                pass: usuarioUpdated.password
            });
        });

    });
}

/////////////////////////////////////////////////////
//
// metodo DELETE
// borrarUsuario: borra fisicamente el usuario por metodo delete mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/usuario/121

function borrarUsuario(req, res) {

    var usuarioId = req.params.id;

    Usuario.findById(usuarioId, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: `no se encuentra el usuario con el id: ${id}`
            });
        }
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'no hay usuario para borrar'
            });
        }
        usuario.remove((err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'no se ha podido borrar el usuario'
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'usuario borrado',
                usuario: usuario
            })
        })

    });
};

/////////////////////////////////////////////////////
//
// metodo PUT
// disableUsuario: cambia de estado a false un usuario mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/usuario-disable/121

function disableUsuario(req, res) {

    // anular un usuario 
    // en lugar de borrarlo cambiamos el estado

    let id = req.params.id

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) { // colocando el return se sale y no sigue 
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    mensaje: 'no existe usuario con ese ID'
                }
            });
        }

        usuarioDB.estado = 'suspendido';
        //console.log(usuarioDB);
        usuarioDB.save((err, usuarioDisable) => {

            if (err) { // colocando el return se sale y no sigue 
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.status(201).json({ // 201 es cuando se crea un nuevo registro
                ok: true,
                usuario: usuarioDisable
            })
        });
    })
}


////////////////////////////////////////////////////////////////////
//
// metod GET
// buscarUsuarios busca usuarios por termino (palabra clave)
//
/////////////////////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/usuarios/juan

function buscarUsuarios(req, res) {

    let termino = req.params.termino;
    // mandamos una expresion regular para ser usada como filtro

    // RegExp es una funcion de js 
    // 'i' insensible a las mayus y minus

    let regex = new RegExp(termino, 'i');

    Usuario.find({ nombre: regex })
        .exec((err, usuarios) => {
            if (err) { // colocando el return se sale y no sigue 
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.json({
                ok: true,
                usuarios
            })
        })

};

module.exports = {

    getUsuario,
    crearUsuario,
    updateUsuario,
    borrarUsuario,
    getUsuarios,
    disableUsuario,
    buscarUsuarios
};