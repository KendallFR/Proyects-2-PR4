let validacionActual = null;
    let filtroActual = 'validaciones';

    window.addEventListener('DOMContentLoaded', () => {
      const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
      
      if (!usuario || usuario.rol !== 'admin') {
        alert('⚠️ Acceso denegado. Solo administradores pueden acceder.');
        window.location.href = '../HTML/autenticacion.html';
        return;
      }

      document.getElementById('admin-nombre').textContent = usuario.nombre.split(' ')[0];
      document.getElementById('admin-cedula').textContent = `Cédula: ${usuario.cedula}`;

      cargarValidacionesPendientes();
      cargarEstadisticas();
      cargarUsuarios();

      // Listeners del Sidebar (Escritorio)
      document.getElementById('btn-validaciones').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('validaciones');
      });

      document.getElementById('btn-estadisticas').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('estadisticas');
      });

      document.getElementById('btn-usuarios').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('usuarios');
      });

      // Listeners del Menú Móvil
      document.getElementById('btn-validaciones-movil').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('validaciones');
        document.getElementById('mobile-menu').classList.add('hidden');
      });

      document.getElementById('btn-estadisticas-movil').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('estadisticas');
        document.getElementById('mobile-menu').classList.add('hidden');
      });

      document.getElementById('btn-usuarios-movil').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccion('usuarios');
        document.getElementById('mobile-menu').classList.add('hidden');
      });

      // Toggle Menú Móvil
      const menuToggle = document.getElementById('menu-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      menuToggle.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
      });

      // Logout
      document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
      document.getElementById('btn-logout-movil').addEventListener('click', cerrarSesion);

      // Modal
      document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
      document.getElementById('modal-validacion-detalle').addEventListener('click', (e) => {
        if (e.target.id === 'modal-validacion-detalle') cerrarModal();
      });

      document.getElementById('btn-aprobar').addEventListener('click', aprobarValidacion);
      document.getElementById('btn-rechazar').addEventListener('click', rechazarValidacion);
    });
    
    function cerrarSesion() {
        if (confirm('¿Deseas cerrar sesión?')) {
          localStorage.removeItem('usuarioActual');
          window.location.href = '../HTML/autenticacion.html';
        }
    }

    function mostrarSeccion(seccion) {
      document.getElementById('seccion-validaciones').classList.toggle('hidden', seccion !== 'validaciones');
      document.getElementById('seccion-estadisticas').classList.toggle('hidden', seccion !== 'estadisticas');
      document.getElementById('seccion-usuarios').classList.toggle('hidden', seccion !== 'usuarios');

      const botonesSidebar = ['btn-validaciones', 'btn-estadisticas', 'btn-usuarios'];
      const botonesMovil = ['btn-validaciones-movil', 'btn-estadisticas-movil', 'btn-usuarios-movil'];
      const todosBotones = [...botonesSidebar, ...botonesMovil];

      todosBotones.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.classList.remove('bg-amber-100', 'text-amber-800', 'dark:bg-amber-800/80', 'dark:text-amber-50', 'font-medium');
          btn.classList.add('hover:bg-amber-50', 'dark:hover:bg-amber-800/40');
        }
      });

      const seccionMap = { validaciones: 'btn-validaciones', estadisticas: 'btn-estadisticas', usuarios: 'btn-usuarios' };
      const seccionMapMovil = { validaciones: 'btn-validaciones-movil', estadisticas: 'btn-estadisticas-movil', usuarios: 'btn-usuarios-movil' };

      // Activar botón de escritorio
      const btnEscritorio = document.getElementById(seccionMap[seccion]);
      if (btnEscritorio) {
          btnEscritorio.classList.remove('hover:bg-amber-50', 'dark:hover:bg-amber-800/40');
          btnEscritorio.classList.add('bg-amber-100', 'text-amber-800', 'dark:bg-amber-800/80', 'dark:text-amber-50', 'font-medium');
      }

      // Activar botón móvil
      const btnMovil = document.getElementById(seccionMapMovil[seccion]);
      if (btnMovil) {
          btnMovil.classList.remove('hover:bg-amber-50', 'dark:hover:bg-amber-800/40');
          btnMovil.classList.add('bg-amber-100', 'text-amber-800', 'dark:bg-amber-800/80', 'dark:text-amber-50', 'font-medium');
      }
    }

    function cargarValidacionesPendientes() {
      const validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
      const pendientes = validaciones.filter(v => v.estado === 'pendiente');

      document.getElementById('contador-pendientes').textContent = pendientes.length;

      const contenedor = document.getElementById('contenedor-validaciones');
      contenedor.innerHTML = '';

      if (pendientes.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-amber-800/80 dark:text-amber-200/80 py-8">✅ No hay validaciones pendientes</p>';
        return;
      }

      pendientes.forEach(validacion => {
        const estudiante = obtenerUsuarioPorCedula(validacion.usuarioCedula);
        const div = document.createElement('div');
        div.className = 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-amber-800/60 rounded-2xl p-4 flex justify-between items-center';
        div.innerHTML = `
          <div class="flex-1">
            <p class="font-medium text-amber-800 dark:text-amber-100">${validacion.itemTitulo}</p>
            <p class="text-xs text-amber-800/80 dark:text-amber-200/80 mt-1">
              📝 Estudiante: <strong>${estudiante?.nombre || 'Desconocido'}</strong>
            </p>
            <p class="text-xs text-amber-800/70 dark:text-amber-200/70">
              ⏰ ${new Date(validacion.fecha).toLocaleString('es-ES')}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[11px] text-amber-800/70 dark:text-amber-200/70">Recompensa</p>
            <p class="font-semibold text-amber-700 dark:text-amber-300">+${validacion.recompensa || '?'} pts</p>
            <button class="btn-revisar mt-2 text-[11px] px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400" data-validacion-id="${validacion.id}">
              Revisar
            </button>
          </div>
        `;
        contenedor.appendChild(div);
      });

      document.querySelectorAll('.btn-revisar').forEach(btn => {
        btn.addEventListener('click', function() {
          const validacionId = this.getAttribute('data-validacion-id');
          const val = pendientes.find(v => v.id === validacionId);
          if (val) abrirModal(val);
        });
      });
    }

    function abrirModal(validacion) {
      validacionActual = validacion;
      const estudiante = obtenerUsuarioPorCedula(validacion.usuarioCedula);
      const mision = misionesEventosData.find(m => m.id === validacion.itemId);

      document.getElementById('modal-titulo').textContent = validacion.itemTitulo;
      document.getElementById('modal-estudiante').textContent = `👤 ${estudiante?.nombre || 'Desconocido'} • Cédula: ${validacion.usuarioCedula}`;
      document.getElementById('modal-descripcion').textContent = mision?.descripcion || 'Sin descripción';
      document.getElementById('modal-recompensa').textContent = `+${mision?.recompensa || 0} pts`;
      document.getElementById('modal-fecha').textContent = new Date(validacion.fecha).toLocaleString('es-ES');

      if (validacion.fotoNombre) {
        document.getElementById('modal-foto-container').classList.remove('hidden');
        document.getElementById('modal-foto-nombre').textContent = `Archivo: ${validacion.fotoNombre}`;
      } else {
        document.getElementById('modal-foto-container').classList.add('hidden');
      }

      if (validacion.comentarios) {
        document.getElementById('modal-comentarios-container').classList.remove('hidden');
        document.getElementById('modal-comentarios').textContent = validacion.comentarios;
      } else {
        document.getElementById('modal-comentarios-container').classList.add('hidden');
      }

      document.getElementById('modal-validacion-detalle').classList.remove('hidden');
    }

    function cerrarModal() {
      document.getElementById('modal-validacion-detalle').classList.add('hidden');
      validacionActual = null;
    }

    function aprobarValidacion() {
      if (!validacionActual) return;

      let validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
      const index = validaciones.findIndex(v => v.id === validacionActual.id);

      if (index !== -1) {
        validaciones[index].estado = 'aprobada';
        localStorage.setItem('validacionesPendientes', JSON.stringify(validaciones));

        const mision = misionesEventosData.find(m => m.id === validacionActual.itemId);
        const puntos = mision?.recompensa || 0;

        let usuarios = JSON.parse(localStorage.getItem('usuariosEcoPuntos') || '[]');
        const usuarioIndex = usuarios.findIndex(u => u.cedula === validacionActual.usuarioCedula);

        if (usuarioIndex !== -1) {
          usuarios[usuarioIndex].puntosActuales = (usuarios[usuarioIndex].puntosActuales || 0) + puntos;
          usuarios[usuarioIndex].puntosTotales = (usuarios[usuarioIndex].puntosTotales || 0) + puntos;
          usuarios[usuarioIndex].nivel = Math.floor(usuarios[usuarioIndex].puntosTotales / 300) + 1;
          localStorage.setItem('usuariosEcoPuntos', JSON.stringify(usuarios));
        }

        alert('✅ Validación aprobada. Se sumaron los puntos al estudiante.');
        cerrarModal();
        cargarValidacionesPendientes();
        cargarEstadisticas();
        cargarUsuarios();
      }
    }

    function rechazarValidacion() {
      if (!validacionActual) return;

      const razon = prompt('¿Por qué deseas rechazar esta validación?');
      if (!razon) return;

      let validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');
      const index = validaciones.findIndex(v => v.id === validacionActual.id);

      if (index !== -1) {
        validaciones[index].estado = 'rechazada';
        validaciones[index].razonRechazo = razon;
        localStorage.setItem('validacionesPendientes', JSON.stringify(validaciones));

        alert('❌ Validación rechazada.');
        cerrarModal();
        cargarValidacionesPendientes();
        cargarEstadisticas();
      }
    }

    function cargarEstadisticas() {
      const usuarios = JSON.parse(localStorage.getItem('usuariosEcoPuntos') || '[]');
      const validaciones = JSON.parse(localStorage.getItem('validacionesPendientes') || '[]');

      const estudiantes = usuarios.filter(u => u.rol === 'estudiante');
      const aprobadas = validaciones.filter(v => v.estado === 'aprobada');
      const rechazadas = validaciones.filter(v => v.estado === 'rechazada');
      const puntosTotales = aprobadas.reduce((sum, v) => {
        const mision = misionesEventosData.find(m => m.id === v.itemId);
        return sum + (mision?.recompensa || 0);
      }, 0);

      document.getElementById('stat-estudiantes').textContent = estudiantes.length;
      document.getElementById('stat-completadas').textContent = aprobadas.length;
      document.getElementById('stat-rechazadas').textContent = rechazadas.length;
      document.getElementById('stat-puntos').textContent = puntosTotales.toLocaleString();

      const topEstudiantes = estudiantes
        .sort((a, b) => (b.puntosTotales || 0) - (a.puntosTotales || 0))
        .slice(0, 5);

      const topHTML = topEstudiantes
        .map((est, i) => `
          <li class="flex justify-between items-center">
            <span>${i + 1}. ${est.nombre}</span>
            <span class="font-semibold text-amber-700 dark:text-amber-300">${(est.puntosTotales || 0).toLocaleString()} pts</span>
          </li>
        `)
        .join('');

      document.getElementById('top-estudiantes').innerHTML = topHTML;
    }

    function cargarUsuarios() {
      const usuarios = JSON.parse(localStorage.getItem('usuariosEcoPuntos') || '[]');
      const tbody = document.getElementById('tabla-usuarios');

      const filas = usuarios
        .map(u => `
          <tr>
            <td class="px-4 py-3">${u.nombre}</td>
            <td class="px-4 py-3 font-mono">${u.cedula}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 rounded text-xs font-semibold ${u.rol === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300'}">${u.rol === 'admin' ? '⚙️ Admin' : '👤 Estudiante'}</span></td>
            <td class="px-4 py-3">Eco ${u.nivel || 1}</td>
            <td class="px-4 py-3 font-semibold">${(u.puntosTotales || 0).toLocaleString()}</td>
            <td class="px-4 py-3 text-xs">${new Date(u.fechaRegistro).toLocaleDateString('es-ES')}</td>
          </tr>
        `)
        .join('');

      tbody.innerHTML = filas;
    }

    function obtenerUsuarioPorCedula(cedula) {
      const usuarios = JSON.parse(localStorage.getItem('usuariosEcoPuntos') || '[]');
      return usuarios.find(u => u.cedula === cedula);
    }
