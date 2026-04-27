import { cargarPaquetes } from "../paquetes/tarjetas.js";

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

document.addEventListener("DOMContentLoaded", async function () {
  await cargarPaquetes();

  document.querySelectorAll('.categoria[data-categoria]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('activa');
      aplicarFiltros();
    });
  });

  const btnBuscar = document.querySelector(".btn-buscar");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", aplicarFiltros);
  }
});

function aplicarFiltros() {
  const selectDestino = document.getElementById("select-destino");
  const fechaInicioInput = document.getElementById("fecha-inicio").value;
  const fechaFinInput = document.getElementById("fecha-fin").value;

  const destino = selectDestino ? selectDestino.value : "";
  const destinoNormalizado = normalizarTexto(destino);

  let fechaInicioFinal = null;
  let fechaFinFinal = null;
  let fechaInicioRef = null; // fecha original sin margen, para calcular proximidad

  if (fechaInicioInput) {
    fechaInicioRef = new Date(fechaInicioInput);
    const fecha = new Date(fechaInicioInput);
    fecha.setDate(fecha.getDate() - 7);
    fechaInicioFinal = fecha;
  }

  if (fechaFinInput) {
    const fecha = new Date(fechaFinInput);
    fecha.setDate(fecha.getDate() + 7);
    fechaFinFinal = fecha;
  }

  const categoriasActivas = [...document.querySelectorAll('.categoria.activa')]
    .map(c => c.dataset.categoria);

  const paquetes = [...document.querySelectorAll("#contenedor-tarjetas .card")];

  // ── Función que evalúa si un paquete pasa destino y categorías ──
  function pasaFiltrosBasicos(paquete) {
    const destinoPaquete = normalizarTexto(paquete.dataset.destino || "");
    if (destinoNormalizado && !destinoPaquete.includes(destinoNormalizado)) return false;

    if (categoriasActivas.length > 0) {
      const categoriasPaquete = (paquete.dataset.categoria || '').split('|').map(c => c.trim());
      if (!categoriasActivas.some(ca => categoriasPaquete.includes(ca))) return false;
    }

    return true;
  }

  // ── Función que evalúa si un paquete pasa también el filtro de fechas ──
  function pasaFiltroFechas(paquete) {
    const fechaInicioPaquete = paquete.dataset.fechaInicio;
    const fechaFinPaquete = paquete.dataset.fechaFin;

    if (fechaInicioFinal && fechaInicioPaquete) {
      if (new Date(fechaInicioPaquete) < fechaInicioFinal) return false;
    }

    if (fechaFinFinal && fechaFinPaquete) {
      if (new Date(fechaFinPaquete) > fechaFinFinal) return false;
    }

    return true;
  }

  // ── Primero: filtrar con todos los criterios ──
  const paquetesFiltrados = paquetes.filter(p => pasaFiltrosBasicos(p) && pasaFiltroFechas(p));

  // ── Quitar aviso anterior si existe ──
  const avisoAnterior = document.getElementById("aviso-proximos");
  if (avisoAnterior) avisoAnterior.remove();

  // ── Si hay resultados con fecha exacta, mostrarlos y terminar ──
  if (paquetesFiltrados.length > 0 || !fechaInicioInput) {
    paquetes.forEach(p => {
      const visible = pasaFiltrosBasicos(p) && pasaFiltroFechas(p);
      p.parentElement.style.display = visible ? "" : "none";
    });
    return;
  }

  // ── Si no hay resultados: buscar los más próximos por fecha de salida ──
  const candidatos = paquetes.filter(p => pasaFiltrosBasicos(p));

  if (candidatos.length === 0) {
    // No hay nada que mostrar ni siquiera por proximidad
    paquetes.forEach(p => p.parentElement.style.display = "none");
    mostrarAviso("No se encontraron paquetes para los filtros seleccionados.");
    return;
  }

  // Ordenar candidatos por proximidad a la fecha de inicio solicitada
  candidatos.sort((a, b) => {
    const difA = Math.abs(new Date(a.dataset.fechaInicio) - fechaInicioRef);
    const difB = Math.abs(new Date(b.dataset.fechaInicio) - fechaInicioRef);
    return difA - difB;
  });

  // Mostrar solo los 4 más próximos
  const masProximos = candidatos.slice(0, 4);

  paquetes.forEach(p => {
    p.parentElement.style.display = masProximos.includes(p) ? "" : "none";
  });

  mostrarAviso("No hay paquetes disponibles para esas fechas. Te mostramos los más próximos a tu búsqueda.");
}

function mostrarAviso(mensaje) {
  const contenedor = document.getElementById("contenedor-tarjetas");
  const aviso = document.createElement("div");
  aviso.id = "aviso-proximos";
  aviso.className = "col-12 text-center mb-3";
  aviso.innerHTML = `
    <div class="alert alert-info d-inline-block px-4 py-2 rounded-pill" role="alert">
      <i class="bi bi-info-circle me-2"></i>${mensaje}
    </div>
  `;
  contenedor.insertAdjacentElement("beforebegin", aviso);
}