const BASE = window.BASE_PATH ?? '';

async function iniciarNavbar() {
  const contenedor = document.getElementById('nav-usuario');
  if (!contenedor) return;

  try {
    const res = await fetch(`${BASE}api/auth/session.php`);
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
      contenedor.classList.add('dropdown');
      contenedor.innerHTML = `
        <a class="nav-link" href="#" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle fs-3"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><span class="dropdown-item-text text-muted small">Hola, ${session.nombre}</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="${BASE}frontend/pages/perfil.html">Mi perfil</a></li>
          <li><a class="dropdown-item" href="${BASE}frontend/pages/perfil.html#reservas">Mis reservas</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="${BASE}api/auth/logout.php">Cerrar sesión</a></li>
        </ul>`;
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