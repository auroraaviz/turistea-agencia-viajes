/*
=========================================
MODAL PRINCIPAL ADMIN TURISTEA
-----------------------------------------
Responsabilidad:
- Crear el HTML del modal dinámicamente
- Insertarlo en el DOM
- Activar eventos de pestañas
- Activar modo edición
- Mostrar vista inicial
- Abrir modal Bootstrap

Entrada:
- paquete => objeto con datos del viaje

Uso:
crearModal(paquete)

=========================================
*/

import { mostrarDestino } from "./modalRender.js";

import {
  activarPestanas,
  activarEditar,
  activarBorrar
} from "./modalEventos.js";

// Genera una nueva instancia del modal
// eliminando restos anteriores si existen
export function crearModal(paquete) {

  const anterior = document.getElementById("miModal");
  if (anterior) anterior.remove();

  const fondo = document.querySelector(".modal-backdrop");
  if (fondo) fondo.remove();

  document.body.classList.remove("modal-open");
  document.body.style = "";

  // Construcción dinámica del contenido HTML
// del modal con pestañas y botón editar
  let html = `
  <div class="modal fade" id="miModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header justify-content-between">

          <div class="btn-group">
            <a href="#" class="btn btn-primary active" data-seccion="destino">Destino</a>
            <a href="#" class="btn btn-primary" data-seccion="hotel">Hotel</a>
            <a href="#" class="btn btn-primary" data-seccion="fechas">Fechas</a>
            <a href="#" class="btn btn-primary" data-seccion="precio">Precio</a>
            <a href="#" class="btn btn-primary" data-seccion="categoria">Categoría</a>
            <a href="#" class="btn btn-primary" data-seccion="opcionales">Opcionales</a>
          </div>

          <div class="d-flex align-items-center gap-2 ms-auto">
            <button
              class="btn btn-outline-primary btn-sm"
              id="btnEditarModal">
              Editar
            </button>

            <button
  class="btn btn-outline-danger btn-sm"
  id="btnBorrarModal">
  Borrar
</button>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

        </div>

        <div
          class="modal-body overflow-auto"
          id="contenidoModal"
          style="height:400px;">
        </div>

      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const botones =
    document.querySelectorAll("#miModal .btn-group .btn");

  activarPestanas(botones, paquete);
  activarEditar(paquete);
  activarBorrar(paquete);

  mostrarDestino(paquete);

  const modal =
    new bootstrap.Modal(
      document.getElementById("miModal")
    );

  modal.show();
}