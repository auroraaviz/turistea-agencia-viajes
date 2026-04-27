/*
=========================================
FORMULARIOS DE EDICIÓN DEL MODAL
-----------------------------------------
Responsabilidad:
- Renderizar formularios HTML
- Mostrar inputs según pestaña activa
- Precargar datos actuales del paquete

Cada función pinta una sección editable
=========================================
*/

import {
  obtenerImagen,
  obtenerImagenHotel
} from "./helpers.js";


// ===========================
// FORMULARIO DESTINO
// ===========================
// Formulario editable:
// datos principales del destino
export function mostrarFormularioDestino(paquete) {

  const cont = document.getElementById("contenidoModal");

  cont.innerHTML = `
    <div class="row g-4">

      <div class="col-md-5">
        <img
          src="${obtenerImagen(paquete)}"
          class="img-fluid rounded shadow-sm w-100 mb-3"
          style="height:220px;object-fit:cover;"
        >

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Cambiar imagen
          </label>

          <input
            type="file"
            id="editImagen"
            class="form-control"
            accept="image/*"
          >
        </div>
      </div>

      <div class="col-md-7">

        <div class="mb-3">
          <label class="form-label fw-semibold">Título</label>
          <input
            type="text"
            id="editTitulo"
            class="form-control"
            value="${paquete.titulo || ""}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Destino</label>
          <input
            type="text"
            id="editDestino"
            class="form-control"
            value="${paquete.destino || ""}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Descripción</label>
          <textarea
            id="editDescripcion"
            class="form-control"
            rows="5"
          >${paquete.descripcion || ""}</textarea>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Cerca de la playa
          </label>

          <select id="editCercaPlaya" class="form-select">
            <option value="1" ${paquete.cerca_playa == 1 ? "selected" : ""}>
              Sí
            </option>
            <option value="0" ${paquete.cerca_playa == 0 ? "selected" : ""}>
              No
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Estado</label>

          <select id="editActivo" class="form-select">
            <option value="1" ${paquete.activo == 1 ? "selected" : ""}>
              Activo
            </option>
            <option value="0" ${paquete.activo == 0 ? "selected" : ""}>
              Inactivo
            </option>
          </select>
        </div>

      </div>
    </div>
  `;
}


// ===========================
// FORMULARIO HOTEL
// ===========================
export function mostrarFormularioHotel(paquete) {

  const cont = document.getElementById("contenidoModal");

  cont.innerHTML = `
    <div class="row g-4">

      <div class="col-md-5">
        <img
          src="${obtenerImagenHotel(paquete)}"
          class="img-fluid rounded shadow-sm w-100 mb-3"
          style="height:220px;object-fit:cover;"
        >

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Cambiar imagen hotel
          </label>

          <input
            type="file"
            id="editHotelImagen"
            class="form-control"
            accept="image/*"
          >
        </div>
      </div>

      <div class="col-md-7">

        <div class="mb-3">
          <label class="form-label fw-semibold">Nombre hotel</label>
          <input
            type="text"
            id="editHotelNombre"
            class="form-control"
            value="${paquete.hotel_nombre || ""}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Estrellas</label>
          <input
            type="number"
            id="editHotelEstrellas"
            class="form-control"
            min="1"
            max="5"
            value="${paquete.hotel_estrellas || 1}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Régimen</label>
          <input
            type="text"
            id="editHotelRegimen"
            class="form-control"
            value="${paquete.hotel_regimen || ""}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Detalles</label>
          <textarea
            id="editHotelDetalles"
            class="form-control"
            rows="4"
          >${paquete.hotel_detalles || ""}</textarea>
        </div>

      </div>
    </div>
  `;
}


// ===========================
// FORMULARIO FECHAS
// ===========================
export function mostrarFormularioFechas(paquete) {

  const cont = document.getElementById("contenidoModal");

  cont.innerHTML = `
    <div class="row g-4">
      <div class="col-md-12">

        <h3 class="fw-bold mb-4">
          Editar fechas
        </h3>

        <div class="mb-3">
          <label class="form-label fw-semibold">Fecha salida</label>
          <input
            type="date"
            id="editFechaSalida"
            class="form-control"
            value="${paquete.fecha_salida || ""}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Fecha regreso</label>
          <input
            type="date"
            id="editFechaRegreso"
            class="form-control"
            value="${paquete.fecha_regreso || ""}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Vuelo incluido</label>

          <select id="editVueloIncluido" class="form-select">
            <option value="1" ${paquete.vuelo_incluido == 1 ? "selected" : ""}>
              Sí
            </option>
            <option value="0" ${paquete.vuelo_incluido == 0 ? "selected" : ""}>
              No
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Salida desde</label>
          <input
            type="text"
            id="editSalidaDesde"
            class="form-control"
            value="${paquete.salida_desde || ""}"
          >
        </div>

      </div>
    </div>
  `;
}


// ===========================
// FORMULARIO PRECIO
// ===========================
export function mostrarFormularioPrecio(paquete) {

  const cont = document.getElementById("contenidoModal");

  cont.innerHTML = `
    <div class="row g-4">
      <div class="col-md-12">

        <h3 class="fw-bold mb-4">
          Editar precio y plazas
        </h3>

        <div class="mb-3">
          <label class="form-label fw-semibold">Precio</label>
          <input
            type="number"
            step="0.01"
            id="editPrecio"
            class="form-control"
            value="${paquete.precio || 0}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Descuento %</label>
          <input
            type="number"
            step="0.01"
            id="editDescuento"
            class="form-control"
            value="${paquete.descuento || 0}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Plazas totales</label>
          <input
            type="number"
            id="editPlazasTotales"
            class="form-control"
            value="${paquete.plazas_totales || 0}"
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Plazas disponibles</label>
          <input
            type="number"
            id="editPlazasDisponibles"
            class="form-control"
            value="${paquete.plazas_disponibles || 0}"
          >
        </div>

      </div>
    </div>
  `;
}


// ===========================
// FORMULARIO CATEGORIA
// ===========================
export function mostrarFormularioCategoria(paquete) {

  const cont = document.getElementById("contenidoModal");

  cont.innerHTML = `
    <div class="row g-4">
      <div class="col-md-12">

        <h3 class="fw-bold mb-4">
          Editar categoría
        </h3>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Categoría
          </label>

          <select
            id="editCategoria"
            class="form-select"
          >

            <option value="vuelo"
              ${paquete.categoria === "vuelo" ? "selected" : ""}>
              Vuelo
            </option>

            <option value="vacaciones"
              ${paquete.categoria === "vacaciones" ? "selected" : ""}>
              Vacaciones
            </option>

            <option value="fin_de_semana"
              ${paquete.categoria === "fin_de_semana" ? "selected" : ""}>
              Fin de semana
            </option>

            <option value="verano"
              ${paquete.categoria === "verano" ? "selected" : ""}>
              Verano
            </option>

          </select>

        </div>

      </div>
    </div>
  `;
}


// ===========================
// FORMULARIO OPCIONALES
// ===========================
export function mostrarFormularioOpcionales(paquete) {

  const cont = document.getElementById("contenidoModal");

  cont.innerHTML = `
    <div class="row g-4">
      <div class="col-md-12">

        <h3 class="fw-bold mb-4">
          Editar opcionales
        </h3>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Vuelo incluido
          </label>

          <select id="editOpcionalVuelo" class="form-select">
            <option value="1" ${paquete.vuelo_incluido == 1 ? "selected" : ""}>
              Sí
            </option>
            <option value="0" ${paquete.vuelo_incluido == 0 ? "selected" : ""}>
              No
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Cerca de la playa
          </label>

          <select id="editOpcionalPlaya" class="form-select">
            <option value="1" ${paquete.cerca_playa == 1 ? "selected" : ""}>
              Sí
            </option>
            <option value="0" ${paquete.cerca_playa == 0 ? "selected" : ""}>
              No
            </option>
          </select>
        </div>

      </div>
    </div>
  `;
}