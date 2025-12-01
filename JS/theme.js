// js/theme.js

(function () {
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Si no hay nada guardado, opcional: seguir preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }

  function updateIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const lightIcon = document.getElementById('theme-toggle-light');
    const darkIcon = document.getElementById('theme-toggle-dark');

    if (!lightIcon || !darkIcon) return;

    if (isDark) {
      darkIcon.classList.add('hidden');
      lightIcon.classList.remove('hidden');
    } else {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }

  // Actualizar iconos al inicio
  updateIcons();

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');

    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    updateIcons();
  });
})();
