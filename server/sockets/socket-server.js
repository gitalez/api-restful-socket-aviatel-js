const { io } = require('../server');// io es el servidor del socket

console.log('esperando que alguien se conecte por socket');

io.on('connection', (client) => {

   console.log('un cliente se conecto');


   client.on('disconnect', () =>{

         console.log('cliente desconectado');

         

   })

   client.on('mensaje',(mensaje)=>{
      console.log(mensaje);

      // emito al cliente  client el evento mensaje-nuevo 
      // cuyo contenido es lo que recibimos en el mensaje 
      io.emit('mensaje-nuevo',mensaje)

})


});// end del io.on

