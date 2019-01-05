const {
    io
} = require('../server');
const {
    Participantes
} = require('../classes/participantes');
const {
    crearMensaje
} = require('../utilidades/utilidades')

const participantes = new Participantes(); // instancio la clase para ser usada


// comienzo a escuchar al participante
// client es el cliente , el server escucha al cliente 
// este cliente cada vez que se conecta tiene un ID que se lo da el socket

io.on('connection', (client) => {

    console.log('un participante nos dice que se ha conectado');

    client.on('entrarChat', (participante) => {

        console.log('mensaje recibido');
        console.log(participante);

        let partAgregado = participantes.agregarParticipantes(client.id, participante.mensaje)
        io.emit('entrarChat', {
            tipo: 'entrarChat',
            texto: partAgregado
        })
    });


    // el server escucha para saber cuando el esp se desconecta 
    client.on('disconnect', () => {

        console.log('un participante nos dice que se desconectado');

        let partBorrardo = participantes.borrarParticipante(client.id);
    });



    client.on('cambioTag', (mensaje) => {
        console.log('mensaje recibido', mensaje);

        io.emit('cambioTag', {
            tipo: 'cambioTag',
            texto: mensaje.mensaje
        })
    })

    client.on('nuevoTag', (mensaje) => {
        console.log('mensaje recibido', mensaje);

        io.emit('nuevoTag', {
            tipo: 'nuevoTag',
            texto: mensaje.mensaje
        })
    })

    client.on('cambioControl', (mensaje) => {
        console.log('mensaje recibido', mensaje);

        io.emit('cambioControl', {
            tipo: 'cambioControl',
            texto: mensaje.mensaje
        })
    })

    client.on('nuevoControl', (mensaje) => {
        console.log('mensaje recibido', mensaje);

        io.emit('nuevoControl', {
            tipo: 'nuevoControl',
            texto: mensaje.mensaje
        })
    })

    // mensajes privados 

    client.on('mensajePrivado', (mensaje) => {

        console.log('mensaje privado recibido', mensaje);

        let part = participantes.getParticipante(client.id)

        console.log(part.nombre);
        console.log(mensaje.mensaje);
        client.broadcast.to(mensaje.para).emit('mensajePrivado', crearMensaje(part.nombre, mensaje.mensaje))

    });

})