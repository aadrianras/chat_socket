const socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    //Despues de enviar el error el usuario sera redireccionado a la pagina de registro
    window.location = 'index.html';
    throw new Error('El nombre es necesario para ingresar en las salas');
}

//Recibimos el nombre desde el objeto window, en la barra de navegacion ?nombre=NOMBRE
let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function () {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function (resp) {
        console.log('Usuarios conectados: ', resp);
    });
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');

});

//Este codigo sera utilizado para que un usuario envie un mensaje a todos
//socket.emit('crearMensaje', { usuario.nombre, 'hola a todos'}));


// Notifica en el chat cuando un usuario se conecta, desconencta y cuantos usuarios existen el grupo
socket.on('crearMensaje', function (mensaje) {
    console.log('Servidor:', mensaje);
});


//Mensajes privados

socket.on('mensajePrivado', function (mensaje) {
    console.log('Mensaje Privado: ', mensaje);
})