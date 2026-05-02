import { abrirModal } from './modal.js';
import { state } from './clientesState.js';
 
export function activarEventosTabla() {
  document.querySelectorAll('.fila-usuario').forEach((fila) => {
    fila.addEventListener('click', () => {
      const id = parseInt(fila.dataset.id);
      console.log('click en fila id:', id);
      console.log('state.usuarios:', state.usuarios);
      const usuario = state.usuarios.find((u) => u.id == id);
      console.log('usuario encontrado:', usuario);
      if (usuario) abrirModal(usuario);
    });
  });
}