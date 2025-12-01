// Datos de misiones y eventos
const misionesEventosData = [
    // MISIONES
    {
        "id": "mis001",
        "tipo": "mision",
        "icono": "♻️",
        "titulo": "Recicla 40 botellas PET",
        "descripcion": "Lleva tus botellas al punto verde de la biblioteca y registra tu entrega.",
        "recompensa": 150,
        "progreso": {
            "actual": 24,
            "total": 40
        },
        "estado": "activa",
        "validacion": {
            "tipo": "foto",
            "requerimiento": "Foto de las botellas en la báscula del punto verde"
        }
    },
    {
        "id": "mis002",
        "tipo": "mision",
        "icono": "🌳",
        "titulo": "Jornada de siembra",
        "descripcion": "Participa al menos 1 vez en la jornada de siembra de árboles del campus.",
        "recompensa": 300,
        "progreso": null,
        "estado": "disponible",
        "validacion": {
            "tipo": "foto",
            "requerimiento": "Foto del árbol plantado con tu identificación"
        }
    },
    {
        "id": "mis003",
        "tipo": "mision",
        "icono": "📚",
        "titulo": "Separa residuos en biblioteca",
        "descripcion": "Clasifica correctamente 20 items de residuos en los contenedores de la biblioteca.",
        "recompensa": 100,
        "progreso": {
            "actual": 8,
            "total": 20
        },
        "estado": "activa",
        "validacion": {
            "tipo": "foto",
            "requerimiento": "Foto de los residuos separados en los contenedores"
        }
    },
    {
        "id": "mis004",
        "tipo": "mision",
        "icono": "🥤",
        "titulo": "Cero plástico de un solo uso",
        "descripcion": "No uses plásticos desechables durante 7 días consecutivos.",
        "recompensa": 250,
        "progreso": {
            "actual": 3,
            "total": 7
        },
        "estado": "activa",
        "validacion": {
            "tipo": "foto",
            "requerimiento": "Foto diaria usando tus utensilios reutilizables"
        }
    },
    {
        "id": "mis005",
        "tipo": "mision",
        "icono": "👥",
        "titulo": "Embajador Eco",
        "descripcion": "Invita a 3 compañeros a unirse a la plataforma y que completen su primera misión.",
        "recompensa": 200,
        "progreso": {
            "actual": 1,
            "total": 3
        },
        "estado": "activa",
        "validacion": {
            "tipo": "foto",
            "requerimiento": "Captura de pantalla del registro de tus invitados"
        }
    },
    
    // EVENTOS
    {
        "id": "evt001",
        "tipo": "evento",
        "icono": "🌍",
        "titulo": "Día Mundial del Reciclaje",
        "descripcion": "Participa en la feria de reciclaje en el campus central. Habrá talleres y actividades.",
        "recompensa": 500,
        "fecha": "2025-05-17",
        "hora": "09:00 - 16:00",
        "lugar": "Plaza Central",
        "cupos": {
            "actual": 45,
            "total": 100
        },
        "estado": "proximo",
        "validacion": {
            "tipo": "qr",
            "codigo": "QR-RECICLAJE-2025",
            "mensaje": "Escanea el código QR en el punto de registro del evento"
        }
    },
    {
        "id": "evt002",
        "tipo": "evento",
        "icono": "🌱",
        "titulo": "Taller de Compostaje",
        "descripcion": "Aprende a crear tu propio compost en casa. Incluye kit inicial gratuito.",
        "recompensa": 150,
        "fecha": "2025-06-03",
        "hora": "14:00 - 16:00",
        "lugar": "Jardín Botánico",
        "cupos": {
            "actual": 12,
            "total": 30
        },
        "estado": "proximo",
        "validacion": {
            "tipo": "qr",
            "codigo": "QR-COMPOSTAJE-2025",
            "mensaje": "Escanea el código QR al finalizar el taller"
        }
    },
    {
        "id": "evt003",
        "tipo": "evento",
        "icono": "🧹",
        "titulo": "Limpieza de Playa",
        "descripcion": "Únete a la limpieza de playa en Jacó. Transporte incluido desde el campus.",
        "recompensa": 400,
        "fecha": "2025-06-15",
        "hora": "06:00 - 14:00",
        "lugar": "Playa Jacó",
        "cupos": {
            "actual": 28,
            "total": 50
        },
        "estado": "proximo",
        "validacion": {
            "tipo": "qr",
            "codigo": "QR-PLAYA-JACO-2025",
            "mensaje": "Escanea el código QR en el punto de reunión"
        }
    },
    {
        "id": "evt004",
        "tipo": "evento",
        "icono": "🎨",
        "titulo": "Arte con Materiales Reciclados",
        "descripcion": "Taller creativo donde transformaremos residuos en obras de arte.",
        "recompensa": 180,
        "fecha": "2025-06-20",
        "hora": "10:00 - 13:00",
        "lugar": "Sala de Arte",
        "cupos": {
            "actual": 8,
            "total": 25
        },
        "estado": "proximo",
        "validacion": {
            "tipo": "qr",
            "codigo": "QR-ARTE-RECICLADO-2025",
            "mensaje": "Escanea el código QR al entregar tu obra"
        }
    },
    {
        "id": "evt005",
        "tipo": "evento",
        "icono": "🚴",
        "titulo": "Ciclo-paseo Ecológico",
        "descripcion": "Recorrido en bicicleta por rutas ecológicas de San José. Bicicletas disponibles.",
        "recompensa": 200,
        "fecha": "2025-06-28",
        "hora": "07:00 - 11:00",
        "lugar": "Punto de encuentro: Entrada Principal",
        "cupos": {
            "actual": 35,
            "total": 60
        },
        "estado": "proximo",
        "validacion": {
            "tipo": "qr",
            "codigo": "QR-CICLOPASEO-2025",
            "mensaje": "Escanea el código QR al finalizar el recorrido"
        }
    }
];

// Función para obtener solo misiones
function obtenerMisiones() {
    return misionesEventosData.filter(item => item.tipo === 'mision');
}

// Función para obtener solo eventos
function obtenerEventos() {
    return misionesEventosData.filter(item => item.tipo === 'evento');
}

// Función para obtener todos los items
function obtenerTodos() {
    return misionesEventosData;
}