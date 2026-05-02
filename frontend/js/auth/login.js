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

    const json = await respuesta.json(); // <- parsea como JSON, no como texto

    if (respuesta.ok && json.ok) {
      if (json.rol === "admin") {
        window.location.href = BASE + "/frontend/pages/admin/admin.html";
      } else {
        window.location.href = BASE + "/index.html";
      }
    } else {
      alert(json.mensaje || "Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error de conexión");
  }
});