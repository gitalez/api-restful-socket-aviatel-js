// hago una clase de los que participan en el socket

class Participantes {

    constructor() {

            this.participantes = []; // inic de un arreglo de modulos

        }
        // se agregan modulos que ingresan al socket
        // necesitamos el id y el nombre 
    agregarParticipantes(id, nombre) {

            // creo un participante

            let participante = { id, nombre }; //  son los que recibo como params 

            //  agrego el nuevo participante al arreglo de participantes
            this.participantes.push(participante);

            return this.participantes; // devuelvo todo el arreglo de participantes

        }
        // obtenmemos un participante por el id 

    getParticipante(id) {
        // filtramos  el array por su Id
        // filter regresa un nuevo arreglo 
        let participante = this.participantes.filter((participanteEncontrado) => {

            return participanteEncontrado.id === id
        })[0]; // si encuentra algo quiero que sea un unico registro , el primero
        return participante // retorno participante con el id deseado
            // o un undefined
    }

    // obtenemos todos los participantes del socket 

    getparticipantes() {
        return this.participantes;
    }

    // borramos un partipante del array x su id
    borrarParticipante(id) {
        // filtramos  el array por su Id
        // si lo encuentra lo borra 
        // filter regresa un nuevo arreglo sin el id que se dio

        // antes de borrarlos lo guardo para no perder la referencia 
        let participanteBorrado = this.getParticipante(id);

        // en this.participantes  es un nuevo arreglo sin el participante del id que se dio
        this.participantes = this.participantes.filter((participanteEncontrado) => {
            participanteEncontrado.id != id
        });

        return participanteBorrado; // retorno un participante borrado o un undefined
    }


}

module.exports = {

    Participantes
}