export function renderAlertas(data) {

  // Clasificar alertas
  const alertasPlazas = data.alerta_plazas || [];
  const proximasSalidas = data.proximas_salidas || [];

  // Paquetes que salen en menos de 15 dias
  const hoy = new Date();
  const salidasProximas = proximasSalidas.filter(p => {
    const diff = (new Date(p.fecha_salida) - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 15;
  });

  // Paquetes sin plazas (0 plazas)
  const sinPlazas = alertasPlazas.filter(p => parseInt(p.plazas_disponibles) === 0);
  const pocasPlazas = alertasPlazas.filter(p => parseInt(p.plazas_disponibles) > 0);

  const totalAlertas = sinPlazas.length + pocasPlazas.length + salidasProximas.length;

  return `
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold mb-0">Alertas</h2>
        <small class="text-muted">${totalAlertas} alertas activas</small>
      </div>
    </div>

    <!-- RESUMEN ALERTAS -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-4">
        <div class="card border-0 shadow-sm text-center p-3 ${sinPlazas.length > 0 ? 'border-start border-danger border-4' : ''}">
          <i class="bi bi-x-circle-fill fs-2 text-danger mb-2"></i>
          <h3 class="fw-bold mb-0">${sinPlazas.length}</h3>
          <small class="text-muted">Sin plazas</small>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card border-0 shadow-sm text-center p-3 ${pocasPlazas.length > 0 ? 'border-start border-warning border-4' : ''}">
          <i class="bi bi-exclamation-triangle-fill fs-2 text-warning mb-2"></i>
          <h3 class="fw-bold mb-0">${pocasPlazas.length}</h3>
          <small class="text-muted">Pocas plazas (1-5)</small>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card border-0 shadow-sm text-center p-3 ${salidasProximas.length > 0 ? 'border-start border-info border-4' : ''}">
          <i class="bi bi-clock-fill fs-2 text-info mb-2"></i>
          <h3 class="fw-bold mb-0">${salidasProximas.length}</h3>
          <small class="text-muted">Salidas en menos de 15 dias</small>
        </div>
      </div>
    </div>

    <!-- PAQUETES SIN PLAZAS -->
    ${sinPlazas.length > 0 ? `
    <div class="card border-0 shadow-sm mb-4 border-start border-danger border-4">
      <div class="card-header bg-white border-0 pt-3">
        <h6 class="fw-bold mb-0">
          <i class="bi bi-x-circle-fill me-2 text-danger"></i>
          Paquetes sin plazas disponibles
        </h6>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 text-center">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Paquete</th>
                <th>Destino</th>
                <th>Plazas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${sinPlazas.map(p => `
                <tr>
                  <td class="text-muted">${p.id}</td>
                  <td class="fw-semibold">${p.titulo}</td>
                  <td>${p.destino}</td>
                  <td><span class="badge bg-danger">0 / ${p.plazas_totales}</span></td>
                  <td><span class="badge bg-danger">Agotado</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- PAQUETES CON POCAS PLAZAS -->
    <div class="card border-0 shadow-sm mb-4 ${pocasPlazas.length > 0 ? 'border-start border-warning border-4' : ''}">
      <div class="card-header bg-white border-0 pt-3">
        <h6 class="fw-bold mb-0">
          <i class="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
          Paquetes con pocas plazas (5 o menos)
        </h6>
      </div>
      <div class="card-body p-0">
        ${pocasPlazas.length > 0 ? `
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 text-center">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Paquete</th>
                <th>Destino</th>
                <th>Plazas disponibles</th>
                <th>Plazas totales</th>
                <th>Ocupacion</th>
              </tr>
            </thead>
            <tbody>
              ${pocasPlazas.map(p => {
                const ocupacion = Math.round(((p.plazas_totales - p.plazas_disponibles) / p.plazas_totales) * 100);
                return `
                  <tr>
                    <td class="text-muted">${p.id}</td>
                    <td class="fw-semibold">${p.titulo}</td>
                    <td>${p.destino}</td>
                    <td><span class="badge bg-warning text-dark">${p.plazas_disponibles}</span></td>
                    <td>${p.plazas_totales}</td>
                    <td>
                      <div class="d-flex align-items-center gap-2 justify-content-center">
                        <div class="progress flex-grow-1" style="height: 8px; max-width: 100px;">
                          <div class="progress-bar ${ocupacion >= 90 ? 'bg-danger' : 'bg-warning'}" style="width: ${ocupacion}%"></div>
                        </div>
                        <small class="fw-semibold">${ocupacion}%</small>
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
        ` : `
        <div class="text-center text-muted py-4">
          <i class="bi bi-check-circle-fill text-success fs-3 d-block mb-2"></i>
          Todos los paquetes tienen plazas suficientes
        </div>
        `}
      </div>
    </div>

    <!-- PROXIMAS SALIDAS -->
    <div class="card border-0 shadow-sm mb-4 ${salidasProximas.length > 0 ? 'border-start border-info border-4' : ''}">
      <div class="card-header bg-white border-0 pt-3">
        <h6 class="fw-bold mb-0">
          <i class="bi bi-clock-fill me-2 text-info"></i>
          Salidas en los proximos 15 dias
        </h6>
      </div>
      <div class="card-body p-0">
        ${salidasProximas.length > 0 ? `
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 text-center">
            <thead class="table-light">
              <tr>
                <th>Paquete</th>
                <th>Destino</th>
                <th>Fecha de salida</th>
                <th>Plazas</th>
                <th>Precio</th>
                <th>Dias restantes</th>
              </tr>
            </thead>
            <tbody>
              ${salidasProximas.map(p => {
                const dias = Math.ceil((new Date(p.fecha_salida) - new Date()) / (1000 * 60 * 60 * 24));
                return `
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
                    <td>
                      <span class="badge ${dias <= 3 ? 'bg-danger' : dias <= 7 ? 'bg-warning text-dark' : 'bg-info'}">
                        ${dias} dias
                      </span>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
        ` : `
        <div class="text-center text-muted py-4">
          <i class="bi bi-check-circle-fill text-success fs-3 d-block mb-2"></i>
          No hay salidas inminentes
        </div>
        `}
      </div>
    </div>

    <!-- RESUMEN RESERVAS PENDIENTES -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-0 pt-3">
        <h6 class="fw-bold mb-0">
          <i class="bi bi-hourglass-split me-2 text-warning"></i>
          Estado de reservas
        </h6>
      </div>
      <div class="card-body">
        <div class="row text-center g-3">
          <div class="col-6 col-md-3">
            <div class="p-3 rounded bg-light">
              <h3 class="fw-bold text-primary mb-0">${data.reservas.total}</h3>
              <small class="text-muted">Total</small>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 rounded bg-light">
              <h3 class="fw-bold text-warning mb-0">${data.reservas.pendientes}</h3>
              <small class="text-muted">Pendientes</small>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 rounded bg-light">
              <h3 class="fw-bold text-success mb-0">${data.reservas.confirmadas}</h3>
              <small class="text-muted">Confirmadas</small>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="p-3 rounded bg-light">
              <h3 class="fw-bold text-danger mb-0">${data.reservas.canceladas}</h3>
              <small class="text-muted">Canceladas</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
