const BASE_PATH = (window.BASE_PATH || "../../").replace(/\/?$/, "/");
const API_URL = `${BASE_PATH}api/comentarios/get.php`;
const DEFAULT_IMAGE = `${BASE_PATH}frontend/assets/img/default.jpg`;

document.addEventListener("DOMContentLoaded", () => {
  actualizarFooter();
  inicializarModalDemo();
  inicializarScrollTop();
  cargarExperiencias();
});

function actualizarFooter() {
  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
}

async function cargarExperiencias() {
  const grid = document.getElementById("gridExperiencias");
  if (!grid) return;

  grid.innerHTML = `
    <div class="col-12">
      <div class="experiencias-empty">
        <i class="bi bi-hourglass-split"></i>
        <p>Cargando experiencias...</p>
      </div>
    </div>
  `;

  try {
    const respuesta = await fetch(API_URL, { credentials: "include" });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const experiencias = await respuesta.json();
    if (!Array.isArray(experiencias) || experiencias.length === 0) {
      renderSinExperiencias();
      actualizarKpis([]);
      return;
    }

    actualizarKpis(experiencias);
    renderDestacada(experiencias);
    renderGrid(experiencias);
  } catch (error) {
    console.error("No se pudieron cargar las experiencias", error);
    grid.innerHTML = `
      <div class="col-12">
        <div class="experiencias-empty">
          <i class="bi bi-exclamation-circle"></i>
          <p>No se pudieron cargar las experiencias en este momento.</p>
        </div>
      </div>
    `;
  }
}

function renderDestacada(experiencias) {
  const card = document.querySelector(".card-featured");
  if (!card) return;

  const destacada = [...experiencias].sort((a, b) => {
    const mediaA = mediaValoracion(a);
    const mediaB = mediaValoracion(b);
    if (mediaB !== mediaA) return mediaB - mediaA;
    return new Date(b.creado_at) - new Date(a.creado_at);
  })[0];

  card.innerHTML = `
    <div class="row g-0">
      <div class="col-md-5">
        <div class="card-featured-img h-100">
          <img src="${resolverImagen(destacada.foto_url || destacada.paquete_imagen)}" alt="${escaparHtml(destacada.titulo_viaje || "Experiencia")}" />
          <div class="overlay"></div>
          <span class="badge-destacada"><i class="bi bi-star-fill me-1"></i>Destacada</span>
          <div class="img-content">
            <div class="dest-tag"><i class="bi bi-geo-alt-fill"></i> ${escaparHtml(destacada.paquete_destino || "Destino Turistea")}</div>
          </div>
        </div>
      </div>
      <div class="col-md-7">
        <div class="card-featured-body d-flex flex-column justify-content-between h-100">
          <div>
            <div class="d-flex align-items-center gap-3 mb-4">
              ${renderAvatar(destacada, true)}
              <div>
                <p class="user-name" style="font-size:1rem">${escaparHtml(destacada.autor_nombre || "Viajero Turistea")}</p>
                <p class="user-pkg">${escaparHtml(nombrePaquete(destacada))}</p>
              </div>
              <div class="stars-yellow ms-auto" style="font-size:1.1rem">${renderEstrellas(mediaValoracion(destacada))}</div>
            </div>
            <h5 class="featured-title">${escaparHtml(destacada.titulo_viaje || "Experiencia compartida")}</h5>
            <p class="review-text">"${escaparHtml(destacada.comentario || "")}"</p>
          </div>
          <div class="d-flex justify-content-end mt-3">
            <span class="date-muted"><i class="bi bi-calendar3 me-1"></i>${formatearFecha(destacada.creado_at)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGrid(experiencias) {
  const grid = document.getElementById("gridExperiencias");
  grid.innerHTML = experiencias.map(exp => `
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="card-exp">
        <div class="card-exp-img">
          <img src="${resolverImagen(exp.foto_url || exp.paquete_imagen)}" alt="${escaparHtml(exp.titulo_viaje || "Experiencia")}" />
          <div class="overlay"></div>
          <div class="dest-tag"><i class="bi bi-geo-alt-fill"></i> ${escaparHtml(exp.paquete_destino || "Turistea")}</div>
        </div>
        <div class="card-exp-body">
          <div class="d-flex align-items-center gap-2 mb-2">
            ${renderAvatar(exp)}
            <div>
              <p class="user-name">${escaparHtml(exp.autor_nombre || "Viajero Turistea")}</p>
              <p class="user-pkg">${escaparHtml(nombrePaquete(exp))}</p>
            </div>
          </div>
          <div class="stars-yellow mb-2">${renderEstrellas(mediaValoracion(exp))}</div>
          <p class="card-review">"${escaparHtml(exp.comentario || "")}"</p>
          <div class="d-flex justify-content-end mt-2">
            <span class="date-muted">${formatearFecha(exp.creado_at, true)}</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function renderSinExperiencias() {
  const card = document.querySelector(".card-featured");
  const grid = document.getElementById("gridExperiencias");

  if (card) {
    card.innerHTML = `
      <div class="experiencias-empty">
        <i class="bi bi-chat-left-text"></i>
        <p>Todavía no hay experiencias publicadas.</p>
      </div>
    `;
  }

  if (grid) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="experiencias-empty">
          <i class="bi bi-pencil-square"></i>
          <p>Cuando los usuarios añadan reseñas, aparecerán aquí.</p>
        </div>
      </div>
    `;
  }
}

function actualizarKpis(experiencias) {
  const kpis = document.querySelectorAll(".kpi-val");
  if (kpis.length < 3) return;

  const total = experiencias.length;
  const media = total
    ? experiencias.reduce((sum, exp) => sum + mediaValoracion(exp), 0) / total
    : 0;
  const destinos = new Set(experiencias.map(exp => exp.paquete_destino).filter(Boolean)).size;

  kpis[0].textContent = total;
  kpis[1].innerHTML = `${media ? media.toFixed(1) : "0.0"} <span style="color:var(--yellow);font-size:1.3rem">★</span>`;
  kpis[2].textContent = destinos;
}

function renderAvatar(exp, grande = false) {
  const foto = exp.autor_foto ? resolverImagen(exp.autor_foto) : "";
  const clases = grande ? "avatar-circle avatar-lg" : "avatar-circle";
  const nombre = exp.autor_nombre || "Viajero Turistea";

  if (foto) {
    return `<img class="${clases} avatar-img" src="${foto}" alt="${escaparHtml(nombre)}" />`;
  }

  return `<div class="${clases}">${iniciales(nombre)}</div>`;
}

function renderEstrellas(valor) {
  const redondeado = Math.round(valor);
  return Array.from({ length: 5 }, (_, i) => i < redondeado ? "★" : "☆").join("");
}

function mediaValoracion(exp) {
  const viaje = Number(exp.valoracion_viaje) || 0;
  const compania = Number(exp.valoracion_compania) || 0;
  return (viaje + compania) / 2;
}

function nombrePaquete(exp) {
  return exp.paquete_titulo ? `Pack "${exp.paquete_titulo}"` : (exp.titulo_viaje || "Experiencia Turistea");
}

function resolverImagen(ruta) {
  if (!ruta) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(ruta)) return ruta;

  const limpia = ruta.replace(/^(\.\.\/)+/, "").replace(/^frontend\//, "");
  return `${BASE_PATH}frontend/${limpia}`;
}

function iniciales(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte[0]?.toUpperCase() || "")
    .join("") || "VT";
}

function formatearFecha(fecha, corto = false) {
  if (!fecha) return "";
  return new Intl.DateTimeFormat("es-ES", {
    month: corto ? "short" : "long",
    year: "numeric",
  }).format(new Date(fecha));
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function inicializarModalDemo() {
  const starBtns = document.querySelectorAll("#starRating .star-btn");
  let valorSeleccionado = 0;

  starBtns.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      const v = Number(btn.dataset.val);
      starBtns.forEach(b => b.classList.toggle("activa", Number(b.dataset.val) <= v));
    });
    btn.addEventListener("mouseleave", () => {
      starBtns.forEach(b => b.classList.toggle("activa", Number(b.dataset.val) <= valorSeleccionado));
    });
    btn.addEventListener("click", () => {
      valorSeleccionado = Number(btn.dataset.val);
      starBtns.forEach(b => b.classList.toggle("activa", Number(b.dataset.val) <= valorSeleccionado));
    });
  });

  const dropzone = document.getElementById("dropzonePub");
  const fileInput = document.getElementById("fileInputPub");
  if (!dropzone || !fileInput) return;

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
    if (file) mostrarArchivo(dropzone, file.name);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) mostrarArchivo(dropzone, fileInput.files[0].name);
  });
}

function mostrarArchivo(dropzone, nombre) {
  dropzone.innerHTML = `
    <i class="bi bi-check-circle-fill" style="font-size:2rem;color:var(--cyan);display:block;margin-bottom:6px"></i>
    <p style="color:var(--navy);font-weight:700;margin:0">${escaparHtml(nombre)}</p>`;
}

function inicializarScrollTop() {
  const btnArriba = document.getElementById("btn-volver-arriba-exp");
  if (!btnArriba) return;

  window.addEventListener("scroll", () => {
    btnArriba.classList.toggle("d-none", window.scrollY < 300);
  });
}
