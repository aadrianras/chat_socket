

let params2 = new URLSearchParams(window.location.search);

//Referencias de JQUERY
let divUsuarios = $('#divUsuarios');
let formEnviar = $('#formEnviar');
let txtMensaje = $('#txtMensaje');
let nombre = params2.get('nombre');
let sala = params2.get('sala');
let divChatbox = $('#divChatbox');
let nombre_sala = $('#nombre_sala');


//Funciones para renderizar los usuarios que se encuentran en la sala
function renderizarUsuarios(usuariosEnSala) {


    let html = '';

    html += `
    <li>
        <a href="javascript:void(0)" class="active"> Chat de <span>${sala}</span></a>
    </li>
    `;

    for (let i = 0; i < usuariosEnSala.length; i++) {
        let usuarioHTML = `
        <li>
            <a data-id=${usuariosEnSala[i].id} href="javascript:void(0)">
                <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> 
                <span>${usuariosEnSala[i].nombre} <small class="text-success">online</small></span>
            </a>
        </li>    
    `;

        html += usuarioHTML;
    }
    //Cambiamos el nombre de la sala
    let htmlNombre = '';
    htmlNombre = `
    <h3 class="box-title">Sala de chat: <small>${sala}</small></h3>
    `;

    nombre_sala.html(htmlNombre);
    divUsuarios.html(html);
}

//Renderizamos cada mensaje enviado
function renderizarMensaje(mensaje) {

    //Normalizamos la hora
    let fecha = new Date(mensaje.fecha);
    let hora = `${fecha.getHours()}:${fecha.getMinutes()}`;
    let adminClass = mensaje.nombre === 'Administrador' ? 'danger' : 'info';

    let html = '';
    if (mensaje.nombre === nombre) {
        html += `
        <li class="reverse animated fadeInDown">
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-img">
                <img src="assets/images/users/5.jpg" alt="user" />
            </div>
            <div class="chat-time">${hora}</div>
        </li>        
        `;
    } else {
        html += `
        <li class="animated fadeInDown">
            <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />
            </div>
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${hora}</div>
        </li>  
        
        `;
    }
    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    let newMessage = divChatbox.children('li:last-child');

    // heights
    let clientHeight = divChatbox.prop('clientHeight');
    let scrollTop = divChatbox.prop('scrollTop');
    let scrollHeight = divChatbox.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


///Event Listener

divUsuarios.on('click', 'a', function () {
    let id = $(this).data('id');
    if (id) console.log(id);
});

formEnviar.on('submit', function (e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    console.log(txtMensaje.val())
    socket.emit('crearMensaje', { nombre: nombre, mensaje: txtMensaje.val() }, function (respCb) {
        txtMensaje.val('').focus();
        console.log('Respuesta en el callback: ', respCb);
        renderizarMensaje(respCb);
        scrollBottom();
    });

})