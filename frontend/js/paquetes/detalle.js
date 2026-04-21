
import { obtener } from "../utils/fetch.js";
import { BASE } from "../config.js";
console.log("detalle.js cargado");
document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const detalle = document.getElementById("detalle");
  const container = document.getElementById("container");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Si no viene id
  if (!id) {
    loading.classList.add("d-none");
    error.classList.remove("d-none");
    return;
  }

  try {
    // Consulta al PHP con id
    const paquete = await obtener(
      `/api/paquetes/get.php?id=${id}`
    );

    // Si no existe paquete
    if (!paquete || !paquete.id) {
      loading.classList.add("d-none");
      error.classList.remove("d-none");
      return;
    }

    // -------- CABECERA --------
    document.title = `${paquete.titulo} - Turistea`;

<<<<<<< HEAD
    document.getElementById("paquete-imagen").src = `${BASE}/frontend/${(paquete.imagen || '').replace(/^\.\.\//, '')}`;
=======
    document.getElementById("paquete-imagen").src = paquete.imagen;
>>>>>>> 4d8e5d7 (Traigo archivos detalles.js, get.php y detalle.html desde juanluis)
    document.getElementById("paquete-imagen").alt = paquete.titulo;

    document.getElementById("paquete-titulo").textContent = paquete.titulo;

    document
      .getElementById("paquete-destino")
      .querySelector("span").textContent = paquete.destino;

    document.getElementById("paquete-info-corta").textContent =
      `${paquete.fecha_salida} - ${paquete.fecha_regreso} · ` +
      `${paquete.plazas_disponibles} plazas disponibles`;

    document.getElementById(
      "paquete-precio"
    ).textContent = `${paquete.precio}€`;

    document.getElementById("paquete-descripcion").textContent =
      paquete.descripcion;

    document.getElementById("paquete-detalles-extra").textContent =
      `Plazas disponibles: ${paquete.plazas_disponibles} / ${paquete.plazas_totales}`;

    // -------- BADGES --------
    const badges = document.getElementById("paquete-badges");

    badges.innerHTML = `
      ${
        paquete.vuelo_incluido == 1
          ? `<span class="badge bg-primary me-2">Vuelo incluido</span>`
          : ""
      }

      ${
        paquete.cerca_playa == 1
          ? `<span class="badge bg-warning text-dark me-2">Cerca de la playa</span>`
          : ""
      }

      ${
        paquete.salida_desde
          ? `<span class="badge bg-secondary">Salida: ${paquete.salida_desde}</span>`
          : ""
      }
    `;

    // -------- BOTÓN FAVORITO --------
    document
      .getElementById("btn-favorito")
      .addEventListener("click", () => {
        const icon = document.querySelector("#btn-favorito i");

        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");
      });

    // Mostrar detalle principal
    loading.classList.add("d-none");
    detalle.classList.remove("d-none");


    // Tarjeta hotel
 document.getElementById("tarjeta-hotel").innerHTML = `
  <div class="row g-0 bg-light rounded shadow-sm align-items-center">

    <!-- Imagen izquierda -->
    <div class="col-12 col-md-4">
      <img
<<<<<<< HEAD
        src="${BASE}/frontend/${(paquete.hotel_imagen || '').replace(/^\.\.\//, '')}"
=======
        src="${paquete.hotel_imagen}"
>>>>>>> 4d8e5d7 (Traigo archivos detalles.js, get.php y detalle.html desde juanluis)
        class="img-fluid w-100 h-100 object-fit-cover rounded-start"
        alt="${paquete.hotel_nombre}"
      >
    </div>

    <!-- Información central -->
    <div class="col-12 col-md-5">
      <div class="card-body text-center">

        <h4 class="card-title"><strong>${paquete.hotel_nombre}</strong></h4>

        <p>${"⭐".repeat(paquete.hotel_estrellas)}</p>

        <p class="card-text">${paquete.hotel_detalles}</p>

        <p><strong>${paquete.noches}</strong> noches</p>

        <p>
          <strong>Régimen:</strong>
          ${paquete.hotel_regimen}
        </p>

      </div>
    </div>

    <!-- Precio derecha -->
    <div class="col-12 col-md-3 text-center p-3">

      ${
        paquete.cerca_playa == 1
          ? `
            <p class="mb-2">
              <i class="bi bi-brightness-high-fill text-warning me-1"></i>
              Cerca de la playa
            </p>
          `
          : ""
      }

      <p class="m-0 fuente_peq">
        Precio final paquete completo
      </p>

      <h4 class="text-primary">
        ${paquete.precio}€
      </h4>

      <p class="mb-0 fuente_peq">
        Precio por persona
      </p>

    </div>

  </div>
`;

// -------- INFORMACION ADICIONAL -----------
document.getElementById("informacion-adicional").innerHTML = `
  <h4><strong>Información adicional</strong></h4>

  <h5>✅ ¿Qué incluye la oferta?</h5>

  <p class="mt-3">
    <i class="bi bi-airplane-fill me-2 text-primary"></i>
    Vuelos incluidos:
    <b>${paquete.vuelo_incluido == 1 ? "Sí" : "No"}</b>
    ${
      paquete.vuelo_incluido == 1
        ? ` - Salida desde: <b>${paquete.salida_desde}</b>`
        : ""
    }
  </p>

  <p>
    <i class="bi bi-building me-2 text-primary"></i>
    Alojamiento en <b>${paquete.hotel_nombre}</b>
  </p>

  <p>
    <i class="bi bi-cup-hot me-2 text-primary"></i>
    Régimen:
    <b>${paquete.hotel_regimen}</b>
  </p>

  <p>
    <i class="bi bi-moon-stars me-2 text-primary"></i>
    Estancia de <b>${paquete.noches}</b> noches
  </p>

  <p>
    <i class="bi bi-headset me-2 text-primary"></i>
    Atención al cliente antes y durante el viaje
  </p>

  <hr>

  <h5>❌ ¿Qué no incluye la oferta?</h5>

  <p  class="mt-3">
    <i class="bi bi-x-circle me-2 text-danger"></i>
    Extras no especificados en la reserva
  </p>

  <p>
    <i class="bi bi-x-circle me-2 text-danger"></i>
    Seguro opcional de cancelación
  </p>

  <p>
    <i class="bi bi-x-circle me-2 text-danger"></i>
    Gastos personales durante la estancia
  </p>

`;  

//------------ AVISO -------------
document.getElementById("aviso").innerHTML = `
  <div class="fondo mt-3 pequeño">
    <i class="bi bi-exclamation-diamond-fill fs-3 m-3 align-content-center"></i>Precio y disponibilidad sujetos a cambios según fechas y demanda.
  </div>

`
 
/*
    // -------- CONTENIDO EXTRA --------
    container.innerHTML = `
      <div class="mb-4">
        <h2>A destacar</h2>

        <div class="row">
          
          </div>

          <div class="col-12 col-md-6">
            
            }
          </div>
        </div>
      </div>

      <hr>

      <h2>Detalles de la oferta</h2>

      <p>
        <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
        Turistea no se hace responsable de retrasos y cancelaciones en vuelos
      </p>

      <div class="container fondo p-4">

        <div class="row-cols-3 bg-light d-flex rounded-2">

          <div class="p-0">
            <img
              src="${paquete.hotel_imagen}"
              class="img-fluid w-100 rounded"
              alt="${paquete.hotel_nombre}"
            >
          </div>

          <div class="p-2">
            <h4 class="text-center estrellas mt-2">
              ${paquete.hotel_nombre}
            </h4>

            <p class="text-center estrellas">
              ${"★".repeat(paquete.hotel_estrellas || 0)}
            </p>

            <ul class="fuente_peq lista-check">
              <li>Equipaje de mano incluido</li>
              <li>Añade traslado al aeropuerto más tarde</li>
            </ul>

            <p class="fuente_peq text-center">
              <strong>Régimen:</strong> ${paquete.hotel_regimen}
            </p>
          </div>

          <div class="align-content-center p-2">

            <div class="row row-cols-2 fuente_peq">
              <div><strong>Salida:</strong> ${paquete.fecha_salida}</div>
              <div><strong>Regreso:</strong> ${paquete.fecha_regreso}</div>
            </div>

            

            <p class="fuente_peq">
              <strong>Descuento:</strong> ${paquete.descuento}%
            </p>

            <p class="fuente_peq">
              <strong>Plazas:</strong>
              ${paquete.plazas_disponibles} / ${paquete.plazas_totales}
            </p>

          </div>

        </div>

      </div>

      <p class="mt-3">
        🪙 Precio y disponibilidad a fecha de publicación.
      </p>

      <hr>

      <h3>🏨 ¿Dónde te alojarás?</h3>

      <p>
        En esta ocasión hemos escogido
        <strong>${paquete.hotel_nombre}</strong>
      </p>

      <img
        src="${paquete.hotel_imagen}"
        class="img-fluid rounded"
        alt="${paquete.hotel_nombre}"
      >
    `;
   */

  } catch (e) {
    console.log(e);

    loading.classList.add("d-none");
    error.classList.remove("d-none");
  }
});