export function renderEstadisticas(data) {

  const plazasTotales = data.plazas_totales || 1;
  const plazasOcupadas = plazasTotales - data.plazas_disponibles;
  const porcentajeOcupacion = Math.round((plazasOcupadas / plazasTotales) * 100);

  // Barras reservas
  const maxReservas = Math.max(data.reservas.pendientes, data.reservas.confirmadas, data.reservas.canceladas, 1);

  // Barra de ocupacion por paquete (alerta_plazas tiene los que tienen pocas plazas, proximas_salidas tiene datos)
  // Usamos proximas_salidas para mostrar ocupacion individual
  const paquetesConOcupacion = data.proximas_salidas.map(p => {
    const totEstimado = parseInt(p.plazas_disponibles) + 10; // estimacion
    return p;
  });

  return `
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold mb-0">Estadisticas</h2>
        <small class="text-muted">Datos y metricas de tu agencia</small>
      </div>
    </div>

    <!-- KPIs RAPIDOS -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <i class="bi bi-airplane-fill fs-2 text-primary mb-2"></i>
          <h3 class="fw-bold mb-0">${data.paquetes.total}</h3>
          <small class="text-muted">Paquetes totales</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <i class="bi bi-people-fill fs-2 text-success mb-2"></i>
          <h3 class="fw-bold mb-0">${data.usuarios.total}</h3>
          <small class="text-muted">Usuarios</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <i class="bi bi-journal-check fs-2 text-warning mb-2"></i>
          <h3 class="fw-bold mb-0">${data.reservas.total}</h3>
          <small class="text-muted">Reservas</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <i class="bi bi-cash-stack fs-2 text-info mb-2"></i>
          <h3 class="fw-bold mb-0">${data.ingresos.toFixed(2)}&euro;</h3>
          <small class="text-muted">Ingresos</small>
        </div>
      </div>
    </div>

    <!-- RESERVAS POR ESTADO -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 pt-3">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-bar-chart-fill me-2 text-primary"></i>
              Reservas por estado
            </h6>
          </div>
          <div class="card-body">

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold">Pendientes</span>
                <span class="small text-muted">${data.reservas.pendientes}</span>
              </div>
              <div class="progress" style="height: 12px;">
                <div class="progress-bar bg-warning" style="width: ${data.reservas.total ? (data.reservas.pendientes / data.reservas.total * 100) : 0}%"></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold">Confirmadas</span>
                <span class="small text-muted">${data.reservas.confirmadas}</span>
              </div>
              <div class="progress" style="height: 12px;">
                <div class="progress-bar bg-success" style="width: ${data.reservas.total ? (data.reservas.confirmadas / data.reservas.total * 100) : 0}%"></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold">Canceladas</span>
                <span class="small text-muted">${data.reservas.canceladas}</span>
              </div>
              <div class="progress" style="height: 12px;">
                <div class="progress-bar bg-danger" style="width: ${data.reservas.total ? (data.reservas.canceladas / data.reservas.total * 100) : 0}%"></div>
              </div>
            </div>

            <div class="text-center mt-4 pt-2 border-top">
              <span class="small text-muted">Total: <strong>${data.reservas.total}</strong> reservas</span>
            </div>

          </div>
        </div>
      </div>

      <!-- OCUPACION GENERAL -->
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 pt-3">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-pie-chart-fill me-2 text-primary"></i>
              Ocupacion general
            </h6>
          </div>
          <div class="card-body d-flex flex-column align-items-center justify-content-center">

            <div class="dash-donut mb-3" style="--porcentaje: ${porcentajeOcupacion};">
              <span class="dash-donut-value">${porcentajeOcupacion}%</span>
            </div>

            <div class="row text-center w-100">
              <div class="col-4">
                <h5 class="fw-bold text-primary mb-0">${plazasTotales}</h5>
                <small class="text-muted">Totales</small>
              </div>
              <div class="col-4">
                <h5 class="fw-bold text-success mb-0">${plazasOcupadas}</h5>
                <small class="text-muted">Ocupadas</small>
              </div>
              <div class="col-4">
                <h5 class="fw-bold text-warning mb-0">${data.plazas_disponibles}</h5>
                <small class="text-muted">Libres</small>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- PAQUETES: ACTIVOS VS INACTIVOS -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 pt-3">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-toggle-on me-2 text-primary"></i>
              Paquetes: activos vs inactivos
            </h6>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="flex-grow-1">
                <div class="progress" style="height: 28px; border-radius: 8px;">
                  <div class="progress-bar bg-success" style="width: ${data.paquetes.total ? (data.paquetes.activos / data.paquetes.total * 100) : 0}%; font-size: 0.85rem;" >
                    Activos: ${data.paquetes.activos}
                  </div>
                  <div class="progress-bar bg-secondary" style="width: ${data.paquetes.total ? (data.paquetes.inactivos / data.paquetes.total * 100) : 0}%; font-size: 0.85rem;">
                    Inactivos: ${data.paquetes.inactivos}
                  </div>
                </div>
              </div>
            </div>
            <div class="row text-center">
              <div class="col-4">
                <h5 class="fw-bold mb-0">${data.paquetes.total}</h5>
                <small class="text-muted">Total</small>
              </div>
              <div class="col-4">
                <h5 class="fw-bold text-success mb-0">${data.paquetes.activos}</h5>
                <small class="text-muted">Activos</small>
              </div>
              <div class="col-4">
                <h5 class="fw-bold text-secondary mb-0">${data.paquetes.inactivos}</h5>
                <small class="text-muted">Inactivos</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TOP DESTINOS -->
      <div class="col-12 col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 pt-3">
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

    <!-- ULTIMOS USUARIOS -->
    <div class="row g-3">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 pt-3">
            <h6 class="fw-bold mb-0">
              <i class="bi bi-person-plus-fill me-2 text-success"></i>
              Ultimos usuarios registrados
            </h6>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 text-center">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha de registro</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.ultimos_usuarios.map(u => `
                    <tr>
                      <td class="text-muted">${u.id}</td>
                      <td class="fw-semibold">${u.nombre} ${u.apellidos}</td>
                      <td class="text-muted">${u.email}</td>
                      <td><small>${u.created_at}</small></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
