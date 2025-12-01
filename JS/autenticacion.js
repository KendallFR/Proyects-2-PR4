/* ========================================
   INICIALIZACIÓN - CARGAR DATOS DE LOCALSTORAGE
   ======================================== */
window.addEventListener('DOMContentLoaded', () => {
    // Crear usuarios de prueba si no existen usuarios registrados
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

    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
        mostrarUsuarioAutenticado(JSON.parse(usuarioActual));
    }
});

/* ========================================
   REFERENCIAS AL DOM
   ======================================== */
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');
const userInfo = document.getElementById('userInfo');
const btnLogout = document.getElementById('btnLogout');

/* ========================================
   FUNCIONES DE ALTERNANCIA DE FORMULARIOS
   ======================================== */
// Muestra el formulario de inicio de sesión
btnLogin.addEventListener('click', () => {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    
    // Estilos de botones con Tailwind
    btnLogin.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    btnLogin.classList.add('bg-emerald-500', 'text-white');
    
    btnRegister.classList.remove('bg-emerald-500', 'text-white');
    btnRegister.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    
    limpiarMensajes();
});

// Muestra el formulario de registro
btnRegister.addEventListener('click', () => {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    
    // Estilos de botones con Tailwind
    btnRegister.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    btnRegister.classList.add('bg-emerald-500', 'text-white');
    
    btnLogin.classList.remove('bg-emerald-500', 'text-white');
    btnLogin.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    
    limpiarMensajes();
});

/* ========================================
   VALIDACIÓN DE CAMPOS
   ======================================== */
function validarCampoRequerido(valor, nombreCampo) {
    if (!valor.trim()) {
        return `${nombreCampo} es requerido`;
    }
    return '';
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return 'Email inválido';
    }
    return '';
}

function validarCedula(cedula) {
    if (!/^\d{9,}$/.test(cedula)) {
        return 'La cédula debe contener solo números (mínimo 9)';
    }
    return '';
}

function validarPassword(password) {
    if (password.length < 6) {
        return 'La contraseña debe tener mínimo 6 caracteres';
    }
    return '';
}

/* ========================================
   MANEJO DEL FORMULARIO DE REGISTRO
   ======================================== */
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('regNombre').value;
    const correo = document.getElementById('regCorreo').value;
    const cedula = document.getElementById('regCedula').value;
    const password = document.getElementById('regPassword').value;

    let errores = {};

    errores.nombre = validarCampoRequerido(nombre, 'Nombre');
    errores.correo = validarEmail(correo);
    errores.cedula = validarCedula(cedula);
    errores.password = validarPassword(password);

    const usuariosRegistrados = obtenerUsuariosDeLocalStorage();

    if (!errores.cedula && usuariosRegistrados.some(u => u.cedula === cedula)) {
        errores.cedula = 'Esta cédula ya está registrada';
    }

    if (Object.values(errores).some(e => e !== '')) {
        mostrarErroresRegistro(errores);
        return;
    }

    // Crear nuevo usuario SIEMPRE como estudiante
    const nuevoUsuario = {
        nombre,
        correo,
        cedula,
        password,
        rol: 'estudiante', // 🔒 Siempre estudiante al registrarse
        nivel: 1,
        puntosTotales: 0,
        puntosActuales: 0,
        fechaRegistro: new Date().toISOString()
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuariosEcoPuntos', JSON.stringify(usuariosRegistrados));
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));

    mostrarExito('Registro exitoso. Redirigiendo...');
    registerForm.reset();
    limpiarErroresRegistro();

    setTimeout(() => {
        redirigirAPaginaAnterior();
    }, 2000);
});

function mostrarErroresRegistro(errores) {
    const campos = {
        nombre: 'regNombre',
        correo: 'regCorreo',
        cedula: 'regCedula',
        password: 'regPassword'
    };

    for (let campo in campos) {
        const input = document.getElementById(campos[campo]);
        const errorSpan = document.getElementById(`reg${campo.charAt(0).toUpperCase() + campo.slice(1)}Error`);

        if (errores[campo]) {
            // Agregar borde rojo con Tailwind
            input.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
            input.classList.remove('border-slate-300', 'dark:border-slate-700');
            errorSpan.textContent = errores[campo];
            errorSpan.classList.add('show');
        } else {
            input.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
            input.classList.add('border-slate-300', 'dark:border-slate-700');
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
    }
}

function limpiarErroresRegistro() {
    document.querySelectorAll('#registerForm input').forEach(input => {
        input.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
        input.classList.add('border-slate-300', 'dark:border-slate-700');
    });
    document.querySelectorAll('#registerForm .error-message').forEach(span => {
        span.textContent = '';
        span.classList.remove('show');
    });
}

/* ========================================
   MANEJO DEL FORMULARIO DE LOGIN
   ======================================== */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cedula = document.getElementById('loginCedula').value;
    const password = document.getElementById('loginPassword').value;

    let errores = {};

    errores.cedula = validarCampoRequerido(cedula, 'Cédula');
    errores.password = validarCampoRequerido(password, 'Contraseña');

    if (Object.values(errores).some(e => e !== '')) {
        mostrarErroresLogin(errores);
        return;
    }

    const usuariosRegistrados = obtenerUsuariosDeLocalStorage();
    const usuario = usuariosRegistrados.find(u => u.cedula === cedula);

    if (!usuario) {
        mostrarErroresLogin({
            cedula: 'Cédula no encontrada',
            password: ''
        });
        return;
    }

    if (usuario.password !== password) {
        mostrarErroresLogin({
            cedula: '',
            password: 'Contraseña incorrecta'
        });
        return;
    }

    // ✅ Asegurar que el usuario tenga un rol definido
    if (!usuario.rol) {
        usuario.rol = 'estudiante';
        // Actualizar en localStorage
        const index = usuariosRegistrados.findIndex(u => u.cedula === cedula);
        usuariosRegistrados[index] = usuario;
        localStorage.setItem('usuariosEcoPuntos', JSON.stringify(usuariosRegistrados));
    }

    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    mostrarUsuarioAutenticado(usuario);
    mostrarExito('¡Inicio de sesión exitoso! Redirigiendo...');
    loginForm.reset();
    limpiarErroresLogin();

    setTimeout(() => {
        redirigirAPaginaAnterior();
    }, 2000);
});

function mostrarErroresLogin(errores) {
    const campos = ['cedula', 'password'];

    campos.forEach(campo => {
        const input = document.getElementById(`login${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
        const errorSpan = document.getElementById(`login${campo.charAt(0).toUpperCase() + campo.slice(1)}Error`);

        if (errores[campo]) {
            input.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
            input.classList.remove('border-slate-300', 'dark:border-slate-700');
            errorSpan.textContent = errores[campo];
            errorSpan.classList.add('show');
        } else {
            input.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
            input.classList.add('border-slate-300', 'dark:border-slate-700');
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
    });
}

function limpiarErroresLogin() {
    document.querySelectorAll('#loginForm input').forEach(input => {
        input.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
        input.classList.add('border-slate-300', 'dark:border-slate-700');
    });
    document.querySelectorAll('#loginForm .error-message').forEach(span => {
        span.textContent = '';
        span.classList.remove('show');
    });
}

/* ========================================
   FUNCIONES DE INTERFAZ
   ======================================== */
function mostrarExito(mensaje) {
    successMessage.textContent = mensaje;
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);
}

function limpiarMensajes() {
    successMessage.classList.remove('show');
}

function mostrarUsuarioAutenticado(usuario) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    document.querySelector('.grid').style.display = 'none'; // Ocultar botones de toggle

    document.getElementById('userNameDisplay').textContent = usuario.nombre;
    document.getElementById('userEmailDisplay').textContent = usuario.correo;
    document.getElementById('userCedulaDisplay').textContent = usuario.cedula;
    document.getElementById('userLevelDisplay').textContent = usuario.nivel || 1;
    document.getElementById('userTotalPointsDisplay').textContent = usuario.puntosTotales || 0;
    document.getElementById('userCurrentPointsDisplay').textContent = usuario.puntosActuales || 0;

    // Mostrar el rol del usuario
    const rolDisplay = document.getElementById('userRolDisplay');
    if (rolDisplay) {
        const rolTexto = usuario.rol === 'admin' ? '⚙️ Administrador' : '👤 Estudiante';
        const rolColor = usuario.rol === 'admin' ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400';
        rolDisplay.textContent = rolTexto;
        rolDisplay.className = `text-sm font-semibold ${rolColor}`;
    }

    userInfo.classList.add('show');
}

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuarioActual');
    
    userInfo.classList.remove('show');
    
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.querySelector('.grid').style.display = 'grid'; // Mostrar botones de toggle
    
    btnLogin.click();
    
    mostrarExito('Sesión cerrada correctamente.');
});

/* ========================================
   REDIRIGIR A PÁGINA ANTERIOR
   ======================================== */
function redirigirAPaginaAnterior() {
    const paginaAnterior = localStorage.getItem('paginaAnterior');
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    //  SI ES ADMIN, REDIRIGIR AL PANEL DE ADMINISTRACIÓN
    if (usuario && usuario.rol === 'admin') {
        console.log('✅ Admin detectado, redirigiendo al panel...');
        window.location.href = 'admin.html';
        return;
    }
    
    // Si es estudiante, redirigir a su dashboard o página anterior
    if (paginaAnterior && paginaAnterior !== window.location.pathname) {
        window.location.href = paginaAnterior;
    } else {
        window.location.href = '../index.html';
    }
}

/* ========================================
   FUNCIONES DE ALMACENAMIENTO EN LOCALSTORAGE
   ======================================== */
function obtenerUsuariosDeLocalStorage() {
    const usuariosJSON = localStorage.getItem('usuariosEcoPuntos');
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}