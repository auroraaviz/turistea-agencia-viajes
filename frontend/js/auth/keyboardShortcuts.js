import { BASE } from '../config.js';

async function irAlPerfilSiEstaLogueado() {
  try {
    const res = await fetch(`${BASE}api/auth/session.php`, {
      credentials: 'include'
    });
    const session = await res.json();

    if (session?.ok) {
      const destino = session.rol === 'admin'
        ? `${BASE}frontend/pages/admin/admin.html`
        : `${BASE}frontend/pages/perfil.html`;
      window.location.href = destino;
      return;
    }
  } catch (_) {
    // Si falla la comprobación de sesión, mostramos el mismo mensaje de error.
  }

  alert('Código incorrecto');
}

function manejarAtajo(event) {
  if (!event.ctrlKey || !event.shiftKey) return;
  if (event.key.toLowerCase() !== 'p') return;

  const activo = document.activeElement;
  if (activo && (activo.tagName === 'INPUT' || activo.tagName === 'TEXTAREA' || activo.tagName === 'SELECT' || activo.isContentEditable)) {
    return;
  }

  event.preventDefault();
  irAlPerfilSiEstaLogueado();
}

window.addEventListener('keydown', manejarAtajo);
