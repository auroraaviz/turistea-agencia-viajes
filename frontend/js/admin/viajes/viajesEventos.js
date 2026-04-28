/*
=========================================
EVENTOS TABLA VIAJES
-----------------------------------------
Responsabilidad:
- Escuchar botones editar / borrar
- Abrir modal detalle
- Detectar clicks en filas
- Conectar acciones usuario con UI

Archivo centrado en interacción.
=========================================
*/

import { crearModal } from "./modal.js";
import { state } from "./viajesState.js";
import { crear } from "../../utils/fetch.js"

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

export function activarBorrar(paquete) {

  const btn =
    document.getElementById(
      "btnBorrarModal"
    );

  if (!btn) return;

  btn.onclick = async () => {

    const ok = confirm(
      "¿Seguro que deseas borrar este paquete?"
    );

    if (!ok) return;

    const respuesta =
      await crear(
        "/api/paquetes/delete.php",
        { id: paquete.id }
      );

    console.log(respuesta);

    document
      .querySelector(
        "#miModal .btn-close"
      )
      .click();

    document
      .getElementById(
        "btnTodosPaquetes"
      )
      .click();

  };

}