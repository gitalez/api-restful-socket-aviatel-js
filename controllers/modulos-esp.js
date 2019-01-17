'use strict'

let Esp = require('../models/modulos-esp');

/////////////////////////////////////////////////////
//
// metodo : GET
// getEsp : obtener un modulo mediante su Id
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/esp/123


function getEsp(req, resp) {

    var getEspId = req.params.id;

    Esp.findById(getEspId, (err, esp) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: `no se encuentra el modulo esp con el id: ${getEspId}`
            });
        }
        if (!esp) {
            return resp.status(404).json({
                ok: false,
                message: 'no existe modulo esp'
            });
        }
        resp.status(200).json({
            ok: true,
            message: 'esp encontrado',
            modulo: esp
        })
    });
}


function cantidadDeModulos(req, resp) {

    Esp.find()

    .exec((err, modulos) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: 'error al devolver los modulos',
                error: err
            })
        }

        if (!modulos) {
            return resp.status(404).json({
                ok: false,
                message: 'no hay modulos'
            })
        }

        Esp.countDocuments({}, (err, conteo) => {

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
// getMisEsps: obtenemos los modulos de un cliente
// en particular de la base con parametros opcionales desde , hasta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/mis-esps

function getMisEsps(req, resp) {

    let id = req.params.consumerId;

    let desde = req.query.desde || 0;
    desde = Number(desde);



    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);



    Esp.find({ usuario: id })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones
        .sort('tipo')
        .exec((err, esps) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: 'error al devolver los modulos ESP',
                    error: err
                })
            }

            if (!esps) {
                return resp.status(404).json({
                    ok: false,
                    message: 'no hay modulos Esp'
                })
            }

            Esp.countDocuments({ usuario: id }, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    modulos: esps,
                    total: conteo
                })
            })
        })

};


//////////////////////////////////////////////////
//
// metodo : GET
// Mostrar todas los controles  de un usuario (por su token)
// getEsps: obtenemos todos los modulos de la base  con parametros opcionales desde , hasta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/esps


function getEsps(req, resp) {

    // los query son los optativos en la url 

    let d = req.query.desde;
    console.log('d', d);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let h = req.query.hasta;
    h = Number(h);
    console.log('h', h);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);
    console.log('hasta ', hasta);

    Esp.find()
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones
        .sort('tipo')
        .exec((err, esps) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: 'error al devolver los modulos ESP',
                    error: err
                })
            }

            if (!esps) {
                return resp.status(404).json({
                    ok: false,
                    message: 'no hay modulos Esp'
                })
            }

            Esp.countDocuments({}, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    modulos: esps,
                    total: conteo
                })
            })
        })



};

/////////////////////////////////////////////////////
//
// metodo POST
// crearEsp: crea y guarda un modulo por el metodo post
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/esp
// en el body llenamos distintas key y values en formato urlencoded

// para obtener la informacion la vamos a codificar en x-wwww-form-urlencoded en el cliente
// y para obtener los datos que se envian desde el cliente 
// pero existe una lib que toma la info se envia  y crea un obj de js : body-parser que es un middle
// si no usamos el bcrypt , en la BD vamos a ver la contraseña que coloco el usuario y eso es bad 
// encriptar en una sola via significa que si aun alguien obtuviera la cadena encriptada no sera posible 
// volverla a su estado original

function crearEsp(req, resp) {

    // metodo post ... que llegan por body
    let params = req.body;
    //console.log(req);
    //console.log(params);
    let esp = new Esp({

        nombre: params.nombre,
        tipo: params.tipo,
        lat: params.lat,
        lng: params.lng,
        mac: params.mac,
        usuario: req.usuario._id, // viene del verificatoken
        ssid: params.ssid,
        passwordRouter: params.passwordRouter,
        esVerdadero: params.esVerdadero,
        lugar: params.lugar,
        descripcion: params.descripcion,
        estado: params.estado,
        creadoEl: new Date(),
    });

    console.log(req);

    esp.save((err, espStored) => {
        // el callback recibe el posible error o  el favorito guardado


        if (err) {
            return resp.status(500).json({
                ok: false,
                message: 'error al guardar el modulo esp',
                error: err

            });
        }

        if (!espStored) {
            return res.status(404).json({
                ok: false,
                error: err
            });
        }

        resp.status(200).json({
            ok: true,
            modulo: espStored
        });

    })
};


/////////////////////////////////////////////////////
//
// metodo PUT
// updateEsp: actualiza y guarda un modulo por el metodo put , mediante id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/esp/121
// en el body llenamos distintas key y values en formato urlencoded

function updateEsp(req, res) {
    // metodo put  ...llega por body

    var update = req.body;
    var espId = req.params.id;
    //console.log('el id que llega ', espId);
    //console.log('lo que llega por el body : ', req.body);
    Esp.findById(espId, (err, espDB) => {

        if (err) {
            return res.status(500).json({ // internal server
                ok: false,
                message: 'error al buscar el modulo esp',
                error: err
            })
        }

        if (!espDB) {
            return res.status(400).json({ // bad request
                ok: false,
                mensaje: 'el modulo con el id' + espId + 'no existe',
                errors: {
                    message: 'no existe un modulo con ese ID'
                }
            });
        }

        espDB.lugar = update.lugar;
        espDB.descripcion = update.descripcion;
        espDB.nombre = update.nombre;
        espDB.ssid = update.ssid;
        espDB.estado = update.estado;
        espDB.passwordRouter = update.passwordRouter;

        // actualizamos el usuario que lo esta modificando 
        espDB.usuario = req.usuario_id;

        espDB.save((err, espUpdated) => {

            if (err) {
                return res.status(400).json({ // bad request
                    ok: false,
                    message: 'error al actualizar el modulo',
                    error: err
                });
            }
            res.status(200).json({ // OK
                update: true,
                modulo: espUpdated,
            });
        });

    });
}
/////////////////////////////////////////////////////
//
// metodo : DELETE
//borrarEsp: borra fisicamente un modulo mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/esp/121


function borrarEsp(req, resp) {

    var espId = req.params.id;

    Esp.findById(espId, (err, esp) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: `no se encuentra el modulo con el id: ${espId}`
            });
        }
        if (!esp) {
            return resp.status(404).json({
                ok: false,
                message: 'no hay modulo para borrar'
            });
        }
        esp.remove((err) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    message: 'no se ha podido borrar el modulo esp'
                });
            }
            resp.status(200).json({
                ok: true,
                message: 'modulo borrado',
                modulo: esp
            })
        })

    });

}

/////////////////////////////////////////////////////
//
//metodo : PUT
// disableEsp: cambia de estado a false un modulo mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/esp-disable/121

function disableEsp(req, res) {

    // anular un modulo
    // en lugar de borrarlo cambiamos el estado

    let id = req.params.id

    Esp.findById(id, (err, espDB) => {

        if (err) { // colocando el return se sale y no sigue 
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!espDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'no existe usuario con ese ID'
                }
            });
        }

        espDB.estado = false;

        espDB.save((err, espDisable) => {

            if (err) { // colocando el return se sale y no sigue 
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.status(201).json({ // 201 es cuando se crea un nuevo registro
                ok: true,
                modulo: espDisable
            })
        });
    })
}


////////////////////////////////////////////////////////////////////
//
// metod GET
// buscarEsp busca modulos por termino (palabra clave)
//
/////////////////////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/esp/cocina

function buscarEsp(req, res) {

    let termino = req.params.termino;
    // mandamos una expresion regular para ser usada como filtro

    // RegExp es una funcion de js 
    // 'i' insensible a las mayus y minus

    let regex = new RegExp(termino, 'i');

    Esp.find({ tipo: regex })
        .exec((err, modulos) => {
            if (err) { // colocando el return se sale y no sigue 
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            res.json({
                ok: true,
                modulos
            })
        })

};

module.exports = {

    getEsp,
    crearEsp,
    updateEsp,
    borrarEsp,
    getEsps,
    buscarEsp,
    disableEsp,
    getMisEsps,
    cantidadDeModulos

}