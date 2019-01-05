// usamos la libreria file-upload
// npm install --save express-fileupload
//  lo siguiente esta definido en app.js
//  const fileUpload = require('express-fileupload')
//  app.use(fileUpload());

'use strict'

const fs = require('fs'); // nos sirve para borrar archivos

const Usuario = require('../models/usuarios');
const Hospital = require('../models/hospitales');
const Medico = require('../models/medicos');

/////////////////////////////////////////////////////
//
// metodo PUT
// upload : subir imagenes de usuarios , tambien cualquiera otra 
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/upload/tipo/id
// usamos form data = file  , en el postman 
// usamos dos parametros el tipo  ( coleccion) que seria el usuario, medico etc 
//  y el id  : es el id que va en la url , es el id a quien le pertenece el file 
// en el postman para probar ponemos imagen como  key y en file seleccionamos un file 

function upload(req, res) {


    console.log('estamos subiendo files');
    let tipo = req.params.tipo;
    let id = req.params.id;

    // tipos de colecciones validas para tener imagenes o files asociacos, creamos un array 

    let tiposValidos = ['usuarios','medicos','hospitales'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'coleccion no valida',
            errors: { message: 'las colecciones validas son: ' + tiposValidos.join(', ') }
        })
    }

    // file viene del form data, pregunto si vienen archivos  
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        })

    }
    // obtener nombre del archivo

    // en la variable archivo tenemos el contenido del archivo
    let archivo = req.files.imagen // imagen es el key que envia el cliente

    //separamos el nombre de la extension por el punto
    // separo todos los caracteres por el punto 
    let nombreCortado = archivo.name.split('.'); // name es el nombre que viene con el file
    
    // en extensionArchivo tenemos el pito de archivo que nos envian : png jpg pdf 
    let extensionArchivo = nombreCortado[nombreCortado.length - 1]; // la extension esta en la ultima posicion del array

    // solo estas extensiones aceptamos , formamos un array

    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    // validamos con indexof,  propiedad de los arrays 

    if (extensionesValidas.indexOf(extensionArchivo) < 0) { // si es menor que cero , no encuentra la extension

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'las extensiones validas son: ' + extensionesValidas.join(', ')}// unidas por una coma y un espacio
        })

    }
    // hasta aqui validamos la extension

    // nombre de archivo personalizado

    // queremos que el nombre del archivo imagen sea 
    //el id del tipo (coleccion) ej : usuario - un random y la extension
    // el nro ramdon previene el cache del navegador , tomamos como ramdon los milisegundos

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`; // con los ms de la fecha construimos el nro ramdon

    // mover el archivo a un path especifico

    // creamos en el proyecto el folder uploads
    // y dentro de ella mas  carpetas : usuarios medicos , hospitales etc 
    // en esas carpetas colocamos sus imagenes
    // ./uploads es el folder creado 
    // tipo es la coleccion
    // nombre archivo es el generado

    let path = `./uploads/${tipo}/${nombreArchivo}`;

    // muevo el archivo al path creado
    //mv quiere decir que tengo en la carpeta uploads/${tipo} un file que pertenece a alguien 
    archivo.mv(path, err => { // mv es un metodo de fileupload express

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
    });

    subirFilePorTipo(tipo, id, nombreArchivo, res);
}

// funcion que sube imagenes por tipo (usuario, medico  etc )
// le pasamos res para darle la respuesta json al cliente 
// id es el id a quien le pertenece el file que estamos guargdando en el folder uploads
function subirFilePorTipo(tipo, id, nombreArchivo, res) {

    // validamos 
    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuarioDB) => {

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: ' usuario no existe'
                })
            }

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: ' no se puedo actualizar Imagen de usuario',
                    err
                })
            }

            let pathViejo = './uploads/usuarios/' + usuarioDB.imagen;
            console.log(pathViejo);


            if (fs.existsSync(pathViejo)) {

                // si existe el path  lo borro , para cargar la nueva imagen
                // es para tener una sola imagen por cada documento de la coleccion 
                fs.unlinkSync(pathViejo); 
            }

            usuarioDB.imagen = nombreArchivo; // le asignamos al usuario de la base de datos un nombre de archivo
            usuarioDB.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({ // internal error server
                        ok: false,
                        mensaje: 'error en base de datos de usuarios',
                        error: err
                    })
                }

                if (!usuarioActualizado) {
                    return res.status(404).json({ // not found
                        ok: false,
                        mensaje: 'no hay usuarios en la base de datos'
                    })
                }


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuarioActualizado
                });
            })
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospitalDB) => {

            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: ' hospital no existe'
                })
            }

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: ' no se puedo actualizar imagen del hospital',
                    err
                })
            }

            // hospitalDB.imagen es el campo reservado para la imagen en el modelo 
            let pathViejo = './uploads/hospitales/' + hospitalDB.imagen;

            console.log(pathViejo);

            if (fs.existsSync(pathViejo)) {
                // si existe lo borro , para cargar la nueva imagen
                // es para tener una sola imagen por cada documento de la coleccion 
                fs.unlinkSync(pathViejo); 
            }
            hospitalDB.imagen = nombreArchivo; // le asignamos al hospital de la base de datos un nombre de archivo
            hospitalDB.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({ // internal error server
                        ok: false,
                        mensaje: 'error en base de datos de hospitales',
                        error: err
                    })
                }
                if (!hospitalActualizado) {
                    return res.status(404).json({ // not found
                        ok: false,
                        mensaje: 'no hay hospitales en la base de datos'
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizado',
                    hospitalActualizado
                })
            })
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medicoDB) => {

            if (!medicoDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: ' medico no existe'
                })
            }

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: ' no se puedo actualizar imagen del medico',
                    err
                })
            }

            // medicoDB.imagen es el campo reservado para la imagen en el modelo 
            let pathViejo = './uploads/medicos/' + medicoDB.imagen;

            console.log(pathViejo);

            if (fs.existsSync(pathViejo)) {
                // si existe lo borro , para cargar la nueva imagen
                // es para tener una sola imagen por cada documento de la coleccion 
                fs.unlinkSync(pathViejo); 
            }
            medicoDB.imagen = nombreArchivo; // le asignamos al hospital de la base de datos un nombre de archivo
            medicoDB.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({ // internal error server
                        ok: false,
                        mensaje: 'error en base de datos de medicos',
                        error: err
                    })
                }
                if (!medicoActualizado) {
                    return res.status(404).json({ // not found
                        ok: false,
                        mensaje: 'no hay medicos en la base de datos'
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizado',
                    medicoActualizado
                })
            })
        });
    }

}

module.exports = {

    upload

};