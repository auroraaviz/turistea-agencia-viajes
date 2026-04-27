document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();

        const datos = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        };

        const BASE_URL = "/turistea";
        ajax(
            BASE_URL + "/api/auth/login.php",
            "POST",
            datos,
            function (respuesta, status) {
                if (status === 200) {
                    if (respuesta.success) {
                        alert("✅ Login correcto. Bienvenido " + respuesta.nombre);
                        window.location.href = BASE_URL + "/index.html";
                    } else {
                        alert("❌ " + respuesta.error);
                    }
                } else {
                    alert("Error en la petición");
                }
            }
        );
    });
});