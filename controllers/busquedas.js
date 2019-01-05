'use strict'

const Modulo = require('../models/modulos-esp') // importo el modelo 

const Control = require('../models/controles') // importo el modelo 

const Usuario = require('../models/usuarios') // importo el modelo 

const Hospital = require('../models/hospitales') // importo el modelo 

const Medico = require('../models/medicos') // importo el modelo 


/////////////////////////////////////////////////////
//
// busqueda especifica , busca por coleccion
// metodo GET
// buscarPorColeccion : busca por colleciion
//
/////////////////////////////////////////////////////

/// en usuarios , medicos , controles etc etc 
// hay busquedas  por cada coleccion ej : 
// en post man : http://localhost:3000/api/usuarios/juan

// aqui es por coleccion y por documento
// /api/busquedas/coleccion/:tabla/:bus
// se busca en la ruta api/busquedas/coleccion
// tabla es  la collecion : controles modulos clientes o usuarios
// bus es el string que buscamos : bidue esp clie usu etc etc
// en post man : http://localhost:3000/api/busquedas/coleccion/controles/bidue
// en post man : http://localhost:3000/api/busquedas/coleccion/modulos/esp
// en post man : http://localhost:3000/api/busquedas/coleccion/usuarios/us

function buscarPorColeccion(req, res) {

    // viene x los params de la url 
    let busqueda = req.params.bus;
    let tabla = req.params.tabla;

    // busqueda es el parametro de la url 
    //  'i' may y minus es insensible
    let regex = new RegExp(busqueda, 'i'); // aqui convertimos la busqueda con la ex regular

    let promesa;

    // busqueda contiene lo que busco 
    // ej : coleccion/usuarios/manuel  ===>>> colecccion/tabla/busqueda

    // pregunto por cada coleccion que viene en la tabla 
    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'controles':
            promesa = buscarControles(busqueda, regex);
            break;

        case 'modulos':
            promesa = buscarModulos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;  

        default:

            return res.status(400).json({
                ok: false,
                mensaje: 'los colecciones de busqueda solo son usuarios, modulos y controles',
                error: { message: 'tipo de coleccion/documento no valido' }
            })
    }

    // en ecma6 existe propiedades de obj computadas 
    // ponemos tabla entre [] y nos da su valor , que puede ser usuarios medicos hospitales 
    // si no lo ponemos entre [] imprime  tabla 

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })

};

/////////////////////////////////////////////////////
//
// busqueda general 
// metodo GET
// buscarAlgo : busca cualquier cosa en la base de datos 
// busca en todas las colecciones que queremos que busque
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/busquedas/todo/hospital
// en post man : http://localhost:3000/api/busquedas/todo/manu

function buscarAlgo(req, res) {

    // bus es lo que viene en la url y que esta declarado en el get 
    // la ruta es : 

    //api.get('/busquedas/todo/:bus', [verificaToken], BusquedaController.buscarAlgo);

    let busqueda = req.params.bus;
    let regex = new RegExp(busqueda, 'i'); //  es insensible a may y minus

    // Promise.all nos permite armar un array de promesas ejecutarlas 
    // y si todas responden sale por then 
    // busco en todas las colecciones que tengo 


    Promise.all([
        buscarModulos(busqueda, regex),
        buscarControles(busqueda, regex),
        buscarUsuarios(busqueda, regex),
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex)
    ])

    .then(respuestas => { // then recibe un array de respuestas para cada una de las promesas
        res.status(200).json({
            ok: true,
            modulos: respuestas[0],
            controles: respuestas[1],
            usuarios: respuestas[2],
            hospitales: respuestas[3],
            medicos: respuestas[4],
        });
    })
}

/// CUANDO USO EL  FIND , PUEDO PAGINAR

/// cuando recibo referencias cruzadas puedo popular , como por ejemplo en medicos y hospitales
// el populate me trasnforma  el id , al contenido que apnta
// busco en dos columnas en forma simultanea del usuario : nombre , email
function buscarModulos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Modulo.find({}, 'nombre tipo estado usuario') // envamos un obj vacio y buscamos por nombre enail y role 
            .or([{ 'nombre': regex }, { 'tipo': regex }]) // envio un array de condiciones , busco por dos tipos 
            .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones
            .exec((err, modulos) => {

                if (err) {
                    reject('error al cargar modulos', err)
                } else {
                    // modulos ira comno respuesta en el array respuesta[0]
                    resolve(modulos) // devuelve los modulos encontrados en el find
                }
            })
    });
}

function buscarControles(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Control.find({ nombre: regex })
            .populate('modulo', 'nombre tipo')
            .populate('usuario', 'nombre email')
            .exec((err, controles) => {

                if (err) {
                    reject('error al cargar controles', err)
                } else {
                     // controles ira comno respuesta en el array respuesta[1]
                    resolve(controles) // devuelve los modulos encontrados en el find
                }
            });
    });
}

// busco en dos columnas en forma simultanea del usuario : nombre , email
// lo hago con el metodo  .or, funcion del mongoose
function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

            // al poner 2do argumento , no traigo el pass
        Usuario.find({}, 'nombre email estado ') // enviamos un obj vacio y buscamos por nombre email  etc : es lo que quiero traer , es lo que va a mostrar 
            .or([{ 'nombre': regex }, { 'email': regex }]) // en cambio aqui envio un array de condiciones para buscar, busco por email y nombre
            .exec((err, usuarios) => {

                if (err) {
                    reject('error al cargar usuarios', err)
                } else {
                     //  usuarios ira como respuesta en el array respuesta[2]
                    resolve(usuarios) // devuelve los usuarios encontrados en el find
                }
            })
    });
}

function buscarHospitales(busqueda, regex){

    return new Promise((resolve, reject) => {

        Hospital.find({nombre: regex}) //  buscamos por nombre , al ser una sola columna  no pongo el .or ,  aqui traigo toda la info del hoatital , si quiero solo traer una parte pongo el sdo argumento 
            .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones
            .exec((err, hospitales) => {

                if (err) {
                    reject('error al cargar hospitales', err) // concateno el error 
                } else {
                     // hospitales ira como respuesta en el array respuesta[3]
                    resolve(hospitales) // devuelve los hospitales encontrados en el find
                }
            })
    });


}

function buscarMedicos(busqueda, regex){

    return new Promise((resolve, reject) => {

        Medico.find({nombre: regex}) // buscamos por nombre
        .populate('usuario', 'nombre email') // se pueden poner mas populate de otras colecciones  
        .populate('hospital', 'nombre ') // se pueden poner mas populate de otras colecciones
        .exec((err, medicos) => {

                if (err) {
                    reject('error al cargar medicos', err) // concateno el error 
                } else {
                     // hospitales ira como respuesta en el array respuesta[4]
                    resolve(medicos) // devuelve los medicos encontrados en el find
                }
            })
    });


}



module.exports = { buscarAlgo, buscarPorColeccion };