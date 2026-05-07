import { badgeActivo, textoActivo, badgeRol, textoRol, avatar} from './helpers.js';

export function renderTabla(lista, paginaActual, porPagina) {
    const totalPaginas = Math.ceil(lista.length / porPagina) || 1;
    const inicio = (paginaActual -1) * porPagina;
    const visibles = lista.slice(inicio, inicio + porPagina);

    let html = `
    <div class = "d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div>
        <h2 class="fw-bold mb-0">Gestión de clientes</h2>
        <small class="text-muted">Total: ${lista.length} usuarios registrados </small>
        </div>
        <button class="btn bnt-outline-primary" id="btnToggleFiltros">
            <i class="bi bi-funnel-fill me-2"></i> Mostrar filtros
            <button>
            </div>

            <!--Panel filtros-->
            <div id="panelFiltros" class="card shadow-sm border-0 mb-4 d-none">
                <div class="card-body">
                    <div class="row g-3 align-items-end">

                    <div class="col-12 col-md-4">
                        <label class="form-label fw-semibold">Buscar</label>
                        <input
                        type = "text"
                        class = "form-control"
                        id = "filtroBusqueda"
                        placeholder="Nombre, apellidos o email...">
                    </div>

                    <div class="col-12 col-md-3">
                        <label class="form-label fw-semibold">Rol</label>
                        <select class="form-select" id="filtroRol">
                            <option value="">Todos</option>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-3">
                        <label class="form-label fw-semibold">Estado</label>
                        <select class="form-select" id="filtroActivo">
                            <option value="">Todos</option>
                            <option value="1">Activo</option>
                            <option value="0">Bloqueado</option>
                        </select>
                    </div>

                    <div class="col-12 d-flex gap-2 flex-wrap">
                        <button class="btn btn-primary" id="btnAplicarFiltros">Aplicar filtros</button>
                        <button class="btn btn-outline-secondary" id="btnLimpiarFiltros">Limpiar</button> 
                    </div>

                </div>
            </div>
        </div>

        <!--Tabla-->
        <div class="table-responsive shadow-sm rounded bg-white">
            <table class="table table-hover align-middle mb-0 text-center">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Avatar</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Registro</th>
                </tr>
            <thead>
            <tbody>
            `;

    if (visibles.length === 0) {
        html += `
            <tr>
                <td colspan="8" class="text-muted py-4">
                    <i class="bi bi-inox me-2></i> No hay usuarios que coincidan con los filtros.
                </td>
            </tr>
        `;
    }

    visibles.forEach((u) => {
        const fecha = u.created_at
        ? new Date(u.created_at).toLocaleDateString('es-ES')
        : '-';

        html += `
            <tr class="fila-usuario" data-id="${u.id}" style="cursor:pointer;"> 
                <td class="fw-bold text-muted">${u.id}</td>
                <td>${avatar(u)}</td>
                <td class="fw-semibold text-start">${u.nombre} ${u.apellidos ?? ''}</td>
                <td>${u.email}</td>
                <td>${u.telefono}</td>
                <td>
                    <span class="badge ${badgeRol(u.rol)}">${textoRol(u.rol)}</span>
                </td>
                <td>
                    <span class="badge ${badgeActivo(u.activo)}">${textoActivo(u.activo)}</span>
                </td>
                <td class="text-muted small">${fecha}</td>
            </tr>
        `;
    });


        html += `
            </tbody>
            </table>
            </div>
        `;
 
  // Paginación
  if (totalPaginas > 1) {
    html += `<nav class="mt-4"><ul class="pagination justify-content-center">`;
    html += `<li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
      <a href="#" class="page-link" id="paginaAnterior">&laquo;</a>
    </li>`;
 
    for (let i = 1; i <= totalPaginas; i++) {
      html += `<li class="page-item ${i === paginaActual ? 'active' : ''}">
        <a href="#" class="page-link pagina-numero" data-pagina="${i}">${i}</a>
      </li>`;
    }
 
    html += `<li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
      <a href="#" class="page-link" id="paginaSiguiente">&raquo;</a>
    </li>`;
    html += `</ul></nav>`;
  }
 
  return html;
}
