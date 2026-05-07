import { activarModal } from './reservasModal.js';
import { activarPaginacion } from './reservasPaginacion.js';
import { leerFiltros, aplicarFiltros } from './reservasFiltros.js';

export function activarEventos(state, refrescar) {
    // Toggle panel filtros
    document.getElementById('btnToggleFiltrosRes')?.addEventListener('click', () => {
        const panel = document.getElementById('panelFiltrosRes');
        const btn   = document.getElementById('btnToggleFiltrosRes');
        const oculto = panel.classList.toggle('d-none');
        btn.innerHTML = oculto
            ? '<i class="bi bi-funnel-fill me-2"></i>Mostrar filtros'
            : '<i class="bi bi-funnel me-2"></i>Ocultar filtros';
    });

    // Aplicar filtros
    document.getElementById('btnAplicarFiltrosRes')?.addEventListener('click', () => {
        state.listaActual = aplicarFiltros(state.reservas, leerFiltros());
        state.paginaActual = 1;
        refrescar();
    });

    // Limpiar filtros
    document.getElementById('btnLimpiarFiltrosRes')?.addEventListener('click', () => {
        state.listaActual  = [...state.reservas];
        state.paginaActual = 1;
        refrescar();
    });

    activarModal();
    activarPaginacion(state, refrescar);
}