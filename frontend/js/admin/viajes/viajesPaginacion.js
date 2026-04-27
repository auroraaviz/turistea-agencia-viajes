export function activarPaginacion(state, refrescar) {
  const totalPaginas =
    Math.ceil(
      state.listaActual.length /
      state.porPagina
    ) || 1;

  const anterior =
    document.getElementById("paginaAnterior");

  const siguiente =
    document.getElementById("paginaSiguiente");

  const paginas =
    document.querySelectorAll(".pagina-numero");

  if (anterior) {
    anterior.addEventListener("click", (e) => {
      e.preventDefault();

      if (state.paginaActual > 1) {
        state.paginaActual--;
        refrescar();
      }
    });
  }

  if (siguiente) {
    siguiente.addEventListener("click", (e) => {
      e.preventDefault();

      if (state.paginaActual < totalPaginas) {
        state.paginaActual++;
        refrescar();
      }
    });
  }

  paginas.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      state.paginaActual =
        parseInt(btn.dataset.pagina);

      refrescar();
    });
  });
}