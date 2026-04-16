
function normalizarTexto(texto) {
            return texto
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // quita acentos
                .trim();
        }

//esperar que el documento esté cargado
document.addEventListener('DOMContentLoaded', function () {

    const btnBuscar = document.querySelector('.btn-buscar');

    btnBuscar.addEventListener('click', function () {

        //Recoge los valores de los inputs
        const destino = document.getElementById('filtro-destino').value.trim();
        const fechaInicioInput = document.getElementById('fecha-inicio').value;
        const fechaFinInput = document.getElementById('fecha-fin').value;

        const destinoNormalizado = normalizarTexto(destino);
        
        //Aplica margen de +/- 7 dias
        let fechaInicioFinal = null;
        let fechaFinFinal = null;

        //fecha de inicio -7 dias
        if (fechaInicioInput) {
            const fecha = new Date(fechaInicioInput);
            fecha.setDate(fecha.getDate() - 7);
            fechaInicioFinal = fecha;
        }

        //fecha de fin +7 dias
        if (fechaFinInput) {
            const fecha = new Date(fechaFinInput);
            fecha.setDate(fecha.getDate() + 7);
            fechaFinFinal = fecha;
        }

        //Recoge todas las tarjetas de paquetes
        const paquetes = document.querySelectorAll('.card');

        paquetes.forEach(function (paquete) {

            let mostrar = true;

            //filtro destino
            const destinoPaquete = normalizarTexto(paquete.dataset.destino || "");

            if (destinoNormalizado && destinoPaquete) {
            if (!destinoPaquete.includes(destinoNormalizado.toLowerCase())) {
                mostrar = false;
            }
        }

            //Filtro por fechas
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

            //Mostrar u ocultar el paquete
            paquete.closest('.col-12').style.display = mostrar ? '' : 'none';
        });
    });

});