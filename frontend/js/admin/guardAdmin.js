/*
=========================================
GUARD ADMIN
-----------------------------------------
Responsabilidad:
- Verificar que el usuario tiene sesión
  activa con rol admin
- Redirigir al login si no cumple

Uso:
  <script type="module" src="../../js/admin/guardAdmin.js"></script>
  (Debe cargarse ANTES que los otros scripts admin)
=========================================
*/

import { BASE } from "../config.js";

(async function () {
  try {
    const respuesta = await fetch(BASE + "/api/auth/session.php", {
      credentials: "include",
    });

    if (!respuesta.ok) {
      redirigirLogin();
      return;
    }

    const data = await respuesta.json();

    if (!data.ok || data.rol !== "admin") {
      redirigirLogin();
      return;
    }
  } catch (error) {
    console.error("Error verificando sesión:", error);
    redirigirLogin();
  }
})();

function redirigirLogin() {
  alert("Acceso denegado: debes iniciar sesión como administrador");
  window.location.href = BASE + "/frontend/pages/login.html";
}
