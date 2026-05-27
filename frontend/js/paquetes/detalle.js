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
  const error   = document.getElementById("error");
  const detalle = document.getElementById("detalle");

  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id");

  if (!id) {
    loading.classList.add("d-none");
    error.classList.remove("d-none");
    return;
  }

  try {
    const paquete = await obtener(`/api/paquetes/get.php?id=${id}`);

    if (!paquete || !paquete.id) {
      loading.classList.add("d-none");
      error.classList.remove("d-none");
      return;
    }

    // ── CABECERA ──────────────────────────────────────────────
    document.title = `${paquete.titulo} - Turistea`;

    document.getElementById("paquete-imagen").src = `${BASE}/frontend/${(paquete.imagen || '').replace(/^\.\.\//, '')}`;
    document.getElementById("paquete-imagen").alt = paquete.titulo;

    document.getElementById("paquete-titulo").textContent = paquete.titulo;

    document.getElementById("paquete-destino")
      .querySelector("span").textContent = paquete.destino;

    // Fechas formateadas
    const fmt = (f) => f
      ? new Date(f).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' })
      : '-';

    document.getElementById("paquete-info-corta").innerHTML =
      `<i class="bi bi-calendar3 me-1 opacity-75"></i>${fmt(paquete.fecha_salida)} &nbsp;→&nbsp; ${fmt(paquete.fecha_regreso)}
       &nbsp;<span class="opacity-50">·</span>&nbsp;
       <i class="bi bi-people me-1 opacity-75"></i>${paquete.plazas_disponibles} plazas disponibles`;

    const precioFinal = parseFloat(paquete.descuento) > 0
    ? (paquete.precio - (paquete.precio * paquete.descuento / 100)).toFixed(0)
    : parseFloat(paquete.precio).toFixed(0);

    document.getElementById("paquete-precio").textContent = `${precioFinal}€`;

    document.getElementById("paquete-descripcion").textContent = paquete.descripcion;

    document.getElementById("paquete-detalles-extra").textContent =
      `Plazas disponibles: ${paquete.plazas_disponibles} / ${paquete.plazas_totales}`;

    // ── BADGES ───────────────────────────────────────────────
    document.getElementById("paquete-badges").innerHTML = `
      ${paquete.vuelo_incluido == 1
        ? `<span class="badge bg-primary">Vuelo incluido</span>`
        : ''}
      ${paquete.cerca_playa == 1
        ? `<span class="badge bg-warning text-dark">Cerca de la playa</span>`
        : ''}
      ${paquete.salida_desde
        ? `<span class="badge bg-secondary">Salida: ${paquete.salida_desde}</span>`
        : ''}
    `;

    // ── TARJETA HOTEL ─────────────────────────────────────────
    const estrellas = parseInt(paquete.hotel_estrellas) || 0;
    const estrellasHtml = estrellas > 0
      ? `<span class="text-warning">${'<i class="bi bi-star-fill"></i>'.repeat(estrellas)}</span>`
      : '';

    document.getElementById("tarjeta-hotel").innerHTML = `
      <div class="row g-0 bg-white align-items-stretch">

        <!-- Imagen -->
        <div class="col-12 col-md-4" style="min-height:200px;">
          <img
            src="${BASE}/frontend/${(paquete.hotel_imagen || '').replace(/^\.\.\//, '')}"
            class="w-100 h-100"
            style="object-fit:cover;min-height:200px;"
            alt="${paquete.hotel_nombre}"
          >
        </div>

        <!-- Info principal -->
        <div class="col-12 col-md-5 p-4 d-flex flex-column justify-content-center">
          <div class="mb-1">${estrellasHtml}</div>
          <h4 class="fw-bold mb-1" style="color:#0077B6">${paquete.hotel_nombre}</h4>
          <p class="text-muted small mb-3">${paquete.destino}</p>

          <div class="d-flex flex-wrap gap-3">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-moon-stars-fill text-info"></i>
              <span class="fw-semibold">${paquete.noches} noches</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-cup-hot-fill text-info"></i>
              <span class="fw-semibold">${paquete.hotel_regimen}</span>
            </div>
            ${paquete.cerca_playa == 1 ? `
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-water text-info"></i>
              <span class="fw-semibold">Cerca de la playa</span>
            </div>` : ''}
          </div>
        </div>

        <!-- Precio -->
        <div class="col-12 col-md-3 d-flex flex-column align-items-center justify-content-center p-4 text-center"
          style="background:linear-gradient(160deg,#f0faff,#e4f4fb);border-left:3px solid #00B4D8;">
          <div class="text-uppercase text-secondary fw-bold mb-1" style="font-size:.7rem;letter-spacing:.1em">
           Precio total
          </div>
          ${parseFloat(paquete.descuento) > 0 ? `
          <div class="text-muted text-decoration-line-through" style="font-size:1rem">${parseFloat(paquete.precio).toFixed(0)}€</div>
          <span class="badge rounded-pill mb-1" style="background:#FF6B6B;color:#fff;font-size:.7rem">-${parseFloat(paquete.descuento).toFixed(0)}%</span>
          ` : ''}
          <div class="fw-bold lh-1 mb-1" style="font-size:2rem;color:#0077B6">${precioFinal}€</div>
          <div class="text-muted small">por persona</div>
        </div>

      </div>
    `;

    // ── INFORMACIÓN ADICIONAL ─────────────────────────────────
    document.getElementById("informacion-adicional").innerHTML = `
      <div class="row g-4">

        <!-- Incluye -->
        <div class="col-12 col-md-6">
          <p class="text-uppercase fw-bold text-success mb-3" style="font-size:.78rem;letter-spacing:.14em">
            <i class="bi bi-check-circle-fill me-1"></i>Qué incluye
          </p>
          <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
            ${paquete.vuelo_incluido == 1 ? `
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-airplane-fill text-info mt-1"></i>
              <span>Vuelo incluido · Salida desde <strong>${paquete.salida_desde}</strong></span>
            </li>` : ''}
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-building text-info mt-1"></i>
              <span>Alojamiento en <strong>${paquete.hotel_nombre}</strong></span>
            </li>
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-cup-hot text-info mt-1"></i>
              <span>Régimen: <strong>${paquete.hotel_regimen}</strong></span>
            </li>
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-moon-stars text-info mt-1"></i>
              <span>Estancia de <strong>${paquete.noches} noches</strong></span>
            </li>
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-headset text-info mt-1"></i>
              <span>Atención al cliente antes y durante el viaje</span>
            </li>
          </ul>
        </div>

        <!-- No incluye -->
        <div class="col-12 col-md-6">
          <p class="text-uppercase fw-bold text-danger mb-3" style="font-size:.78rem;letter-spacing:.14em">
            <i class="bi bi-x-circle-fill me-1"></i>Qué no incluye
          </p>
          <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-x-circle text-danger mt-1"></i>
              <span>Extras no especificados en la reserva</span>
            </li>
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-x-circle text-danger mt-1"></i>
              <span>Seguro opcional de cancelación</span>
            </li>
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-x-circle text-danger mt-1"></i>
              <span>Gastos personales durante la estancia</span>
            </li>
            ${paquete.vuelo_incluido != 1 ? `
            <li class="d-flex align-items-start gap-2">
              <i class="bi bi-airplane text-danger mt-1"></i>
              <span>Vuelo no incluido</span>
            </li>` : ''}
          </ul>
        </div>

      </div>
    `;

    // ── AVISO ─────────────────────────────────────────────────
    document.getElementById("aviso").innerHTML = `
      <div class="fondo mt-3">
        <i class="bi bi-exclamation-diamond-fill"></i>
        Precio y disponibilidad sujetos a cambios según fechas y demanda.
      </div>
    `;

    // ── SINCRONIZAR PRECIO SIDEBAR ────────────────────────────
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

// -------- BOTÓN RESERVAR / PAGAR → PASARELA --------
const btnReservar = document.getElementById("btn-reservar");
if (btnReservar && paquete.fecha_salida) {
  const plazasDisponibles = parseInt(paquete.plazas_disponibles) || 0;
  const avisoPlazas = document.getElementById("aviso-plazas");

  if (plazasDisponibles <= 0) {
    if (avisoPlazas) {
      avisoPlazas.textContent = "No hay plazas disponibles para este paquete.";
      avisoPlazas.classList.remove("d-none");
    }

    btnReservar.disabled = true;
    btnReservar.classList.add("disabled");
    btnReservar.innerHTML = '<i class="bi bi-x-circle me-2"></i>Plazas agotadas';
    btnReservar.setAttribute("aria-disabled", "true");
  } else {
    // Comprobar si el usuario está logueado
    let usuarioLogueado = false;
    try {
      const sesion = await obtener("/api/auth/session.php");
      usuarioLogueado = sesion && sesion.ok;
    } catch (_) {}

    const fechaSalida = new Date(paquete.fecha_salida);
    const hoy         = new Date();
    const diasHasta   = Math.ceil((fechaSalida - hoy) / (1000 * 60 * 60 * 24));

    if (!usuarioLogueado) {
      btnReservar.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión para reservar';
      btnReservar.addEventListener("click", () => {
        window.location.href = `login.html`;
      });
    } else {
      if (diasHasta < 30) {
        btnReservar.innerHTML = '<i class="bi bi-credit-card me-2"></i>Pagar ahora';
      } else {
        btnReservar.innerHTML = '<i class="bi bi-send-fill me-2"></i>Reservar';
      }

      btnReservar.addEventListener("click", () => {
        const numViajeros = parseInt(document.getElementById("sb-personas")?.value || "1");
        window.location.href = `pasarela-pago.html?id=${id}&viajeros=${numViajeros}`;
      });
    }
  }
}

    // ── MOSTRAR ───────────────────────────────────────────────
    loading.classList.add("d-none");
    detalle.classList.remove("d-none");

  } catch (e) {
    console.error("Error cargando el paquete:", e);
    loading.classList.add("d-none");
    error.classList.remove("d-none");
  }
});
