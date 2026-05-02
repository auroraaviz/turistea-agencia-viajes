import { state } from './clientesState.js';
 
// ID del modal en el DOM — lo inyectamos si no existe
const MODAL_ID = 'modalEditarUsuario';
 
export function abrirModal(usuario) {
  // Inyectar el modal en el body si aún no existe
  if (!document.getElementById(MODAL_ID)) {
    document.body.insertAdjacentHTML('beforeend', plantillaModal());
  }
 
  // Rellenar campos
  document.getElementById('muId').textContent        = usuario.id;
  document.getElementById('muNombre').value          = usuario.nombre    ?? '';
  document.getElementById('muApellidos').value       = usuario.apellidos ?? '';
  document.getElementById('muEmail').value           = usuario.email     ?? '';
  document.getElementById('muTelefono').value        = usuario.telefono  ?? '';
  document.getElementById('muRol').value             = usuario.rol       ?? 'usuario';
  document.getElementById('muActivo').value          = String(usuario.activo ?? 1);
 
  // Guardar referencia al usuario actual
  state.usuarioEnEdicion = usuario;
 
  // Abrir el modal de Bootstrap
  const modalEl = document.getElementById(MODAL_ID);
  const bsModal  = bootstrap.Modal.getOrCreateInstance(modalEl);
  bsModal.show();
 
  // Eventos del modal (guardar + bloquear/desbloquear)
  activarEventosModal(bsModal);
}
 
function activarEventosModal(bsModal) {
  // Evitar listeners duplicados clonando los botones
  ['btnGuardarUsuario', 'btnBloquearUsuario'].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
  });
 
  // GUARDAR
  document.getElementById('btnGuardarUsuario').addEventListener('click', async () => {
    const usuario = state.usuarioEnEdicion;
    if (!usuario) return;
 
    const datos = {
      id:        usuario.id,
      nombre:    document.getElementById('muNombre').value.trim(),
      apellidos: document.getElementById('muApellidos').value.trim(),
      email:     document.getElementById('muEmail').value.trim(),
      telefono:  document.getElementById('muTelefono').value.trim(),
      rol:       document.getElementById('muRol').value,
      activo:    parseInt(document.getElementById('muActivo').value),
    };
 
    try {
        const res = await fetch('/turistea/turistea/api/usuarios/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
 
      const json = await res.json();
 
      if (json.ok) {
        // Actualizar el state local sin recargar la página
        const idx = state.usuarios.findIndex((u) => u.id === usuario.id);
        if (idx !== -1) Object.assign(state.usuarios[idx], datos);
 
        bsModal.hide();
 
        // Disparar evento para que clientes.js refresque la tabla
        document.dispatchEvent(new CustomEvent('clientes:actualizar'));
      } else {
        alert('Error al guardar: ' + (json.error ?? 'desconocido'));
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al guardar.');
    }
  });
 
  // BLOQUEAR / DESBLOQUEAR (soft delete)
  document.getElementById('btnBloquearUsuario').addEventListener('click', async () => {
    const usuario = state.usuarioEnEdicion;
    if (!usuario) return;
 
    const accion = usuario.activo == 1 ? 'bloquear' : 'activar';
    if (!confirm(`¿Seguro que quieres ${accion} a este usuario?`)) return;
 
    try {
      const res = await fetch('/turistea/turistea/api/usuarios/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: usuario.id }),
      });
 
      const json = await res.json();
 
      if (json.ok) {
        // Actualizar activo en el state
        const idx = state.usuarios.findIndex((u) => u.id === usuario.id);
        if (idx !== -1) state.usuarios[idx].activo = usuario.activo == 1 ? 0 : 1;
 
        bsModal.hide();
        document.dispatchEvent(new CustomEvent('clientes:actualizar'));
      } else {
        alert('Error: ' + (json.error ?? 'desconocido'));
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    }
  });
}
 
function plantillaModal() {
  return `
    <div class="modal fade" id="${MODAL_ID}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
 
          <div class="modal-header" style="background:#0077B6;">
            <h5 class="modal-title text-white fw-bold">
              <i class="bi bi-person-gear me-2"></i>
              Editar usuario <span id="muId" class="opacity-75 small"></span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
 
          <div class="modal-body p-4">
            <div class="row g-3">
 
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold">Nombre</label>
                <input type="text" class="form-control" id="muNombre">
              </div>
 
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold">Apellidos</label>
                <input type="text" class="form-control" id="muApellidos">
              </div>
 
              <div class="col-12">
                <label class="form-label fw-semibold">Email</label>
                <input type="email" class="form-control" id="muEmail">
              </div>
 
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold">Teléfono</label>
                <input type="text" class="form-control" id="muTelefono">
              </div>
 
              <div class="col-12 col-md-3">
                <label class="form-label fw-semibold">Rol</label>
                <select class="form-select" id="muRol">
                  <option value="usuario">Usuario</option>
                  <option value="gestor">Gestor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
 
              <div class="col-12 col-md-3">
                <label class="form-label fw-semibold">Estado</label>
                <select class="form-select" id="muActivo">
                  <option value="1">Activo</option>
                  <option value="0">Bloqueado</option>
                </select>
              </div>
 
            </div>
          </div>
 
          <div class="modal-footer d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-outline-danger"
              id="btnBloquearUsuario"
            >
              <i class="bi bi-slash-circle me-1"></i>
              Bloquear / Activar
            </button>
 
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" class="btn btn-primary" id="btnGuardarUsuario">
                <i class="bi bi-floppy me-1"></i>
                Guardar
              </button>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  `;
}