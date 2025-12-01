// Datos de recompensas disponibles
const recompensasData = [
    {
        "id": "r001",
        "nombre": "Descuento Cafetería 10%",
        "descripcion": "Descuento del 10% en tu próxima compra en cafetería",
        "costo": 30,
        "icono": "☕",
        "categoria": "alimentos",
        "stock": 100
    },
    {
        "id": "r002",
        "nombre": "Descuento Cafetería 20%",
        "descripcion": "Descuento del 20% en tu próxima compra en cafetería",
        "costo": 60,
        "icono": "🍽️",
        "categoria": "alimentos",
        "stock": 100
    },
    {
        "id": "r003",
        "nombre": "Descuento Cafetería 30%",
        "descripcion": "Descuento del 30% en tu próxima compra en cafetería",
        "costo": 90,
        "icono": "🛒",
        "categoria": "alimentos",
        "stock": 100
    },
    {
        "id": "r004",
        "nombre": "Botella Estampada UTN",
        "descripcion": "Botella reutilizable con logo de la UTN y Eco-Puntos",
        "costo": 120,
        "icono": "🥤",
        "categoria": "merchandising",
        "stock": 50
    },
    {
        "id": "r005",
        "nombre": "Camisa de la Universidad",
        "descripcion": "Camiseta oficial de la Universidad Técnica Nacional",
        "costo": 200,
        "icono": "👕",
        "categoria": "merchandising",
        "stock": 40
    },
    {
        "id": "r006",
        "nombre": "Descuento Tarjeta de Ingreso ₡500",
        "descripcion": "Rebaja de ₡500 en tu próxima tarjeta de ingreso",
        "costo": 60,
        "icono": "🎫",
        "categoria": "servicios",
        "stock": 200
    },
    {
        "id": "r007",
        "nombre": "Descuento Tarjeta de Ingreso ₡1,000",
        "descripcion": "Rebaja de ₡1,000 en tu próxima tarjeta de ingreso",
        "costo": 120,
        "icono": "💳",
        "categoria": "servicios",
        "stock": 150
    },
    {
        "id": "r008",
        "nombre": "Planta Pequeña Eco",
        "descripcion": "Planta de interior en maceta biodegradable",
        "costo": 75,
        "icono": "🌱",
        "categoria": "ambiental",
        "stock": 60
    }
];

// Categorías de recompensas
const categoriasRecompensas = [
    {
        "id": "alimentos",
        "nombre": "Alimentos",
        "descripcion": "Descuentos en cafetería"
    },
    {
        "id": "merchandising",
        "nombre": "Merchandising",
        "descripcion": "Artículos de la universidad"
    },
    {
        "id": "servicios",
        "nombre": "Servicios",
        "descripcion": "Servicios universitarios"
    },
    {
        "id": "ambiental",
        "nombre": "Ambiental",
        "descripcion": "Artículos ecológicos"
    }
];

// Función para obtener todas las recompensas
function obtenerRecompensas() {
    return recompensasData;
}

// Función para obtener recompensa por ID
function obtenerRecompensaPorId(id) {
    return recompensasData.find(r => r.id === id);
}

// Función para obtener recompensas por categoría
function obtenerRecompensasPorCategoria(categoria) {
    return recompensasData.filter(r => r.categoria === categoria);
}

// Función para verificar disponibilidad
function verificarDisponibilidad(recompensaId) {
    const recompensa = obtenerRecompensaPorId(recompensaId);
    return recompensa && recompensa.stock > 0;
}