const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {


    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                ok: false,
                message: 'El nombre de usuario y la sala son obligatorias'
            })
        }

        //Agregamos al usuario a la sala de chat correspondiente
        client.join(usuario.sala, (err) => {
            if (err) {
                throw new Error('Error al ingresar a la sala');
            }
        });

        //Agregamos al nuevo usuario al grupo
        usuarios.agregarUsuario(client.id, usuario.nombre, usuario.sala);

        //Mostramos en consola el nombre del nuevo usuario
        console.log(`El usuario ${usuario.nombre} con el id: ${client.id} se conecto a la sala ${usuario.sala}`);
        //Retornamos la info del grupo con el nuevo usuario
        callback(usuarios.getUsuariosEnSala(usuario.sala));

        //Notificamos a todos los usuarios que un usuario ingreso a la sala
        const msg = `El usuario ${usuario.nombre} acaba ingresar a la Sala ${usuario.sala}`;
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', msg));


        //Agregamos al usuario en la lista del caht
        client.broadcast.to(usuario.sala).emit('listaUsuariosEnSala', usuarios.getUsuariosEnSala(usuario.sala));
    });


    //Recibe un mensaje y lo reenviar a todos los usuarios
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getUsuario(client.id);

        let msg = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', msg);

        callback(msg);
    })


    //Mensaje Privados
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getUsuario(client.id);
        let msg = crearMensaje(persona.nombre, data.mensaje);
        //Enviamos el mensaje privado a un solo usuario
        client.broadcast.to(data.id).emit('mensajePrivado', msg);
    })


    client.on('disconnect', () => {

        //Eliminamos al usuario del grupo
        let usuarioDesconectado = usuarios.borrarUsuario(client.id);



        //Mostramos en consola el nombre del usuario que se desconecto
        console.log(`El usuario ${usuarioDesconectado.nombre} abandono la sala`);



        //Notificamos a todos los usuarios que el usuario abandono el grupo
        const msg = `El usuario ${usuarioDesconectado.nombre} acaba de abandonar la sala`;
        client.broadcast.to(usuarioDesconectado.sala).emit('crearMensaje', crearMensaje('Administrador', msg));



        //Enviamos el nuevo grupo de la sala
        client.broadcast.to(usuarioDesconectado.sala).emit('listaUsuariosEnSala', usuarios.getUsuariosEnSala(usuarioDesconectado.sala));
    });


});
