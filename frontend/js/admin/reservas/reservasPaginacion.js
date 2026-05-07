export function activarPaginacion(state, refrescar) {
    document.getElementById('paginaAnteriorRes')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.paginaActual > 1) { state.paginaActual--; refrescar(); }
    });

    document.getElementById('paginaSiguienteRes')?.addEventListener('click', (e) => {
        e.preventDefault();
        const total = Math.ceil(state.listaActual.length / state.porPagina);
        if (state.paginaActual < total) { state.paginaActual++; refrescar(); }
    });

    document.querySelectorAll('.pagina-numero-res').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            state.paginaActual = parseInt(e.target.dataset.pagina);
            refrescar();
        });
    });
}