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

    <div class="modal-dialog modal-lg modal-dialog-centered">

      <div class="modal-content">

        <div class="modal-header">

          <h5 class="modal-title">
            Nuevo paquete
          </h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal">
          </button>

        </div>


        <div class="modal-body">

          <div class="row g-3">

            <div class="col-md-6">
              <label class="form-label">
                Título
              </label>

              <input
                type="text"
                class="form-control"
                id="crearTitulo">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Destino
              </label>

              <input
                type="text"
                class="form-control"
                id="crearDestino">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Precio
              </label>

              <input
                type="number"
                class="form-control"
                id="crearPrecio">
            </div>


            <div class="col-md-6">
              <label class="form-label">
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


            <div class="col-md-6">
              <label class="form-label">
                Fecha salida
              </label>

              <input
                type="date"
                class="form-control"
                id="crearSalida">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Fecha regreso
              </label>

              <input
                type="date"
                class="form-control"
                id="crearRegreso">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Plazas totales
              </label>

              <input
                type="number"
                class="form-control"
                id="crearTotales"
                value="10">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Plazas disponibles
              </label>

              <input
                type="number"
                class="form-control"
                id="crearDisponibles"
                value="10">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Imagen paquete
              </label>

              <input
                type="file"
                class="form-control"
                id="crearImagen">
            </div>


            <div class="col-md-6">
              <label class="form-label">
                Imagen hotel
              </label>

              <input
                type="file"
                class="form-control"
                id="crearHotelImagen">
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

      descripcion: "",

      imagen:
        obtenerRutaImagen(
          "crearImagen",
          "assets/img/default.jpg",
          "assets/img/"
        ),

      hotel_nombre: "",

      hotel_estrellas: 3,

      hotel_regimen: "",

      hotel_detalles: "",

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

      descuento: 0,

      plazas_totales:
        document.getElementById(
          "crearTotales"
        ).value,

      plazas_disponibles:
        document.getElementById(
          "crearDisponibles"
        ).value,

      activo: 1,

      vuelo_incluido: 0,

      salida_desde: "",

      cerca_playa: 0,

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