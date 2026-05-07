import { badgeEstado, textoEstado } from './reservasHelpers.js';

export function renderTabla(lista, paginaActual, porPagina) {
    const totalPaginas = Math.ceil(lista.length / porPagina) || 1;
    const inicio   = (paginaActual - 1) * porPagina;
    const visibles = lista.slice(inicio, inicio + porPagina);

    let html = `
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
            <h2 class="fw-bold mb-0">Gestión de reservas</h2>
            <small class="text-muted">Total: ${lista.length} reservas</small>
        </div>
        <button class="btn btn-outline-primary" id="btnToggleFiltrosRes">
            <i class="bi bi-funnel-fill me-2"></i>Mostrar filtros
        </button>
    </div>

    <div id="panelFiltrosRes" class="card shadow-sm border-0 mb-4 d-none">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-12 col-md-5">
                    <label class="form-label fw-semibold">Buscar</label>
                    <input type="text" class="form-control" id="filtroReservaBusqueda"
                        placeholder="Cliente, email o paquete...">
                </div>
                <div class="col-12 col-md-3">
                    <label class="form-label fw-semibold">Estado</label>
                    <select class="form-select" id="filtroReservaEstado">
                        <option value="">Todos</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CONFIRMADA">Confirmada</option>
                        <option value="CANCELADA">Cancelada</option>
                    </select>
                </div>
                <div class="col-12 d-flex gap-2">
                    <button class="btn btn-primary" id="btnAplicarFiltrosRes">Aplicar</button>
                    <button class="btn btn-outline-secondary" id="btnLimpiarFiltrosRes">Limpiar</button>
                </div>
            </div>
        </div>
    </div>

    <div class="table-responsive shadow-sm rounded bg-white">
        <table class="table table-hover align-middle mb-0 text-center">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Paquete</th>
                    <th>Viajeros</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha reserva</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>`;

    if (visibles.length === 0) {
        html += `<tr><td colspan="8" class="text-muted py-4">No hay reservas que coincidan.</td></tr>`;
    }

    visibles.forEach((r) => {
        const fecha = r.fecha_reserva
            ? new Date(r.fecha_reserva).toLocaleDateString('es-ES')
            : '-';

        html += `
        <tr class="fila-reserva" data-id="${r.id}" style="cursor:pointer;">
            <td class="fw-bold text-muted">${r.id}</td>
            <td class="text-start">
                <div class="fw-semibold">${r.nombre} ${r.apellidos ?? ''}</div>
                <small class="text-muted">${r.email}</small>
            </td>
            <td class="text-start">
                <div class="fw-semibold">${r.paquete_titulo}</div>
                <small class="text-muted">${r.destino ?? ''}</small>
            </td>
            <td>${r.num_viajeros}</td>
            <td class="fw-bold">${parseFloat(r.precio_total).toFixed(2)}€</td>
            <td><span class="badge ${badgeEstado(r.estado)}">${textoEstado(r.estado)}</span></td>
            <td class="text-muted small">${fecha}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary btn-ver-reserva" data-id="${r.id}">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>`;
    });

    html += `</tbody></table></div>`;

    if (totalPaginas > 1) {
        html += `<nav class="mt-4"><ul class="pagination justify-content-center">`;
        html += `<li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" id="paginaAnteriorRes">&laquo;</a></li>`;
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<li class="page-item ${i === paginaActual ? 'active' : ''}">
                <a href="#" class="page-link pagina-numero-res" data-pagina="${i}">${i}</a></li>`;
        }
        html += `<li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a href="#" class="page-link" id="paginaSiguienteRes">&raquo;</a></li>`;
        html += `</ul></nav>`;
    }

    return html;
}