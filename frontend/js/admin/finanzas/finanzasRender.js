function dinero(valor) {
  return `${Number(valor || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}€`;
}

function fecha(valor) {
  if (!valor) return "-";
  return new Date(valor.replace(" ", "T")).toLocaleDateString("es-ES");
}

function nombreCliente(item) {
  const nombre = `${item.usuario_nombre || ""} ${item.usuario_apellidos || ""}`.trim();
  return nombre || item.usuario_email || "Cliente";
}

function facturaNumero(item) {
  const year = item.fecha_pago ? new Date(item.fecha_pago.replace(" ", "T")).getFullYear() : new Date().getFullYear();
  return `FAC-${year}-${String(item.id).padStart(6, "0")}`;
}

function badgePago(estado) {
  const clases = {
    PAGADO: "bg-success",
    PENDIENTE: "bg-warning text-dark",
    FALLIDO: "bg-danger"
  };
  return `<span class="badge ${clases[estado] || "bg-secondary"}">${estado || "SIN ESTADO"}</span>`;
}

function renderNav(activa) {
  const items = [
    ["ingresos", "bi-graph-up-arrow", "Ingresos"],
    ["pagos", "bi-credit-card", "Pagos"],
    ["facturas", "bi-receipt", "Facturas"]
  ];

  return `
    <div class="finanzas-tabs" role="tablist" aria-label="Secciones de finanzas">
      ${items.map(([id, icono, texto]) => `
        <button class="finanzas-tab ${activa === id ? "active" : ""}" type="button" data-finanzas-tab="${id}">
          <i class="bi ${icono}"></i>
          <span>${texto}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderKPIs(data) {
  return `
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-success"><i class="bi bi-graph-up-arrow"></i></div>
          <div class="dash-card-body">
            <span class="dash-card-label">Ingresos totales</span>
            <span class="dash-card-value">${dinero(data.resumen.ingresos_totales)}</span>
            <small class="text-muted">pagos completados</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-primary"><i class="bi bi-calendar2-check"></i></div>
          <div class="dash-card-body">
            <span class="dash-card-label">Ingresos del mes</span>
            <span class="dash-card-value">${dinero(data.resumen.ingresos_mes)}</span>
            <small class="text-muted">mes actual</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-warning"><i class="bi bi-hourglass-split"></i></div>
          <div class="dash-card-body">
            <span class="dash-card-label">Pagos pendientes</span>
            <span class="dash-card-value">${dinero(data.resumen.pagos_pendientes)}</span>
            <small class="text-muted">importe por cobrar</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="dash-card shadow-sm">
          <div class="dash-card-icon dash-icon-info"><i class="bi bi-receipt"></i></div>
          <div class="dash-card-body">
            <span class="dash-card-label">Facturas</span>
            <span class="dash-card-value">${data.resumen.facturas_emitidas}</span>
            <small class="text-muted">${data.resumen.pagos_totales} pagos registrados</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGraficoIngresos(data) {
  const meses = data.ingresos_mensuales || [];
  const max = Math.max(...meses.map((m) => Number(m.total)), 1);

  return `
    <div class="card border-0 shadow-sm h-100">
      <div class="card-header bg-white border-0 pt-3 pb-0">
        <h6 class="fw-bold mb-0"><i class="bi bi-bar-chart-fill me-2 text-primary"></i>Ingresos por mes</h6>
      </div>
      <div class="card-body">
        ${meses.length === 0
          ? `<p class="text-muted text-center py-4 mb-0">Sin ingresos registrados</p>`
          : `<div class="finanzas-chart">
              ${meses.map((m) => `
                <div class="finanzas-bar-group">
                  <span class="finanzas-bar-value">${dinero(m.total)}</span>
                  <div class="finanzas-bar" style="height:${Math.max((Number(m.total) / max) * 190, 10)}px"></div>
                  <small>${m.mes}</small>
                </div>
              `).join("")}
            </div>`
        }
      </div>
    </div>
  `;
}

function renderEstados(data) {
  const estados = data.pagos_por_estado || [];
  const total = estados.reduce((sum, item) => sum + Number(item.total || 0), 0) || 1;

  return `
    <div class="card border-0 shadow-sm h-100">
      <div class="card-header bg-white border-0 pt-3 pb-0">
        <h6 class="fw-bold mb-0"><i class="bi bi-pie-chart-fill me-2 text-primary"></i>Estado de pagos</h6>
      </div>
      <div class="card-body">
        ${estados.length === 0
          ? `<p class="text-muted text-center py-4 mb-0">Sin pagos registrados</p>`
          : estados.map((item) => `
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold">${item.estado}</span>
                <span class="small text-muted">${item.total} pagos · ${dinero(item.importe)}</span>
              </div>
              <div class="progress" style="height:12px">
                <div class="progress-bar ${item.estado === "PAGADO" ? "bg-success" : item.estado === "PENDIENTE" ? "bg-warning" : "bg-danger"}" style="width:${(Number(item.total) / total) * 100}%"></div>
              </div>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;
}

function renderMetodos(data) {
  const metodos = data.pagos_por_metodo || [];

  return `
    <div class="card border-0 shadow-sm h-100">
      <div class="card-header bg-white border-0 pt-3 pb-0">
        <h6 class="fw-bold mb-0"><i class="bi bi-wallet2 me-2 text-primary"></i>Métodos de pago</h6>
      </div>
      <div class="card-body">
        ${metodos.length === 0
          ? `<p class="text-muted text-center py-4 mb-0">Sin métodos registrados</p>`
          : metodos.map((item, index) => `
            <div class="finanzas-method ${index < metodos.length - 1 ? "border-bottom" : ""}">
              <div>
                <span class="fw-semibold">${item.metodo || "Sin método"}</span>
                <small class="text-muted d-block">${item.total} pago${Number(item.total) !== 1 ? "s" : ""}</small>
              </div>
              <span class="fw-bold">${dinero(item.importe)}</span>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;
}

function renderTopPaquetes(data) {
  const paquetes = data.top_paquetes || [];

  return `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-0 pt-3 pb-0">
        <h6 class="fw-bold mb-0"><i class="bi bi-trophy-fill me-2 text-primary"></i>Paquetes con más ingresos</h6>
      </div>
      <div class="card-body">
        ${paquetes.length === 0
          ? `<p class="text-muted text-center py-4 mb-0">Sin ingresos por paquete</p>`
          : paquetes.map((p, index) => `
            <div class="d-flex justify-content-between align-items-center ${index < paquetes.length - 1 ? "mb-3 pb-3 border-bottom" : ""}">
              <div class="d-flex align-items-center gap-2 min-w-0">
                <span class="badge bg-primary rounded-circle dash-rank">${index + 1}</span>
                <div class="min-w-0">
                  <span class="fw-semibold d-block text-truncate">${p.titulo || "Paquete"}</span>
                  <small class="text-muted">${p.destino || ""} · ${p.pagos} pagos</small>
                </div>
              </div>
              <span class="fw-bold text-success">${dinero(p.ingresos)}</span>
            </div>
          `).join("")
        }
      </div>
    </div>
  `;
}

function renderTablaPagos(data) {
  const pagos = data.ultimos_pagos || [];

  return `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-0 pt-3 pb-0">
        <h6 class="fw-bold mb-0"><i class="bi bi-credit-card me-2 text-primary"></i>Últimos pagos</h6>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Referencia</th>
                <th>Cliente</th>
                <th>Reserva</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th class="text-end">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${pagos.length === 0
                ? `<tr><td colspan="7" class="text-center text-muted py-4">No hay pagos registrados</td></tr>`
                : pagos.map((p) => `
                  <tr>
                    <td class="fw-semibold">${p.referencia_externa || `PAG-${p.id}`}</td>
                    <td>
                      <span class="fw-semibold d-block">${nombreCliente(p)}</span>
                      <small class="text-muted">${p.usuario_email || ""}</small>
                    </td>
                    <td>#${p.reserva_id || "-"} · ${p.paquete_titulo || "Sin paquete"}</td>
                    <td>${p.metodo || "-"}</td>
                    <td>${badgePago(p.estado)}</td>
                    <td>${fecha(p.fecha_pago)}</td>
                    <td class="text-end fw-bold">${dinero(p.importe)}</td>
                  </tr>
                `).join("")
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderTablaFacturas(data) {
  const facturas = data.facturas || [];

  return `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-0 pt-3 pb-0">
        <h6 class="fw-bold mb-0"><i class="bi bi-receipt-cutoff me-2 text-primary"></i>Facturas emitidas</h6>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Concepto</th>
                <th>Fecha</th>
                <th>Método</th>
                <th class="text-end">Total</th>
                <th class="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              ${facturas.length === 0
                ? `<tr><td colspan="7" class="text-center text-muted py-4">No hay facturas emitidas</td></tr>`
                : facturas.map((f) => `
                  <tr class="fila-factura" role="button" tabindex="0" data-reserva-id="${f.reserva_id || ""}" data-factura-numero="${facturaNumero(f)}">
                    <td class="fw-semibold">${facturaNumero(f)}</td>
                    <td>
                      <span class="fw-semibold d-block">${nombreCliente(f)}</span>
                      <small class="text-muted">${f.usuario_email || ""}</small>
                    </td>
                    <td>Reserva #${f.reserva_id || "-"} · ${f.paquete_titulo || "Viaje Turistea"}</td>
                    <td>${fecha(f.fecha_pago)}</td>
                    <td>${f.metodo || "-"}</td>
                    <td class="text-end fw-bold">${dinero(f.importe)}</td>
                    <td class="text-end text-primary"><i class="bi bi-eye"></i></td>
                  </tr>
                `).join("")
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function renderFinanzas(data, seccion = "ingresos") {
  const contenidoSeccion = {
    ingresos: `
      <div class="row g-3 mb-4">
        <div class="col-12 col-xl-8">${renderGraficoIngresos(data)}</div>
        <div class="col-12 col-xl-4">${renderEstados(data)}</div>
      </div>
      <div class="row g-3">
        <div class="col-12 col-xl-5">${renderMetodos(data)}</div>
        <div class="col-12 col-xl-7">${renderTopPaquetes(data)}</div>
      </div>
    `,
    pagos: `
      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-6">${renderEstados(data)}</div>
        <div class="col-12 col-lg-6">${renderMetodos(data)}</div>
      </div>
      ${renderTablaPagos(data)}
    `,
    facturas: renderTablaFacturas(data)
  };

  return `
    <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
      <div>
        <h2 class="fw-bold mb-0">Finanzas</h2>
        <small class="text-muted">Ingresos, pagos y facturas de Turistea</small>
      </div>
      ${renderNav(seccion)}
    </div>
    ${renderKPIs(data)}
    ${contenidoSeccion[seccion] || contenidoSeccion.ingresos}
  `;
}
