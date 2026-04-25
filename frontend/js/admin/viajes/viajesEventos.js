import { crearModal } from "./modal.js";
import { state } from "./viajesState.js";

export function activarEventosTabla() {

  const botonesEditar =
    document.querySelectorAll(".btnEditar");

  const botonesEliminar =
    document.querySelectorAll(".btnEliminar");

  const filas =
    document.querySelectorAll(".fila-paquete");


  botonesEditar.forEach((btn) => {

    btn.onclick = (e) => {

      e.stopPropagation();

      const id = btn.dataset.id;

      console.log("Editar paquete:", id);

    };

  });


  botonesEliminar.forEach((btn) => {

    btn.onclick = (e) => {

      e.stopPropagation();

      const id = btn.dataset.id;

      const confirmar = confirm(
        "¿Eliminar este paquete?"
      );

      if (!confirmar) return;

      console.log("Eliminar paquete:", id);

    };

  });


  filas.forEach((fila) => {

    fila.onclick = () => {

      const id =
        fila.dataset.id;

      const paquete =
        state.paquetes.find(
          p => p.id == id
        );

      crearModal(paquete);

    };

  });

}