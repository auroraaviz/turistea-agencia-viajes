/*
=========================================
CREAR PAQUETE
-----------------------------------------
Responsabilidad:
- Escuchar botón Crear paquete
- Abrir modal nuevo paquete
- Recoger datos del formulario
- Insertar en create.php
- Refrescar listado
=========================================
*/

import { crear } from "../../utils/fetch.js";

// Mensaje carga módulo
console.log("crear paquete cargado");

// =========================================
// INICIO
// =========================================
// Espera carga del DOM y activa botón menú
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const btn =
      document.getElementById(
        "btnCrearPaquete"
      );

    if (!btn) return;

    btn.onclick = (e) => {

      e.preventDefault();

      abrirModalCrear();

    };

});

// =========================================
// ABRIR MODAL CREAR
// =========================================
// Genera ventana modal Bootstrap
function abrirModalCrear() {

    // Elimina modal anterior si existe
  const anterior =
    document.getElementById(
      "modalCrearPaquete"
    );

  if (anterior) anterior.remove();

// HTML del modal
  const html = `
  <div
    class="modal fade"
    id="modalCrearPaquete"
    tabindex="-1">

    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

      <div class="modal-content">

        <div class="modal-header justify-content-between flex-wrap gap-2">

          <div class="btn-group flex-wrap">
            <a href="#" class="btn btn-primary active" data-seccion="destino">Destino</a>
            <a href="#" class="btn btn-primary" data-seccion="hotel">Hotel</a>
            <a href="#" class="btn btn-primary" data-seccion="fechas">Fechas</a>
            <a href="#" class="btn btn-primary" data-seccion="precio">Precio</a>
            <a href="#" class="btn btn-primary" data-seccion="categoria">Categoría</a>
            <a href="#" class="btn btn-primary" data-seccion="opcionales">Opcionales</a>
          </div>

          <div class="d-flex align-items-center gap-2 ms-auto">
            <span class="fw-semibold text-primary">
              Nuevo paquete
            </span>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

        </div>


        <div
          class="modal-body overflow-auto"
          style="min-height:200px;">

          <div class="crear-seccion" data-seccion="destino">

            <div class="row g-4">

              <div class="col-md-5">
                <div
                  class="bg-light rounded shadow-sm d-flex align-items-center justify-content-center mb-3"
                  style="height:220px;">
                  <i class="bi bi-image fs-1 text-primary"></i>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Imagen paquete
                  </label>

                  <input
                    type="file"
                    class="form-control"
                    id="crearImagen"
                    accept="image/*">
                </div>
              </div>

              <div class="col-md-7">

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Título
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="crearTitulo">
                </div>


                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Destino
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="crearDestino">
                </div>


                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Descripción
                  </label>

                  <textarea
                    class="form-control"
                    id="crearDescripcion"
                    rows="5"></textarea>
                </div>

              </div>

            </div>

          </div>


          <div class="crear-seccion d-none" data-seccion="precio">

            <h3 class="fw-bold mb-4">
              Precio y plazas
            </h3>

            <div class="row g-3">


            <div class="col-12 col-md-6">
              <label class="form-label">
                Precio
              </label>

              <input
                type="number"
                step="0.01"
                class="form-control"
                id="crearPrecio">
            </div>


            <div class="col-12 col-md-6">
              <label class="form-label">
                Descuento
              </label>

              <input
                type="number"
                step="0.01"
                class="form-control"
                id="crearDescuento"
                value="0">
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">
                Plazas totales
              </label>

              <input
                type="number"
                class="form-control"
                id="crearTotales"
                value="10">
            </div>


            <div class="col-12 col-md-6">
              <label class="form-label">
                Plazas disponibles
              </label>

              <input
                type="number"
                class="form-control"
                id="crearDisponibles"
                value="10">
            </div>

            </div>

          </div>


          <div class="crear-seccion d-none" data-seccion="fechas">

            <h3 class="fw-bold mb-4">
              Fechas y salida
            </h3>

            <div class="row g-3">


            <div class="col-12 col-md-6">
              <label class="form-label">
                Fecha salida
              </label>

              <input
                type="date"
                class="form-control"
                id="crearSalida">
            </div>


            <div class="col-12 col-md-6">
              <label class="form-label">
                Fecha regreso
              </label>

              <input
                type="date"
                class="form-control"
                id="crearRegreso">
            </div>


            <div class="col-12 col-md-6">
              <label class="form-label">
                Vuelo incluido
              </label>

              <select
                class="form-select"
                id="crearVueloIncluido">

                <option value="0">
                  No
                </option>

                <option value="1">
                  Sí
                </option>

              </select>
            </div>


            <div class="col-12 col-md-6">
              <label class="form-label">
                Salida desde
              </label>

              <input
                type="text"
                class="form-control"
                id="crearSalidaDesde">
            </div>

            </div>

          </div>


          <div class="crear-seccion d-none" data-seccion="opcionales">

            <h3 class="fw-bold mb-4">
              Opcionales
            </h3>

            <div class="row g-3">


            <div class="col-12 col-md-6">
              <label class="form-label">
                Cerca de playa
              </label>

              <select
                class="form-select"
                id="crearCercaPlaya">

                <option value="0">
                  No
                </option>

                <option value="1">
                  Sí
                </option>

              </select>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">
                Activo
              </label>

              <select
                class="form-select"
                id="crearActivo">

                <option value="1">
                  Sí
                </option>

                <option value="0">
                  No
                </option>

              </select>
            </div>

            </div>

          </div>


          <div class="crear-seccion d-none" data-seccion="hotel">

            <div class="row g-4">

              <div class="col-md-5">
                <div
                  class="bg-light rounded shadow-sm d-flex align-items-center justify-content-center mb-3"
                  style="height:220px;">
                  <i class="bi bi-building fs-1 text-primary"></i>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Imagen hotel
                  </label>

                  <input
                    type="file"
                    class="form-control"
                    id="crearHotelImagen"
                    accept="image/*">
                </div>
              </div>

              <div class="col-md-7">

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Nombre hotel
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="crearHotelNombre">
                </div>


                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Estrellas hotel
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="5"
                    class="form-control"
                    id="crearHotelEstrellas"
                    value="3">
                </div>


                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Régimen hotel
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="crearHotelRegimen">
                </div>


                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Detalles hotel
                  </label>

                  <textarea
                    class="form-control"
                    id="crearHotelDetalles"
                    rows="4"></textarea>
                </div>

              </div>

            </div>

          </div>


          <div class="crear-seccion d-none" data-seccion="categoria">

            <h3 class="fw-bold mb-4">
              Categoría
            </h3>

            <div class="mb-3">
              <label class="form-label fw-semibold">
                Categoría
              </label>

              <select
                class="form-select"
                id="crearCategoria">

                <option value="vacaciones">
                  Vacaciones
                </option>

                <option value="vuelo">
                  Vuelo
                </option>

                <option value="fin_de_semana">
                  Fin de semana
                </option>

                <option value="verano">
                  Verano
                </option>

              </select>
            </div>

          </div>

        </div>


        <div class="modal-footer">

          <button
            class="btn btn-secondary"
            data-bs-dismiss="modal">
            Cancelar
          </button>

          <button
            class="btn btn-success"
            id="btnGuardarNuevo">

            Crear paquete

          </button>

        </div>

      </div>

    </div>

  </div>
  `;

// Inserta modal en body
  document.body.insertAdjacentHTML(
    "beforeend",
    html
  );

// Activa pestañas del modal crear
  activarPestanasCrear();

// Inicializa Bootstrap modal
  const modal =
    new bootstrap.Modal(
      document.getElementById(
        "modalCrearPaquete"
      )
    );


  modal.show();

// Activa botón guardar
  activarGuardar(modal);

}

// =========================================
// PESTAÑAS MODAL CREAR
// =========================================
// Muestra cada bloque del formulario
function activarPestanasCrear() {

  const botones =
    document.querySelectorAll(
      "#modalCrearPaquete .btn-group .btn"
    );

  const secciones =
    document.querySelectorAll(
      "#modalCrearPaquete .crear-seccion"
    );

  botones.forEach((boton) => {

    boton.onclick = (e) => {

      e.preventDefault();

      const seccion =
        boton.dataset.seccion;

      botones.forEach((b) =>
        b.classList.remove("active")
      );

      boton.classList.add("active");

      secciones.forEach((bloque) => {

        bloque.classList.toggle(
          "d-none",
          bloque.dataset.seccion !== seccion
        );

      });

    };

  });

}

// =========================================
// GUARDAR NUEVO PAQUETE
// =========================================
// Recoge datos y llama API create.php
function activarGuardar(modal) {

  const btn =
    document.getElementById(
      "btnGuardarNuevo"
    );

  btn.onclick = async () => {

    const datos = {

      titulo:
        document.getElementById(
          "crearTitulo"
        ).value,

      destino:
        document.getElementById(
          "crearDestino"
        ).value,

      descripcion:
        document.getElementById(
          "crearDescripcion"
        ).value,

      imagen:
        obtenerRutaImagen(
          "crearImagen",
          "assets/img/default.jpg",
          "assets/img/"
        ),

      hotel_nombre:
        document.getElementById(
          "crearHotelNombre"
        ).value,

      hotel_estrellas:
        document.getElementById(
          "crearHotelEstrellas"
        ).value,

      hotel_regimen:
        document.getElementById(
          "crearHotelRegimen"
        ).value,

      hotel_detalles:
        document.getElementById(
          "crearHotelDetalles"
        ).value,

      hotel_imagen:
        obtenerRutaImagen(
          "crearHotelImagen",
          "assets/img/hoteles/default.jpg",
          "assets/img/hoteles/"
        ),

      fecha_salida:
        document.getElementById(
          "crearSalida"
        ).value,

      fecha_regreso:
        document.getElementById(
          "crearRegreso"
        ).value,

      precio:
        document.getElementById(
          "crearPrecio"
        ).value,

      descuento:
        document.getElementById(
          "crearDescuento"
        ).value,

      plazas_totales:
        document.getElementById(
          "crearTotales"
        ).value,

      plazas_disponibles:
        document.getElementById(
          "crearDisponibles"
        ).value,

      activo:
        document.getElementById(
          "crearActivo"
        ).value,

      vuelo_incluido:
        document.getElementById(
          "crearVueloIncluido"
        ).value,

      salida_desde:
        document.getElementById(
          "crearSalidaDesde"
        ).value,

      cerca_playa:
        document.getElementById(
          "crearCercaPlaya"
        ).value,

      categoria:
        document.getElementById(
          "crearCategoria"
        ).value

    };

// Enviar datos al backend
    const respuesta =
      await crear(
        "/api/paquetes/create.php",
        datos
      );

    console.log(respuesta);

    modal.hide();

    document
      .getElementById(
        "btnTodosPaquetes"
      )
      .click();

  };

}

// =========================================
// OBTENER RUTA IMAGEN
// =========================================
// Si usuario selecciona archivo,
// devuelve ruta para guardar en BD
function obtenerRutaImagen(
  idInput,
  defecto,
  carpeta
) {

  const input =
    document.getElementById(
      idInput
    );

  if (
    input &&
    input.files.length > 0
  ) {
    return (
      carpeta +
      input.files[0].name
    );
  }

  return defecto;
}
