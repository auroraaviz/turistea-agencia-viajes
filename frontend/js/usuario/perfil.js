/**
 * perfil.js
 * Orquesta toda la lógica de la página de perfil.
 *
 * COMPATIBILIDAD CON fetch.js DEL PROYECTO:
 *  - obtener() devuelve objeto JSON o null
 *  - crear()   devuelve texto (string) → hay que JSON.parse() manualmente
 *  - session.php devuelve { ok: true, id, nombre, email, rol }
 */

import { obtener, crear } from "../utils/fetch.js";
import { BASE } from "../config.js";

let reservasPerfil = [];

/* ─────────────────────────────────────────
   INICIALIZACIÓN
───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {
  const sesion = await verificarSesion();
  if (!sesion) return;

  // Mostrar nombre desde sesión inmediatamente (sin esperar BD)
  rellenarDesdeSession(sesion);

  // Cargar el resto en paralelo
  await Promise.all([
    cargarPerfil(),
    cargarReservas(),
    cargarFavoritos(),
    cargarTarjeta(),
  ]);

  inicializarEventos();
});

/* ─────────────────────────────────────────
   1. VERIFICAR SESIÓN
───────────────────────────────────────── */
async function verificarSesion() {
  const sesion = await obtener("/api/auth/session.php");

  // session.php devuelve { ok: true } si hay sesión activa
  if (!sesion || !sesion.ok) {
    window.location.href = `${BASE}/frontend/pages/login.html`;
    return null;
  }
  return sesion;
}

/* ─────────────────────────────────────────
   2a. RELLENAR DESDE SESIÓN (inmediato)
   Evita que el hero aparezca vacío mientras
   se consulta la BD.
───────────────────────────────────────── */
function rellenarDesdeSession(sesion) {
  const nombre = sesion.nombre || "Usuario";

  document.getElementById("hero-saludo").textContent    = `¡Hola, ${nombre}! 👋`;
  document.getElementById("hero-email").textContent     = sesion.email || "";
  document.getElementById("sidebar-nombre").textContent = nombre;
  document.getElementById("sidebar-email").textContent  = sesion.email || "";

  actualizarAvatar(nombre);
}

/* ─────────────────────────────────────────
   2b. CARGAR PERFIL COMPLETO (desde BD)
───────────────────────────────────────── */
async function cargarPerfil() {
  const usuario = await obtener("/api/perfil/get.php");

  // En modo dev get.php devuelve datos de sesión directamente
  // Si hay error lo ignoramos: los datos de sesión ya están visibles
  if (!usuario || usuario.error) {
    console.warn("Perfil completo no disponible:", usuario?.error);
    return;
  }

  const nombreCompleto = [usuario.nombre, usuario.apellidos]
    .filter(Boolean).join(" ").trim();

  // Hero
  document.getElementById("hero-saludo").textContent = `¡Hola, ${usuario.nombre}! 👋`;
  document.getElementById("hero-email").textContent  = usuario.email;

  // Sidebar
  document.getElementById("sidebar-nombre").textContent = nombreCompleto;
  document.getElementById("sidebar-email").textContent  = usuario.email;

  // Teléfono
  const telWrap = document.getElementById("info-telefono-wrap");
  if (usuario.telefono) {
    document.getElementById("info-telefono").textContent = usuario.telefono;
    telWrap.style.display = "";
  } else {
    telWrap.style.display = "none";
  }

  // Miembro desde
  if (usuario.created_at) {
    const fecha = new Date(usuario.created_at);
    document.getElementById("info-miembro").textContent =
      `Miembro desde ${fecha.toLocaleDateString("es-ES", { year: "numeric", month: "long" })}`;
  }

  actualizarAvatar(nombreCompleto);

  // Pre-rellenar modal de edición con datos actuales
  document.getElementById("edit-nombre").value    = usuario.nombre    || "";
  document.getElementById("edit-apellidos").value = usuario.apellidos || "";
  document.getElementById("edit-telefono").value  = usuario.telefono  || "";
}

function actualizarAvatar(nombre) {
  const avatar   = document.getElementById("perfil-avatar");
  avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || "U")}&background=0077B6&color=fff&size=128&bold=true&font-size=0.4`;
  avatar.alt = nombre;
}

/* ─────────────────────────────────────────
   3. CARGAR RESERVAS
───────────────────────────────────────── */
async function cargarReservas() {
  const contenedor = document.getElementById("contenedor-reservas");
  const contenedorConfirmados = document.getElementById("contenedor-confirmados");
  const reservas   = await obtener("/api/perfil/reservas.php");

  if (!reservas || reservas.error || reservas.length === 0) {
    contenedor.innerHTML = mensajeVacio("bi-ticket-detailed", "Aún no tienes reservas.");
    if (contenedorConfirmados) {
      contenedorConfirmados.innerHTML = mensajeVacio("bi-check-circle", "Aún no tienes paquetes confirmados.");
    }
    document.getElementById("stat-reservas").textContent = 0;
    return;
  }

  reservasPerfil = reservas;
  document.getElementById("stat-reservas").textContent = reservas.length;
  renderizarReservas(reservasPerfil, contenedor, { mostrarConfirmar: true, mostrarCancelar: true, mostrarEliminar: true });
  renderizarConfirmados();

  // Filtro por estado (sin nueva petición al servidor)
  document.getElementById("filtro-reservas").addEventListener("change", (e) => {
    const val      = e.target.value;
    const filtradas = val ? reservasPerfil.filter(r => r.estado === val) : reservasPerfil;
    renderizarReservas(filtradas, contenedor, { mostrarConfirmar: true, mostrarCancelar: true, mostrarEliminar: true });
  });
}

function renderizarReservas(lista, contenedor, opciones = {}) {
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="text-muted text-center py-3">No hay reservas con ese filtro.</p>`;
    return;
  }

  contenedor.innerHTML = lista.map(r => {
    const badge  = badgeEstado(r.estado);
    const imagen = r.imagen
    ? `${BASE}/frontend/${r.imagen}`
    : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80";
    const fecha  = new Date(r.fecha_reserva).toLocaleDateString("es-ES",
      { day: "2-digit", month: "short", year: "numeric" });
    const puedeConfirmar = opciones.mostrarConfirmar && r.estado === "PENDIENTE";
    const puedeCancelar = opciones.mostrarCancelar && r.estado === "PENDIENTE";
    const puedeEliminar = opciones.mostrarEliminar && reservaPuedeEliminarse(r.estado);

    return `
      <div class="reserva-card" data-reserva-id="${r.id}">
        <div class="row g-0">
          <div class="col-4 col-md-3">
            <img class="reserva-img" src="${imagen}" alt="${r.nombre_paquete || 'Destino'}" />
          </div>
          <div class="col-8 col-md-9 p-3">
            <div class="d-flex align-items-start justify-content-between flex-wrap gap-1 mb-1">
              <span class="reserva-titulo">${r.nombre_paquete || "Paquete de viaje"}</span>
              <div class="reserva-estado-acciones">
                ${puedeCancelar ? `
                  <button type="button" class="btn-cancelar-reserva" data-id="${r.id}">
                    <i class="bi bi-x-lg me-1"></i>Cancelar
                  </button>
                ` : ""}
                <span class="reserva-badge ${badge.clase}">
                  <i class="bi ${badge.icono}"></i> ${r.estado}
                </span>
              </div>
            </div>
            <div class="reserva-fecha mb-2">
              <i class="bi bi-calendar3"></i> Reservado el ${fecha}
            </div>
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span style="font-size:.8rem;color:#777;">
                <i class="bi bi-people-fill me-1"></i>${r.num_viajeros} viajero${r.num_viajeros > 1 ? "s" : ""}
              </span>
              <span style="font-size:.8rem;color:#777;">
                <i class="bi bi-currency-euro me-1"></i>${Number(r.precio_total).toLocaleString("es-ES")}
              </span>
              ${(puedeCancelar || puedeConfirmar) ? `
                <div class="reserva-acciones-pendiente">
                  ${puedeConfirmar ? `
                    <button type="button" class="btn-confirmar-reserva"
                      data-id="${r.id}" data-viajeros="${r.num_viajeros}">
                      <i class="bi bi-people-fill me-1"></i>Añadir viajeros y confirmar
                    </button>
                  ` : ""}
                </div>
              ` : ""}
              ${r.estado === "CONFIRMADA" ? `
                <a href="${BASE}/api/reservas/factura_pdf.php?reserva_id=${r.id}"
                  data-id="${r.id}"
                  class="btn-ver-reserva ms-auto"
                  style="background:#0077B6;color:white;border-color:#0077B6;">
                  <i class="bi bi-file-earmark-pdf me-1"></i>Factura
                </a>
              ` : ""}
              ${puedeEliminar ? `
                <div class="reserva-acciones-eliminar">
                  <button type="button" class="btn-eliminar-reserva" data-id="${r.id}">
                    <i class="bi bi-trash me-1"></i>Eliminar
                  </button>
                </div>
              ` : ""}
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  contenedor.querySelectorAll(".btn-confirmar-reserva").forEach(btn => {
    btn.addEventListener("click", abrirModalViajeros);
  });

  contenedor.querySelectorAll(".btn-cancelar-reserva").forEach(btn => {
    btn.addEventListener("click", cancelarReserva);
  });

  contenedor.querySelectorAll(".btn-eliminar-reserva").forEach(btn => {
    btn.addEventListener("click", eliminarReserva);
  });

  contenedor.querySelectorAll(".btn-ver-reserva").forEach(btn => {
    btn.addEventListener("click", abrirModalFactura);
  });
}

function abrirModalFactura(e) {
  e.preventDefault();

  const btn = e.currentTarget;
  const reservaId = btn.dataset.id;
  if (!reservaId) return;

  document.getElementById("modalFacturaPerfilWrap")?.remove();

  const urlDescarga = `${BASE}/api/reservas/factura_pdf.php?reserva_id=${encodeURIComponent(reservaId)}`;
  const urlInline = `${urlDescarga}&vista=inline`;
  const wrap = document.createElement("div");
  wrap.id = "modalFacturaPerfilWrap";
  wrap.innerHTML = `
    <div class="modal fade" id="modalFacturaPerfil" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-file-earmark-pdf me-2 text-primary"></i>Factura reserva #${reservaId}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body p-0 bg-light">
            <iframe
              class="factura-pdf-frame"
              src="${urlInline}"
              title="Vista previa de la factura de la reserva ${reservaId}">
            </iframe>
          </div>
          <div class="modal-footer">
            <a class="btn btn-primary rounded-pill px-4" href="${urlDescarga}">
              <i class="bi bi-download me-1"></i>Descargar
            </a>
            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Salir
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(wrap);

  const modalEl = document.getElementById("modalFacturaPerfil");
  const bsModal = new bootstrap.Modal(modalEl);
  modalEl.addEventListener("hidden.bs.modal", () => wrap.remove());
  bsModal.show();
}

function renderizarConfirmados() {
  const contenedor = document.getElementById("contenedor-confirmados");
  if (!contenedor) return;

  const confirmadas = reservasPerfil.filter(r => r.estado === "CONFIRMADA");

  if (confirmadas.length === 0) {
    contenedor.innerHTML = mensajeVacio("bi-check-circle", "Aún no tienes paquetes confirmados.");
    return;
  }

  renderizarReservas(confirmadas, contenedor);
}

async function confirmarReserva(e) {
  const btn = e.currentTarget;
  const reservaId = btn.dataset.id;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Confirmando';

  const texto = await crear("/api/perfil/reserva-confirmar.php", { reserva_id: reservaId });
  const respuesta = parsearTexto(texto);

  if (!respuesta || !respuesta.ok) {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Confirmar';
    alert(respuesta?.error || respuesta?.mensaje || "No se pudo confirmar la reserva.");
    return;
  }

  const reserva = reservasPerfil.find(r => String(r.id) === String(reservaId));
  if (reserva) reserva.estado = "CONFIRMADA";

  const filtro = document.getElementById("filtro-reservas")?.value || "";
  const lista = filtro ? reservasPerfil.filter(r => r.estado === filtro) : reservasPerfil;

  renderizarReservas(lista, document.getElementById("contenedor-reservas"), { mostrarConfirmar: true, mostrarCancelar: true, mostrarEliminar: true });
  renderizarConfirmados();
}

async function cancelarReserva(e) {
  const btn = e.currentTarget;
  const reservaId = btn.dataset.id;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Cancelando';

  const texto = await crear("/api/perfil/reserva-cancelar.php", { reserva_id: reservaId });
  const respuesta = parsearTexto(texto);

  if (!respuesta || !respuesta.ok) {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-x-lg me-1"></i>Cancelar';
    alert(respuesta?.error || respuesta?.mensaje || "No se pudo cancelar la reserva.");
    return;
  }

  const reserva = reservasPerfil.find(r => String(r.id) === String(reservaId));
  if (reserva) reserva.estado = "CANCELADA";

  const filtro = document.getElementById("filtro-reservas")?.value || "";
  const lista = filtro ? reservasPerfil.filter(r => r.estado === filtro) : reservasPerfil;

  renderizarReservas(lista, document.getElementById("contenedor-reservas"), { mostrarConfirmar: true, mostrarCancelar: true, mostrarEliminar: true });
  renderizarConfirmados();
}

async function eliminarReserva(e) {
  const btn = e.currentTarget;
  const reservaId = btn.dataset.id;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Eliminando';

  const texto = await crear("/api/perfil/reserva-eliminar.php", { reserva_id: reservaId });
  const respuesta = parsearTexto(texto);

  if (!respuesta || !respuesta.ok) {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-trash me-1"></i>Eliminar';
    alert(respuesta?.error || respuesta?.mensaje || "No se pudo eliminar la reserva.");
    return;
  }

  reservasPerfil = reservasPerfil.filter(r => String(r.id) !== String(reservaId));
  document.getElementById("stat-reservas").textContent = reservasPerfil.length;

  const filtro = document.getElementById("filtro-reservas")?.value || "";
  const lista = filtro ? reservasPerfil.filter(r => r.estado === filtro) : reservasPerfil;
  const contenedor = document.getElementById("contenedor-reservas");

  if (reservasPerfil.length === 0) {
    contenedor.innerHTML = mensajeVacio("bi-ticket-detailed", "Aún no tienes reservas.");
  } else {
    renderizarReservas(lista, contenedor, { mostrarConfirmar: true, mostrarCancelar: true, mostrarEliminar: true });
  }

  renderizarConfirmados();
}

function badgeEstado(estado) {
  return {
    CONFIRMADA: { clase: "badge-confirmada", icono: "bi-check-circle-fill" },
    PENDIENTE:  { clase: "badge-pendiente",  icono: "bi-clock-fill" },
    CANCELADA:  { clase: "badge-cancelada",  icono: "bi-x-circle-fill" },
  }[estado] || { clase: "badge-pendiente", icono: "bi-circle" };
}

function reservaPuedeEliminarse(estado) {
  return !["CONFIRMADA", "PENDIENTE", "RESERVADA"].includes(estado);
}

/* ─────────────────────────────────────────
   4. CARGAR FAVORITOS
───────────────────────────────────────── */
async function cargarFavoritos() {
  const contenedor = document.getElementById("contenedor-favoritos");
  const favoritos  = await obtener("/api/perfil/favoritos.php");

  if (!favoritos || favoritos.error || favoritos.length === 0) {
    contenedor.innerHTML = mensajeVacio("bi-heart", "Aún no tienes destinos guardados.");
    document.getElementById("stat-favoritos").textContent = 0;
    return;
  }

  document.getElementById("stat-favoritos").textContent = favoritos.length;
  renderizarFavoritos(favoritos, contenedor);
}

function renderizarFavoritos(lista, contenedor) {
  contenedor.innerHTML = lista.map(f => {
    const imagen = f.imagen
    ? `${BASE}/frontend/${f.imagen}`
    : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80";

    return `
      <div class="col-6 col-md-4" data-paquete-id="${f.paquete_id}">
        <div class="fav-card">
          <img src="${imagen}" alt="${f.nombre || 'Destino'}" />
          <div class="fav-overlay">
            <div class="fav-title">${f.nombre || "Destino"}</div>
            <div class="fav-country">${f.destino || ""}</div>
          </div>
          <button class="btn-quitar-fav" title="Quitar de favoritos" data-id="${f.paquete_id}">
            <i class="bi bi-heart-fill"></i>
          </button>
        </div>
      </div>`;
  }).join("");

  contenedor.querySelectorAll(".btn-quitar-fav").forEach(btn => {
    btn.addEventListener("click", eliminarFavorito);
  });

  contenedor.querySelectorAll("[data-paquete-id] .fav-card").forEach(card => {
    card.addEventListener("click", () => {
      const paqueteId = card.closest("[data-paquete-id]")?.dataset.paqueteId;
      if (paqueteId) {
        window.location.href = `${BASE}/frontend/pages/detalle.html?id=${paqueteId}`;
      }
    });
  });
}

/* ─────────────────────────────────────────
   5. ELIMINAR FAVORITO
───────────────────────────────────────── */
async function eliminarFavorito(e) {
  e.stopPropagation();
  const paqueteId = this.dataset.id;
  const col       = this.closest("[data-paquete-id]");

  // Animación de salida inmediata
  col.style.transition = "opacity .3s, transform .3s";
  col.style.opacity    = "0";
  col.style.transform  = "scale(.85)";

  const texto     = await crear("/api/perfil/favorito-eliminar.php", { paquete_id: paqueteId });
  const respuesta = parsearTexto(texto);

  if (respuesta && respuesta.ok) {
    setTimeout(() => {
      col.remove();
      const restantes = document.querySelectorAll("#contenedor-favoritos [data-paquete-id]").length;
      document.getElementById("stat-favoritos").textContent = restantes;

      if (restantes === 0) {
        document.getElementById("contenedor-favoritos").innerHTML =
          mensajeVacio("bi-heart", "Aún no tienes destinos guardados.");
      }
    }, 320);
  } else {
    // Revertir animación si el servidor falló
    col.style.opacity   = "1";
    col.style.transform = "scale(1)";
  }
}

/* ─────────────────────────────────────────
   6. EDITAR PERFIL
───────────────────────────────────────── */
async function guardarPerfil() {
  const feedback = document.getElementById("editar-feedback");
  const btn      = document.getElementById("btn-guardar-perfil");

  const datos = {
    nombre:    document.getElementById("edit-nombre").value.trim(),
    apellidos: document.getElementById("edit-apellidos").value.trim(),
    telefono:  document.getElementById("edit-telefono").value.trim(),
  };

  if (!datos.nombre) {
    mostrarFeedback(feedback, "El nombre no puede estar vacío.", "danger");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Guardando…";

  const texto     = await crear("/api/perfil/update.php", datos);
  const respuesta = parsearTexto(texto);

  if (respuesta && respuesta.ok) {
    // Intentar guardar tarjeta si se rellenaron los campos
    const tarjetaOk = await guardarTarjetaModal();
    if (tarjetaOk === false) {
      mostrarFeedback(feedback, "Datos de perfil guardados, pero revisa los campos de la tarjeta.", "warning");
      btn.disabled  = false;
      btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Guardar cambios';
      return;
    }

    mostrarFeedback(feedback, "✓ Cambios guardados correctamente.", "success");

    const nombreCompleto = [datos.nombre, datos.apellidos].filter(Boolean).join(" ");
    document.getElementById("sidebar-nombre").textContent = nombreCompleto;
    document.getElementById("hero-saludo").textContent    = `¡Hola, ${datos.nombre}! 👋`;

    if (datos.telefono) {
      document.getElementById("info-telefono").textContent        = datos.telefono;
      document.getElementById("info-telefono-wrap").style.display = "";
    }

    actualizarAvatar(nombreCompleto);

    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById("modalEditarPerfil")).hide();
      feedback.classList.add("d-none");
    }, 1500);

  } else {
    mostrarFeedback(feedback, respuesta?.mensaje || "Error al guardar los cambios.", "danger");
  }

  btn.disabled   = false;
  btn.innerHTML  = '<i class="bi bi-check-lg me-1"></i>Guardar cambios';
}

/* ─────────────────────────────────────────
   7. CERRAR SESIÓN
───────────────────────────────────────── */
async function cerrarSesion(e) {
  if (e) e.preventDefault();
  await crear("/api/auth/logout.php", {});
  window.location.href = `${BASE}/index.html`;
}

/* ─────────────────────────────────────────
   8. UTILIDADES
───────────────────────────────────────── */

// crear() devuelve texto → parseamos de forma segura
function parsearTexto(texto) {
  if (!texto) return null;
  try { return JSON.parse(texto); }
  catch { return null; }
}

function mostrarFeedback(el, mensaje, tipo) {
  el.className   = `alert alert-${tipo}`;
  el.textContent = mensaje;
  el.classList.remove("d-none");
}

function mensajeVacio(icono, texto) {
  return `
    <div class="col-12 text-center py-5 text-muted">
      <i class="bi ${icono} fs-1 d-block mb-2"></i>
      ${texto}
    </div>`;
}

/* ─────────────────────────────────────────
   9. EVENTOS
───────────────────────────────────────── */
function inicializarEventos() {
  document.getElementById("btn-guardar-perfil")
    ?.addEventListener("click", guardarPerfil);

  document.getElementById("btn-logout")
    ?.addEventListener("click", cerrarSesion);

  document.getElementById("sidebar-logout")
    ?.addEventListener("click", cerrarSesion);

  document.getElementById("modalEditarPerfil")
    ?.addEventListener("hidden.bs.modal", () => {
      const fb = document.getElementById("editar-feedback");
      fb.classList.add("d-none");
      fb.textContent = "";
    });

  // Formateo inputs tarjeta
  document.getElementById("card-numero")?.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").substring(0, 16);
    this.value = v.replace(/(.{4})/g, "$1 ").trim();
  });

  document.getElementById("card-vencimiento")?.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 3) v = v.substring(0, 2) + "/" + v.substring(2);
    this.value = v;
  });

  document.getElementById("card-cvv")?.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 4);
  });

  inicializarModalViajeros();
}

/* ─────────────────────────────────────────
   10. CARGAR TARJETA
───────────────────────────────────────── */
async function cargarTarjeta() {
  const res = await obtener("/api/perfil/tarjeta.php");

  const tarjetaWrap  = document.getElementById("tarjeta-wrap");
  const sinTarjeta   = document.getElementById("sin-tarjeta-wrap");
  const modalInfo    = document.getElementById("tarjeta-modal-info");
  const modalResumen = document.getElementById("tarjeta-modal-resumen");

  if (res && res.tarjeta) {
    const t = res.tarjeta;

    // Sidebar visual
    document.getElementById("tarjeta-numero").textContent  = `**** **** **** ${t.ultimos_4}`;
    document.getElementById("tarjeta-titular").textContent = t.titular;
    document.getElementById("tarjeta-vence").textContent   = t.vencimiento;
    tarjetaWrap.style.display  = "";
    if (sinTarjeta) sinTarjeta.style.display = "none";

    // Modal: mostrar aviso de tarjeta ya guardada
    if (modalInfo && modalResumen) {
      modalResumen.textContent = `**** **** **** ${t.ultimos_4} · ${t.titular}`;
      modalInfo.classList.remove("d-none");
    }
  } else {
    if (tarjetaWrap) tarjetaWrap.style.display = "none";
    if (sinTarjeta) sinTarjeta.style.display   = "";
  }
}

/* ─────────────────────────────────────────
   11. GUARDAR TARJETA (desde modal perfil)
───────────────────────────────────────── */
async function guardarTarjetaModal() {
  const titular     = document.getElementById("card-titular")?.value.trim();
  const numero      = document.getElementById("card-numero")?.value.replace(/\s/g, "");
  const vencimiento = document.getElementById("card-vencimiento")?.value.trim();
  const cvv         = document.getElementById("card-cvv")?.value.trim();

  // Si no rellenó la tarjeta la saltamos silenciosamente
  if (!titular && !numero && !vencimiento && !cvv) return true;

  // Validar si llenó algo
  if (!titular || numero?.length < 16 || vencimiento?.length < 5 || cvv?.length < 3) {
    return false; // indica error
  }

  const texto     = await crear("/api/tarjetas/guardar.php", {
    titular,
    ultimos_4:  numero.slice(-4),
    vencimiento
  });
  const respuesta = parsearTexto(texto);

  if (respuesta && respuesta.ok) {
    await cargarTarjeta(); // refresca visual del sidebar
    return true;
  }
  return false;
}

/* ─────────────────────────────────────────
   12. FIN DEL ARCHIVO
───────────────────────────────────────── */

/* ─────────────────────────────────────────
   13. MODAL VIAJEROS
───────────────────────────────────────── */

let _reservaIdPendiente   = null;
let _numViajerosPendiente = 0;

function abrirModalViajeros(e) {
  e.preventDefault?.();
  e.stopPropagation?.();

  const btn       = e.currentTarget;
  _reservaIdPendiente   = btn.dataset.id;
  _numViajerosPendiente = parseInt(btn.dataset.viajeros) || 1;

  const campos = document.getElementById("viajeros-campos");
  const fb     = document.getElementById("viajeros-feedback");
  if (fb) { fb.classList.add("d-none"); fb.textContent = ""; }

  // Generar un formulario por viajero
  campos.innerHTML = Array.from({ length: _numViajerosPendiente }, (_, i) => `
    <div class="border rounded p-3 mb-3">
      <p class="fw-bold mb-2" style="color:#1a2d45;">
        <i class="bi bi-person-fill me-1 text-primary"></i>Viajero ${i + 1}
      </p>
      <div class="row g-2">
        <div class="col-6">
          <input type="text" class="form-control form-control-sm v-nombre"
            placeholder="Nombre *" data-idx="${i}" required />
        </div>
        <div class="col-6">
          <input type="text" class="form-control form-control-sm v-apellidos"
            placeholder="Apellidos *" data-idx="${i}" required />
        </div>
        <div class="col-6">
          <input type="text" class="form-control form-control-sm v-dni"
            placeholder="DNI *" data-idx="${i}" required />
        </div>
        <div class="col-6">
          <input type="date" class="form-control form-control-sm v-nacimiento"
            placeholder="Fecha de nacimiento *" data-idx="${i}" required />
        </div>
      </div>
    </div>
  `).join("");

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalViajeros")
  ).show();
}

function inicializarModalViajeros() {
  const btn = document.getElementById("btn-confirmar-viajeros");
  if (!btn || btn.dataset.listenerConfirmarViajeros) return;

  btn.addEventListener("click", confirmarConViajeros);
  btn.dataset.listenerConfirmarViajeros = "true";
}

async function confirmarConViajeros() {
  const fb  = document.getElementById("viajeros-feedback");
  const btn = document.getElementById("btn-confirmar-viajeros");

  // Recoger datos de cada viajero
  const viajeros = [];
  let valido = true;

  for (let i = 0; i < _numViajerosPendiente; i++) {
    const nombre      = document.querySelector(`.v-nombre[data-idx="${i}"]`)?.value.trim();
    const apellidos   = document.querySelector(`.v-apellidos[data-idx="${i}"]`)?.value.trim();
    const dni         = document.querySelector(`.v-dni[data-idx="${i}"]`)?.value.trim();
    const nacimiento  = document.querySelector(`.v-nacimiento[data-idx="${i}"]`)?.value.trim();

    if (!nombre || !apellidos || !dni || !nacimiento) {
      valido = false;
      break;
    }
    viajeros.push({ nombre, apellidos, dni, fecha_nacimiento: nacimiento });
  }

  if (!valido) {
    fb.className   = "alert alert-danger";
    fb.textContent = "Rellena todos los campos de cada viajero.";
    fb.classList.remove("d-none");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Confirmando…";

  // 1. Guardar viajeros en BD
  const textoV     = await crear("/api/perfil/viajeros-guardar.php", {
    reserva_id: _reservaIdPendiente,
    viajeros
  });
  const respV = parsearTexto(textoV);

  if (!respV || !respV.ok) {
    fb.className   = "alert alert-danger";
    fb.textContent = respV?.error || "Error al guardar los viajeros.";
    fb.classList.remove("d-none");
    btn.disabled    = false;
    btn.innerHTML   = '<i class="bi bi-check-lg me-1"></i>Confirmar reserva';
    return;
  }

  // 2. Confirmar la reserva (endpoint existente de tus compañeros)
  const textoC     = await crear("/api/perfil/reserva-confirmar.php", {
    reserva_id: parseInt(_reservaIdPendiente)
  });
  const respC = parsearTexto(textoC);

  if (!respC || !respC.ok) {
    fb.className   = "alert alert-danger";
    fb.textContent = respC?.error || "Error al confirmar la reserva.";
    fb.classList.remove("d-none");
    btn.disabled    = false;
    btn.innerHTML   = '<i class="bi bi-check-lg me-1"></i>Confirmar reserva';
    return;
  }

  // 3. Éxito — cerrar modal y recargar reservas
  bootstrap.Modal.getInstance(
    document.getElementById("modalViajeros")
  ).hide();

  await cargarReservas();

  btn.disabled  = false;
  btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Confirmar reserva';
}
