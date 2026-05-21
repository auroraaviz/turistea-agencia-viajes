import { obtener, crear } from "./utils/fetch.js";
import { BASE } from "./config.js";

/* ─────────────────────────────────────────
   ESTADO
───────────────────────────────────────── */
let comentarios = [];
let valorViaje = 0;
let valorCompania = 0;
let archivoSeleccionado = null;

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  inicializarEstrellas("starRatingViaje", v => { valorViaje = v; });
  inicializarEstrellas("starRatingCompania", v => { valorCompania = v; });
  inicializarDropzone();
  inicializarScrollTop();

  await cargarExperiencias();
  cargarPaquetesUsuario();

  document.getElementById("btnPublicar").addEventListener("click", publicarExperiencia);
});

/* ─────────────────────────────────────────
   CARGAR Y RENDERIZAR EXPERIENCIAS
───────────────────────────────────────── */
async function cargarExperiencias() {
  const datos = await obtener("/api/comentarios/get.php");
  if (!datos || !Array.isArray(datos)) {
    document.getElementById("gridExperiencias").innerHTML =
      '<div class="col-12 text-center py-4"><p class="text-muted">No hay experiencias todavía. ¡Sé el primero en compartir la tuya!</p></div>';
    ocultarDestacada();
    actualizarKPIs([]);
    return;
  }

  comentarios = datos;
  actualizarKPIs(comentarios);
  renderizarDestacada(comentarios);
  renderizarGrid(comentarios);
}

function actualizarKPIs(lista) {
  document.getElementById("kpi-total").textContent = lista.length;

  if (lista.length > 0) {
    const media = lista.reduce((s, c) => s + c.valoracion_viaje, 0) / lista.length;
    document.getElementById("kpi-media").innerHTML =
      `${media.toFixed(1)} <span style="color:var(--yellow);font-size:1.3rem">★</span>`;
  } else {
    document.getElementById("kpi-media").innerHTML =
      `- <span style="color:var(--yellow);font-size:1.3rem">★</span>`;
  }

  const destinos = new Set(lista.map(c => c.destino).filter(Boolean));
  document.getElementById("kpi-destinos").textContent = destinos.size;
}

function renderizarDestacada(lista) {
  if (lista.length === 0) { ocultarDestacada(); return; }

  const mejor = lista.reduce((a, b) => b.valoracion_viaje > a.valoracion_viaje ? b : a, lista[0]);

  const imgEl = document.getElementById("destacada-img");
  if (mejor.foto_url) {
    imgEl.src = `${BASE}/frontend/${mejor.foto_url}`;
  }

  document.getElementById("destacada-destino").innerHTML =
    `<i class="bi bi-geo-alt-fill"></i> ${esc(mejor.destino || mejor.titulo_viaje)}`;
  document.getElementById("destacada-avatar").textContent = iniciales(mejor.autor_nombre);
  document.getElementById("destacada-autor").textContent = mejor.autor_nombre;
  document.getElementById("destacada-paquete").textContent = mejor.nombre_paquete || mejor.titulo_viaje;
  document.getElementById("destacada-estrellas").textContent = "★".repeat(mejor.valoracion_viaje) + "☆".repeat(5 - mejor.valoracion_viaje);
  document.getElementById("destacada-texto").textContent = `"${mejor.comentario}"`;
  document.getElementById("destacada-fecha").innerHTML =
    `<i class="bi bi-calendar3 me-1"></i>${formatearFecha(mejor.creado_at)}`;
}

function ocultarDestacada() {
  const sec = document.getElementById("seccion-destacada");
  const card = document.getElementById("cardDestacada");
  if (sec) sec.style.display = "none";
  if (card) card.style.display = "none";
}

function renderizarGrid(lista) {
  const grid = document.getElementById("gridExperiencias");

  if (lista.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No hay experiencias todavía. ¡Sé el primero en compartir la tuya!</p></div>';
    return;
  }

  const colores = [
    { bg: "#e0f4ff", color: "#0077B6" },
    { bg: "#fff0e0", color: "#c47400" },
    { bg: "#e8f5e9", color: "#2e7d32" },
    { bg: "#f0e8ff", color: "#6a34b5" },
    { bg: "#fce4ec", color: "#c62828" },
    { bg: "#fff8e1", color: "#f57f17" },
  ];

  grid.innerHTML = lista.map((c, i) => {
    const color = colores[i % colores.length];
    const estrellas = "★".repeat(c.valoracion_viaje) + "☆".repeat(5 - c.valoracion_viaje);
    const imagen = c.foto_url
      ? `${BASE}/frontend/${c.foto_url}`
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80";

    return `
      <div class="col-6 col-md-3">
        <div class="card-exp">
          <div class="card-exp-img">
            <img src="${imagen}" alt="${esc(c.destino || c.titulo_viaje)}" />
            <div class="overlay"></div>
            <div class="dest-tag"><i class="bi bi-geo-alt-fill"></i> ${esc(c.destino || "Destino")}</div>
          </div>
          <div class="card-exp-body">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="avatar-circle" style="background:${color.bg};color:${color.color}">${iniciales(c.autor_nombre)}</div>
              <div>
                <p class="user-name">${esc(c.autor_nombre)}</p>
                <p class="user-pkg">${esc(c.nombre_paquete || c.titulo_viaje)}</p>
              </div>
            </div>
            <div class="stars-yellow mb-2">${estrellas}</div>
            <p class="card-review">"${esc(c.comentario)}"</p>
            <div class="d-flex justify-content-end mt-2">
              <span class="date-muted">${formatearFecha(c.creado_at)}</span>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ─────────────────────────────────────────
   CARGAR PAQUETES DEL USUARIO EN EL MODAL
───────────────────────────────────────── */
async function cargarPaquetesUsuario() {
  const select = document.getElementById("selectPaquete");

  const reservas = await obtener("/api/perfil/reservas.php");
  if (!reservas || !Array.isArray(reservas) || reservas.length === 0) {
    select.innerHTML = '<option value="">Inicia sesión y reserva un viaje para compartir tu experiencia</option>';
    return;
  }

  const hoy = new Date();
  const elegibles = reservas.filter(r => {
    if (r.estado !== "CONFIRMADA" || !r.fecha_regreso) return false;
    const regreso = new Date(r.fecha_regreso);
    return (hoy - regreso) / (1000 * 60 * 60 * 24) > 5;
  });

  if (elegibles.length === 0) {
    select.innerHTML = '<option value="">No tienes viajes completados disponibles para reseñar</option>';
    return;
  }

  select.innerHTML = '<option value="">Selecciona el paquete...</option>' +
    elegibles.map(r =>
      `<option value="${r.paquete_id}" data-titulo="${esc(r.nombre_paquete)}">${esc(r.nombre_paquete)} — ${esc(r.destino)}</option>`
    ).join("");
}

/* ─────────────────────────────────────────
   PUBLICAR EXPERIENCIA
───────────────────────────────────────── */
async function publicarExperiencia() {
  const feedback = document.getElementById("modal-feedback");
  const btn = document.getElementById("btnPublicar");

  const paqueteId = document.getElementById("selectPaquete").value;
  const tituloViaje = document.getElementById("inputTitulo").value.trim();
  const comentario = document.getElementById("textComentario").value.trim();
  const selectEl = document.getElementById("selectPaquete");
  const tituloFallback = selectEl.options[selectEl.selectedIndex]?.dataset?.titulo || tituloViaje;

  if (!paqueteId) {
    mostrarFeedback(feedback, "Selecciona un paquete.", "danger");
    return;
  }
  if (!tituloViaje) {
    mostrarFeedback(feedback, "Escribe un título para tu experiencia.", "danger");
    return;
  }
  if (!valorViaje || !valorCompania) {
    mostrarFeedback(feedback, "Selecciona ambas valoraciones (viaje y compañía).", "danger");
    return;
  }
  if (!comentario) {
    mostrarFeedback(feedback, "Escribe tu experiencia.", "danger");
    return;
  }

  const formData = new FormData();
  formData.append("paquete_id", paqueteId);
  formData.append("titulo_viaje", tituloViaje || tituloFallback);
  formData.append("comentario", comentario);
  formData.append("valoracion_viaje", valorViaje);
  formData.append("valoracion_compania", valorCompania);
  if (archivoSeleccionado) {
    formData.append("foto", archivoSeleccionado);
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Publicando';

  const texto = await crear("/api/comentarios/create.php", formData);
  let respuesta = null;
  try { respuesta = JSON.parse(texto); } catch { /* noop */ }

  if (!respuesta || !respuesta.ok) {
    mostrarFeedback(feedback, respuesta?.mensaje || "No se pudo publicar la experiencia.", "danger");
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar experiencia';
    return;
  }

  mostrarFeedback(feedback, "¡Experiencia publicada correctamente!", "success");
  btn.disabled = false;
  btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar experiencia';

  // Limpiar formulario
  resetearModal();

  // Recargar experiencias
  await cargarExperiencias();

  // Cerrar modal tras un momento
  setTimeout(() => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalPublicar"));
    if (modal) modal.hide();
    feedback.classList.add("d-none");
  }, 1500);
}

function resetearModal() {
  document.getElementById("selectPaquete").selectedIndex = 0;
  document.getElementById("inputTitulo").value = "";
  document.getElementById("textComentario").value = "";
  valorViaje = 0;
  valorCompania = 0;
  archivoSeleccionado = null;
  resetearEstrellas("starRatingViaje");
  resetearEstrellas("starRatingCompania");
  resetearDropzone();
}

/* ─────────────────────────────────────────
   ESTRELLAS INTERACTIVAS
───────────────────────────────────────── */
function inicializarEstrellas(containerId, onSelect) {
  const btns = document.querySelectorAll(`#${containerId} .star-btn`);
  let valor = 0;

  btns.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      const v = +btn.dataset.val;
      btns.forEach(b => b.classList.toggle("activa", +b.dataset.val <= v));
    });
    btn.addEventListener("mouseleave", () => {
      btns.forEach(b => b.classList.toggle("activa", +b.dataset.val <= valor));
    });
    btn.addEventListener("click", () => {
      valor = +btn.dataset.val;
      btns.forEach(b => b.classList.toggle("activa", +b.dataset.val <= valor));
      onSelect(valor);
    });
  });
}

function resetearEstrellas(containerId) {
  document.querySelectorAll(`#${containerId} .star-btn`)
    .forEach(b => b.classList.remove("activa"));
}

/* ─────────────────────────────────────────
   DROPZONE
───────────────────────────────────────── */
function inicializarDropzone() {
  const dropzone = document.getElementById("dropzonePub");
  const fileInput = document.getElementById("fileInputPub");

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    dropzone.style.background = "#d0eef8";
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.background = "";
  });
  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.style.background = "";
    const file = e.dataTransfer.files[0];
    if (file) seleccionarArchivo(file);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) seleccionarArchivo(fileInput.files[0]);
  });
}

function seleccionarArchivo(file) {
  if (file.size > 2 * 1024 * 1024) {
    const feedback = document.getElementById("modal-feedback");
    mostrarFeedback(feedback, "La imagen no puede superar los 2 MB.", "danger");
    return;
  }
  archivoSeleccionado = file;
  const dropzone = document.getElementById("dropzonePub");
  dropzone.innerHTML = `
    <i class="bi bi-check-circle-fill" style="font-size:2rem;color:var(--cyan);display:block;margin-bottom:6px"></i>
    <p style="color:var(--navy);font-weight:700;margin:0">${esc(file.name)}</p>`;
}

function resetearDropzone() {
  const dropzone = document.getElementById("dropzonePub");
  dropzone.innerHTML = `
    <i class="bi bi-cloud-arrow-up"></i>
    <p>Arrastra tu foto aquí o <span>selecciona un archivo</span></p>`;
  document.getElementById("fileInputPub").value = "";
}

/* ─────────────────────────────────────────
   SCROLL TOP
───────────────────────────────────────── */
function inicializarScrollTop() {
  const btnArriba = document.getElementById("btn-volver-arriba-exp");
  window.addEventListener("scroll", () => {
    btnArriba.classList.toggle("d-none", window.scrollY < 300);
  });
}

/* ─────────────────────────────────────────
   UTILIDADES
───────────────────────────────────────── */
function esc(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function iniciales(nombre) {
  if (!nombre) return "??";
  return nombre.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

function mostrarFeedback(el, mensaje, tipo) {
  if (!el) return;
  el.className = `alert alert-${tipo}`;
  el.textContent = mensaje;
  el.classList.remove("d-none");
}
