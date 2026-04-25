/*
crea HTML del modal
lo inserta en DOM
llama eventos
carga vista inicial
abre modal
*/
import { mostrarDestino } from "./modalRender.js";

import {
  activarPestanas,
  activarEditar
} from "./modalEventos.js";


// Crea ventana modal
export function crearModal(paquete) {

  const anterior =
    document.getElementById(
      "miModal"
    );

  if (anterior) anterior.remove();


  const fondo =
    document.querySelector(
      ".modal-backdrop"
    );

  if (fondo) fondo.remove();


  document.body.classList.remove(
    "modal-open"
  );

  document.body.style = "";


  let html = `
  <div class="modal fade" id="miModal" tabindex="-1">

    <div class="modal-dialog modal-lg modal-dialog-centered">

      <div class="modal-content">

        <div class="modal-header justify-content-between">

          <div class="btn-group">

            <a
              href="#"
              class="btn btn-primary active"
              data-seccion="destino">
              Destino
            </a>

            <a
              href="#"
              class="btn btn-primary"
              data-seccion="hotel">
              Hotel
            </a>

            <a
              href="#"
              class="btn btn-primary"
              data-seccion="fechas">
              Fechas
            </a>

            <a
              href="#"
              class="btn btn-primary"
              data-seccion="precio">
              Precio
            </a>

            <a
              href="#"
              class="btn btn-primary">
              Categoría
            </a>

            <a
              href="#"
              class="btn btn-primary">
              Opcionales
            </a>

          </div>


          <div class="d-flex align-items-center gap-2 ms-auto">

            <button
              class="btn btn-outline-primary btn-sm"
              id="btnEditarModal">
              Editar
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
          style="height:320px;">
        </div>

      </div>

    </div>

  </div>
  `;


  document.body.insertAdjacentHTML(
    "beforeend",
    html
  );


  const botones =
    document.querySelectorAll(
      "#miModal .btn-group .btn"
    );


  // Activa eventos
  activarPestanas(
    botones,
    paquete
  );

  activarEditar();


  // Vista inicial
  mostrarDestino(paquete);


  const modal =
    new bootstrap.Modal(
      document.getElementById(
        "miModal"
      )
    );

  modal.show();

}