/*
=========================================
DETALLE PÚBLICO DE PAQUETE
-----------------------------------------
Responsabilidad:
- Leer id desde URL
- Solicitar paquete a API
- Mostrar detalle completo
- Pintar hotel, precio y extras

Vista pública del producto.
=========================================
*/

import { obtener, crear } from "../utils/fetch.js";
import { BASE } from "../config.js";

console.log("detalle.js cargado");

document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const detalle = document.getElementById("detalle");

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

    document.getElementById("paquete-imagen").src = `${BASE}/frontend/${(paquete.imagen || '').replace(/^\.\.\//, '')}`;
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
    document.getElementById("paquete-badges").innerHTML = `
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

    // Tarjeta hotel
 document.getElementById("tarjeta-hotel").innerHTML = `
  <div class="row g-0 bg-light rounded shadow-sm align-items-center">

    <!-- Imagen izquierda -->
    <div class="col-12 col-md-4">
      <img
        src="${BASE}/frontend/${(paquete.hotel_imagen || '').replace(/^\.\.\//, '')}"
        class="img-fluid w-100 h-100 object-fit-cover rounded-start"
        alt="${paquete.hotel_nombre}"
      >
    </div>

    
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
  <div class="fondo mt-3">
    <i class="bi bi-exclamation-diamond-fill"></i>Precio y disponibilidad sujetos a cambios según fechas y demanda.
  </div>

`;
//-------SINCRONIZAR PRECIO EN SIDEBAR-----------
 const srcPrecio = document.getElementById("paquete-precio");
    const dstPrecio = document.getElementById("sidebar-precio");
    if (srcPrecio && dstPrecio) {
      dstPrecio.textContent = srcPrecio.textContent.trim();
    }

//eventos despues de que el dom esté cargado

// Comprobar si ya es favorito al cargar la página
const esFavoritoRes = await obtener(`/api/favoritos/estado.php?paquete_id=${id}`);
const btnFav  = document.getElementById("btn-favorito");
const iconFav = btnFav.querySelector("i");

if (esFavoritoRes && esFavoritoRes.es_favorito) {
  iconFav.classList.replace("bi-heart", "bi-heart-fill");
  btnFav.querySelector("i").nextSibling
    ? null
    : btnFav.lastChild.textContent = " Guardado en favoritos";
  btnFav.innerHTML = `<i class="bi bi-heart-fill me-1"></i> Guardado en favoritos`;
}

btnFav.addEventListener("click", async () => {
  const yaEsFav = iconFav.classList.contains("bi-heart-fill");

  // Cambio visual inmediato (no espera respuesta del servidor)
  iconFav.classList.toggle("bi-heart");
  iconFav.classList.toggle("bi-heart-fill");
  btnFav.innerHTML = yaEsFav
    ? `<i class="bi bi-heart me-1"></i> Guardar en favoritos`
    : `<i class="bi bi-heart-fill me-1"></i> Guardado en favoritos`;

  // Llamada a la API
  const endpoint = yaEsFav
    ? "/api/favoritos/eliminar.php"
    : "/api/favoritos/agregar.php";

  const texto     = await crear(endpoint, { paquete_id: id });
  const respuesta = texto ? (() => { try { return JSON.parse(texto); } catch { return null; } })() : null;

  // Si el servidor falla revertimos el cambio visual
  if (!respuesta || !respuesta.ok) {
    iconFav.classList.toggle("bi-heart");
    iconFav.classList.toggle("bi-heart-fill");
    btnFav.innerHTML = yaEsFav
      ? `<i class="bi bi-heart-fill me-1"></i> Guardado en favoritos`
      : `<i class="bi bi-heart me-1"></i> Guardar en favoritos`;
  }
});

// -------- BOTÓN RESERVAR --------
const btnReservar = document.getElementById("btn-reservar");
if (btnReservar) {
  btnReservar.addEventListener("click", async () => {
    const numViajeros = parseInt(document.getElementById("sb-personas")?.value || "1");

    btnReservar.disabled = true;
    btnReservar.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Procesando...`;

    const texto     = await crear("/api/reservas/crear.php", {
      paquete_id:   parseInt(id),
      num_viajeros: numViajeros
    });
    const respuesta = texto ? (() => { try { return JSON.parse(texto); } catch { return null; } })() : null;

    if (respuesta && respuesta.ok) {
      btnReservar.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>¡Reserva solicitada!`;
      btnReservar.style.background = "#28a745";
      btnReservar.disabled = true;
    } else {
      const msg = respuesta?.error || "Error al crear la reserva";
      btnReservar.disabled = false;
      btnReservar.innerHTML = `<i class="bi bi-send-fill me-2"></i>Solicitar reserva`;
      alert(msg);
    }
  });
}

loading.classList.add("d-none");
detalle.classList.remove("d-none");




  } catch (e) {
    console.error("Error cargando el paquete:", e);

    loading.classList.add("d-none");
    error.classList.remove("d-none");
  }
});