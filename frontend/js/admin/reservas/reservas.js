import { obtener } from "../../utils/fetch.js";

console.log("modulo reservas admin cargado");

document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");
  if (!contenido) return;

  // Botones del sidebar
  document.getElementById("btnReservasPendientes")?.addEventListener("click", (e) => {
    e.preventDefault();
    cargarReservas("PENDIENTE");
  });

  document.getElementById("btnReservasConfirmadas")?.addEventListener("click", (e) => {
    e.preventDefault();
    cargarReservas("CONFIRMADA");
  });

  document.getElementById("btnReservasCanceladas")?.addEventListener("click", (e) => {
    e.preventDefault();
    cargarReservas("CANCELADA");
  });

  document.getElementById("btnReservasTodas")?.addEventListener("click", (e) => {
    e.preventDefault();
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
        // Dos llamadas en paralelo: filtrada para tabla, todas para KPIs
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

        contenido.innerHTML = renderReservas(reservasFiltradas, todasReservas, titulo, estado);

    } catch (err) {
        console.error(err);
        contenido.innerHTML = '<div class="alert alert-danger text-center mt-4">Error al cargar las reservas.</div>';
    }
}

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
    return estado ? `<span class="badge ${map[estado] || "bg-secondary"}">${estado}</span>` : '<span class="text-muted">—</span>';
  }

  function renderReservas(reservas, todasReservas, titulo, estadoFiltro) {
    const contadores = {
        total: todasReservas.length,
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

      <!-- KPIs -->
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
            <h3 class="fw-bold mb-0">${ingresos.toFixed(2)}\u20AC</h3>
            <small class="text-muted">Ingresos</small>
          </div>
        </div>
      </div>

      <!-- TABLA -->
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
                    <tr>
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
                      <td class="text-end fw-bold">${parseFloat(r.precio_total).toFixed(2)}\u20AC</td>
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
