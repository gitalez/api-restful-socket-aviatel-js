require('../config/config'); // al ser este el primer archivo lo va a ejecutar primero

const jwt = require('jsonwebtoken');

//===================
// verificar token
//===================

let verificaToken = (request, response, next) => {

    // leemos el headers de la peticion que nos llega del usuario
    // en el header de la peticion viene el token 
    // let token = request.get('token');
    // en el postman colocar el content type  application/x-www-form-urlencoded
    // y la clave authorization con el token correspondiente del cliente logueado

    //let token = request.headers.token;

    if (!request.headers.authorization) {
        console.log('cabecera inexistente');
        return response.status(403).json({
            ok: false,
            err: {
                mensaje: 'no posee la autorizacion necesaria'
            }
        });
    }

    // el token lo recibo en los headers 
    let token = request.headers.authorization;
    // le quitamos las comillas al token 
    //let token = request.headers.authorization.replace(char(34), char(39), '')

    //let token = request.body.token;
    /*
        try {

        }catch(ex){

            console.log(ex);
            return res.status(404).json({
                ok: false,
                message: 'token inconsistente'
            })
        }

    */
    console.log('este es el token recibido');
    console.log(token);

    // decoded contiene la info del usuario
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return response.status(401).json({ // no autorizado

                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        };

        request.usuario = decoded.usuario; // es el usuario que esta en el payload del token 
        //console.log(token);
        console.log(decoded.usuario);
        next();

    });

}

//===================================
// verificar AdminRole o super 
//==================================

let verificaAdmin_Role_Super = (request, response, next) => {

    let usuario = request.usuario;

    if (usuario.role === 'admin' || usuario.role === 'super') {
        next();
    } else {
        return response.json({

            ok: false,
            error: {
                message: 'este usuario no es administrador'
            }
        });
    };

};

//===================
// verificar SUPER
//===================

let verificaSuper = (request, response, next) => {

    let usuario = request.usuario;

    if (usuario.role === 'super') {

        next();

    } else {
        return response.json({

            ok: false,
            error: {
                message: 'este usuario no puede acceder a esta funcion'
            }
        });
    };

};


//===================
// verificar token para la imagen
//===================


let verificaTokenImg = (request, response, next) => {

    // leemos el headers de la peticion que nos llega del cliente 
    // en el header de la peticion viene el token 
    let token = request.query.token;
    // se lo devuelvo al cliente
    //response.json({
    //  token
    //  });


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return response.status(401).json({

                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        // decoded.usuario es el payload
        request.usuario = decoded.usuario;
        //console.log(token);
        next();
    });

};


module.exports = {

    verificaToken,
    verificaAdmin_Role_Super,
    verificaTokenImg,
    verificaSuper
}