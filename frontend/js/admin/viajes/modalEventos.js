/*
botón editar
botones tabs
guardar cambios
listeners
*/


import {
  mostrarDestino,
  mostrarHotel,
  mostrarFechas,
  mostrarPrecio
} from "./modalRender.js";


// Activa botones de pestañas
export function activarPestanas(
  botones,
  paquete
) {

  botones.forEach((btn) => {

    btn.onclick = (e) => {

      e.preventDefault();

      botones.forEach((b) => {
        b.classList.remove(
          "active"
        );
      });

      btn.classList.add(
        "active"
      );

      const seccion =
        btn.dataset.seccion;

      if (seccion === "destino") {
        mostrarDestino(paquete);
      }

      if (seccion === "hotel") {
        mostrarHotel(paquete);
      }

      if (seccion === "fechas") {
        mostrarFechas(paquete);
      }

      if (seccion === "precio") {
        mostrarPrecio(paquete);
      }

    };

  });

}


// Botón editar toggle
export function activarEditar() {

  const btnEditar =
    document.getElementById(
      "btnEditarModal"
    );

  let editando = false;

  btnEditar.onclick = () => {

    editando = !editando;

    if (editando) {

      btnEditar.classList.add(
        "active",
        "btn-primary"
      );

      btnEditar.classList.remove(
        "btn-outline-primary"
      );

      btnEditar.textContent =
        "Editando";

    } else {

      btnEditar.classList.remove(
        "active",
        "btn-primary"
      );

      btnEditar.classList.add(
        "btn-outline-primary"
      );

      btnEditar.textContent =
        "Editar";

    }

  };

}