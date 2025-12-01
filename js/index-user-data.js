/* ========================================
   INDEX - ACTUALIZAR DATOS DEL USUARIO
   ======================================== */

window.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('usuarioActual');
    
    if (usuarioActual) {
        const usuario = JSON.parse(usuarioActual);
        actualizarDatosIndex(usuario);
    } else {
        // Si no hay usuario, mostrar datos genéricos
        mostrarDatosGenericos();
    }
});

/* ========================================
   ACTUALIZAR DATOS CON USUARIO AUTENTICADO
   ======================================== */
function actualizarDatosIndex(usuario) {
    const nivel = usuario.nivel || 1;
    const puntosTotales = usuario.puntosTotales || 0;
    const puntosActuales = usuario.puntosActuales || 0;
    
    // Calcular puntos para siguiente nivel (cada 300 puntos = 1 nivel)
    const puntosParaSiguienteNivel = ((nivel + 1) * 300) - puntosTotales;
    const porcentajeNivel = ((puntosTotales % 300) / 300) * 100;
    
    // Calcular botellas recicladas (10 pts por botella)
    const botellasRecicladas = Math.floor(puntosTotales / 10);
    
    // Meta mensual: basada en nivel (nivel * 10 botellas)
    const metaMensual = nivel * 10;
    const botellasEsteMes = Math.min(botellasRecicladas, metaMensual); // Simular progreso del mes
    const porcentajeMeta = (botellasEsteMes / metaMensual) * 100;
    
    // 1. Actualizar sección "Tu progreso ambiental"
    actualizarProgresoAmbiental(nivel, porcentajeNivel, botellasEsteMes, metaMensual, porcentajeMeta, puntosActuales);
    
    // 2. Actualizar botones de CTA para usuarios autenticados
    actualizarBotonesCTA(usuario);
    
    // 3. Actualizar estadísticas globales (opcional: agregar datos reales del usuario)
    actualizarEstadisticasGlobales(botellasRecicladas);
}

/* ========================================
   ACTUALIZAR PROGRESO AMBIENTAL
   ======================================== */
function actualizarProgresoAmbiental(nivel, porcentajeNivel, botellasEsteMes, metaMensual, porcentajeMeta, puntosActuales) {
    // Encontrar la sección de progreso
    const seccionProgreso = document.querySelector('.space-y-4 > div:first-child');
    
    if (!seccionProgreso) return;
    
    seccionProgreso.innerHTML = `
        <p class="text-sm font-semibold text-emerald-800 dark:text-emerald-100 mb-2">Tu progreso ambiental</p>
        <div class="space-y-3">
            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-emerald-700/80 dark:text-emerald-200/80">Nivel Eco</span>
                    <span class="text-emerald-600 dark:text-emerald-300 font-semibold">Eco ${nivel}</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div class="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full transition-all duration-500" style="width: ${porcentajeNivel}%;"></div>
                </div>
                <p class="text-[11px] text-emerald-700/70 dark:text-emerald-200/70 mt-1">
                    ${puntosActuales.toLocaleString()} puntos acumulados
                </p>
            </div>

            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-emerald-700/80 dark:text-emerald-200/80">Meta mensual de reciclaje</span>
                    <span class="text-emerald-600 dark:text-emerald-300 font-semibold">${botellasEsteMes}/${metaMensual} botellas</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${porcentajeMeta}%;"></div>
                </div>
            </div>
        </div>
    `;
}

/* ========================================
   ACTUALIZAR BOTONES CTA
   ======================================== */
function actualizarBotonesCTA(usuario) {
    const nombreUsuario = usuario.nombre.split(' ')[0];
    
    // Buscar el contenedor de botones
    const botonesContainer = document.querySelector('.flex.flex-wrap.gap-3.mb-6');
    
    if (!botonesContainer) return;
    
    // Reemplazar botones con opciones para usuario autenticado
    botonesContainer.innerHTML = `
        <a href="dashboard-estudiante.html"
           class="px-5 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition">
            Ir a mi Dashboard
        </a>
        <a href="recompensas.html"
           class="px-5 py-2.5 rounded-full border border-emerald-500/70 text-sm text-emerald-700 dark:text-emerald-100 hover:bg-emerald-500/10 transition">
            Ver recompensas
        </a>
    `;
}

/* ========================================
   ACTUALIZAR ESTADÍSTICAS GLOBALES
   ======================================== */
function actualizarEstadisticasGlobales(botellasUsuario) {
    // Obtener todos los usuarios para calcular estadísticas globales
    const usuarios = obtenerUsuariosDeLocalStorage();
    
    // Calcular totales
    const totalBotellas = usuarios.reduce((sum, u) => {
        const botellas = Math.floor((u.puntosTotales || 0) / 10);
        return sum + botellas;
    }, 0);
    
    const totalEstudiantes = usuarios.length;
    
    // Calcular CO2 evitado (aproximado: 0.17 kg por botella)
    const co2Evitado = Math.floor(totalBotellas * 0.17);
    
    // Actualizar las tres tarjetas de estadísticas
    const estadisticas = document.querySelectorAll('.grid.grid-cols-3.gap-4 > div');
    
    if (estadisticas[0]) {
        estadisticas[0].innerHTML = `
            <p class="text-emerald-700/80 dark:text-emerald-200/80">Botellas recicladas</p>
            <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">${totalBotellas.toLocaleString()}+</p>
        `;
    }
    
    if (estadisticas[1]) {
        estadisticas[1].innerHTML = `
            <p class="text-emerald-700/80 dark:text-emerald-200/80">Estudiantes activos</p>
            <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">${totalEstudiantes}</p>
        `;
    }
    
    if (estadisticas[2]) {
        estadisticas[2].innerHTML = `
            <p class="text-emerald-700/80 dark:text-emerald-200/80">Kg de CO₂ evitados</p>
            <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">${co2Evitado.toLocaleString()}+</p>
        `;
    }
}

/* ========================================
   MOSTRAR DATOS GENÉRICOS (SIN USUARIO)
   ======================================== */
function mostrarDatosGenericos() {
    // Si no hay usuario autenticado, mantener los datos estáticos del HTML
    // Pero aún así podemos actualizar estadísticas globales
    const usuarios = obtenerUsuariosDeLocalStorage();
    
    if (usuarios.length > 0) {
        const totalBotellas = usuarios.reduce((sum, u) => {
            const botellas = Math.floor((u.puntosTotales || 0) / 10);
            return sum + botellas;
        }, 0);
        
        const totalEstudiantes = usuarios.length;
        const co2Evitado = Math.floor(totalBotellas * 0.17);
        
        // Actualizar solo las estadísticas globales
        const estadisticas = document.querySelectorAll('.grid.grid-cols-3.gap-4 > div');
        
        if (estadisticas[0]) {
            estadisticas[0].innerHTML = `
                <p class="text-emerald-700/80 dark:text-emerald-200/80">Botellas recicladas</p>
                <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">${totalBotellas.toLocaleString()}+</p>
            `;
        }
        
        if (estadisticas[1]) {
            estadisticas[1].innerHTML = `
                <p class="text-emerald-700/80 dark:text-emerald-200/80">Estudiantes activos</p>
                <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">${totalEstudiantes}</p>
            `;
        }
        
        if (estadisticas[2]) {
            estadisticas[2].innerHTML = `
                <p class="text-emerald-700/80 dark:text-emerald-200/80">Kg de CO₂ evitados</p>
                <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">${co2Evitado.toLocaleString()}+</p>
            `;
        }
    }
}

/* ========================================
   FUNCIONES AUXILIARES
   ======================================== */
function obtenerUsuariosDeLocalStorage() {
    const usuariosJSON = localStorage.getItem('usuariosEcoPuntos');
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}