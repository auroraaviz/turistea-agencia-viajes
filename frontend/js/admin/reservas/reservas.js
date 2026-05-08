import { obtener, crear } from "../../utils/fetch.js";

console.log("modulo reservas admin cargado");

document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");
  if (!contenido) return;

  let estadoActual = null; // guarda el filtro activo para refrescar tras cambios

  document.getElementById("btnReservasPendientes")?.addEventListener("click", (e) => {
    e.preventDefault();
    estadoActual = "PENDIENTE";
    cargarReservas("PENDIENTE");
  });

  document.getElementById("btnReservasConfirmadas")?.addEventListener("click", (e) => {
    e.preventDefault();
    estadoActual = "CONFIRMADA";
    cargarReservas("CONFIRMADA");
  });

  document.getElementById("btnReservasCanceladas")?.addEventListener("click", (e) => {
    e.preventDefault();
    estadoActual = "CANCELADA";
    cargarReservas("CANCELADA");
  });

  document.getElementById("btnReservasTodas")?.addEventListener("click", (e) => {
    e.preventDefault();
    estadoActual = null;
    cargarReservas(null);
  });

  async function cargarReservas(estado) {
    contenido.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Cargando reservas...</p>
      </div>`;

    const urlFiltrada = estado
      ? "/api/reservas/listar.php?estado=" + estado
      : "/api/reservas/listar.php";

    try {
      const [reservasFiltradas, todasReservas] = await Promise.all([
        obtener(urlFiltrada),
        obtener("/api/reservas/listar.php")
      ]);

      if (!reservasFiltradas || !Array.isArray(reservasFiltradas)) {
        contenido.innerHTML = '<div class="alert alert-danger text-center mt-4">Error al cargar las reservas.</div>';
        return;
      }

      const titulo = estado
        ? "Reservas " + estado.charAt(0) + estado.slice(1).toLowerCase() + "s"
        : "Todas las reservas";

      contenido.innerHTML = renderReservas(reservasFiltradas, todasReservas, titulo);
      activarFilas();

    } catch (err) {
      console.error(err);
      contenido.innerHTML = '<div class="alert alert-danger text-center mt-4">Error al cargar las reservas.</div>';
    }
  }

  // ── Activa el click en cada fila para abrir el modal ──────────────────
  function activarFilas() {
    document.querySelectorAll(".fila-reserva").forEach((fila) => {
      fila.addEventListener("click", () => abrirModal(fila.dataset.id, fila.dataset));
    });
  }

  // ── Modal de detalle + acciones ───────────────────────────────────────
  function abrirModal(id, datos) {
    document.getElementById("modalReservaWrap")?.remove();

    const wrap = document.createElement("div");
    wrap.id = "modalReservaWrap";
    wrap.innerHTML = `
      <div class="modal fade" id="modalReserva" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">
                Reserva #${datos.id}
                <span class="ms-2">${badgeEstado(datos.estado)}</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Cliente</p>
                  <p class="fw-semibold mb-0">${datos.nombre} ${datos.apellidos}</p>
                  <p class="text-muted small mb-0">${datos.email}</p>
                </div>
                <div class="col-md-6">
                  <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Paquete</p>
                  <p class="fw-semibold mb-0">${datos.paquete}</p>
                  <p class="text-muted small mb-0">${datos.destino}</p>
                </div>
                <div class="col-md-4">
                  <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Viajeros</p>
                  <p class="fw-semibold mb-0">${datos.viajeros}</p>
                </div>
                <div class="col-md-4">
                  <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Total</p>
                  <p class="fw-semibold mb-0">${parseFloat(datos.precio).toFixed(2)}€</p>
                </div>
                <div class="col-md-4">
                  <p class="text-uppercase fw-bold text-muted mb-1" style="font-size:.75rem">Fecha</p>
                  <p class="fw-semibold mb-0">${datos.fecha}</p>
                </div>
              </div>

              <hr>

              <p class="text-uppercase fw-bold text-muted mb-2" style="font-size:.75rem">Cambiar estado</p>
              <div class="d-flex gap-2 flex-wrap mb-3">
                ${datos.estado !== "PENDIENTE"  ? `<button class="btn btn-warning  btn-sm btn-estado" data-estado="PENDIENTE">Marcar pendiente</button>`  : ""}
                ${datos.estado !== "CONFIRMADA" ? `<button class="btn btn-success  btn-sm btn-estado" data-estado="CONFIRMADA">Confirmar</button>` : ""}
                ${datos.estado !== "CANCELADA"  ? `<button class="btn btn-danger   btn-sm btn-estado" data-estado="CANCELADA">Cancelar</button>`  : ""}
              </div>

              <hr>

              <p class="text-uppercase fw-bold text-muted mb-2" style="font-size:.75rem">Zona peligrosa</p>
              <button class="btn btn-outline-danger btn-sm" id="btnEliminarReserva">
                <i class="bi bi-trash me-1"></i>Eliminar reserva
              </button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(wrap);
    const bsModal = new bootstrap.Modal(document.getElementById("modalReserva"));
    bsModal.show();

    document.getElementById("modalReserva").addEventListener("hidden.bs.modal", () => wrap.remove());

    // Botones cambiar estado
    wrap.querySelectorAll(".btn-estado").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;

        const texto = await crear("/api/reservas/update.php", {
          id:     parseInt(id),
          estado: btn.dataset.estado
        });
        const res = texto ? (() => { try { return JSON.parse(texto); } catch { return null; } })() : null;

        if (res?.ok) {
          bsModal.hide();
          cargarReservas(estadoActual);
        } else {
          btn.disabled = false;
          btn.textContent = btn.dataset.estado;
          alert(res?.error || "Error al actualizar el estado");
        }
      });
    });

    // Botón eliminar
    document.getElementById("btnEliminarReserva").addEventListener("click", async () => {
      if (!confirm(`¿Eliminar la reserva #${id}? Esta acción no se puede deshacer.`)) return;

      const texto = await crear("/api/reservas/eliminar.php", { id: parseInt(id) });
      const res = texto ? (() => { try { return JSON.parse(texto); } catch { return null; } })() : null;

      if (res?.ok) {
        bsModal.hide();
        cargarReservas(estadoActual);
      } else {
        alert(res?.error || "Error al eliminar la reserva");
      }
    });
  }

  // ── Render ────────────────────────────────────────────────────────────
  function badgeEstado(estado) {
    const map = {
      PENDIENTE:  "bg-warning text-dark",
      CONFIRMADA: "bg-success",
      CANCELADA:  "bg-danger"
    };
    return `<span class="badge ${map[estado] || "bg-secondary"}">${estado}</span>`;
  }

  function badgePago(estado) {
    const map = {
      PENDIENTE: "bg-warning text-dark",
      PAGADO:    "bg-success",
      FALLIDO:   "bg-danger"
    };
    return estado
      ? `<span class="badge ${map[estado] || "bg-secondary"}">${estado}</span>`
      : '<span class="text-muted">—</span>';
  }

  function renderReservas(reservas, todasReservas, titulo) {
    const contadores = {
      total:      todasReservas.length,
      pendientes: todasReservas.filter(r => r.estado === "PENDIENTE").length,
      confirmadas: todasReservas.filter(r => r.estado === "CONFIRMADA").length,
      canceladas: todasReservas.filter(r => r.estado === "CANCELADA").length
    };
    const ingresos = todasReservas
      .filter(r => r.pago_estado === "PAGADO")
      .reduce((sum, r) => sum + parseFloat(r.pago_importe || 0), 0);

    return `
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="fw-bold mb-0">${titulo}</h2>
          <small class="text-muted">${reservas.length} reserva${reservas.length !== 1 ? "s" : ""} encontrada${reservas.length !== 1 ? "s" : ""}</small>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center p-3">
            <i class="bi bi-journal-check fs-2 text-primary mb-2"></i>
            <h3 class="fw-bold mb-0">${contadores.total}</h3>
            <small class="text-muted">Total</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center p-3">
            <i class="bi bi-clock-fill fs-2 text-warning mb-2"></i>
            <h3 class="fw-bold mb-0">${contadores.pendientes}</h3>
            <small class="text-muted">Pendientes</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center p-3">
            <i class="bi bi-check-circle-fill fs-2 text-success mb-2"></i>
            <h3 class="fw-bold mb-0">${contadores.confirmadas}</h3>
            <small class="text-muted">Confirmadas</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm text-center p-3">
            <i class="bi bi-cash-stack fs-2 text-info mb-2"></i>
            <h3 class="fw-bold mb-0">${ingresos.toFixed(2)}€</h3>
            <small class="text-muted">Ingresos</small>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Paquete</th>
                  <th class="text-center">Viajeros</th>
                  <th class="text-end">Total</th>
                  <th class="text-center">Estado</th>
                  <th class="text-center">Pago</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${reservas.length === 0
                  ? '<tr><td colspan="8" class="text-center text-muted py-4">No hay reservas</td></tr>'
                  : reservas.map(r => `
                    <tr class="fila-reserva" style="cursor:pointer"
                      data-id="${r.id}"
                      data-estado="${r.estado}"
                      data-nombre="${r.usuario_nombre || ""}"
                      data-apellidos="${r.usuario_apellidos || ""}"
                      data-email="${r.usuario_email || ""}"
                      data-paquete="${r.paquete_titulo || ""}"
                      data-destino="${r.paquete_destino || ""}"
                      data-viajeros="${r.num_viajeros}"
                      data-precio="${r.precio_total}"
                      data-fecha="${r.fecha_reserva || ""}">
                      <td class="text-muted">#${r.id}</td>
                      <td>
                        <div class="fw-semibold">${r.usuario_nombre || ""} ${r.usuario_apellidos || ""}</div>
                        <small class="text-muted">${r.usuario_email || ""}</small>
                      </td>
                      <td>
                        <div class="fw-semibold">${r.paquete_titulo || "—"}</div>
                        <small class="text-muted">${r.paquete_destino || ""}</small>
                      </td>
                      <td class="text-center">${r.num_viajeros}</td>
                      <td class="text-end fw-bold">${parseFloat(r.precio_total).toFixed(2)}€</td>
                      <td class="text-center">${badgeEstado(r.estado)}</td>
                      <td class="text-center">${badgePago(r.pago_estado)}</td>
                      <td><small>${r.fecha_reserva || "—"}</small></td>
                    </tr>
                  `).join("")
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }
});