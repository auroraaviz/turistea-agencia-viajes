// Cerrar sesión vía POST y redirigir al login
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnCerrarSesion");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const base = window.BASE_PATH ?? "";

    try {
      await fetch(base + "api/auth/logout.php", {
        method: "POST",
        credentials: "include"
      });
    } catch (_) {
      // Si falla el fetch, redirigimos igualmente
    }

    window.location.href = base + "frontend/pages/login.html";
  });
});
