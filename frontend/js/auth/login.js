import { BASE } from "../config.js";

document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const datos = new FormData(form);

  try {
    const respuesta = await fetch(BASE + "/api/auth/login.php", {
      method: "POST",
      body: datos,
      credentials: "include",
    });

    const texto = await respuesta.text();

    if (respuesta.ok && texto.trim() === "OK") {
      window.location.href = BASE + "/index.html";
    } else {
      alert(texto || "Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error de conexión");
  }
});
