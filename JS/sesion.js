/* ========================================
   Maneja la sesión del usuario globalmente
   ======================================== */

/* ========================================
   OBTENER USUARIO AUTENTICADO
   ======================================== */
// Función que devuelve el usuario actualmente autenticado
function obtenerUsuarioAutenticado() {
    const usuarioJSON = localStorage.getItem('usuarioActual');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

/* ========================================
   VERIFICAR SI USUARIO ESTÁ AUTENTICADO
   ======================================== */
// Devuelve true si hay usuario autenticado, false si no
function estaAutenticado() {
    return obtenerUsuarioAutenticado() !== null;
}

/* ========================================
   VERIFICAR SI EL USUARIO ES ADMINISTRADOR
   ======================================== */
// Devuelve true si el usuario autenticado es admin
function esAdministrador() {
    const usuario = obtenerUsuarioAutenticado();
    return usuario !== null && usuario.rol === 'admin';
}

/* ========================================
   VERIFICAR SI EL USUARIO ES ESTUDIANTE
   ======================================== */
// Devuelve true si el usuario autenticado es estudiante
function esEstudiante() {
    const usuario = obtenerUsuarioAutenticado();
    return usuario !== null && usuario.rol === 'estudiante';
}

/* ========================================
   OBTENER ROL DEL USUARIO ACTUAL
   ======================================== */
// Devuelve el rol del usuario autenticado o null si no hay usuario
function obtenerRolUsuario() {
    const usuario = obtenerUsuarioAutenticado();
    return usuario ? usuario.rol : null;
}

/* ========================================
   OBTENER USUARIO DEL LOCALSTORAGE POR CÉDULA
   ======================================== */
// Busca un usuario específico en la base de datos
function obtenerUsuarioPorCedula(cedula) {
    const usuariosJSON = localStorage.getItem('usuariosEcoPuntos');
    const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];
    return usuarios.find(u => u.cedula === cedula);
}

/* ========================================
   OBTENER TODOS LOS USUARIOS
   ======================================== */
// Devuelve la lista completa de usuarios registrados
function obtenerTodosLosUsuarios() {
    const usuariosJSON = localStorage.getItem('usuariosEcoPuntos');
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

/* ========================================
   OBTENER USUARIOS POR ROL
   ======================================== */
// Devuelve todos los usuarios con un rol específico ('admin' o 'estudiante')
function obtenerUsuariosPorRol(rol) {
    const usuarios = obtenerTodosLosUsuarios();
    return usuarios.filter(u => u.rol === rol);
}

/* ========================================
   ACTUALIZAR ECO-PUNTOS DEL USUARIO ACTUAL
   ======================================== */
// Aumenta o disminuye los eco-puntos del usuario autenticado
// Ejemplo: actualizarEcoPuntos(10) suma 10 puntos
// Ejemplo: actualizarEcoPuntos(-5) resta 5 puntos
// Funciona con CUALQUIER usuario que esté autenticado
function actualizarEcoPuntos(cantidad) {
    const usuarioActual = obtenerUsuarioAutenticado();
    if (!usuarioActual) {
        console.warn('❌ No hay usuario autenticado. Inicia sesión primero.');
        return false;
    }

    // Obtener todos los usuarios
    const usuarios = obtenerTodosLosUsuarios();

    // Encontrar el usuario actual por cédula (identificador único)
    const usuarioIndex = usuarios.findIndex(u => u.cedula === usuarioActual.cedula);
    if (usuarioIndex === -1) {
        console.warn('❌ Usuario no encontrado en la base de datos');
        return false;
    }

    // Actualizar los eco-puntos
    usuarios[usuarioIndex].puntosActuales = (usuarios[usuarioIndex].puntosActuales || 0) + cantidad;
    usuarios[usuarioIndex].puntosTotales = (usuarios[usuarioIndex].puntosTotales || 0) + cantidad;
    
    // Evitar que los puntos actuales sean negativos
    if (usuarios[usuarioIndex].puntosActuales < 0) {
        usuarios[usuarioIndex].puntosActuales = 0;
    }

    // Recalcular nivel (300 puntos = 1 nivel)
    usuarios[usuarioIndex].nivel = Math.floor(usuarios[usuarioIndex].puntosTotales / 300) + 1;

    // Guardar cambios en localStorage
    localStorage.setItem('usuariosEcoPuntos', JSON.stringify(usuarios));
    
    // Actualizar también el usuario actual en sesión
    localStorage.setItem('usuarioActual', JSON.stringify(usuarios[usuarioIndex]));
    
    // Log de depuración
    console.log(`✅ ${usuarios[usuarioIndex].nombre} ahora tiene ${usuarios[usuarioIndex].puntosActuales} eco-puntos`);
    
    // Emitir evento personalizado para que otras páginas se enteren
    window.dispatchEvent(new CustomEvent('ecoPuntosActualizados', {
        detail: { 
            usuarioNombre: usuarios[usuarioIndex].nombre,
            nuevosPuntos: usuarios[usuarioIndex].puntosActuales,
            cantidadSumada: cantidad
        }
    }));

    return true;
}

/* ========================================
   CERRAR SESIÓN
   ======================================== */
// Elimina la sesión actual del usuario
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    
    // Redirigir a login después de 500ms
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

/* ========================================
   PROTEGER PÁGINA SOLO PARA ADMINISTRADORES
   ======================================== */
// Redirige a login si el usuario no es admin
function protegerPaginaAdmin() {
    const usuario = obtenerUsuarioAutenticado();
    
    if (!usuario) {
        localStorage.setItem('paginaAnterior', window.location.pathname);
        window.location.href = '../HTML/login.html';
        return false;
    }
    
    if (usuario.rol !== 'admin') {
        alert('⚠️ Esta página es solo para administradores');
        window.location.href = '../HTML/dashboard.html';
        return false;
    }
    
    return true;
}

/* ========================================
   PROTEGER PÁGINA SOLO PARA ESTUDIANTES
   ======================================== */
// Redirige a login si el usuario no es estudiante
function protegerPaginaEstudiante() {
    const usuario = obtenerUsuarioAutenticado();
    
    if (!usuario) {
        localStorage.setItem('paginaAnterior', window.location.pathname);
        window.location.href = 'autenticacion.html';
        return false;
    }
    
    if (usuario.rol !== 'estudiante') {
        alert('⚠️ Esta página es solo para estudiantes');
        window.location.href = 'admin.html';
        return false;
    }
    
    return true;
}

/* ========================================
   PROTEGER PÁGINA PARA USUARIOS AUTENTICADOS
   ======================================== */
// Redirige a login si no hay usuario autenticado (sin importar el rol)
function protegerPagina() {
    const usuario = obtenerUsuarioAutenticado();
    
    if (!usuario) {
        localStorage.setItem('paginaAnterior', window.location.pathname);
        window.location.href = 'autenticacion.html';
        return false;
    }
    
    return true;
}

/* ========================================
   INICIALIZACIÓN AUTOMÁTICA
   ======================================== */
// Se ejecuta cuando se carga cualquier página
window.addEventListener('DOMContentLoaded', () => {
    // Crear usuarios de prueba si no existen
    const usuariosJSON = localStorage.getItem('usuariosEcoPuntos');
    if (!usuariosJSON) {
        const usuariosPrueba = [
            {
                nombre: 'Juan Pérez',
                correo: 'juan.perez@utn.ac.cr',
                cedula: '123456789',
                password: '123456',
                rol: 'estudiante',
                nivel: 1,
                puntosTotales: 150,
                puntosActuales: 150,
                fechaRegistro: new Date().toISOString()
            },
            {
                nombre: 'Admin EcoCampus',
                correo: 'admin@utn.ac.cr',
                cedula: '999999999',
                password: 'admin123',
                rol: 'admin',
                nivel: 1,
                puntosTotales: 0,
                puntosActuales: 0,
                fechaRegistro: new Date().toISOString()
            }
        ];
        localStorage.setItem('usuariosEcoPuntos', JSON.stringify(usuariosPrueba));
        console.log('✅ Usuarios de prueba creados');
        console.log('');
        console.log('👤 ESTUDIANTE:');
        console.log('   Cédula: 123456789');
        console.log('   Contraseña: 123456');
        console.log('');
        console.log('⚙️ ADMINISTRADOR:');
        console.log('   Cédula: 999999999');
        console.log('   Contraseña: admin123');
    }

    // Verificar si hay usuario autenticado
    const usuarioActual = obtenerUsuarioAutenticado();
    
    if (usuarioActual) {
        console.log(`✅ Usuario autenticado: ${usuarioActual.nombre} (${usuarioActual.rol})`);
    }
});