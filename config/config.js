// el process esta corriendo en forma global en node
// el process es un objeto global que esta corriendo a lo largo de la app de node
// este obj es actualizado dependiendo del entorno donde esta corriendo 


// =============================
// puerto
//==============================

// si la entrega heroku es process.env.PORT
//si no existe el process.env.PORT va a ser = a 3000
process.env.PORT = process.env.PORT || 3000;

// =============================
// entorno
//==============================

// si process.env.Node_env no existe supongo que estoy en desarrollo
// esta  es de heroku 

//  process.env.NODE_ENV || 'dev'; esto significa  si process.env.node_env no existe supongo que estoy en desarrollo

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// vencimiento del token
//==============================

// 60 seg
// 60 min
// 24 horas
// 30 dias
// 1000 en ms 


process.env.CADUCIDAD_TOKEN = '7d';
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 1000; //  equivale a 1 mes

// =============================
// SEED  de autentificacion
//==============================

// si process.env.SEED no existe le paso el string
// sino la variable de entorno que defino en heroku ??
// la var de proceso SEED hay que declararla en heroku ??
process.env.SEED = process.env.SEED || '@este-es@-un-seed-@dificil';

// =============================
// identificacion google 
//==============================

// anterior  952677273135-r58h1ambi57rjf41ocktq70jea9kt01i.apps.googleusercontent.com
CLIENT_ID = '444920625021-fb814pc5kobd282l3eqktch9m51dr7ti.apps.googleusercontent.com'


// =============================
// bas de datos
//==============================

// para probar  que funcione en mlab comento el if 
var  urlDB

if (process.env.NODE_ENV === 'dev') {

    //urlDB = 'mongodb://localhost:27017/esp'; la que corria aviago

    urlDB = 'mongodb://localhost:27017/hospitalDB'; // es para ver como es hospitales 
} else {
    //urlDB = process.env.MONGO_URI;
    urlDB = 'mongodb://user-esp:123456esp@ds127342.mlab.com:27342/api-esp'
};

//mongodb://<dbuser>:<dbpassword>@ds125892.mlab.com:25892/api-esp
//urlDB = 'mongodb://api-esp:123456esp@ds125892.mlab.com:25892/api-esp';
// nos inventamos cualquier enviroment (process.env.URLDB) y lo ponemos en el connect de 
// mongoose en el server.js

process.env.URLDB = urlDB;
