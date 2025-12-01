/* ========================================
   INDEX - CARRUSEL DE ACTIVIDADES
   ======================================== */

let indiceCarrusel = 0;
let intervalCarrusel = null;
let actividadesMostrar = [];

window.addEventListener('DOMContentLoaded', () => {
    cargarActividadesCarrusel();
    iniciarCarruselAutomatico();
});

/* ========================================
   CARGAR ACTIVIDADES EN EL CARRUSEL
   ======================================== */
function cargarActividadesCarrusel() {
    // Obtener eventos y misiones del archivo JSON
    const eventos = obtenerEventos();
    const misiones = obtenerMisiones();
    
    // Combinar y tomar las primeras 6 actividades (3 eventos + 3 misiones)
    actividadesMostrar = [
        ...eventos.slice(0, 3),
        ...misiones.slice(0, 3)
    ];
    
    // Mezclar aleatoriamente
    actividadesMostrar.sort(() => Math.random() - 0.5);
    
    // Renderizar carrusel
    renderizarCarrusel();
    actualizarIndicadores();
}

/* ========================================
   RENDERIZAR CARRUSEL
   ======================================== */
function renderizarCarrusel() {
    const contenedor = document.getElementById('carousel-container');
    
    if (!contenedor) return;
    
    const actividad = actividadesMostrar[indiceCarrusel];
    
    if (!actividad) return;
    
    let html = '';
    
    if (actividad.tipo === 'evento') {
        html = renderizarTarjetaEvento(actividad);
    } else {
        html = renderizarTarjetaMision(actividad);
    }
    
    contenedor.innerHTML = html;
}

/* ========================================
   RENDERIZAR TARJETA DE EVENTO
   ======================================== */
function renderizarTarjetaEvento(evento) {
    const fecha = new Date(evento.fecha + 'T00:00:00');
    const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
    });
    
    const cuposDisponibles = evento.cupos.total - evento.cupos.actual;
    
    // Generar gradiente aleatorio para cada evento
    const gradientes = [
        'from-emerald-400/60 to-lime-400/40 dark:from-emerald-500/50 dark:to-lime-400/40',
        'from-blue-400/60 to-cyan-400/40 dark:from-blue-500/50 dark:to-cyan-400/40',
        'from-purple-400/60 to-pink-400/40 dark:from-purple-500/50 dark:to-pink-400/40',
        'from-orange-400/60 to-yellow-400/40 dark:from-orange-500/50 dark:to-yellow-400/40',
        'from-teal-400/60 to-green-400/40 dark:from-teal-500/50 dark:to-green-400/40'
    ];
    
    const gradiente = gradientes[Math.floor(Math.random() * gradientes.length)];
    
    return `
        <article class="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-emerald-800/60 rounded-2xl overflow-hidden flex flex-col h-full">
            <div class="h-32 bg-gradient-to-r ${gradiente} flex items-center justify-center">
                <span class="text-6xl">${evento.icono}</span>
            </div>
            <div class="p-5 flex-1 flex flex-col">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-semibold text-emerald-800 dark:text-emerald-100 text-base">
                        ${evento.titulo}
                    </h4>
                    <span class="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold whitespace-nowrap ml-2">
                        +${evento.recompensa} pts
                    </span>
                </div>
                
                <div class="text-emerald-700/80 dark:text-emerald-200/80 mb-3 text-xs space-y-1">
                    <p>📅 ${fechaFormateada}</p>
                    <p>🕐 ${evento.hora}</p>
                    <p>📍 ${evento.lugar}</p>
                    <p>👥 ${cuposDisponibles} cupos disponibles de ${evento.cupos.total}</p>
                </div>
                
                <p class="text-emerald-700/80 dark:text-emerald-200/80 text-sm mb-4 flex-1">
                    ${evento.descripcion}
                </p>
                
                <div class="mt-auto">
                    <a href="autenticacion.html"
                       class="inline-block w-full text-center text-sm px-4 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition">
                        Inscribirme al evento
                    </a>
                </div>
            </div>
        </article>
    `;
}

/* ========================================
   RENDERIZAR TARJETA DE MISIÓN
   ======================================== */
function renderizarTarjetaMision(mision) {
    const tieneProgreso = mision.progreso !== null;
    const porcentaje = tieneProgreso ? (mision.progreso.actual / mision.progreso.total) * 100 : 0;
    
    return `
        <article class="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-emerald-800/60 rounded-2xl overflow-hidden flex flex-col h-full">
            <div class="h-32 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 dark:from-emerald-500/20 dark:to-teal-500/10 flex items-center justify-center border-b border-slate-200 dark:border-emerald-800/60">
                <span class="text-6xl">${mision.icono}</span>
            </div>
            <div class="p-5 flex-1 flex flex-col">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-semibold text-emerald-800 dark:text-emerald-100 text-base">
                        ${mision.titulo}
                    </h4>
                    <span class="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold whitespace-nowrap ml-2">
                        +${mision.recompensa} pts
                    </span>
                </div>
                
                <p class="text-emerald-700/80 dark:text-emerald-200/80 text-sm mb-3">
                    ${mision.descripcion}
                </p>
                
                ${tieneProgreso ? `
                    <div class="mb-4">
                        <div class="flex justify-between text-xs text-emerald-800/80 dark:text-emerald-200/80 mb-1.5">
                            <span class="font-medium">Progreso de ejemplo</span>
                            <span class="font-semibold">${mision.progreso.actual}/${mision.progreso.total}</span>
                        </div>
                        <div class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500" style="width: ${porcentaje}%;"></div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-lg p-3 mb-4">
                    <p class="text-xs text-blue-800 dark:text-blue-200">
                        <strong>Validación:</strong> ${mision.validacion.requerimiento}
                    </p>
                </div>
                
                <div class="mt-auto">
                    <a href="autenticacion.html"
                       class="inline-block w-full text-center text-sm px-4 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition">
                        Aceptar misión
                    </a>
                </div>
            </div>
        </article>
    `;
}

/* ========================================
   ACTUALIZAR INDICADORES
   ======================================== */
function actualizarIndicadores() {
    const contenedorIndicadores = document.getElementById('carousel-indicators');
    
    if (!contenedorIndicadores) return;
    
    let html = '';
    
    for (let i = 0; i < actividadesMostrar.length; i++) {
        const activo = i === indiceCarrusel ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600';
        html += `
            <button 
                class="h-2 rounded-full transition-all duration-300 ${activo} ${i === indiceCarrusel ? 'w-8' : 'w-2'}"
                onclick="irASlide(${i})"
                aria-label="Ir a actividad ${i + 1}">
            </button>
        `;
    }
    
    contenedorIndicadores.innerHTML = html;
}

/* ========================================
   CONTROLES DEL CARRUSEL
   ======================================== */
function siguienteSlide() {
    indiceCarrusel = (indiceCarrusel + 1) % actividadesMostrar.length;
    renderizarCarrusel();
    actualizarIndicadores();
    reiniciarCarruselAutomatico();
}

function anteriorSlide() {
    indiceCarrusel = (indiceCarrusel - 1 + actividadesMostrar.length) % actividadesMostrar.length;
    renderizarCarrusel();
    actualizarIndicadores();
    reiniciarCarruselAutomatico();
}

function irASlide(indice) {
    indiceCarrusel = indice;
    renderizarCarrusel();
    actualizarIndicadores();
    reiniciarCarruselAutomatico();
}

/* ========================================
   CARRUSEL AUTOMÁTICO
   ======================================== */
function iniciarCarruselAutomatico() {
    // Cambiar de slide cada 5 segundos
    intervalCarrusel = setInterval(siguienteSlide, 5000);
}

function reiniciarCarruselAutomatico() {
    // Detener el intervalo actual
    if (intervalCarrusel) {
        clearInterval(intervalCarrusel);
    }
    // Iniciar uno nuevo
    iniciarCarruselAutomatico();
}

// Pausar carrusel cuando el usuario pasa el mouse sobre él
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel-container');
    
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            if (intervalCarrusel) {
                clearInterval(intervalCarrusel);
            }
        });
        
        carousel.addEventListener('mouseleave', () => {
            iniciarCarruselAutomatico();
        });
    }
});