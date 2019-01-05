"use strict"

const fs = require('fs'); // nos sirve para borrar archivos y verificar si el path existe

const path = require('path'); // nos resuelve el path en donde estamos


// opciones x default 

/////////////////////////////////////////////////////
//
// metodo GET
// imgUpload : obtiene una imagen de una coleccion como usuario
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/img/tipo/img
// usamos form data = file  en el postman
// usamos dos parametros el tipo que seria la coleccion
// img seria : el nonmbre completo del archivo de la imagen , previamente subida por upload


function imgUpload(req, res) {


    let tipo = req.params.tipo;
    let img = req.params.img;

    // cargamos un path para ver si la imagen existe 
    // dirname contiene toda la ruta donde estoy en este 
    //momento independiente si estoy en local o en un host como heroku


    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen) // envio al cliente/ postman  el path de la imagen
    } else { 
        // no existe , regresamos el noimg
        // obtenmos el path no image
        let pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg'); // existe en  la api 
        res.sendFile(pathNoImagen);
    }

}

module.exports = {

    imgUpload

};