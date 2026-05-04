export function renderDashboard(data) {

  const plazasTotales = data.plazas_totales || 1;
  const plazasOcupadas = plazasTotales - data.plazas_disponibles;
  const porcentajeOcupacion = Math.round((plazasOcupadas / plazasTotales) * 100);

  return `

    <!-- FILA 1: 3 TARJETAS KPI -->
    <div class="row g-3 mb-3">

      <div class="col-12 col-sm-6 col-md-4">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-primary">
            <i class="bi bi-airplane-fill"></i>
          </div>
          <div class="dash-card-body">
            <span class="dash-card-label">Paquetes activos</span>
            <span class="dash-card-value">${data.paquetes.activos}</span>
            <small class="text-muted">${data.paquetes.inactivos} inactivos de ${data.paquetes.total} totales</small>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-success">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="dash-card-body">
            <span class="dash-card-label">Usuarios</span>
            <span class="dash-card-value">${data.usuarios.total}</span>
            <small class="text-muted">registrados</small>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-warning">
            <i class="bi bi-journal-check"></i>
          </div>
          <div class="dash-card-body">
            <span class="dash-card-label">Reservas</span>
            <span class="dash-card-value">${data.reservas.total}</span>
            <small class="text-muted">${data.reservas.pendientes} pendientes</small>
          </div>
        </div>
      </div>

    </div>

    <!-- FILA 2: 3 TARJETAS KPI -->
    <div class="row g-3 mb-4">

      <div class="col-12 col-sm-6 col-md-4">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-info">
            <i class="bi bi-cash-stack"></i>
          </div>
          <div class="dash-card-body">
            <span class="dash-card-label">Ingresos</span>
            <span class="dash-card-value">${data.ingresos.toFixed(2)}&euro;</span>
            <small class="text-muted">pagos completados</small>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-danger">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div class="dash-card-body">
            <span class="dash-card-label">Alertas plazas</span>
            <span class="dash-card-value">${data.alerta_plazas.length}</span>
            <small class="text-muted">paquetes con 5 plazas o menos</small>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-purple">
            <i class="bi bi-pie-chart-fill"></i>
          </div>
          <div class="dash-card-body">
            <span class="dash-card-label">Ocupacion</span>
            <span class="dash-card-value">${porcentajeOcupacion}%</span>
            <small class="text-muted">${data.plazas_disponibles} plazas disponibles</small>
          </div>
        </div>
      </div>

    </div>

    <!-- FILA 3: GRAFICO RESERVAS + TOP DESTINOS -->
    <div class="row g-3 mb-4">

      <!-- GRAFICO OVERVIEW -->
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 pt-3 pb-0">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-bar-chart-fill me-2 text-primary"></i>
              Overview de reservas
            </h6>
          </div>
          <div class="card-body d-flex align-items-end gap-4 justify-content-center pt-4">
            ${renderBarrasReservas(data.reservas)}
          </div>
        </div>
      </div>

      <!-- TOP DESTINOS -->
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 pt-3 pb-0">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-geo-alt-fill me-2 text-primary"></i>
              Top destinos
            </h6>
          </div>
          <div class="card-body">
            ${data.destinos_populares.length > 0
              ? data.destinos_populares.map((d, i) => `
                <div class="d-flex justify-content-between align-items-center ${i < data.destinos_populares.length - 1 ? 'mb-3 pb-3 border-bottom' : ''}">
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary rounded-circle dash-rank">${i + 1}</span>
                    <span class="fw-semibold">${d.destino}</span>
                  </div>
                  <span class="badge bg-primary bg-opacity-10 text-primary">${d.total} paquetes</span>
                </div>
              `).join("")
              : `<p class="text-muted text-center mb-0">Sin datos</p>`
            }
          </div>
        </div>
      </div>

    </div>

    <!-- FILA 4: PROXIMAS SALIDAS -->
    <div class="row g-3">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 pt-3 pb-0">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-calendar-event me-2 text-primary"></i>
              Proximas salidas
            </h6>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 text-center">
                <thead class="table-light">
                  <tr>
                    <th>Paquete</th>
                    <th>Destino</th>
                    <th>Salida</th>
                    <th>Plazas</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.proximas_salidas.length > 0
                    ? data.proximas_salidas.map(p => `
                      <tr>
                        <td class="fw-semibold">${p.titulo}</td>
                        <td>${p.destino}</td>
                        <td>${p.fecha_salida}</td>
                        <td>
                          <span class="badge ${parseInt(p.plazas_disponibles) <= 5 ? 'bg-danger' : 'bg-success'}">
                            ${p.plazas_disponibles}
                          </span>
                        </td>
                        <td class="fw-bold">${p.precio}&euro;</td>
                      </tr>
                    `).join("")
                    : `<tr><td colspan="5" class="text-center text-muted py-3">No hay salidas programadas</td></tr>`
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBarrasReservas(reservas) {
  const max = Math.max(reservas.pendientes, reservas.confirmadas, reservas.canceladas, 1);

  const barras = [
    { valor: reservas.pendientes, label: "Pendientes", clase: "dash-bar-warning" },
    { valor: reservas.confirmadas, label: "Confirmadas", clase: "dash-bar-success" },
    { valor: reservas.canceladas, label: "Canceladas", clase: "dash-bar-danger" }
  ];

  return barras.map(b => `
    <div class="dash-bar-group">
      <div class="dash-bar ${b.clase}" style="height: ${Math.max((b.valor / max) * 160, 8)}px;"></div>
      <small class="fw-bold mt-2 d-block">${b.valor}</small>
      <small class="text-muted">${b.label}</small>
    </div>
  `).join("");
}
