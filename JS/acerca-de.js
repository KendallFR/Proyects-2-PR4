/**
 * Script principal para la página 'Acerca de'.
 * Maneja la carga dinámica de las secciones 'Contexto' y 'Equipo'.
 * Gestiona la funcionalidad de mostrar/ocultar los detalles del equipo.
 * Asume que 'contextoData' y 'teamData' están definidos en 'json/data.js'.
 */

// =======================================================
// 1. FUNCIONES DE CARGA DINÁMICA
// =======================================================

/**
 * Carga los elementos del contexto (Misión, Visión, etc.) en el grid.
 */
function cargarContexto() {
    const grid = document.getElementById('contextoGrid');
    // Verifica que el contenedor y los datos existan
    if (!grid || typeof contextoData === 'undefined') return;

    contextoData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'contexto-item';
        div.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">${item.icono}</div>
            <h3>${item.titulo}</h3>
            <p>${item.descripcion}</p>
        `;
        
        // Lógica de interacción simple (cambio de color al hacer clic)
        div.addEventListener('click', function() {
            const isDefault = this.style.backgroundColor === 'white' || this.style.backgroundColor === '';
            this.style.backgroundColor = isDefault ? '#2ecc71' : 'white';
            this.style.color = isDefault ? 'white' : '#333';
            
            // Ajuste de color para elementos internos al hacer clic
            const iconDiv = this.querySelector('div[style*="font-size"]');
            const h3 = this.querySelector('h3');
            if (iconDiv) iconDiv.style.color = isDefault ? 'white' : '#2ecc71';
            if (h3) h3.style.color = isDefault ? 'white' : '#27ae60';
        });
        
        grid.appendChild(div);
    });
}

/**
 * Carga las tarjetas del equipo de desarrollo, incluyendo la estructura necesaria
 * para el correcto despliegue de imágenes y la sección oculta de detalles.
 */
function cargarEquipo() {
    const grid = document.getElementById('teamGrid');
    // Verifica que el contenedor y los datos existan
    if (!grid || typeof teamData === 'undefined') return;

    teamData.forEach(member => {
        const div = document.createElement('div');
        div.className = 'team-member';
        
        // Se genera el HTML con la estructura crítica:
        // 1. developer-photo-container: Arregla el problema de descuadre de imágenes con el CSS 'object-fit: cover'.
        // 2. additional-details: Contiene toda la información extra para el botón 'Ver Más'.
        div.innerHTML = `
            <div class="developer-photo-container">
                <img src="${member.foto}" alt="${member.nombre}">
            </div>
            
            <div class="team-member-info">
                <h3 class="developer-name">${member.nombre}</h3>
                <p class="descripcion">${member.descripcion}</p>
                <p class="email">${member.email}</p>
                
                <div class="additional-details">
                    <h4>Información Adicional</h4>
                    
                    <p><strong>Cédula:</strong> ${member.cedula}</p>
                    <p><strong>Correo UTN:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                    
                    <p><strong>Carrera:</strong> ${member.carrera}</p>
                    <p><strong>Institución:</strong> ${member.institucion}</p>
                    <p><strong>Año/Ciclo:</strong> ${member.anio_ciclo}</p>
                    <p><strong>Curso:</strong> ${member.curso}</p>

                    <div class="social-links">
                        <a href="${member.github}" target="_blank" aria-label="GitHub de ${member.nombre}">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

// =======================================================
// 2. FUNCIONES DE INTERACCIÓN
// =======================================================

/**
 * Configura el botón "Ver Más Información" para mostrar/ocultar los detalles
 * de las tarjetas de los desarrolladores.
 */
function configurarBoton() {
    const btnVerMas = document.getElementById('btnVerMas');
    // Si el botón no existe, la función termina
    if (!btnVerMas) return;

    let detallesVisibles = false;

    btnVerMas.addEventListener('click', function() {
        // Selecciona todos los contenedores de detalles en la página
        const allDetails = document.querySelectorAll('.additional-details');
        
        detallesVisibles = !detallesVisibles; // Alterna el estado de visibilidad
        
        // Aplica o remueve la clase 'visible' (definida en CSS) para la transición
        allDetails.forEach(detailElement => {
            if (detallesVisibles) {
                detailElement.classList.add('visible');
            } else {
                detailElement.classList.remove('visible');
            }
        });

        // Actualiza el texto del botón según el estado
        this.textContent = detallesVisibles ? 'Ocultar Información' : 'Ver Más Información';
        
        // Desplaza la vista al inicio de la cuadrícula al mostrar los detalles
        if (detallesVisibles) {
            document.getElementById('teamGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// =======================================================
// 3. INICIALIZACIÓN
// =======================================================

/**
 * Ejecuta todas las funciones de inicialización una vez que el DOM esté cargado.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Se recomienda usar 'DOMContentLoaded' en lugar de 'window.onload'
    
    // Verificación de datos: Útil para depuración en caso de error de carga
    if (typeof contextoData === 'undefined' || typeof teamData === 'undefined') {
        console.error('ERROR: Los arrays de datos no están definidos. Verifique que "json/data.js" se cargue antes que este script.');
        return; 
    }
    
    cargarContexto();
    cargarEquipo();
    configurarBoton();
});