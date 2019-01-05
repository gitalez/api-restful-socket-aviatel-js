const { io } = require('../server');


io.on('connection', (client) => {
    console.log('conectado');

    ////////////////// de aqui hasta mas alla era de la app anterior /////////////////

    client.on('disconnect', function() {
        // io.emit('usuario', {
        //    user: client.nickname,
        //   event: 'left'
        //  })

        console.log('user left');
    });
});




// client es el cliente , el server escucha al cliente 
// este cliente cada vez que se conecta tiene un ID que se lo da el socket

// la cte ChatMessage es la referencia al contenido del modelo que esta en chat-message
//const ChatMessage = require('../../models/chat-message');




/*

io.on('connection', (client) => {
    console.log('conectado');

    ////////////////// de aqui hasta mas alla era de la app anterior /////////////////

    client.on('disconnect', function() {
        // io.emit('usuario', {
        //    user: client.nickname,
        //   event: 'left'
        //  })

        console.log('user left');
    });

    client.on('set-nickname', (nickname) => {

        client.nickname = nickname;
        io.emit('usuario', {
            user: nickname,
            event: 'joined'
        });

    });

    client.on('add-message', (message) => {

        // el server emite a todos los clientes que estan escuchando 
        io.emit('message', {
            text: message.text,
            from: client.nickname,
            created: new Date()
        });
    });

    //////// termina mas alla //////////////////////////////////////

    // escucha quien se unio 
    client.on('join:room', (chatId) => {

        console.log('join:room', chatId);
        client.join(chatId) // el metodo join mete en un array todos los id que estan conectados 

    });

    // escuchamos un mensaje del cliente y lo guardamos en DB

    client.on('send:chatmessage', (data) => {

        var newMessage = new ChatMessage();

        // lo que viene en data lo pone el cliente
        newMessage.chatId = data.chatId; // el id del grupo
        newMessage.message = data.message; // el cuerpo del mensaje 
        newMessage.from = data.from; // quien lo envia

        // salvamos en la base de datos a newMessage
        // como newMessage es un modelo de schema de mongo , puedo acceder a los metodos de mongoose

        newMessage.save((err, msgStored) => {

            if (err) {

                console.log('error al guardar el mensaje');
                return

            };

            if (!msgStored) {

                console.log('error 404');
                return
            };

            //  re - emitimos el mensaje con el metodo to , que es personalizado 
            // chatId el id del grupo
            // lo re enviamos a quien lo envio 

            io.to(msgStored.chatId).emit('chatmessage', msgStored);




        })
    });


});


new ChatMessage instancia el modelo Chatmessage :

  from: {
        type: String
    },
    message: {
        type: String
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'ChatGroup'
    },

  */
