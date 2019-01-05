'use strict'

let Control = require('../models/controles');

/////////////////////////////////////////////////////
//
// metodo : GET
// getControl : obtener un control mediante su Id
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/control/123


function getControl(req, resp) {

    var getControlId = req.params.id;

    Control.findById(getControlId, (err, control) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: `no se encuentra el control con el id: ${getControlId}`
            });
        }
        if (!control) {

            return resp.status(404).json({
                ok: false,
                message: 'no existe este control'
            });
        }
        resp.status(200).json({
            ok: true,
            message: 'control encontrado',
            control: control
        })
    });

}


//////////////////////////////////////////////////
//
// metodo : GET
// getMisControles: obtenemos los controles de un cliente y 
//de un modulo en particular de la base  con parametros opcionales desde , hasta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/mis-controles

function getMisControles(req, resp) {

    let id = req.params.consumerId;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);


    Control.find({ usuario: id })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones
        .populate('modulo', 'nombre')
        .sort('nombre')
        .exec((err, controles) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: 'error al devolver los controles',
                    error: err
                })
            }

            if (!controles) {
                return resp.status(404).json({
                    ok: false,
                    message: 'no hay controles'
                })
            }

            Control.count({ usuario: id }, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    controles: controles,
                    total: conteo
                })
            })
        })
};

function cantidadDeControles(req, resp) {

    Control.find()

    .exec((err, controles) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: 'error al devolver los controles',
                error: err
            })
        }

        if (!controles) {
            return resp.status(404).json({
                ok: false,
                message: 'no hay controles'
            })
        }

        Control.count({}, (err, conteo) => {

            resp.status(200).json({ // ok 
                ok: true,
                total: conteo
            })
        })
    })
}

//////////////////////////////////////////////////
//
// metodo : GET
// Mostrar todas los controles  de un usuario (por su token)
// getEsps: obtenemos todos los modulos de la base  con parametros opcionales desde , hasta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/esps



function getControles(req, resp) {

    // los query son los optativos en la url 


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Control.find()
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones
        .exec((err, controles) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: 'error al devolver los controles',
                    error: err
                })
            }

            if (!controles) {
                return resp.status(404).json({
                    ok: false,
                    message: 'no hay controles'
                })
            }

            Control.count({}, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    controles: controles,
                    total: conteo
                })
            })
        })
};

/////////////////////////////////////////////////////
//
// metodo POST
// crearControl: crea y guarda un modulo por el metodo post
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/control
// en el body llenamos distintas key y values en formato urlencoded

// para obtener la informacion la vamos a codificar en x-wwww-form-urlencoded en el cliente
// y para obtener los datos que se envian desde el cliente 
// pero existe una lib que toma la info se envia  y crea un obj de js : body-parser que es un middle
// si no usamos el bcrypt , en la BD vamos a ver la contraseña que coloco el usuario y eso es bad 
// encriptar en una sola via significa que si aun alguien obtuviera la cadena encriptada no sera posible 
// volverla a su estado original

function crearControl(req, resp) {

    // metodo post ... que llegan por body
    let params = req.body;
    //console.log(req);
    console.log(params);

    let control = new Control({

        nombre: params.nombre,
        tipo: params.tipo,
        descripcion: params.descripcion,
        estado: params.estado,
        codigo: params.codigo,
        creadoEl: new Date(),
        usuario: req.usuario._id, // viene del verificatoken
        modulo: params.modulo,
        lapso: params.lapso,
        operadores: params.operadores,

    });

    //console.log(req);

    console.log('este es el control antes de salvar ', control);

    control.save((err, controlStored) => {

        var error = err;
        console.log(error);

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: 'error al guardar el control',
                error: err

            });
        }

        if (!controlStored) {
            return resp.status(404).json({
                ok: false,
                error: err
            });
        }

        resp.status(200).json({
            ok: true,
            control: controlStored
        });

    })
};


/////////////////////////////////////////////////////
//
// metodo PUT
// updateControl: actualiza y guarda un modulo por el metodo put , mediante id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/control/121
// en el body llenamos distintas key y values en formato urlencoded

function updateControl(req, res) {
    // metodo put  ...llega por body

    var update = req.body;
    var id = req.params.id;
    //console.log('el id que llega ', espId);
    //console.log('lo que llega por el body : ', req.body);
    Control.findById(id, (err, controlDB) => {

        if (err) {
            return res.status(500).json({ // internal server
                ok: false,
                message: 'error al buscar el control',
                error: err
            })
        }

        if (!controlDB) {
            return res.status(400).json({ // bad request
                ok: false,
                mensaje: 'el control con el id' + id + 'no existe',
                errors: {
                    message: 'no existe un control con ese ID'
                }
            });
        }

        controlDB.nombre = update.nombre;
        controlDB.descripcion = update.descripcion;
        controlDB.estado = update.estado;
        controlDB.codigo = update.codigo;

        // actualizamos el usuario que lo esta modificando 
        controlDB.usuario = req.usuario_id;

        controlDB.save((err, controlUpdated) => {

            if (err) {
                return res.status(400).json({ // bad request
                    ok: false,
                    message: 'error al actualizar el control',
                    error: err
                });
            }
            res.status(200).json({ // OK
                update: true,
                control: controlUpdated,
            });
        });

    });
}

/////////////////////////////////////////////////////
//
// metodo : DELETE
//borrarControl: borra fisicamente un modulo mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/control/121


function borrarControl(req, resp) {

    var controlId = req.params.id;

    Esp.findById(controlId, (err, esp) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: `no se encuentra el control con el id: ${controlId}`
            });
        }
        if (!control) {
            return resp.status(404).json({
                ok: false,
                message: 'no hay control para borrar'
            });
        }
        control.remove((err) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: 'no se ha podido borrar el control'
                });
            }
            resp.status(200).json({
                ok: true,
                message: 'control borrado',
                control: control
            })
        })

    });

}

/////////////////////////////////////////////////////
//
//metodo : PUT
// disableEsp: cambia de estado a false un control mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/control-disable/121

function disableControl(req, res) {



    let id = req.params.id

    Control.findById(id, (err, controlDB) => {

        if (err) { // colocando el return se sale y no sigue 
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!controlDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'no existe control con ese ID'
                }
            });
        }

        controlDB.estado = false;

        controlDB.save((err, controlDisable) => {

            if (err) { // colocando el return se sale y no sigue 
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.status(201).json({ // 201 es cuando se crea un nuevo registro
                ok: true,
                control: controlDisable
            })
        });
    })
}


////////////////////////////////////////////////////////////////////
//
// metod GET
// buscarControl busca controles por termino (palabra clave)
//
/////////////////////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/control/cocina

function buscarControles(req, res) {

    let termino = req.params.termino;
    // mandamos una expresion regular para ser usada como filtro

    // RegExp es una funcion de js 
    // 'i' insensible a las mayus y minus

    let regex = new RegExp(termino, 'i');

    Control.find({ tipo: regex })
        .exec((err, controles) => {
            if (err) { // colocando el return se sale y no sigue 
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.json({
                ok: true,
                controles
            })
        })

};

module.exports = {

    getControl,
    crearControl,
    updateControl,
    borrarControl,
    getControles,
    getMisControles,
    buscarControles,
    disableControl,
    getMisControles,
    cantidadDeControles

}