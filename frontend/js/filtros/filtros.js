function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

document.addEventListener("DOMContentLoaded", function () {
  const btnBuscar = document.querySelector(".btn-buscar");

  if (!btnBuscar) {
    console.error("No existe .btn-buscar");
    return;
  }

  btnBuscar.addEventListener("click", function () {
    const selectDestino = document.getElementById("select-destino");
    const fechaInicioInput = document.getElementById("fecha-inicio").value;
    const fechaFinInput = document.getElementById("fecha-fin").value;

    const destino = selectDestino ? selectDestino.value : "";
    const destinoNormalizado = normalizarTexto(destino);

    let fechaInicioFinal = null;
    let fechaFinFinal = null;

    // Fecha inicio -7 días
    if (fechaInicioInput) {
      const fecha = new Date(fechaInicioInput);
      fecha.setDate(fecha.getDate() - 7);
      fechaInicioFinal = fecha;
    }

    // Fecha fin +7 días
    if (fechaFinInput) {
      const fecha = new Date(fechaFinInput);
      fecha.setDate(fecha.getDate() + 7);
      fechaFinFinal = fecha;
    }

    // Solo tarjetas de paquetes
    const paquetes = document.querySelectorAll("#contenedor-tarjetas .card");

    paquetes.forEach(function (paquete) {
      let mostrar = true;

      // DESTINO
      const destinoPaquete = normalizarTexto(
        paquete.dataset.destino || ""
      );

      if (destinoNormalizado) {
        if (!destinoPaquete.includes(destinoNormalizado)) {
          mostrar = false;
        }
      }

      // FECHAS
      const fechaInicioPaquete = paquete.dataset.fechaInicio;
      const fechaFinPaquete = paquete.dataset.fechaFin;

      if (fechaInicioFinal && fechaInicioPaquete) {
        const fechaPaquete = new Date(fechaInicioPaquete);

        if (fechaPaquete < fechaInicioFinal) {
          mostrar = false;
        }
      }

      if (fechaFinFinal && fechaFinPaquete) {
        const fechaPaquete = new Date(fechaFinPaquete);

        if (fechaPaquete > fechaFinFinal) {
          mostrar = false;
        }
      }

      // Mostrar / ocultar columna Bootstrap
      const columna = paquete.parentElement;

      if (columna) {
        columna.style.display = mostrar ? "" : "none";
      }
    });
  });
});