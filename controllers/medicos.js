'use strict'


let Medico = require('../models/medicos'); // cargamos el modelo


// req es lo que recibe la callback
// si al parametro lo terminamos con ? es opcional y en el nav te deja pasasr sin el nombre
// el metodo recibe una req y uns res
//la req es lo que recibe en la peticion del usuario  , y res es lo que responde 


/////////////////////////////////////////////////////
//
// metodo GET
// getMedico : obtener el medico mediante su Id
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/medico/123


function getMedico(req, resp) {

    let getMedicoId = req.params.id;

    Medico.findById(getMedicoId)
        .populate('usuario', 'nombre email imagen')
        .populate('hospital')
        .exec((err, medico) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'error al buscar medico'
                
            });
        }
        if (!medico) {
            return resp.status(404).json({
                ok: false,
                mensaje: `no se encuentra el medico con el id: ${getMedicoId}`
             
            });
        }
        resp.status(200).json({
            ok: true,
            mensaje: 'medico encontrado',
            medico: medico
        })
    });
}

//////////////////////////////////////////////////
//
// metodo : GET
// getMedicos: obtenemos todos los medicoes de la base con parametros opcionales desde, hsta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/medicos


function getMedicos(req, resp) {

    // los query son los optativos en la url 

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(5);

    // el err y usuarios pueden ir dentro de este () con un {} en caso que los 
     // metodos skip limit y sort no existan ... van ahora en .exec

     // el segundo parametro es lo que quiero traer  mombre imagen   etc etc 
     // no traigo  el password 

      // el populate puede tener dos campos uno el usuario que lo creo ( la ref usuario en los models )
     // y el otro lo que quiero de ese usuario
    Medico.find({}, 'nombre imagen ') 
       .populate('usuario','nombre email')
       .populate('hospital') // me interesan todos los campos
        .skip(desde)
        .limit(hasta)
        .sort('-nombre')
        .exec((err, medicos) => {

            if (err) {
                return resp.status(500).json({ // internal error server
                    ok: false,
                    mensaje: 'error en base de datos de medicos',
                    error: err
                })
            }
            if (!medicos) {
                return resp.status(404).json({ // not found
                    ok: false,
                    mensaje: 'no hay medicos en la base de datos'
                })
            }
            Medico.countDocuments({}, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    medicos: medicos,
                    total: conteo
                })
            })

        });
};



/////////////////////////////////////////////////////
//
// metodo POST
// crearMedico: crea y guarda un usuario por el metodo post
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/medico
// en el body llenamos distintas key y values en formato urlencoded

// para obtener la informacion la vamos a codificar en x-wwww-form-urlencoded en el cliente
// y para obtener los datos que se envian desde el cliente 
// pero existe una lib que toma la info se envia  y crea un obj de js : body-parser que es un middle


function crearMedico(req, resp) {


    console.log("estamos creando un medico");
    // metodo post ... que llegan por body
    let params = req.body;

    // imagen  estado  tiene defalut en el modelo 
    let medico = new Medico({ // new Usuario hace ref al modelo

        nombre: params.nombre,
        usuario: req.usuario._id, // guardamos el id del usuario que lo creo
        hospital: params.hospital // recibimos del body todo el hospital 
    });

    medico.save((err, medicoDB) => {

        if (err) { // colocando el return se sale y no sigue 
            return resp.status(400).json({ // bad request
                ok: false,
                mensaje: 'error al crear un medico',
                error: err
            });
        }

        if (!medicoDB) {
            return resp.status(404).json({ // not found 
                ok: false,
                mensaje: 'no se pudo crear el medico',
            });
        }
        resp.status(201).json({ // recurso creado
            ok: true,
            medico: medicoDB,
            usuarioCreador: req.usuario // es el usuario que esta en el token 
        })
    });

};

/////////////////////////////////////////////////////
//
// metodo PUT
// updateMedico: actualiza y guarda un medico por el metodo put , mediante id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/medico/121
// en el body llenamos distintas key y values en formato urlencoded

function updateMedico(req, resp) {
    // metodo put  ...llega por body

    let update = req.body;
    let medicoId = req.params.id;

    Medico.findById(medicoId, (err, medicoDB) => {

        if (err) {
            return resp.status(500).json({ // internal server
                ok: false,
                mensaje: 'el medico con el id' + medicoId + 'no existe',
                errors: err
            })
        }

        if (!medicoDB) {
            return resp.status(400).json({ // bad request
                ok: false,
                mensaje: 'no se pudo actualizar el medico con el id :' + medicoId
            });
        }
        medicoDB.nombre = update.nombre;
        medicoDB.usuario = req.usuario._id; // modificamos el id del usuario que lo modifico 
        medicoDB.hospital = update.hospital // recibimos del body todo el hospital 

        medicoDB.save((err, medicoUpdated) => {

            if (err) {
                return resp.status(400).json({ // bad request
                    ok: false,
                    mensaje: 'error al actualizar el medico',
                    error: err
                });
            }
            resp.status(200).json({ // OK
                update: true,
                medico: medicoUpdated
            });
        });

    });
}

/////////////////////////////////////////////////////
//
// metodo DELETE
// borrarMedico: borra fisicamente el usuario por metodo delete mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/medico/121

function borrarMedico(req, resp) {

    var medicoId = req.params.id;

    Medico.findById(medicoId, (err, medico) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: `no se encuentra el medico con el id: ${medicoId}`
            });
        }
        if (!medico) {
            return resp.status(404).json({
                ok: false,
                mensaje: 'no hay medico para borrar'
            });
        }
        medico.remove((err) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'no se ha podido borrar el medico'
                });
            }
            resp.status(200).json({
                ok: true,
                mensaje: 'medico borrado',
                medico: medico
            })
        })

    });
};


////////////////////////////////////////////////////////////////////
//
// metod GET
// buscarMedicos busca medicos por termino (palabra clave)
//
/////////////////////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/medicos/santollani

function buscarMedicos(req, resp) {

    let termino = req.params.termino;
    // mandamos una expresion regular para ser usada como filtro

    // RegExp es una funcion de js 
    // 'i' insensible a las mayus y minus

    let regex = new RegExp(termino, 'i');

    Medico.find({ nombre: regex })
        .exec((err, medicos) => {
            if (err) { // colocando el return se sale y no sigue 
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'error en base de datos de medicos',
                    error: err
                });
            }
            resp.json({
                ok: true,
                medicos
            })
        })

};

module.exports = {

    getMedico,
    crearMedico,
    updateMedico,
    borrarMedico,
    getMedicos,
    buscarMedicos
};