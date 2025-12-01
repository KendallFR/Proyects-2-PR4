/* ========================================
   Maneja la navbar con información de sesión
   Versión mejorada con soporte para móvil
   ======================================== */

/* ========================================
   REFERENCIAS AL DOM - ESCRITORIO
   ======================================== */
const userSession = document.getElementById('userSession');
const loginPrompt = document.getElementById('loginPrompt');
const userSessionName = document.getElementById('userSessionName');
const userSessionPoints = document.getElementById('userSessionPoints');
const btnLogoutNav = document.getElementById('btnLogoutNav');

/* ========================================
   REFERENCIAS AL DOM - MÓVIL
   ======================================== */
const userSessionMobile = document.getElementById('userSessionMobile');
const loginPromptMobile = document.getElementById('loginPromptMobile');
const userSessionNameMobile = document.getElementById('userSessionNameMobile');
const userSessionPointsMobile = document.getElementById('userSessionPointsMobile');
const btnLogoutNavMobile = document.getElementById('btnLogoutNavMobile');

/* ========================================
   GUARDAR PÁGINA ACTUAL EN LOCALSTORAGE
   ======================================== */
window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('autenticacion') && !window.location.pathname.includes('login')) {
        localStorage.setItem('paginaAnterior', window.location.pathname);
    }
    
    actualizarNavbar();
});

/* ========================================
   ACTUALIZAR NAVBAR SEGÚN SESIÓN
   ======================================== */
function actualizarNavbar() {
    const usuario = obtenerUsuarioAutenticado();

    if (usuario) {
        // Usuario autenticado - mostrar información
        mostrarInfoUsuario(usuario);
        ocultarLoginPrompts();
    } else {
        // Usuario NO autenticado - mostrar botón de login
        ocultarInfoUsuario();
        mostrarLoginPrompts();
    }
}

/* ========================================
   FUNCIONES AUXILIARES
   ======================================== */
function mostrarInfoUsuario(usuario) {
    const icono = usuario.rol === 'admin' ? '⚙️' : '👤';
    const nombreCorto = usuario.nombre.split(' ')[0];
    const puntos = usuario.puntosActuales || 0;

    // Escritorio
    if (userSession) {
        userSession.classList.remove('hidden', 'md:hidden');
        userSession.classList.add('hidden', 'md:flex');
    }
    if (userSessionName) userSessionName.textContent = `${icono} ${nombreCorto}`;
    if (userSessionPoints) userSessionPoints.textContent = `🌱 ${puntos}`;

    // Móvil
    if (userSessionMobile) {
        userSessionMobile.classList.remove('hidden');
        userSessionMobile.classList.add('flex', 'md:hidden');
    }
    if (userSessionNameMobile) userSessionNameMobile.textContent = `${icono} ${nombreCorto}`;
    if (userSessionPointsMobile) userSessionPointsMobile.textContent = `🌱 ${puntos}`;
}

function ocultarInfoUsuario() {
    // Escritorio
    if (userSession) {
        userSession.classList.add('hidden');
        userSession.classList.remove('md:flex');
    }
    
    // Móvil
    if (userSessionMobile) userSessionMobile.classList.add('hidden');
}

function mostrarLoginPrompts() {
    // Escritorio
    if (loginPrompt) {
        loginPrompt.classList.remove('hidden');
        loginPrompt.style.display = 'block';
    }
    
    // Móvil
    if (loginPromptMobile) {
        loginPromptMobile.classList.remove('hidden');
        loginPromptMobile.style.display = 'block';
    }
}

function ocultarLoginPrompts() {
    // Escritorio
    if (loginPrompt) {
        loginPrompt.classList.add('hidden');
        loginPrompt.style.display = 'none';
    }
    
    // Móvil
    if (loginPromptMobile) {
        loginPromptMobile.classList.add('hidden');
        loginPromptMobile.style.display = 'none';
    }
}

/* ========================================
   EVENTOS DE CIERRE DE SESIÓN
   ======================================== */
function handleLogout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        localStorage.removeItem('usuarioActual');
        window.location.href = 'autenticacion.html';
    }
}

// Escritorio
if (btnLogoutNav) {
    btnLogoutNav.addEventListener('click', handleLogout);
}

// Móvil
if (btnLogoutNavMobile) {
    btnLogoutNavMobile.addEventListener('click', handleLogout);
}

/* ========================================
   ESCUCHAR CAMBIOS DE ECO-PUNTOS
   ======================================== */
window.addEventListener('ecoPuntosActualizados', (event) => {
    const usuario = obtenerUsuarioAutenticado();
    if (usuario) {
        const nuevosPuntos = `🌱 ${event.detail.nuevosPuntos}`;
        
        // Actualizar escritorio
        if (userSessionPoints) userSessionPoints.textContent = nuevosPuntos;
        
        // Actualizar móvil
        if (userSessionPointsMobile) userSessionPointsMobile.textContent = nuevosPuntos;
    }
});

/* ========================================
   ESCUCHAR CAMBIOS EN LOCALSTORAGE
   ======================================== */
window.addEventListener('storage', () => {
    actualizarNavbar();
});