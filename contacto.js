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
    if (name.length === 0) {
        showError('nameError', 'El nombre es requerido');
        isValid = false;
    } else if (name.length < 3) {
        showError('nameError', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        showError('nameError', 'El nombre solo puede contener letras');
        isValid = false;
    }
    
    // VALIDACIÓN 2: Email (formato válido)
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
        showError('emailError', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('emailError', 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // VALIDACIÓN 3: Asunto (debe seleccionar una opción)
    const subject = document.getElementById('subject').value;
    if (subject === '') {
        showError('subjectError', 'Por favor selecciona un asunto');
        isValid = false;
    }
    
    // VALIDACIÓN 4: Mensaje
    const message = document.getElementById('message').value.trim();
    if (message.length === 0) {
        showError('messageError', 'El mensaje es requerido');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    // VALIDACIÓN 5: CAPTCHA
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
    errorElement.classList.remove('hidden');
}

// Función para limpiar errores
function clearErrors() {
    const errorElements = ['nameError', 'emailError', 'subjectError', 'messageError', 'captchaError'];
    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
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
    
    // Crear el contenido del modal con mejor formato
    modalData.innerHTML = `
        <div class="space-y-3">
            <p class="text-sm"><strong class="text-emerald-700 dark:text-emerald-300">Nombre:</strong> <span class="text-slate-700 dark:text-slate-300">${name}</span></p>
            <p class="text-sm"><strong class="text-emerald-700 dark:text-emerald-300">Email:</strong> <span class="text-slate-700 dark:text-slate-300">${email}</span></p>
            <p class="text-sm"><strong class="text-emerald-700 dark:text-emerald-300">Teléfono:</strong> <span class="text-slate-700 dark:text-slate-300">${phone}</span></p>
            <p class="text-sm"><strong class="text-emerald-700 dark:text-emerald-300">Asunto:</strong> <span class="text-slate-700 dark:text-slate-300">${subject}</span></p>
            <p class="text-sm"><strong class="text-emerald-700 dark:text-emerald-300">Mensaje:</strong> <span class="text-slate-700 dark:text-slate-300">${message}</span></p>
        </div>
    `;
    
    // Mostrar el modal con la clase active para activar el centrado
    modal.classList.add('active');
    
    // Mostrar mensaje de éxito
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '¡Mensaje enviado exitosamente!';
    formMessage.className = 'p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-center font-semibold';
    formMessage.classList.remove('hidden');
    
    // Resetear el formulario
    document.getElementById('contactForm').reset();
    grecaptcha.reset();
    
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('dataModal');
    modal.classList.remove('active');
}

// Cerrar modal al hacer clic en la X
document.getElementById('closeModalX').addEventListener('click', closeModal);

// Cerrar modal al hacer clic en el botón Cerrar
document.getElementById('closeModal').addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('dataModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Validación en tiempo real (opcional pero mejora la experiencia)
document.getElementById('name').addEventListener('blur', function() {
    const name = this.value.trim();
    const errorElement = document.getElementById('nameError');
    
    if (name.length > 0 && name.length < 3) {
        showError('nameError', 'El nombre debe tener al menos 3 caracteres');
    } else if (name.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        showError('nameError', 'El nombre solo puede contener letras');
    } else {
        errorElement.classList.add('hidden');
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById('emailError');
    
    if (email.length > 0 && !emailRegex.test(email)) {
        showError('emailError', 'Por favor ingresa un correo electrónico válido');
    } else {
        errorElement.classList.add('hidden');
    }
});

document.getElementById('message').addEventListener('blur', function() {
    const message = this.value.trim();
    const errorElement = document.getElementById('messageError');
    
    if (message.length > 0 && message.length < 10) {
        showError('messageError', 'El mensaje debe tener al menos 10 caracteres');
    } else {
        errorElement.classList.add('hidden');
    }
});