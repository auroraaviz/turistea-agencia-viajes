import { BASE } from "../config.js";

document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const datos = new FormData(form);

  try {
    const respuesta = await fetch(BASE + "/api/auth/register.php", {
      method: "POST",
      body: datos,
    });

    const texto = await respuesta.text();

    if (respuesta.ok && !texto.includes("Error") && !texto.includes("ya está")) {
      alert("Registro exitoso. Redirigiendo al login...");
      window.location.href = BASE + "/frontend/pages/login.html";
    } else {
      alert(texto || "Error al registrar");
    }
  } catch (error) {
    console.error("Error en registro:", error);
    alert("Error de conexión");
  }
});
