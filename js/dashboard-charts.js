/* ========================================
   DASHBOARD CHARTS - Gráficos de Impacto
   Archivo: JS/dashboard-charts.js
   ======================================== */

let chartReciclaje = null;
let chartActividades = null;

/**
 * Inicializar los gráficos del dashboard
 */
function inicializarCharts() {
    // Verificar que Chart.js esté cargado
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está cargado');
        return;
    }

    // Configurar colores según el tema
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)';
    const gridColor = isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.2)';

    // Inicializar gráfico de reciclaje mensual
    inicializarChartReciclaje(textColor, gridColor);

    // Inicializar gráfico de distribución de actividades
    inicializarChartActividades(textColor, gridColor);

    // Escuchar cambios de tema para actualizar los gráficos
    observarCambiosTema();
}

/**
 * Gráfico de Reciclaje Mensual (Líneas)
 */
function inicializarChartReciclaje(textColor, gridColor) {
    const ctx = document.getElementById('chartReciclaje');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (chartReciclaje) {
        chartReciclaje.destroy();
    }

    chartReciclaje = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [
                {
                    label: 'Botellas Recicladas',
                    data: [320, 445, 580, 720, 892],
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Estudiantes Participantes',
                    data: [85, 124, 168, 215, 276],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toLocaleString();
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Gráfico de Distribución de Actividades (Dona/Pie)
 */
function inicializarChartActividades(textColor, gridColor) {
    const ctx = document.getElementById('chartActividades');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (chartActividades) {
        chartActividades.destroy();
    }

    chartActividades = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Reciclaje de Botellas',
                'Eventos Ambientales',
                'Misiones Completadas',
                'Campañas de Limpieza',
                'Talleres Educativos'
            ],
            datasets: [{
                data: [40, 25, 18, 10, 7],
                backgroundColor: [
                    'rgb(16, 185, 129)',   // emerald-500
                    'rgb(59, 130, 246)',   // blue-500
                    'rgb(168, 85, 247)',   // purple-500
                    'rgb(234, 179, 8)',    // yellow-500
                    'rgb(236, 72, 153)'    // pink-500
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(59, 130, 246)',
                    'rgb(168, 85, 247)',
                    'rgb(234, 179, 8)',
                    'rgb(236, 72, 153)'
                ],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        color: textColor,
                        font: {
                            size: 11
                        },
                        padding: 12,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed + '%';
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Observar cambios de tema para actualizar los gráficos
 */
function observarCambiosTema() {
    // Observar cambios en la clase 'dark' del documento
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isDark = document.documentElement.classList.contains('dark');
                const textColor = isDark ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)';
                const gridColor = isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.2)';
                
                // Actualizar colores de los gráficos
                actualizarColoresCharts(textColor, gridColor);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}

/**
 * Actualizar colores de los gráficos cuando cambia el tema
 */
function actualizarColoresCharts(textColor, gridColor) {
    // Actualizar gráfico de reciclaje
    if (chartReciclaje) {
        chartReciclaje.options.plugins.legend.labels.color = textColor;
        chartReciclaje.options.scales.y.ticks.color = textColor;
        chartReciclaje.options.scales.x.ticks.color = textColor;
        chartReciclaje.options.scales.y.grid.color = gridColor;
        chartReciclaje.update();
    }

    // Actualizar gráfico de actividades
    if (chartActividades) {
        chartActividades.options.plugins.legend.labels.color = textColor;
        chartActividades.update();
    }
}


function actualizarDatosCharts() {
    const validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
    const aprobadas = validaciones.filter(v => v.estado === 'aprobada');
}

// Inicializar charts cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCharts);
} else {
    inicializarCharts();
}