/* ========================================
   DASHBOARD - LÓGICA DE USUARIO AUTENTICADO
   ======================================== */

// Estado actual del filtro (misiones, eventos o todo)
let filtroActual = 'misiones';
let mostrarTodo = false; // Controla si se muestran todos los items o solo 3
let misionEventoActual = null; // Almacena la misión/evento que se está validando
let fotoSeleccionada = null; // Almacena el archivo de foto seleccionado

// Verificar si hay usuario autenticado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('usuarioActual');
    
    if (!usuarioActual) {
        // Si no hay usuario autenticado, redirigir al login
        localStorage.setItem('paginaAnterior', window.location.pathname);
        window.location.href = 'autenticacion.html';
        return;
    }

    const usuario = JSON.parse(usuarioActual);
    console.log('Usuario cargado:', usuario); // Debug
    cargarDatosDashboard(usuario);
    cargarRanking();
    cargarMisionesEventos(filtroActual, usuario, mostrarTodo);
    
    // Configurar event listeners para botones de filtro
    configurarFiltros(usuario);
    configurarBotonVerTodo(usuario);
    configurarModal();
});

/* ========================================
   CONFIGURAR BOTÓN "VER TODO"
   ======================================== */
function configurarBotonVerTodo(usuario) {
    const btnVerTodo = document.getElementById('btn-ver-todo');
    
    if (!btnVerTodo) return;
    
    btnVerTodo.addEventListener('click', () => {
        mostrarTodo = !mostrarTodo;
        
        // Cambiar texto del botón
        btnVerTodo.textContent = mostrarTodo ? 'Ver menos' : 'Ver todo';
        
        // Recargar contenido
        cargarMisionesEventos(filtroActual, usuario, mostrarTodo);
    });
}

/* ========================================
   CONFIGURAR FILTROS DE MISIONES/EVENTOS
   ======================================== */
function configurarFiltros(usuario) {
    const btnMisiones = document.getElementById('btn-misiones');
    const btnEventos = document.getElementById('btn-eventos');
    
    if (!btnMisiones || !btnEventos) return;
    
    btnMisiones.addEventListener('click', () => {
        if (filtroActual === 'misiones') return;
        
        filtroActual = 'misiones';
        mostrarTodo = false; // Resetear al cambiar filtro
        actualizarEstilosBotones();
        actualizarBotonVerTodo();
        cargarMisionesEventos('misiones', usuario, mostrarTodo);
    });
    
    btnEventos.addEventListener('click', () => {
        if (filtroActual === 'eventos') return;
        
        filtroActual = 'eventos';
        mostrarTodo = false; // Resetear al cambiar filtro
        actualizarEstilosBotones();
        actualizarBotonVerTodo();
        cargarMisionesEventos('eventos', usuario, mostrarTodo);
    });
}

function actualizarEstilosBotones() {
    const btnMisiones = document.getElementById('btn-misiones');
    const btnEventos = document.getElementById('btn-eventos');
    
    if (filtroActual === 'misiones') {
        btnMisiones.className = 'px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800/80 dark:text-emerald-50 font-medium transition';
        btnEventos.className = 'px-2 py-1 text-xs rounded-full border border-emerald-400/60 text-emerald-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition';
    } else {
        btnEventos.className = 'px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800/80 dark:text-emerald-50 font-medium transition';
        btnMisiones.className = 'px-2 py-1 text-xs rounded-full border border-emerald-400/60 text-emerald-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition';
    }
}

function actualizarBotonVerTodo() {
    const btnVerTodo = document.getElementById('btn-ver-todo');
    if (btnVerTodo) {
        btnVerTodo.textContent = mostrarTodo ? 'Ver menos' : 'Ver todo';
    }
}

/* ========================================
   CARGAR MISIONES O EVENTOS DINÁMICAMENTE
   ======================================== */
function cargarMisionesEventos(tipo, usuario, verTodo = false) {
    const contenedor = document.getElementById('contenedor-misiones-eventos');
    const titulo = document.getElementById('seccion-titulo');
    
    if (!contenedor || !titulo) return;
    
    let items;
    if (tipo === 'misiones') {
        items = obtenerMisiones();
        titulo.textContent = 'Misiones activas';
    } else {
        items = obtenerEventos();
        titulo.textContent = 'Eventos próximos';
    }
    
    // Limitar a 3 items si no se está mostrando todo
    const itemsMostrar = verTodo ? items : items.slice(0, 3);
    
    let html = '';
    
    if (tipo === 'misiones') {
        itemsMostrar.forEach(mision => {
            html += renderizarMision(mision, usuario);
        });
    } else {
        itemsMostrar.forEach(evento => {
            html += renderizarEvento(evento);
        });
    }
    
    contenedor.innerHTML = html;
    
    // Agregar event listeners a los botones después de renderizar
    agregarEventListenersBotones(tipo);
}

/* ========================================
   AGREGAR EVENT LISTENERS A BOTONES
   ======================================== */
function agregarEventListenersBotones(tipo) {
    if (tipo === 'misiones') {
        const botonesMisiones = document.querySelectorAll('.btn-aceptar-mision');
        botonesMisiones.forEach(boton => {
            boton.addEventListener('click', function() {
                const mision = JSON.parse(this.getAttribute('data-mision'));
                abrirModal(mision, 'mision');
            });
        });
    } else {
        const botonesEventos = document.querySelectorAll('.btn-inscribir-evento');
        botonesEventos.forEach(boton => {
            boton.addEventListener('click', function() {
                const evento = JSON.parse(this.getAttribute('data-evento'));
                abrirModal(evento, 'evento');
            });
        });
    }
}

/* ========================================
   RENDERIZAR UNA MISIÓN
   ======================================== */
function renderizarMision(mision, usuario) {
    // Verificar si la misión ya fue completada por este usuario
    const validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
    const misionCompletada = validaciones.some(v => 
        v.usuarioCedula === usuario.cedula && 
        v.itemId === mision.id && 
        v.estado === 'aprobada'
    );
    
    let html = `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-emerald-900/80">
            <div class="max-w-xs">
                <p class="font-medium text-emerald-800 dark:text-emerald-100">
                    ${mision.icono} ${mision.titulo}
                </p>
                <p class="text-xs text-emerald-800/80 dark:text-emerald-200/80">
                    ${mision.descripcion}
                </p>
            </div>
            <div class="text-right">
                <p class="text-[11px] text-emerald-800/70 dark:text-emerald-200/70">Recompensa</p>
                <p class="font-semibold text-emerald-700 dark:text-emerald-300">+${mision.recompensa} pts</p>
    `;
    
    // Botón según estado
    if (misionCompletada) {
        html += `
                <button class="mt-2 text-[11px] px-3 py-1 rounded-full bg-slate-400 text-slate-950 cursor-not-allowed" disabled>
                    ¡Completada!
                </button>
        `;
    } else if (mision.estado === 'activa') {
        html += `
                <button class="btn-aceptar-mision mt-2 text-[11px] px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400" data-mision='${JSON.stringify(mision)}'>
                    Aceptar misión
                </button>
        `;
    } else {
        html += `
                <button class="btn-aceptar-mision mt-2 text-[11px] px-3 py-1 rounded-full border border-emerald-400/60 text-emerald-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" data-mision='${JSON.stringify(mision)}'>
                    Aceptar misión
                </button>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

/* ========================================
   RENDERIZAR UN EVENTO
   ======================================== */
function renderizarEvento(evento) {
    const fecha = new Date(evento.fecha + 'T00:00:00');
    const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
    });
    
    const cuposDisponibles = evento.cupos.total - evento.cupos.actual;
    const porcentajeCupos = (evento.cupos.actual / evento.cupos.total) * 100;
    
    return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-emerald-900/80">
            <div class="max-w-xs">
                <p class="font-medium text-emerald-800 dark:text-emerald-100">
                    ${evento.icono} ${evento.titulo}
                </p>
                <p class="text-xs text-emerald-800/80 dark:text-emerald-200/80 mb-1">
                    ${evento.descripcion}
                </p>
                <div class="text-[11px] text-emerald-800/70 dark:text-emerald-200/70 space-y-0.5">
                    <p>📅 ${fechaFormateada} • ${evento.hora}</p>
                    <p>📍 ${evento.lugar}</p>
                    <p>👥 ${cuposDisponibles} cupos disponibles</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-[11px] text-emerald-800/70 dark:text-emerald-200/70">Recompensa</p>
                <p class="font-semibold text-emerald-700 dark:text-emerald-300">+${evento.recompensa} pts</p>
                <button class="btn-inscribir-evento mt-2 text-[11px] px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400" data-evento='${JSON.stringify(evento)}'>
                    Inscribirme
                </button>
            </div>
        </div>
    `;
}

/* ========================================
   CARGAR DATOS DEL USUARIO EN EL DASHBOARD
   ======================================== */
function cargarDatosDashboard(usuario) {
    // Actualizar nombre del usuario en el header
    const nombreUsuario = usuario.nombre.split(' ')[0];
    const headerTitle = document.querySelector('main h2');
    if (headerTitle) {
        headerTitle.textContent = `Hola, ${nombreUsuario} 🌱`;
    }
    
    // Actualizar información de la sesión en el sidebar
    actualizarInfoSesion(usuario);
    
    // Usar el nivel que ya tiene el usuario
    const nivel = usuario.nivel || 1;
    const puntosTotales = usuario.puntosTotales || 0;
    const puntosActuales = usuario.puntosActuales || 0;
    
    // Calcular puntos para siguiente nivel (cada 300 puntos = 1 nivel)
    const puntosParaSiguienteNivel = ((nivel * 300) - puntosTotales);
    
    console.log('Nivel:', nivel, 'Puntos Totales:', puntosTotales, 'Puntos Actuales:', puntosActuales);
    
    // Actualizar nivel en el header
    const nivelDisplay = document.querySelector('header .text-right.text-xs');
    if (nivelDisplay) {
        nivelDisplay.innerHTML = `
            <p class="text-emerald-800/80 dark:text-emerald-200/80">Nivel</p>
            <p class="text-base font-semibold text-emerald-700 dark:text-emerald-300">Eco ${nivel}</p>
            <p class="text-[11px] text-emerald-700/80 dark:text-emerald-200/70">A ${puntosParaSiguienteNivel} pts del próximo nivel</p>
        `;
    }
    
    // Actualizar resumen de estadísticas usando IDs específicos
    
    // Puntos actuales
    const statPuntos = document.getElementById('stat-puntos-actuales');
    if (statPuntos) {
        statPuntos.innerHTML = `
            <p class="text-xs text-emerald-800/80 dark:text-emerald-200/80">Puntos actuales</p>
            <p class="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-300">${puntosActuales.toLocaleString()}</p>
            <p class="text-xs text-emerald-800/70 dark:text-emerald-200/70 mt-1">
                A ${puntosParaSiguienteNivel} puntos de tu próximo nivel.
            </p>
        `;
    }
    
    // Botellas recicladas (calculadas basadas en puntos totales, 10 pts por botella)
    const botellasRecicladas = Math.floor(puntosTotales / 10);
    const statBotellas = document.getElementById('stat-botellas');
    if (statBotellas) {
        statBotellas.innerHTML = `
            <p class="text-xs text-emerald-800/80 dark:text-emerald-200/80">Botellas recicladas</p>
            <p class="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-300">${botellasRecicladas}</p>
            <p class="text-xs text-emerald-800/70 dark:text-emerald-200/70 mt-1">
                Total acumulado.
            </p>
        `;
    }
    
    // Actividades asistidas (calculadas basadas en nivel)
    const actividadesAsistidas = Math.max(1, Math.floor(nivel / 2));
    const statActividades = document.getElementById('stat-actividades');
    if (statActividades) {
        statActividades.innerHTML = `
            <p class="text-xs text-emerald-800/80 dark:text-emerald-200/80">Actividades asistidas</p>
            <p class="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-300">${actividadesAsistidas}</p>
            <p class="text-xs text-emerald-800/70 dark:text-emerald-200/70 mt-1">
                Validado por moderadores.
            </p>
        `;
    }
}

/* ========================================
   CARGAR RANKING DINÁMICO
   ======================================== */
function cargarRanking() {
    const usuarios = obtenerUsuariosDeLocalStorage();
    const usuarioActualJSON = localStorage.getItem('usuarioActual');
    
    if (!usuarioActualJSON) return;
    
    const usuarioActual = JSON.parse(usuarioActualJSON);
    
    // Ordenar usuarios por puntos totales (descendente)
    const ranking = usuarios
        .map(u => ({
            ...u,
            puntosTotales: u.puntosTotales || 0
        }))
        .sort((a, b) => b.puntosTotales - a.puntosTotales)
        .slice(0, 10); // Top 10
    
    // Encontrar posición del usuario actual
    const posicionUsuario = ranking.findIndex(u => u.cedula === usuarioActual.cedula);
    
    const rankingContainer = document.querySelector('ol.space-y-2');
    if (!rankingContainer) return;
    
    let rankingHTML = '';
    
    // Mostrar top 3 siempre
    for (let i = 0; i < Math.min(3, ranking.length); i++) {
        const usuario = ranking[i];
        const esUsuarioActual = usuario.cedula === usuarioActual.cedula;
        const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
        const nombre = esUsuarioActual ? 'Tú' : usuario.nombre;
        
        rankingHTML += `
            <li class="flex justify-between items-center ${esUsuarioActual ? 'font-bold' : ''}">
                <span>${medalla} ${nombre}</span>
                <span class="font-semibold text-emerald-700 dark:text-emerald-300">${usuario.puntosTotales.toLocaleString()} pts</span>
            </li>
        `;
    }
    
    // Si el usuario actual no está en el top 3, mostrarlo después
    if (posicionUsuario > 2 && posicionUsuario !== -1) {
        rankingHTML += `
            <li class="flex justify-between items-center font-bold pt-2 border-t border-slate-200 dark:border-emerald-800/60">
                <span>#${posicionUsuario + 1} Tú</span>
                <span class="font-semibold text-emerald-700 dark:text-emerald-300">${usuarioActual.puntosTotales.toLocaleString()} pts</span>
            </li>
        `;
    }
    
    rankingContainer.innerHTML = rankingHTML;
    
    // Actualizar texto informativo
    const infoText = rankingContainer.nextElementSibling;
    if (infoText && infoText.classList.contains('text-[11px]')) {
        const totalUsuarios = usuarios.length;
        const posicion = posicionUsuario !== -1 ? posicionUsuario + 1 : totalUsuarios;
        infoText.textContent = `Estás en el puesto ${posicion} de ${totalUsuarios} estudiantes. ¡Sigue así!`;
    }
}

/* ========================================
   FUNCIONES AUXILIARES
   ======================================== */
function obtenerUsuariosDeLocalStorage() {
    const usuariosJSON = localStorage.getItem('usuariosEcoPuntos');
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

/* ========================================
   ACTUALIZACIÓN PERIÓDICA (OPCIONAL)
   ======================================== */
// Actualizar ranking cada 30 segundos (por si hay cambios)
setInterval(() => {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
        cargarRanking();
    }
}, 30000);

/* ========================================
   MODAL DE VALIDACIÓN
   ======================================== */
function configurarModal() {
    const modal = document.getElementById('modal-validacion');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnEnviar = document.getElementById('btn-enviar-validacion');
    
    // Cerrar modal
    const cerrarModal = () => {
        modal.classList.add('hidden');
        limpiarModal();
    };
    
    btnCerrar?.addEventListener('click', cerrarModal);
    btnCancelar?.addEventListener('click', cerrarModal);
    
    // Click fuera del modal para cerrar
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });
    
    // Configurar zona de carga de foto
    const zonaFoto = document.getElementById('zona-foto');
    const inputFoto = document.getElementById('input-foto');
    const btnCambiarFoto = document.getElementById('btn-cambiar-foto');
    
    zonaFoto?.addEventListener('click', () => inputFoto?.click());
    btnCambiarFoto?.addEventListener('click', (e) => {
        e.stopPropagation();
        inputFoto?.click();
    });
    
    inputFoto?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            fotoSeleccionada = file;
            mostrarPreviewFoto(file);
        }
    });
    
    // Drag and drop
    zonaFoto?.addEventListener('dragover', (e) => {
        e.preventDefault();
        zonaFoto.classList.add('border-emerald-500');
    });
    
    zonaFoto?.addEventListener('dragleave', () => {
        zonaFoto.classList.remove('border-emerald-500');
    });
    
    zonaFoto?.addEventListener('drop', (e) => {
        e.preventDefault();
        zonaFoto.classList.remove('border-emerald-500');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            fotoSeleccionada = file;
            inputFoto.files = e.dataTransfer.files;
            mostrarPreviewFoto(file);
        }
    });
    
    // Enviar validación
    btnEnviar?.addEventListener('click', () => enviarValidacion());
}

function mostrarPreviewFoto(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('preview-foto');
        const previewContainer = document.getElementById('preview-container');
        const placeholder = document.getElementById('placeholder-foto');
        
        preview.src = e.target.result;
        previewContainer?.classList.remove('hidden');
        placeholder?.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function limpiarModal() {
    fotoSeleccionada = null;
    misionEventoActual = null;
    
    const inputFoto = document.getElementById('input-foto');
    const previewContainer = document.getElementById('preview-container');
    const placeholder = document.getElementById('placeholder-foto');
    const comentarios = document.getElementById('comentarios-foto');
    
    if (inputFoto) inputFoto.value = '';
    previewContainer?.classList.add('hidden');
    placeholder?.classList.remove('hidden');
    if (comentarios) comentarios.value = '';
}

function abrirModal(item, tipo) {
    misionEventoActual = item;
    const modal = document.getElementById('modal-validacion');
    
    // Actualizar contenido del modal
    document.getElementById('modal-titulo').textContent = item.titulo;
    document.getElementById('modal-descripcion').textContent = item.descripcion;
    document.getElementById('modal-recompensa').textContent = `+${item.recompensa} pts`;
    
    const validacionFoto = document.getElementById('validacion-foto');
    const validacionQr = document.getElementById('validacion-qr');
    const btnTextoEnviar = document.getElementById('btn-texto-enviar');
    
    // Mostrar tipo de validación correcto
    if (tipo === 'mision') {
        document.getElementById('modal-tipo-validacion').textContent = '📸 Validación con foto';
        document.getElementById('foto-requerimiento').textContent = item.validacion.requerimiento;
        validacionFoto?.classList.remove('hidden');
        validacionQr?.classList.add('hidden');
        btnTextoEnviar.textContent = 'Enviar evidencia';
    } else {
        document.getElementById('modal-tipo-validacion').textContent = '📱 Validación con código QR';
        document.getElementById('qr-mensaje').textContent = item.validacion.mensaje;
        document.getElementById('qr-codigo').textContent = item.validacion.codigo;
        validacionQr?.classList.remove('hidden');
        validacionFoto?.classList.add('hidden');
        btnTextoEnviar.textContent = 'Confirmar inscripción';
    }
    
    modal?.classList.remove('hidden');
}

function enviarValidacion() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual || !misionEventoActual) return;
    
    const usuario = JSON.parse(usuarioActual);
    const btnEnviar = document.getElementById('btn-enviar-validacion');
    
    // Deshabilitar botón mientras procesa
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span>Procesando...</span>';
    
    // Simular envío (en producción iría a un servidor)
    setTimeout(() => {
        // Para EVENTOS: Sumar puntos inmediatamente (confirmación de inscripción)
        if (misionEventoActual.tipo === 'evento') {
            sumarPuntosUsuario(usuario, misionEventoActual.recompensa);
            guardarInscripcionEvento(usuario, misionEventoActual);
        } else {
            // Para MISIONES: Guardar como pendiente de revisión
            guardarValidacionPendiente(usuario, misionEventoActual);
        }
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito(misionEventoActual.tipo);
        
        // Cerrar modal
        document.getElementById('modal-validacion').classList.add('hidden');
        limpiarModal();
        
        // Restaurar botón
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<span id="btn-texto-enviar">Enviar evidencia</span>';
        
        // Recargar misiones/eventos y datos del usuario
        cargarMisionesEventos(filtroActual, JSON.parse(localStorage.getItem('usuarioActual')), mostrarTodo);
        cargarDatosDashboard(JSON.parse(localStorage.getItem('usuarioActual')));
    }, 1500);
}

function guardarValidacionPendiente(usuario, item) {
    // Obtener validaciones pendientes del localStorage
    let validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
    
    const validacion = {
        id: `val_${Date.now()}`,
        usuarioCedula: usuario.cedula,
        itemId: item.id,
        itemTitulo: item.titulo,
        tipo: item.tipo,
        tipoValidacion: item.validacion.tipo,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        comentarios: document.getElementById('comentarios-foto')?.value || '',
        fotoNombre: fotoSeleccionada?.name || null
    };
    
    validaciones.push(validacion);
    localStorage.setItem('validacionesPendientes', JSON.stringify(validaciones));
}

function sumarPuntosUsuario(usuario, puntos) {
    // Obtener todos los usuarios
    let usuarios = JSON.parse(localStorage.getItem('usuariosEcoPuntos') || '[]');
    
    // Encontrar al usuario
    const index = usuarios.findIndex(u => u.cedula === usuario.cedula);
    if (index !== -1) {
        // Sumar puntos
        usuarios[index].puntosActuales = (usuarios[index].puntosActuales || 0) + puntos;
        usuarios[index].puntosTotales = (usuarios[index].puntosTotales || 0) + puntos;
        
        // Calcular nuevo nivel (cada 300 puntos = 1 nivel)
        usuarios[index].nivel = Math.floor(usuarios[index].puntosTotales / 300) + 1;
        
        // Guardar en localStorage
        localStorage.setItem('usuariosEcoPuntos', JSON.stringify(usuarios));
        
        // Actualizar usuario actual
        localStorage.setItem('usuarioActual', JSON.stringify(usuarios[index]));
    }
}

function guardarInscripcionEvento(usuario, evento) {
    // Guardar registro de inscripción (no requiere validación admin)
    let validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
    
    const inscripcion = {
        id: `ins_${Date.now()}`,
        usuarioCedula: usuario.cedula,
        itemId: evento.id,
        itemTitulo: evento.titulo,
        tipo: evento.tipo,
        tipoValidacion: 'qr',
        fecha: new Date().toISOString(),
        estado: 'aprobada', // Auto-aprobado para eventos
        comentarios: 'Inscripción confirmada automáticamente'
    };
    
    validaciones.push(inscripcion);
    localStorage.setItem('validacionesPendientes', JSON.stringify(validaciones));
}

function mostrarMensajeExito(tipo) {
    const mensaje = tipo === 'mision' 
        ? '✅ Tu evidencia ha sido enviada y está pendiente de revisión por un administrador.'
        : '✅ ¡Inscripción exitosa! Los puntos han sido sumados a tu cuenta.';
    
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.className = 'fixed top-4 right-4 bg-emerald-500 text-slate-950 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 5000);
}

// Archivo: JS/admin-link.js
// Script para mostrar enlace al panel admin solo si el usuario es administrador

window.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  
  if (usuario && usuario.rol === 'admin') {
    mostrarEnlaceAdmin();
  }
});

function mostrarEnlaceAdmin() {
  // Buscar el sidebar nav
  const nav = document.querySelector('aside nav');
  
  if (!nav) return;
  
  // Crear el enlace al panel admin
  const enlaceAdmin = document.createElement('a');
  enlaceAdmin.href = 'admin.html';
  enlaceAdmin.className = 'block px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800/40 text-amber-600 dark:text-amber-400 font-medium border-t border-slate-200 dark:border-emerald-800/60 mt-2 pt-3';
  enlaceAdmin.innerHTML = '⚙️ Panel de Administración';
  
  // Agregar el enlace al final del nav
  nav.appendChild(enlaceAdmin);
  
  // También agregar en el header (desktop)
  const header = document.querySelector('header > div:last-child');
  if (header) {
    const btnAdmin = document.createElement('a');
    btnAdmin.href = 'admin.html';
    btnAdmin.className = 'hidden md:flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-500/30 transition text-sm font-medium border border-amber-400/60';
    btnAdmin.innerHTML = '⚙️ Admin';
    
    // Insertar antes del toggle de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      header.insertBefore(btnAdmin, themeToggle);
    }
  }
}
/* ========================================
   Control del menú móvil del dashboard
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias al DOM
  const menuToggleMobile = document.getElementById('menu-toggle-mobile');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const mobileSidebarPanel = document.getElementById('mobile-sidebar-panel');
  const closeMobileSidebar = document.getElementById('close-mobile-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Función para abrir el menú
  function abrirMenu() {
    mobileSidebar.classList.remove('hidden');
    // Pequeño delay para que la transición funcione
    setTimeout(() => {
      mobileSidebarPanel.classList.remove('-translate-x-full');
    }, 10);
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  // Función para cerrar el menú
  function cerrarMenu() {
    mobileSidebarPanel.classList.add('-translate-x-full');
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      mobileSidebar.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  // Event listeners
  if (menuToggleMobile) {
    menuToggleMobile.addEventListener('click', abrirMenu);
  }

  if (closeMobileSidebar) {
    closeMobileSidebar.addEventListener('click', cerrarMenu);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', cerrarMenu);
  }

  // Cerrar menú al hacer clic en un enlace de navegación
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', cerrarMenu);
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileSidebar.classList.contains('hidden')) {
      cerrarMenu();
    }
  });
});

/* ========================================
   Sincronización de botones de tema
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  
  const themeToggleLightMobile = document.getElementById('theme-toggle-light-mobile');
  const themeToggleDarkMobile = document.getElementById('theme-toggle-dark-mobile');
  
  const themeToggleLightDesktop = document.getElementById('theme-toggle-light-desktop');
  const themeToggleDarkDesktop = document.getElementById('theme-toggle-dark-desktop');

  // Función para actualizar todos los botones de tema
  function actualizarBotonesTema() {
    const isDark = document.documentElement.classList.contains('dark');
    
    // Móvil
    if (themeToggleLightMobile && themeToggleDarkMobile) {
      if (isDark) {
        themeToggleLightMobile.classList.remove('hidden');
        themeToggleDarkMobile.classList.add('hidden');
      } else {
        themeToggleLightMobile.classList.add('hidden');
        themeToggleDarkMobile.classList.remove('hidden');
      }
    }
    
    // Desktop
    if (themeToggleLightDesktop && themeToggleDarkDesktop) {
      if (isDark) {
        themeToggleLightDesktop.classList.remove('hidden');
        themeToggleDarkDesktop.classList.add('hidden');
      } else {
        themeToggleLightDesktop.classList.add('hidden');
        themeToggleDarkDesktop.classList.remove('hidden');
      }
    }
  }

  // Escuchar cambios de tema desde theme.js
  const observer = new MutationObserver(actualizarBotonesTema);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Sincronizar botón móvil con la función de cambio de tema
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
      // Disparar el click del botón principal de tema si existe
      const mainThemeToggle = document.getElementById('theme-toggle');
      if (mainThemeToggle) {
        mainThemeToggle.click();
      } else {
        // Si no existe, cambiar el tema manualmente
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', 
          document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        );
      }
    });
  }

  // Sincronizar botón desktop
  if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', () => {
      const mainThemeToggle = document.getElementById('theme-toggle');
      if (mainThemeToggle) {
        mainThemeToggle.click();
      } else {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', 
          document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        );
      }
    });
  }

  // Inicializar estado de los botones
  actualizarBotonesTema();
});

/* ========================================
   Scroll suave para anclas (opcional)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href && href !== '#') {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggleMobile = document.getElementById('menu-toggle-mobile');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const mainContent = document.querySelector('main');
  
  const observarMenuMobile = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const menuEstaAbierto = !mobileSidebar.classList.contains('hidden');
        
        if (menuEstaAbierto) {
          mainContent.style.zIndex = '0';
        } else {
          mainContent.style.zIndex = '';
        }
      }
    });
  });
  
  if (mobileSidebar) {
    observarMenuMobile.observe(mobileSidebar, { attributes: true });
  }
});

function eliminarSesionDuplicada() {
  // Buscar el sidebar móvil
  const mobileSidebarPanel = document.getElementById('mobile-sidebar-panel');
  
  if (!mobileSidebarPanel) return;
  
  // Buscar todos los divs con información de sesión
  const sesionDivs = mobileSidebarPanel.querySelectorAll('.border-t.p-4');
  
  // Si hay más de uno, eliminar los duplicados (mantener solo el último)
  if (sesionDivs.length > 1) {
    for (let i = 0; i < sesionDivs.length - 1; i++) {
      // Verificar que contiene "Sesión:" antes de eliminar
      if (sesionDivs[i].textContent.includes('Sesión:')) {
        sesionDivs[i].remove();
      }
    }
  }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  eliminarSesionDuplicada();
});


function actualizarInfoSesion(usuario) {
  const nombreUsuario = usuario.nombre.split(' ')[0];
  
  // Actualizar en sidebar DESKTOP
  const sessionInfoDesktop = document.querySelector('aside.w-64 .border-t.p-4');
  if (sessionInfoDesktop) {
    sessionInfoDesktop.innerHTML = `
      Sesión: <span class="font-semibold">${nombreUsuario}</span><br />
      <span class="text-[11px] text-emerald-700/80 dark:text-emerald-200/70">Cédula: ${usuario.cedula}</span>
    `;
  }
  
  // Actualizar en sidebar MÓVIL 
  const mobileSidebarPanel = document.getElementById('mobile-sidebar-panel');
  if (mobileSidebarPanel) {
    const sessionInfoMobile = mobileSidebarPanel.querySelector('.border-t.p-4');
    if (sessionInfoMobile) {
      sessionInfoMobile.innerHTML = `
        Sesión: <span class="font-semibold">${nombreUsuario}</span><br />
        <span class="text-[11px] text-emerald-700/80 dark:text-emerald-200/70">Cédula: ${usuario.cedula}</span>
      `;
    }
  }
}
