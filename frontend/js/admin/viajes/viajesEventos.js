export function activarEventosTabla() {
  const botonesEditar =
    document.querySelectorAll(".btnEditar");

  const botonesEliminar =
    document.querySelectorAll(".btnEliminar");

  botonesEditar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      console.log("Editar paquete:", id);

      // luego abriremos modal editar
    });
  });

  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      const confirmar = confirm(
        "¿Eliminar este paquete?"
      );

      if (!confirmar) return;

      console.log("Eliminar paquete:", id);

      // luego llamada API delete.php
    });
  });
}