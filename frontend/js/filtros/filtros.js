function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// esperar que el documento esté cargado
document.addEventListener('DOMContentLoaded', function () {

      if (fechaInicioFinal && fechaInicioPaquete) {
        const fechaPaquete = new Date(fechaInicioPaquete);

    btnBuscar.addEventListener('click', function () {

        const destino = document.getElementById('filtro-destino').value.trim();
        const fechaInicioInput = document.getElementById('fecha-inicio').value;
        const fechaFinInput = document.getElementById('fecha-fin').value;

        const destinoNormalizado = normalizarTexto(destino);

        let fechaInicioFinal = null;
        let fechaFinFinal = null;

        // -7 días
        if (fechaInicioInput) {
            const fecha = new Date(fechaInicioInput);
            fecha.setDate(fecha.getDate() - 7);
            fechaInicioFinal = fecha;
        }
      }

        // +7 días
        if (fechaFinInput) {
            const fecha = new Date(fechaFinInput);
            fecha.setDate(fecha.getDate() + 7);
            fechaFinFinal = fecha;
        }
      }

    
        const paquetes = document.querySelectorAll('.card');

        paquetes.forEach(function (paquete) {

            let mostrar = true;

            // destino
            const destinoPaquete = normalizarTexto(paquete.dataset.destino || "");

            if (destinoNormalizado && destinoPaquete) {
                if (!destinoPaquete.includes(destinoNormalizado)) {
                    mostrar = false;
                }
            }

            // fechas
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

            // mostrar / ocultar
            paquete.closest('.col-12').style.display = mostrar ? '' : 'none';
        });
    });
  });
});