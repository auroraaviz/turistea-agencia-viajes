/**
 * perfil.js
 * Orquesta toda la lógica de la página de perfil:
 *  - Verificación de sesión
 *  - Carga de datos del usuario
 *  - Carga de reservas y favoritos desde la API
 *  - Modal de edición de perfil
 *  - Eliminar favorito
 *  - Cerrar sesión
 */

import { obtener, crear } from "../utils/fetch.js";
import { BASE } from "../config.js";

/* ─────────────────────────────────────────
   INICIALIZACIÓN
───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {
  await verificarSesion();
  await Promise.all([cargarPerfil(), cargarReservas(), cargarFavoritos()]);
  inicializarEventos();
});

/* ─────────────────────────────────────────
   1. VERIFICAR SESIÓN
   Si no hay sesión activa → redirigir a login
───────────────────────────────────────── */
async function verificarSesion() {
  try {
    const sesion = await obtener("/api/auth/session.php");
    if (!sesion || !sesion.id) {
      window.location.href = `${BASE}/frontend/pages/login.html`;
    }
  } catch {
    window.location.href = `${BASE}/frontend/pages/login.html`;
  }
}

/* ─────────────────────────────────────────
   2. CARGAR DATOS DEL USUARIO
───────────────────────────────────────── */
async function cargarPerfil() {
  try {
    const usuario = await obtener("/api/perfil/get.php");

    // ── Hero ──
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.trim();
    document.getElementById("hero-saludo").textContent = `¡Hola, ${usuario.nombre}! 👋`;
    document.getElementById("hero-email").textContent  = usuario.email;

    // ── Avatar con iniciales (sin API externa de foto) ──
    const avatar = document.getElementById("perfil-avatar");
    const iniciales = encodeURIComponent(nombreCompleto || "U");
    avatar.src = `https://ui-avatars.com/api/?name=${iniciales}&background=0077B6&color=fff&size=128&bold=true&font-size=0.4`;
    avatar.alt = nombreCompleto;

    // ── Sidebar ──
    document.getElementById("sidebar-nombre").textContent = nombreCompleto;
    document.getElementById("sidebar-email").textContent  = usuario.email;

    // Teléfono (opcional)
    const telWrap = document.getElementById("info-telefono-wrap");
    if (usuario.telefono) {
      document.getElementById("info-telefono").textContent = usuario.telefono;
    } else {
      telWrap.style.display = "none";
    }

    // Fecha de alta
    const fecha = new Date(usuario.created_at);
    const opciones = { year: "numeric", month: "long" };
    document.getElementById("info-miembro").textContent =
      `Miembro desde ${fecha.toLocaleDateString("es-ES", opciones)}`;

    // ── Pre-rellenar modal de edición ──
    document.getElementById("edit-nombre").value    = usuario.nombre    || "";
    document.getElementById("edit-apellidos").value = usuario.apellidos || "";
    document.getElementById("edit-telefono").value  = usuario.telefono  || "";

  } catch (err) {
    console.error("Error cargando perfil:", err);
  }
}

/* ─────────────────────────────────────────
   3. CARGAR RESERVAS
───────────────────────────────────────── */
async function cargarReservas() {
  const contenedor = document.getElementById("contenedor-reservas");

  try {
    const reservas = await obtener("/api/perfil/reservas.php");

    if (!reservas || reservas.length === 0) {
      contenedor.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-ticket-detailed fs-1 d-block mb-2"></i>
          Aún no tienes reservas.
        </div>`;
      document.getElementById("stat-reservas").textContent = 0;
      return;
    }

    document.getElementById("stat-reservas").textContent = reservas.length;
    renderizarReservas(reservas, contenedor);

    // Filtro por estado
    document.getElementById("filtro-reservas").addEventListener("change", (e) => {
      const filtro = e.target.value;
      const filtradas = filtro ? reservas.filter(r => r.estado === filtro) : reservas;
      renderizarReservas(filtradas, contenedor);
    });

  } catch (err) {
    console.error("Error cargando reservas:", err);
    contenedor.innerHTML = `<p class="text-danger text-center">Error al cargar reservas.</p>`;
  }
}

function renderizarReservas(lista, contenedor) {
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="text-muted text-center py-3">No hay reservas con ese filtro.</p>`;
    return;
  }

  contenedor.innerHTML = lista.map(r => {
    const badgeInfo = badgeEstado(r.estado);
    const imagen    = r.imagen
      ? `${BASE}/${r.imagen}`
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80";

    const fechaReserva = new Date(r.fecha_reserva).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric"
    });

    return `
      <div class="reserva-card">
        <div class="row g-0">
          <div class="col-4 col-md-3">
            <img src="${imagen}" alt="${r.nombre_paquete || 'Destino'}" style="min-height:130px; width:100%; height:100%; object-fit:cover;" />
          </div>
          <div class="col-8 col-md-9 p-3">
            <div class="d-flex align-items-start justify-content-between flex-wrap gap-1 mb-1">
              <span class="reserva-titulo">${r.nombre_paquete || "Paquete de viaje"}</span>
              <span class="reserva-badge ${badgeInfo.clase}">
                <i class="bi ${badgeInfo.icono}"></i> ${r.estado}
              </span>
            </div>
            <div class="reserva-fecha mb-2">
              <i class="bi bi-calendar3"></i> Reservado el ${fechaReserva}
            </div>
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span style="font-size:.8rem; color:#777;">
                <i class="bi bi-people-fill me-1"></i>${r.num_viajeros} viajero${r.num_viajeros > 1 ? 's' : ''}
              </span>
              <span style="font-size:.8rem; color:#777;">
                <i class="bi bi-currency-euro me-1"></i>${Number(r.precio_total).toLocaleString("es-ES")}
              </span>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");
}

function badgeEstado(estado) {
  const mapa = {
    CONFIRMADA: { clase: "badge-confirmada", icono: "bi-check-circle-fill" },
    PENDIENTE:  { clase: "badge-pendiente",  icono: "bi-clock-fill" },
    CANCELADA:  { clase: "badge-cancelada",  icono: "bi-x-circle-fill" },
  };
  return mapa[estado] || { clase: "badge-pendiente", icono: "bi-circle" };
}

/* ─────────────────────────────────────────
   4. CARGAR FAVORITOS
───────────────────────────────────────── */
async function cargarFavoritos() {
  const contenedor = document.getElementById("contenedor-favoritos");

  try {
    const favoritos = await obtener("/api/perfil/favoritos.php");

    if (!favoritos || favoritos.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-heart fs-1 d-block mb-2"></i>
          Aún no tienes destinos guardados.
        </div>`;
      document.getElementById("stat-favoritos").textContent = 0;
      return;
    }

    document.getElementById("stat-favoritos").textContent = favoritos.length;
    renderizarFavoritos(favoritos, contenedor);

  } catch (err) {
    console.error("Error cargando favoritos:", err);
    contenedor.innerHTML = `<p class="text-danger text-center col-12">Error al cargar favoritos.</p>`;
  }
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

  // Eventos de eliminar favorito
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
  const col = this.closest("[data-paquete-id]");

  // Animación de salida
  col.style.transition = "opacity .3s, transform .3s";
  col.style.opacity    = "0";
  col.style.transform  = "scale(.85)";

  try {
    await crear("/api/perfil/favorito-eliminar.php", { paquete_id: paqueteId });

    setTimeout(() => {
      col.remove();
      // Actualizar contador
      const restantes = document.querySelectorAll("#contenedor-favoritos [data-paquete-id]").length;
      document.getElementById("stat-favoritos").textContent = restantes;

      if (restantes === 0) {
        document.getElementById("contenedor-favoritos").innerHTML = `
          <div class="col-12 text-center py-5 text-muted">
            <i class="bi bi-heart fs-1 d-block mb-2"></i>
            Aún no tienes destinos guardados.
          </div>`;
      }
    }, 320);

  } catch (err) {
    console.error("Error eliminando favorito:", err);
    // Revertir animación si falla
    col.style.opacity   = "1";
    col.style.transform = "scale(1)";
  }
}

/* ─────────────────────────────────────────
   6. EDITAR PERFIL (modal)
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

  try {
    const respuesta = await crear("/api/perfil/update.php", datos);

    if (respuesta && respuesta.ok) {
      mostrarFeedback(feedback, "✓ Cambios guardados correctamente.", "success");
      // Actualizar UI sin recargar
      const nombreCompleto = `${datos.nombre} ${datos.apellidos}`.trim();
      document.getElementById("sidebar-nombre").textContent = nombreCompleto;
      document.getElementById("hero-saludo").textContent    = `¡Hola, ${datos.nombre}! 👋`;
      document.getElementById("info-telefono").textContent  = datos.telefono || "—";

      // Actualizar avatar
      const avatar = document.getElementById("perfil-avatar");
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&background=0077B6&color=fff&size=128&bold=true&font-size=0.4`;

      setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById("modalEditarPerfil")).hide();
        feedback.classList.add("d-none");
      }, 1500);
    } else {
      mostrarFeedback(feedback, respuesta?.mensaje || "Error al guardar los cambios.", "danger");
    }

  } catch (err) {
    console.error("Error guardando perfil:", err);
    mostrarFeedback(feedback, "Error de conexión. Inténtalo de nuevo.", "danger");
  } finally {
    btn.disabled    = false;
    btn.innerHTML   = '<i class="bi bi-check-lg me-1"></i>Guardar cambios';
  }
}

function mostrarFeedback(el, mensaje, tipo) {
  el.className    = `alert alert-${tipo}`;
  el.textContent  = mensaje;
  el.classList.remove("d-none");
}

/* ─────────────────────────────────────────
   7. CERRAR SESIÓN
───────────────────────────────────────── */
async function cerrarSesion() {
  try {
    await crear("/api/auth/logout.php", {});
  } catch { /* ignorar */ }
  window.location.href = `${BASE}/frontend/pages/login.html`;
}

/* ─────────────────────────────────────────
   8. REGISTRO DE EVENTOS
───────────────────────────────────────── */
function inicializarEventos() {
  // Guardar perfil desde modal
  document.getElementById("btn-guardar-perfil")?.addEventListener("click", guardarPerfil);

  // Cerrar sesión (navbar + sidebar)
  document.getElementById("btn-logout")?.addEventListener("click", (e) => { e.preventDefault(); cerrarSesion(); });
  document.getElementById("sidebar-logout")?.addEventListener("click", (e) => { e.preventDefault(); cerrarSesion(); });

  // Limpiar feedback del modal al cerrarse
  document.getElementById("modalEditarPerfil")?.addEventListener("hidden.bs.modal", () => {
    const fb = document.getElementById("editar-feedback");
    fb.classList.add("d-none");
    fb.textContent = "";
  });
}