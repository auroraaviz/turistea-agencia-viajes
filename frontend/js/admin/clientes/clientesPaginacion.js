export function activarPaginacion(state, refrescar) {
  const btnAnterior  = document.getElementById('paginaAnterior');
  const btnSiguiente = document.getElementById('paginaSiguiente');
  const paginas      = document.querySelectorAll('.pagina-numero');
 
  if (btnAnterior) {
    btnAnterior.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.paginaActual > 1) {
        state.paginaActual--;
        refrescar();
      }
    });
  }
 
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', (e) => {
      e.preventDefault();
      const total = Math.ceil(state.listaActual.length / state.porPagina);
      if (state.paginaActual < total) {
        state.paginaActual++;
        refrescar();
      }
    });
  }
 
  paginas.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      state.paginaActual = parseInt(e.target.dataset.pagina);
      refrescar();
    });
  });
}