const BASE = window.BASE_PATH ?? '';

function crearAvatarUrl(nombre) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || 'U')}&background=0077B6&color=fff&size=128&bold=true&font-size=0.4`;
}

async function obtenerNombreAvatar(session) {
  let nombre = [session.nombre, session.apellidos].filter(Boolean).join(' ').trim();

  try {
    const res = await fetch(`${BASE}api/perfil/get.php`, {
      credentials: 'include'
    });

    if (res.ok) {
      const perfil = await res.json();
      const nombrePerfil = [perfil.nombre, perfil.apellidos].filter(Boolean).join(' ').trim();
      if (nombrePerfil) nombre = nombrePerfil;
    }
  } catch (_) {
    // El nombre de sesión es suficiente si el perfil completo no está disponible.
  }

  return nombre || 'Usuario';
}

async function cerrarSesion(e) {
  e.preventDefault();

  try {
    await fetch(`${BASE}api/auth/logout.php`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (_) {
    // Aunque falle la petición, devolvemos al inicio.
  }

  window.location.href = `${BASE}index.html`;
}

async function iniciarNavbar() {
  const contenedor = document.getElementById('nav-usuario');
  if (!contenedor) return;

  try {
    const res = await fetch(`${BASE}api/auth/session.php`, {
      credentials: 'include'
    });
    const session = await res.json();

    if (!session.ok) {
      // Sin sesión: login y registro
      contenedor.classList.add('dropdown');
      contenedor.innerHTML = `
        <a class="nav-link" href="#" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle fs-3"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="${BASE}frontend/pages/login.html">Iniciar sesión</a></li>
          <li><a class="dropdown-item" href="${BASE}frontend/pages/register.html">Registrarse</a></li>
        </ul>`;

    } else if (session.rol === 'admin') {
      // Admin: icono directo al panel
      contenedor.innerHTML = `
        <a class="nav-link" href="${BASE}frontend/pages/admin/admin.html" title="Panel de administración">
          <i class="bi bi-person-fill-gear fs-3"></i>
        </a>`;

    } else {
      // Usuario normal: perfil y reservas
      const nombreAvatar = await obtenerNombreAvatar(session);

      contenedor.classList.add('dropdown');
      contenedor.innerHTML = `
        <a class="nav-link nav-user-avatar-link" href="#" data-bs-toggle="dropdown" aria-label="Abrir menú de usuario">
          <img class="nav-user-avatar" src="${crearAvatarUrl(nombreAvatar)}" alt="${nombreAvatar}">
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><span class="dropdown-item-text text-muted small">Hola, ${session.nombre}</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="${BASE}frontend/pages/perfil.html">Mi perfil</a></li>
          <li><a class="dropdown-item" href="${BASE}frontend/pages/perfil.html#reservas">Mis reservas</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" data-logout>Cerrar sesión</a></li>
        </ul>`;

      contenedor.querySelector('[data-logout]')?.addEventListener('click', cerrarSesion);
    }

  } catch (e) {
    // Si falla el fetch (red, servidor caído), mostrar login por defecto
    contenedor.classList.add('dropdown');
    contenedor.innerHTML = `
      <a class="nav-link" href="#" data-bs-toggle="dropdown">
        <i class="bi bi-person-circle fs-3"></i>
      </a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="${BASE}frontend/pages/login.html">Iniciar sesión</a></li>
        <li><a class="dropdown-item" href="${BASE}frontend/pages/register.html">Registrarse</a></li>
      </ul>`;
  }
}

iniciarNavbar();

