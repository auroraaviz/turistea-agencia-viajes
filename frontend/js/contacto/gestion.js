import { BASE } from "../config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const respuesta = document.getElementById("respuestaContacto");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById("nombre").value.trim(),
      email: document.getElementById("email").value.trim(),
      asunto: document.getElementById("asunto").value.trim(),
      mensaje: document.getElementById("mensaje").value.trim()
    };

    respuesta.innerHTML = "Enviando mensaje...";

    try {
      const res = await fetch(BASE + "/api/contacto/enviar.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const json = await res.json();

      if (res.ok) {
        respuesta.innerHTML =
          "<span class='text-success'>Mensaje enviado correctamente.</span>";

        form.reset();

      } else {
        respuesta.innerHTML =
          "<span class='text-danger'>" +
          (json.error || "Error al enviar") +
          "</span>";
      }

    } catch (error) {
      console.error(error);

      respuesta.innerHTML =
        "<span class='text-danger'>Error de conexión.</span>";
    }
  });
});