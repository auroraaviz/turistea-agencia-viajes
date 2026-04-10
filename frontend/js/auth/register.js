document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("formRegistro")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const datos = {
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        telefono: document.getElementById("telefono").value,
      };

      const BASE_URL = "/turistea";
      ajax(
        BASE_URL + "/api/auth/register.php",
        "POST",
        datos,
        function (respuesta, status) {
          if (status === 200) {
            if (respuesta.success) {
              alert("✅ Usuario registrado");
            } else {
              alert("❌ " + respuesta.message);
            }
          } else {
            alert("Error en la petición");
          }
        },
      );
    });
});
