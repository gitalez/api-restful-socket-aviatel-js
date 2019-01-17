// npm install jsonwebtoken --save

// la pagina  de inicio es :  , logueado con alz@aviatel.com
// https://developers.google.com/identity/sign-in/web/sign-in?refresh=1&pli=1#before_you_begin

// la pagina de la consola es : https://console.developers.google.com/apis/dashboard?project=mapasqr-1532043272200&authuser=0

// procedimiento
/// ir a oauth consent screen , y cambiar si se necesita

// crear credenciales  con 0authclientID seleccionar web application
// nombre autenticacion by google
// crear
// nos da client id  y el client secret

//444920625021-fb814pc5kobd282l3eqktch9m51dr7ti.apps.googleusercontent.com
//uim_AfL0koXjjfyucJBHG6X7

// ir al proyecto autenticacion by ggogle
// y colocar en autthorized javascript origins http://localhost:3000 y http://localhost://4200
// que son el backend y el front end

// para probar que funcione desde el lado del server , creamos un app llamada
// google-signin-demo
// ver este proyecto !!!!!!!

"use strict";

require("../config/config"); // al ser este el primer archivo lo va a ejecutar primero

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// como usamos los usuarios hacemos un require del modelo usuarios

const Usuario = require("../models/usuarios");

// google OAuth2cliente entre {} es una destructuracion , extrae del require solo eso
const { OAuth2Client } = require("google-auth-library");

//  del donfig:
const client = new OAuth2Client(CLIENT_ID);

//////////////////////////////////////////////////
//
//metodo POST
// login usuario por google
//
//////////////////////////////////////////////////
//postman : http://localhost:3000/api/login-usuario-google

async function verify(token) {
  // await retorna una promesa  de nuestra funcion async verify
  //que espera a que client.verifyIdToken() se resuelva para pasarlo a la var ticket
  // le dice quien es el cliente_id y el token google recibido
  // esta funcion retorna un error si el token no es valido , este error sera catcheado
  // por la funcion que lo llama
  const ticket = await client.verifyIdToken({
    idToken: token, // token de google
    audience: CLIENT_ID // del config
    // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload(); // tenemos la info del usuario
  // lo que da google
  return {
    nombre: payload.name,
    email: payload.email,
    imagen: payload.picture,
    google: true
  };
}
//////////// PROCESO /////////////
/*
recibimos una peticion de aut x ggogle 
en esa peticion viene un token de ggogle, generada en google a peticion del front end 
el front end envia ese token ggogle 
verifica si el token es valido 
 verificamos si con la funcion verify 
 si no es valido , termina 

 si es un token google valido : construye un payload con google = true  por medio de getpayload()
 que devuelve el obj payload en la var googleUser

 si es token google valido , buscamos en la base un email de usuario haciendo match con email y googleUser.mail
si encuentra el mail  puede que google sea true o false 

si google es false : lo pido que se registre por usuario y contraseña y salgo 

si google es true  : quiere decir que es un token google valido, que encontro su mail
genero un token de la api ( no  token de google) con el payload , la semilla y la caducidad
y se lo envio al cliente 


si no encuentra el mail , no existe  hay que crearlo 
genero un nuevo usuario : con su modelo y lo salvo con mongoose
luego genero un token  de la api ,(  no de google )


*/

async function loginUsuarioGoogle(req, resp) {
  let token = req.body.token; // token que viene del cliente

  var googleUser = await verify(token) // esta funcion regresa un usuario de google o un error si el token es invalido
    // si es invalido lo agarramos con un catch
    .catch(e => {
      return resp.status(403).json({
        ok: false,
        mensaje: "login usuario google token no valido"
      });
    });

  // tenemos un usuario con token ggogle valido salvado en la variable googleUser
  // buscamos si existe un usuario con ese email
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return resp.status(500).json({
        // internal server error
        ok: false,
        mensaje: "error en BD",
        errors: err
      });
    }
    if (usuarioDB) {
      // usuarioDB existe

      if (usuarioDB.google === false) {
        // si el usuario no ha sido autenticado por google
        return resp.status(400).json({
          // internal server error
          ok: false,
          mensaje:
            "debe autenticarse por su autentificacion de email y contraseña"
        });
      } else {
        // existe en usuarioBD autenticado por google
        // generamos el token
        var token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });

        // le enviamos al cliente el token generado aqui y otras cosas

        resp.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token, //le envio el token
          menu: obtenermenu(usuarioDB.role)
        });
      }
    } else {
      // usuarioDB no existe , hay que crearlo

      let usuario = new Usuario();
      usuario.imagen = googleUser.imagen;
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.estado = "activo";
      usuario.role = "consumer";
      usuario.google = true;
      usuario.password = ":)"; // esto es porque fue autenticado por google y no tiene contraseña

      usuario.save((err, usuarioDB) => {
        // generamos el token
        var token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });

        if (err) {
          // colocando el return se sale y no sigue

          return res.status(400).json({
            // bad request
            ok: false,
            mensaje: "login incorrecto , login no creado",
            error: err
          });
        }

        if (!usuarioDB) {
          return resp.status(404).json({
            // not found
            ok: false,
            mensaje: "usuario no encontrado, login no creado",
            error: err
          });
        }

        res.status(200).json({
          ok: true,
          message: "login correcto y usuario creado",
          usuario: usuarioDB,
          id: usuarioDB._id, // el _ es porque mongo se lo pone
          token: token,
          caducidad: process.env.CADUCIDAD_TOKEN,
          pass: usuarioDB.password,
          menu: obtenermenu(usuarioDB.role),
          solicitante: "google"
        });
      });
    }
  });
}

//////////////////////////////////////////////////
//
//metodo POST
// login  usuario normal
//////////////////////////////////////////////////
//postman : http://localhost:3000/api/login-usuario

function loginUsuario(req, resp) {
  console.log("estamos logueando usuarios");
  let body = req.body; // en el body viene el email

  //  en ({}) mientras el correo sea al body.email
  // significa encuentre el usuario cuyo email coincide con el body.email
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return resp.status(500).json({
        // internal server error
        ok: false,
        mensaje: "error en BD",
        errors: err
      });
    }

    if (!usuarioDB) {
      return resp.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas ,email", // en produccion quitar email
        errors: err
      });
    }

    // hasta aqui tenemos un correo valido

    // tenemos que comparar la contraseña ingresada

    // en usuarioDB.password tenemos la contraseña encriptada
    // en body.password nos la dieron sin encriptar
    // el metodo comparesync  encripta la del body y  la compara con las de DB

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return resp.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas, password", // quitar password en produccion
        errors: err
      });
    }

    // aqui podemos   generar el token  recordar que estamos del lado server
    // invocamos al metodo sign
    //colocamos la data como un objeto  , conocida como payload
    //luego una semilla que sera la clave secreta llamada seed
    // luego la fecha de expiracion
    // ver config

    // en usuarioDB viene el password , para que el password no sea parte del payload
    //lo cambiamos a una carita feliz

    usuarioDB.password = ":)";

    /// creamos el token

    // el payload es { usuario: usuarioDB }
    // la semilla key es process.env.SEED

    console.log("login", process.env.CADUCIDAD_TOKEN);
    var token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN
    });

    // le enviamos al cliente el token generado aqui y otras cosas

    resp.status(200).json({
      ok: true,
      mensaje: "login correcto",
      usuario: usuarioDB,
      id: usuarioDB._id, // el _ es porque mongo se lo pone
      token: token,
      caducidad: process.env.CADUCIDAD_TOKEN,
      pass: usuarioDB.password,
      menu: obtenermenu(usuarioDB.role)
    });
  });
}

//////////////////////////////////////////////////
//
//metodo  GET
//renovar token
//////////////////////////////////////////////////
//postman : http://localhost:3000/api/renovar-token

function renovarToken(req, resp) {
  /// creamos el nuevo token

  // el payload es { usuario: req.usuario }
  // la semilla key es process.env.SEED

  console.log("renovar", process.env.CADUCIDAD_TOKEN);
  var token = jwt.sign({ usuario: req.usuario }, process.env.SEED, {
    expiresIn: process.env.CADUCIDAD_TOKEN
  });

  // le enviamos al cliente el nuevo token generado aqui y otras cosas

  resp.status(200).json({
    ok: true,
    mensaje: "el token se ha renovado",
    //usuario: req.usuario,
    token: token
  });
}

function obtenermenu(role) {

    ////// super //////////

    var menu = [];

    var menuSuper = [
    {
      titulo: "aprendizaje",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: "Barra de progreso", url: "/progress" },
        { titulo: "Graficas", url: "/graficas1" },
        { titulo: "Promesas", url: "/promesas" },
        { titulo: "Obserbables", url: "/rxjs" },
        { titulo: "Hospitales", url: "/hospitales" },
        { titulo: "Medicos", url: "/medicos" }
      ]
    },
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu: [{ titulo: "Tablero", url: "/dashboard" }]
    },
    {
      titulo: "Mantenimiento",
      icono: "mdi mdi-folder-lock-open",
      submenu: [{ titulo: "Usuarios", url: "/usuarios" }]
    },
    {
      titulo: "Actividad",
      icono: "mdi mdi-message-text",
      submenu: [{ titulo: "Chat", url: "/chats" }]
    }
    
  ];

  /////////// admin //////////

  var menuAdmin = [
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu: [{ titulo: "Tablero", url: "/dashboard" }]
    },
    {
      titulo: "Mantenimiento",
      icono: "mdi mdi-folder-lock-open",
      submenu: [{ titulo: "Usuarios", url: "/usuarios" }]
    },
    {
    titulo: "Actividad",
    icono: "mdi mdi-message-text",
    submenu: [{ titulo: "Chat", url: "/chats" }]
  }

  ];

  ///// var menu consumer ///////////
  
  var menuConsumer = [
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu: [{ titulo: "Tablero", url: "/dashboard" }]
    }
  
  ];

  switch (role) {

        case 'super': {

            menu = menuSuper;
            break;
        }

        case 'admin' : {

            menu = menuAdmin;
            break
        }

        case 'admin' : {

            menu = menuConsumer;
            break;
        }
        default : {
            menu;
            break;
        }
  }

  return menu;
}

module.exports = {
  loginUsuario,
  loginUsuarioGoogle,
  renovarToken
};

// unshift lo pone al principio y push lo pone al final
//if(role === 'admin' || role === 'super') {
//menu[2].submenu.unshift({titulo: 'Usuarios', url: '/usuarios'});
//}
