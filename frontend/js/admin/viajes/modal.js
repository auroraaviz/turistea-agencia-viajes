import { obtenerImagen, obtenerImagenHotel } from './helpers.js';
import { BASE } from '../../config.js';

export function crearModal(paquete) {
  const anterior = document.getElementById('miModal');

  if (anterior) anterior.remove();

  const fondo = document.querySelector('.modal-backdrop');

  if (fondo) fondo.remove();

  document.body.classList.remove('modal-open');
  document.body.style = '';

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

            <a href="#" class="btn btn-primary"
            data-seccion="fechas">
              Fechas
            </a>

            <a href="#" class="btn btn-primary"
            data-seccion="precio">
              Precio
            </a>

            <a href="#" class="btn btn-primary">
              Categoría
            </a>

            <a href="#" class="btn btn-primary">
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
  style="height:320px;"
>
</div>

      </div>

    </div>

  </div>
  `;

  function mostrarDestino(paquete) {
    const cont = document.getElementById('contenidoModal');

    cont.innerHTML = `
    
      <div class="row g-4">

        <div class="col-md-5">

          <img
            src="${obtenerImagen(paquete)}"
            class="img-fluid rounded shadow-sm w-100"
            style="height:280px;object-fit:cover;"
          >

        </div>

        <div class="col-md-7">

          <h3 class="fw-bold">
            ${paquete.titulo}
          </h3>

          <p>
            <strong>Destino:</strong>
            ${paquete.destino}
          </p>

          <p>
            <strong>Descripción:</strong><br>
            ${paquete.descripcion || 'Sin descripción'}
          </p>
         
          <p>
  <strong>Cerca de la playa:</strong>
  ${paquete.cerca_playa == 1 ? 'Sí' : 'No'}
</p>
          <div class="mt-4">

  <span class="
    btn
    btn-sm
    ${paquete.activo == 1
      ? "btn-success"
      : "btn-secondary"}
    disabled
  ">

    ${paquete.activo == 1
      ? "Activo"
      : "Inactivo"}

  </span>

</div>

        </div>

      </div>
    `;
  }

  //Muestra el hotel
  function mostrarHotel(paquete) {
    const cont = document.getElementById('contenidoModal');

    cont.innerHTML = `

      <div class="row g-4">

        <div class="col-md-5">

          <img
            src="${obtenerImagenHotel(paquete)}"
            class="img-fluid rounded shadow-sm w-100"
            style="height:280px;object-fit:cover;"
          >

        </div>

        <div class="col-md-7">

          <h3 class="fw-bold">
            ${paquete.hotel_nombre}
          </h3>

          <p>
            <strong>Estrellas:</strong>
            ${'⭐'.repeat(paquete.hotel_estrellas)}
          </p>

          <p>
            <strong>Régimen:</strong>
            ${paquete.hotel_regimen}
          </p>

          <p>
            <strong>Detalles:</strong><br>
            ${paquete.hotel_detalles || 'Sin detalles'}
          </p>

        </div>

      </div>
    `;
  }

  //Mostrar fechas
  function mostrarFechas(paquete) {
    const cont = document.getElementById('contenidoModal');

    cont.innerHTML = `

    <div class="row g-4">

      <div class="col-md-12">

        <h3 class="fw-bold mb-4">
          Fechas del paquete
        </h3>

        <p>
          <strong>Salida:</strong>
          ${paquete.fecha_salida}
        </p>

        <p>
          <strong>Regreso:</strong>
          ${paquete.fecha_regreso}
        </p>

        <p>
          <strong>Vuelo incluido:</strong>
          ${paquete.vuelo_incluido == 1 ? 'Sí' : 'No'}
        </p>

        ${
          paquete.vuelo_incluido == 1
            ? `
            <p>
              <strong>Salida desde:</strong>
              ${paquete.salida_desde || 'Sin indicar'}
            </p>
          `
            : ''
        }

      </div>

    </div>

  `;
  }

  //Muestra Precios
  function mostrarPrecio(paquete) {
    const cont = document.getElementById('contenidoModal');

    const precio = parseFloat(paquete.precio) || 0;

    const descuento = parseFloat(paquete.descuento) || 0;

    const precioFinal = precio - (precio * descuento) / 100;

    cont.innerHTML = `

    <div class="row g-4">

      <div class="col-md-12">

        <h3 class="fw-bold mb-4">
          Información económica
        </h3>

        <p>
          <strong>Precio base:</strong>
          ${precio.toFixed(2)} €
        </p>

        <p>
          <strong>Descuento:</strong>
          ${descuento} %
        </p>

        <p class="fs-4 text-success fw-bold">
          Precio final:
          ${precioFinal.toFixed(2)} €
        </p>

        <hr>

        <p>
          <strong>Plazas totales:</strong>
          ${paquete.plazas_totales ?? '-'}
        </p>

        <p>
          <strong>Plazas disponibles:</strong>
          ${paquete.plazas_disponibles ?? '-'}
        </p>

      </div>

    </div>

  `;
  }

  document.body.insertAdjacentHTML('beforeend', html);

  const botones = document.querySelectorAll('#miModal .btn-group .btn');

  //seccion botones
  botones.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();

      botones.forEach((b) => {
        b.classList.remove('active');
      });

      btn.classList.add('active');

      const seccion = btn.dataset.seccion;

      if (seccion === 'destino') {
        mostrarDestino(paquete);
      }

      if (seccion === 'hotel') {
        mostrarHotel(paquete);
      }

      if (seccion === 'fechas') {
        mostrarFechas(paquete);
      }

      if (seccion === 'precio') {
        mostrarPrecio(paquete);
      }
    };
  });

  mostrarDestino(paquete);

  const modal = new bootstrap.Modal(document.getElementById('miModal'));

  modal.show();

  //Botón de edición
  const btnEditar =
  document.getElementById(
    "btnEditarModal"
  );

let editando = false;

btnEditar.onclick = () => {

  editando = !editando;

  if (editando) {

    btnEditar.classList.add(
      "active",
      "btn-primary"
    );

    btnEditar.classList.remove(
      "btn-outline-primary"
    );

    btnEditar.textContent =
      "Editando";

  } else {

    btnEditar.classList.remove(
      "active",
      "btn-primary"
    );

    btnEditar.classList.add(
      "btn-outline-primary"
    );

    btnEditar.textContent =
      "Editar";

  }

};
}
