
class Usuarios {
    constructor() {
        this.grupo = [];
    }

    //Métodos
    agregarUsuario(id, nombre, sala) {
        let usuario = { id, nombre, sala };
        this.grupo.push(usuario);
        return this.grupo;
    }

    getUsuario(id) {
        let usuario = this.grupo.filter(user => user.id === id)[0];
        return usuario;
    }

    getUsuariosEnSala(salaUsuario) {
        let sala = this.grupo.filter(s => s.sala === salaUsuario);
        return sala;
    }

    getGrupo() {
        return this.grupo;
    }

    getUsuariosPorSala(sala) {
        return sala;
    }

    borrarUsuario(id) {
        let usuarioBorrado = this.getUsuario(id);
        this.grupo = this.grupo.filter(user => user.id !== id);
        return usuarioBorrado;
    }
}


module.exports = {
    Usuarios
}