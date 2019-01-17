'use strict'


let Hospital = require('../models/hospitales'); // cargamos el modelo


// req es lo que recibe la callback
// si al parametro lo terminamos con ? es opcional y en el nav te deja pasasr sin el nombre
// el metodo recibe una req y uns res
//la req es lo que recibe en la peticion del usuario  , y res es lo que responde 


/////////////////////////////////////////////////////
//
// metodo GET
// getHospital : obtener el hospital mediante su Id
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/hospital/123


function getHospital(req, resp) {

    let getHospitalId = req.params.id;

    Hospital.findById(getHospitalId)
    .populate('usuario', 'nombre imagen email')
    .exec((err, hospital) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'error al buscar hospital'
                
            });
        }
        if (!hospital) {
            return resp.status(404).json({
                ok: false,
                mensaje: `no se encuentra el hospital con el id: ${getHospitalId}`
               
            });
        }
        resp.status(200).json({
            ok: true,
            mensaje: 'hospital encontrado',
            hospital: hospital
        })
    });
}

//////////////////////////////////////////////////
//
// metodo : GET
// getHospitales: obtenemos todos los hospitales de la base con parametros opcionales desde, hsta
//
/////////////////////////////////////////////////////
//http: //localhost:3000/api/hospitales


function getHospitales(req, resp) {

    // los query son los optativos en la url 

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(5);

    // el err y usuarios pueden ir dentro de este () con un {} en caso que los 
     // metodos skip limit y sort no existan ... van ahora en .exec

     // el segundo parametro  en el find es lo que quiero traer :   mombre imagen  etc etc 
     // no traigo  el password 
     // el populate puede tener dos campos uno el usuario que lo creo ( la ref usuario en los models )
     // y el otro lo que quiero de ese usuario
    Hospital.find({}, 'nombre imagen') 
       .populate('usuario', 'nombre email') // este populate nos da la info del usuario que lo creo 
        .skip(desde)
        .limit(hasta)
        .sort('-nombre')
        .exec((err, hospitales) => {

            if (err) {
                return resp.status(500).json({ // internal error server
                    ok: false,
                    mensaje: 'error en base de datos de hospitales',
                    error: err
                })
            }
            if (!hospitales) {
                return resp.status(404).json({ // not found
                    ok: false,
                    mensaje: 'no hay hospitales en la base de datos'
                })
            }
            Hospital.countDocuments({}, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                })
            })

        });
};



/////////////////////////////////////////////////////
//
// metodo POST
// crearHospital: crea y guarda un usuario por el metodo post
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/hospital
// en el body llenamos distintas key y values en formato urlencoded

// para obtener la informacion la vamos a codificar en x-wwww-form-urlencoded en el cliente
// y para obtener los datos que se envian desde el cliente 
// pero existe una lib que toma la info se envia  y crea un obj de js : body-parser que es un middle


function crearHospital(req, resp) {


    console.log("estamos creando un hospital");
    // metodo post ... que llegan por body
    let params = req.body;

    // imagen  estado  tiene defalut en el modelo 
    let hospital = new Hospital({ // new Usuario hace ref al modelo

        nombre: params.nombre,
        usuario: req.usuario._id // guardamos el id del usuario que lo guardo 

    });

    hospital.save((err, hospitalDB) => {

        if (err) { // colocando el return se sale y no sigue 
            return resp.status(400).json({ // bad request
                ok: false,
                mensaje: 'error al crear un hospital',
                error: err
            });
        }

        if (!hospitalDB) {
            return resp.status(404).json({ // not found 
                ok: false,
                mensaje: 'no se pudo crear el hospital',
            });
        }
        resp.status(201).json({ // recurso creado
            ok: true,
            hospital: hospitalDB,
            usuarioCreador: req.usuario // es el usuario que esta en el token 
        })
    });

};

/////////////////////////////////////////////////////
//
// metodo PUT
// updateHospital: actualiza y guarda un hospital por el metodo put , mediante id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/hospital/121
// en el body llenamos distintas key y values en formato urlencoded

function updateHospital(req, resp) {
    // metodo put  ...llega por body

    let update = req.body;
    let hospitalId = req.params.id;

    Hospital.findById(hospitalId, (err, hospitalDB) => {

        if (err) {
            return resp.status(500).json({ // internal server
                ok: false,
                mensaje: 'el hospital con el id' + hospitalId + 'no existe',
                errors: err
            })
        }

        if (!hospitalDB) {
            return resp.status(400).json({ // bad request
                ok: false,
                mensaje: 'no se pudo actualizar el hospital con el id :' + hospitalId
            });
        }
        hospitalDB.nombre = update.nombre;
        hospitalDB.usuario = req.usuario._id; // modificamos el id del usuario que lo modifico 
       
        hospitalDB.save((err, hospitalUpdated) => {

            if (err) {
                return resp.status(400).json({ // bad request
                    ok: false,
                    mensaje: 'error al actualizar el hospital',
                    error: err
                });
            }
            resp.status(200).json({ // OK
                update: true,
                hospital: hospitalUpdated
            });
        });

    });
}

/////////////////////////////////////////////////////
//
// metodo DELETE
// borrarHospital: borra fisicamente el usuario por metodo delete mediante su id
//
////////////////////////////////////////////////////
// en postman http://localhost:3000/api/hospital/121

function borrarHospital(req, resp) {

    var hospitalId = req.params.id;

    Hospital.findById(hospitalId, (err, hospital) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: `no se encuentra el hospital con el id: ${hospitalId}`
            });
        }
        if (!hospital) {
            return resp.status(404).json({
                ok: false,
                mensaje: 'no hay hospital para borrar'
            });
        }
        hospital.remove((err) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'no se ha podido borrar el hospital'
                });
            }
            resp.status(200).json({
                ok: true,
                mensaje: 'hospital borrado',
                hospital: hospital
            })
        })

    });
};


////////////////////////////////////////////////////////////////////
//
// metod GET
// buscarHospitales busca hospitales por termino (palabra clave)
//
/////////////////////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/hospitales/santollani

function buscarHospitales(req, resp) {

    let termino = req.params.termino;
    // mandamos una expresion regular para ser usada como filtro

    // RegExp es una funcion de js 
    // 'i' insensible a las mayus y minus

    let regex = new RegExp(termino, 'i');

    Hospital.find({ nombre: regex })
        .exec((err, hospitales) => {
            if (err) { // colocando el return se sale y no sigue 
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'error en base de datos de hospitales',
                    error: err
                });
            }
            resp.json({
                ok: true,
                hospitales
            })
        })

};

module.exports = {

    getHospital,
    crearHospital,
    updateHospital,
    borrarHospital,
    getHospitales,
    buscarHospitales
};