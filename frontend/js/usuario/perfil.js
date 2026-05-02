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
  const reservas   = await obtener("/api/perfil/reservas.php");

  if (!reservas || reservas.error || reservas.length === 0) {
    contenedor.innerHTML = mensajeVacio("bi-ticket-detailed", "Aún no tienes reservas.");
    document.getElementById("stat-reservas").textContent = 0;
    return;
  }

  document.getElementById("stat-reservas").textContent = reservas.length;
  renderizarReservas(reservas, contenedor);

  // Filtro por estado (sin nueva petición al servidor)
  document.getElementById("filtro-reservas").addEventListener("change", (e) => {
    const val      = e.target.value;
    const filtradas = val ? reservas.filter(r => r.estado === val) : reservas;
    renderizarReservas(filtradas, contenedor);
  });
}

function renderizarReservas(lista, contenedor) {
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="text-muted text-center py-3">No hay reservas con ese filtro.</p>`;
    return;
  }

  contenedor.innerHTML = lista.map(r => {
    const badge  = badgeEstado(r.estado);
    const imagen = r.imagen
      ? `${BASE}/${r.imagen}`
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80";
    const fecha  = new Date(r.fecha_reserva).toLocaleDateString("es-ES",
      { day: "2-digit", month: "short", year: "numeric" });

    return `
      <div class="reserva-card">
        <div class="row g-0">
          <div class="col-4 col-md-3">
            <img src="${imagen}" alt="${r.nombre_paquete || 'Destino'}"
              style="min-height:130px;width:100%;height:100%;object-fit:cover;" />
          </div>
          <div class="col-8 col-md-9 p-3">
            <div class="d-flex align-items-start justify-content-between flex-wrap gap-1 mb-1">
              <span class="reserva-titulo">${r.nombre_paquete || "Paquete de viaje"}</span>
              <span class="reserva-badge ${badge.clase}">
                <i class="bi ${badge.icono}"></i> ${r.estado}
              </span>
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
            </div>
          </div>
        </div>
      </div>`;
  }).join("");
}

function badgeEstado(estado) {
  return {
    CONFIRMADA: { clase: "badge-confirmada", icono: "bi-check-circle-fill" },
    PENDIENTE:  { clase: "badge-pendiente",  icono: "bi-clock-fill" },
    CANCELADA:  { clase: "badge-cancelada",  icono: "bi-x-circle-fill" },
  }[estado] || { clase: "badge-pendiente", icono: "bi-circle" };
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
      ? `${BASE}/${f.imagen}`
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
  window.location.href = `${BASE}/frontend/pages/login.html`;
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
}