// Inicializar Mapa con Leaflet (OpenStreetMap - GRATIS)
document.addEventListener('DOMContentLoaded', function() {
    // Coordenadas de Universidad Técnica Nacional - Sede Central Alajuela
    // 2Q4M+RCG, Acequia Grande, Alajuela
    const lat = 10.0070417;
    const lng = -84.2163889;
    
    // Crear el mapa
    const map = L.map('map').setView([lat, lng], 17);
    
    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Agregar marcador
    L.marker([lat, lng]).addTo(map)
        .bindPopup('<b>Universidad Técnica Nacional</b><br>Sede Central - Alajuela<br>Acequia Grande<br>Eco-Puntos')
        .openPopup();
});

// Validación del formulario
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Limpiar mensajes de error previos
    clearErrors();
    
    let isValid = true;
    
    // VALIDACIÓN 1: Nombre (mínimo 3 caracteres, solo letras y espacios)
    const name = document.getElementById('name').value.trim();
    if (name.length < 3) {
        showError('nameError', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        showError('nameError', 'El nombre solo puede contener letras');
        isValid = false;
    }
    
    // VALIDACIÓN 2: Email (formato válido)
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // VALIDACIÓN 3: Asunto (debe seleccionar una opción)
    const subject = document.getElementById('subject').value;
    if (subject === '') {
        showError('subjectError', 'Por favor selecciona un asunto');
        isValid = false;
    }
    
    // Validación del mensaje (opcional pero recomendable)
    const message = document.getElementById('message').value.trim();
    if (message.length < 10) {
        showError('messageError', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    // VALIDACIÓN DEL CAPTCHA
    const captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
        showError('captchaError', 'Por favor completa el captcha');
        isValid = false;
    }
    
    // Si todo es válido, mostrar modal con los datos
    if (isValid) {
        showDataModal();
    }
});

// Función para mostrar errores
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Función para limpiar errores
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

// Función para mostrar el modal con los datos del formulario
function showDataModal() {
    const modal = document.getElementById('dataModal');
    const modalData = document.getElementById('modalData');
    
    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value || 'No proporcionado';
    const subject = document.getElementById('subject').options[document.getElementById('subject').selectedIndex].text;
    const message = document.getElementById('message').value;
    
    // Crear el contenido del modal
    modalData.innerHTML = `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
    `;
    
    // Mostrar el modal
    modal.style.display = 'block';
    
    // Mostrar mensaje de éxito
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '¡Mensaje enviado exitosamente!';
    formMessage.className = 'form-message success';
    
    // Resetear el formulario
    document.getElementById('contactForm').reset();
    grecaptcha.reset();
}

// Cerrar modal al hacer clic en la X
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('dataModal').style.display = 'none';
});

// Cerrar modal al hacer clic en el botón Cerrar
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('dataModal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('dataModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Validación en tiempo real (opcional)
document.getElementById('name').addEventListener('blur', function() {
    const name = this.value.trim();
    if (name.length > 0 && name.length < 3) {
        showError('nameError', 'El nombre debe tener al menos 3 caracteres');
    } else if (name.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        showError('nameError', 'El nombre solo puede contener letras');
    } else {
        document.getElementById('nameError').style.display = 'none';
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 0 && !emailRegex.test(email)) {
        showError('emailError', 'Por favor ingresa un correo electrónico válido');
    } else {
        document.getElementById('emailError').style.display = 'none';
    }
});