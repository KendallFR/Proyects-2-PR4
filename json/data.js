// Datos del contexto del proyecto
const contextoData = [
    {
        "icono": "🌍",
        "titulo": "Impacto Ambiental",
        "descripcion": "Reducción de residuos enviados a vertederos mediante separación efectiva"
    },
    {
        "icono": "🎮",
        "titulo": "Gamificación",
        "descripcion": "Sistema de puntos, misiones y recompensas para motivar la participación"
    },
    {
        "icono": "🎓",
        "titulo": "Educación",
        "descripcion": "Formación de cultura ambiental en la comunidad universitaria"
    },
    {
        "icono": "♻️",
        "titulo": "Basura Cero",
        "descripcion": "Compromiso con la meta de cero residuos en campus universitarios"
    }
];

// Datos del equipo
const teamData = [
    {
        "nombre": "Adrián Rojas Murillo",
        "email": "rojasmadrian28@gmail.com", 
        "foto": "img/adrian-rojas.jpeg", 
        "descripcion": "Desarrollador web",
        "cedula": "2-0854-0031", 
        "carrera": "Ingeniería del Software",
        "institucion": "Universidad Técnica Nacional - Sede Central",
        "anio_ciclo": "2025 - Ciclo II",
        "curso": "ISW-512 Diseño de Aplicaciones Web",
        "github": "https://github.com/aerm28"
    },
    {
        "nombre": "Kendall Fernández Rojas", 
        "email": "kefernandezro@est.utn.ac.cr", 
        "foto": "img/kendall-fernandez.jpeg", 
        "descripcion": "Desarrolador Web", 
        "cedula": "2-0834-0473", 
        "carrera": "Ingeniería del Software",
        "institucion": "Universidad Técnica Nacional - Sede Central",
        "anio_ciclo": "2025 - Ciclo II",
        "curso": "ISW-512 Diseño de Aplicaciones Web",
        "github": "https://github.com/KendallFR"
    }
];

// Misiones disponibles
const misionesData = [
    {
        "id": "m001",
        "titulo": "Primera Separación",
        "descripcion": "Realiza tu primera separación de residuos correctamente",
        "puntos": 50,
        "icono": "♻️",
        "categoria": "principiante"
    },
    {
        "id": "m002",
        "titulo": "Experto en Orgánicos",
        "descripcion": "Separa 10 kg de residuos orgánicos",
        "puntos": 100,
        "icono": "🌱",
        "categoria": "intermedio"
    },
    {
        "id": "m003",
        "titulo": "Maestro del Reciclaje",
        "descripcion": "Clasifica correctamente 50 items diferentes",
        "puntos": 200,
        "icono": "🏆",
        "categoria": "avanzado"
    },
    {
        "id": "m004",
        "titulo": "Embajador Ambiental",
        "descripcion": "Invita a 5 amigos a unirse a Eco-Puntos",
        "puntos": 150,
        "icono": "👥",
        "categoria": "social"
    }
];

// Recompensas disponibles
const recompensasData = [
    {
        "id": "r001",
        "titulo": "Descuento Cafetería 10%",
        "descripcion": "10% de descuento en cualquier compra en la cafetería",
        "puntos": 100,
        "imagen": "🍽️",
        "stock": 50
    },
    {
        "id": "r002",
        "titulo": "Rebaja Matrícula 5%",
        "descripcion": "5% de descuento en la matrícula del próximo ciclo",
        "puntos": 500,
        "imagen": "🎓",
        "stock": 20
    },
    {
        "id": "r003",
        "titulo": "Botella Reutilizable",
        "descripcion": "Botella ecológica de acero inoxidable",
        "puntos": 200,
        "imagen": "🍶",
        "stock": 30
    },
    {
        "id": "r004",
        "titulo": "Vale Librería",
        "descripcion": "₡5000 en la librería universitaria",
        "puntos": 300,
        "imagen": "📚",
        "stock": 25
    }
];

// Categorías de residuos
const categoriasResiduos = [
    {
        "id": "organicos",
        "nombre": "Orgánicos",
        "color": "#2ecc71",
        "descripcion": "Restos de comida, cáscaras, residuos biodegradables",
        "ejemplos": ["Frutas", "Verduras", "Cáscaras", "Restos de comida"]
    },
    {
        "id": "envases",
        "nombre": "Envases",
        "color": "#3498db",
        "descripcion": "Botellas plásticas, tetra pak, envases limpios",
        "ejemplos": ["Botellas PET", "Tetra Pak", "Envases de yogurt"]
    },
    {
        "id": "aluminio",
        "nombre": "Aluminio",
        "color": "#95a5a6",
        "descripcion": "Latas de bebidas, papel aluminio",
        "ejemplos": ["Latas de refresco", "Latas de cerveza", "Papel aluminio"]
    },
    {
        "id": "papel",
        "nombre": "Papel",
        "color": "#f39c12",
        "descripcion": "Papel limpio, periódicos, revistas",
        "ejemplos": ["Hojas de papel", "Periódicos", "Revistas", "Folletos"]
    },
    {
        "id": "carton",
        "nombre": "Cartón",
        "color": "#d35400",
        "descripcion": "Cajas de cartón limpias y plegadas",
        "ejemplos": ["Cajas", "Empaques", "Cartón corrugado"]
    },
    {
        "id": "ordinarios",
        "nombre": "Ordinarios",
        "color": "#34495e",
        "descripcion": "Residuos no reciclables",
        "ejemplos": ["Papel sucio", "Servilletas usadas", "Residuos mixtos"]
    }
];

// Inicializar usuarios en localStorage si no existen
function inicializarUsuarios() {
    if (!localStorage.getItem('ecopuntos_usuarios')) {
        localStorage.setItem('ecopuntos_usuarios', JSON.stringify(usuariosPredeterminados));
    }
}

// Llamar inicialización al cargar el archivo
inicializarUsuarios();