/*
=========================================
VISTAS DE SOLO LECTURA DEL MODAL
-----------------------------------------
Responsabilidad:
- Mostrar datos del paquete
- Renderizar contenido visual
- No modifica datos

Modo visual del modal
=========================================
*/

import {
  obtenerImagen,
  obtenerImagenHotel
} from "./helpers.js";


// Muestra datos de destino
export function mostrarDestino(paquete) {

  const cont =
    document.getElementById(
      "contenidoModal"
    );

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
          ${paquete.descripcion || "Sin descripción"}
        </p>

        <p>
          <strong>Cerca de la playa:</strong>
          ${paquete.cerca_playa == 1 ? "Sí" : "No"}
        </p>

        <div class="mt-4">

          <span class="
            btn
            btn-sm
            ${
              paquete.activo == 1
              ? "btn-success"
              : "btn-secondary"
            }
            disabled
          ">

            ${
              paquete.activo == 1
              ? "Activo"
              : "Inactivo"
            }

          </span>

        </div>

      </div>

    </div>
  `;
}


// Muestra el hotel
export function mostrarHotel(paquete) {

  const cont =
    document.getElementById(
      "contenidoModal"
    );

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
          ${"⭐".repeat(paquete.hotel_estrellas)}
        </p>

        <p>
          <strong>Régimen:</strong>
          ${paquete.hotel_regimen}
        </p>

        <p>
          <strong>Detalles:</strong><br>
          ${paquete.hotel_detalles || "Sin detalles"}
        </p>

      </div>

    </div>
  `;
}


// Muestra fechas del paquete
export function mostrarFechas(paquete) {

  const cont =
    document.getElementById(
      "contenidoModal"
    );

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
          ${
            paquete.vuelo_incluido == 1
            ? "Sí"
            : "No"
          }
        </p>

        ${
          paquete.vuelo_incluido == 1
          ? `
            <p>
              <strong>Salida desde:</strong>
              ${paquete.salida_desde || "Sin indicar"}
            </p>
          `
          : ""
        }

      </div>

    </div>

  `;
}


// Muestra precios y plazas
export function mostrarPrecio(paquete) {

  const cont =
    document.getElementById(
      "contenidoModal"
    );

  const precio =
    parseFloat(paquete.precio) || 0;

  const descuento =
    parseFloat(paquete.descuento) || 0;

  const precioFinal =
    precio - (precio * descuento / 100);

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
          ${paquete.plazas_totales ?? "-"}
        </p>

        <p>
          <strong>Plazas disponibles:</strong>
          ${paquete.plazas_disponibles ?? "-"}
        </p>

      </div>

    </div>

  `;

}


// Muestra Categoria
export function mostrarCategoria(paquete) {

  const cont =
    document.getElementById(
      "contenidoModal"
    );


  cont.innerHTML = `

<div>
    <h1 class="text-bg-secondary text-center">Mostrando categoria</h1>
</div>

  `;
}


// Muestra Opcionales
export function mostrarOpcionales(paquete) {

  const cont =
    document.getElementById(
      "contenidoModal"
    );


  cont.innerHTML = `

<div>
    <h1 class="text-bg-secondary text-center">Mostrando opcionales</h1>
</div>

  `;
}