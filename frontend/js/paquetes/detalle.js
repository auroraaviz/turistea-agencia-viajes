document.addEventListener("DOMContentLoaded", () => {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));

  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const detalle = document.getElementById("detalle");

  if (!id) {
    loading.classList.add("d-none");
    error.classList.remove("d-none");
    return;
  }

  fetch("/api/paquetes/mock.json")
    .then(res => res.json())
    .then(json => {
      loading.classList.add("d-none");

      const p = json.data.find(paquete => paquete.id === id);

      if (!p) {
        error.classList.remove("d-none");
        return;
      }

      document.title = `${p.titulo} - Turistea`;
      document.getElementById("paquete-titulo").textContent = p.titulo;
      document.getElementById("paquete-destino").querySelector("span").textContent = p.destino;
      document.getElementById("paquete-imagen").src = p.imagen;
      document.getElementById("paquete-imagen").alt = p.titulo;
      document.getElementById("paquete-info-corta").textContent =
        `${p.hotel_nombre} · ${p.hotel_regimen} · ${p.fecha_salida} al ${p.fecha_regreso}`;
      document.getElementById("paquete-precio").textContent = `Desde ${p.precio}€ pp`;
      document.getElementById("paquete-descripcion").textContent = p.descripcion;

      document.getElementById("paquete-detalles-extra").textContent =
        `Plazas disponibles: ${p.plazas_disponibles} de ${p.plazas_totales}.`;

      const badges = document.getElementById("paquete-badges");
      badges.innerHTML = `
        ${p.vuelo_incluido ? `<span class="badge bg-info me-2">Vuelo incluido</span>` : ""}
        ${p.cerca_playa ? `<span class="badge bg-success me-2">Cerca de la playa</span>` : ""}
        ${p.salida_desde ? `<span class="badge bg-secondary me-2">Salida: ${p.salida_desde}</span>` : ""}
      `;

      document.getElementById("btn-favorito").addEventListener("click", () => {
        const icon = document.querySelector("#btn-favorito i");
        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");
      });

      detalle.classList.remove("d-none");
    })
    .catch(() => {
      loading.classList.add("d-none");
      error.classList.remove("d-none");
    });
});