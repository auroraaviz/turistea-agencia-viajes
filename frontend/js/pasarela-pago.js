// =====================================================
// PASARELA DE PAGO - JS
// =====================================================

import { BASE } from "./config.js";
import { obtener, crear } from "./utils/fetch.js";

const params     = new URLSearchParams(window.location.search);
const paqueteId  = params.get("id");
const viajeros   = parseInt(params.get("viajeros")) || 1;

// ── Elementos del DOM ──
const datosTarjeta   = document.getElementById("datos-tarjeta");
const sinTarjeta     = document.getElementById("sin-tarjeta");
const btnPagar       = document.getElementById("btn-pagar");
const btnAgregar     = document.getElementById("btn-agregar-tarjeta");
const btnGuardar     = document.getElementById("btn-guardar-tarjeta");
const loadingEl      = document.getElementById("loading");
const errorEl        = document.getElementById("error");
const contenidoEl    = document.getElementById("contenido-pasarela");

// Campos del formulario
const inputTitular     = document.getElementById("input-titular");
const inputNumero      = document.getElementById("input-numero");
const inputVencimiento = document.getElementById("input-vencimiento");
const inputCvv         = document.getElementById("input-cvv");
const inputGuardar     = document.getElementById("input-guardar-tarjeta");

// Campos de visualización
const pagoTitular      = document.getElementById("pago-titular");
const pagoNumero       = document.getElementById("pago-numero");
const pagoVencimiento  = document.getElementById("pago-vencimiento");
const pagoTotalTarjeta = document.getElementById("pago-total-tarjeta");
const pagoDesglose     = document.getElementById("pago-desglose");

// ── Estado ──
let paquete    = null;
let totalPago  = 0;
let tarjetaId  = null;
let tarjetaTemporal = false;
let modo       = "pagar"; // "pagar" o "reservar"

// ── Cargar paquete desde la API ──
async function cargarPaquete() {
  if (!paqueteId) { mostrarError(); return; }

  const data = await obtener("/api/paquetes/get.php?id=" + paqueteId);
  if (!data || data.error) { mostrarError(); return; }

  paquete   = data;
  totalPago = parseFloat(paquete.precio) * viajeros;

  // Determinar modo según fecha de salida
  const fechaSalida = new Date(paquete.fecha_salida);
  const hoy         = new Date();
  const diasHasta   = Math.ceil((fechaSalida - hoy) / (1000 * 60 * 60 * 24));

  modo = diasHasta < 30 ? "pagar" : "reservar";

  // Actualizar texto del botón
  btnPagar.textContent = modo === "pagar" ? "Pagar" : "Reservar";

  renderResumenPaquete(diasHasta);
  await cargarTarjetaGuardada();

  loadingEl.classList.add("d-none");
  contenidoEl.classList.remove("d-none");
}

function mostrarError() {
  loadingEl.classList.add("d-none");
  errorEl.classList.remove("d-none");
}

// ── Renderizar resumen del paquete ──
function renderResumenPaquete(diasHasta) {
  const resumen = document.getElementById("resumen-paquete");
  if (!resumen) return;

  const precioUnit = parseFloat(paquete.precio);
  const noches     = paquete.noches || "—";
  const hotel      = paquete.hotel_nombre || "Hotel";
  const estrellas  = paquete.hotel_estrellas ? " " + "\u2605".repeat(paquete.hotel_estrellas) : "";

  const etiquetaModo = modo === "pagar"
    ? '<span class="badge-modo pago">Pago inmediato requerido (menos de 30 días)</span>'
    : '<span class="badge-modo reserva">Reserva disponible (más de 30 días)</span>';

  let html = `
    ${etiquetaModo}
    <h6 class="resumen-titulo">${paquete.titulo}</h6>
    <p class="resumen-destino"><i class="bi bi-geo-alt-fill"></i> ${paquete.destino}</p>
    <hr>
    <div class="resumen-linea">
      <span>${hotel}${estrellas} · ${noches} noches</span>
    </div>`;

  if (paquete.vuelo_incluido) {
    html += '<div class="resumen-linea"><span><i class="bi bi-airplane"></i> Vuelo incluido</span></div>';
  }

  html += `
    <hr>
    <div class="resumen-linea">
      <span>Precio por persona</span>
      <span class="valor">${precioUnit.toFixed(2)}\u20AC</span>
    </div>
    <div class="resumen-linea">
      <span>Viajeros</span>
      <span class="valor">\u00D7 ${viajeros}</span>
    </div>
    <div class="resumen-linea total">
      <span>Total</span>
      <span class="valor">${totalPago.toFixed(2)}\u20AC</span>
    </div>`;

  resumen.innerHTML = html;
}

// ── Rellenar desglose en datos de tarjeta ──
function renderDesglose() {
  let html = "";
  const precioUnit = parseFloat(paquete.precio);

  if (paquete.vuelo_incluido) {
    html += datoPago("Vuelo ida/vuelta", "Incluido");
  }

  const hotel     = paquete.hotel_nombre || "Hotel";
  const estrellas = paquete.hotel_estrellas ? " " + paquete.hotel_estrellas + "*" : "";
  html += datoPago(hotel + estrellas, precioUnit.toFixed(2) + "\u20AC/pers.");

  if (viajeros > 1) {
    html += datoPago("Viajeros", "\u00D7 " + viajeros);
  }

  pagoDesglose.innerHTML = html;
}

function datoPago(label, valor) {
  return `<div class="pago-dato">
            <span class="label">${label}</span>
            <span class="valor">${valor}</span>
          </div>`;
}

async function cargarTarjetaGuardada() {
  const data = await obtener("/api/perfil/tarjeta.php");
  if (!data || !data.tarjeta) return;

  mostrarTarjeta({
    id: data.tarjeta.id,
    titular: data.tarjeta.titular,
    ultimos4: data.tarjeta.ultimos_4,
    vencimiento: data.tarjeta.vencimiento,
    guardada: true
  });
}

function mostrarTarjeta({ id = null, titular, ultimos4, vencimiento, guardada = false }) {
  tarjetaId = id ? parseInt(id) : null;
  tarjetaTemporal = !guardada;

  pagoTitular.textContent      = titular;
  pagoNumero.textContent       = "**** " + ultimos4;
  pagoVencimiento.textContent  = vencimiento;
  pagoTotalTarjeta.textContent = totalPago.toFixed(2) + "\u20AC";

  renderDesglose();

  sinTarjeta.classList.add("d-none");
  datosTarjeta.classList.remove("d-none");
  btnPagar.disabled = false;
  btnAgregar.textContent = guardada ? "Cambiar tarjeta de crédito" : "Usar otra tarjeta de crédito";
}

// ── Formatear número de tarjeta ──
inputNumero.addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").substring(0, 16);
  this.value = v.replace(/(.{4})/g, "$1 ").trim();
});

// ── Formatear vencimiento MM/AA ──
inputVencimiento.addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + "/" + v.substring(2);
  this.value = v;
});

// ── Solo números en CVV ──
inputCvv.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").substring(0, 4);
});

// ── Confirmar tarjeta: guardada si se marca el check, temporal si no ──
btnGuardar.addEventListener("click", async function () {
  const titular     = inputTitular.value.trim();
  const numero      = inputNumero.value.trim();
  const vencimiento = inputVencimiento.value.trim();
  const cvv         = inputCvv.value.trim();

  const numLimpio = numero.replace(/\s/g, "");

  // Validación
  if (!titular || numLimpio.length < 16 || vencimiento.length < 5 || cvv.length < 3) {
    inputTitular.classList.toggle("is-invalid", !titular);
    inputNumero.classList.toggle("is-invalid", numLimpio.length < 16);
    inputVencimiento.classList.toggle("is-invalid", vencimiento.length < 5);
    inputCvv.classList.toggle("is-invalid", cvv.length < 3);
    return;
  }

  btnGuardar.disabled = true;
  btnGuardar.textContent = inputGuardar.checked ? "Guardando..." : "Validando...";

  let resp = { ok: true, id: null };

  if (inputGuardar.checked) {
    const texto = await crear("/api/tarjetas/guardar.php", {
      titular: titular,
      numero: numLimpio,
      vencimiento: vencimiento,
      cvv: cvv
    });

    resp = texto ? (() => { try { return JSON.parse(texto); } catch { return null; } })() : null;
  }

  if (resp && resp.ok) {
    mostrarTarjeta({
      id: resp.id,
      titular: titular,
      ultimos4: numLimpio.slice(-4),
      vencimiento: vencimiento,
      guardada: inputGuardar.checked
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalTarjeta"));
    if (modal) modal.hide();
  } else {
    const msg = resp?.error || "Error al guardar la tarjeta";
    alert(msg);
  }

  btnGuardar.disabled = false;
  btnGuardar.textContent = "Continuar";
});

// ── Pagar / Reservar ──
btnPagar.addEventListener("click", async function () {
  btnPagar.disabled = true;
  btnPagar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';

  const texto = await crear("/api/reservas/crear.php", {
    paquete_id:   parseInt(paqueteId),
    num_viajeros: viajeros,
    tarjeta_id:   tarjetaId,
    tarjeta_temporal: tarjetaTemporal,
    modo:         modo
  });

  const resp = texto ? (() => { try { return JSON.parse(texto); } catch { return null; } })() : null;

  if (resp && resp.ok) {
    const msgExito = modo === "pagar"
      ? '<i class="bi bi-check-circle-fill me-2"></i>Pago realizado!'
      : '<i class="bi bi-check-circle-fill me-2"></i>Reserva confirmada!';
    btnPagar.innerHTML = msgExito;
    btnPagar.style.background = "#28a745";

    // Redirigir al perfil tras 2 segundos
    setTimeout(() => {
      window.location.href = "perfil.html#reservas";
    }, 2000);
  } else {
    const msg = resp?.error || "Error al procesar";
    btnPagar.disabled = false;
    btnPagar.textContent = modo === "pagar" ? "Pagar" : "Reservar";
    alert(msg);
  }
});

// ── Iniciar ──
cargarPaquete();
