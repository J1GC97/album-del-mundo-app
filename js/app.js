console.log("🔥 app.js cargado correctamente");

/* ============================================================
   Inicio de la SPA
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 SPA iniciada");

    // Cargar selects de país y ciudad
    if (typeof cargarPaises === "function") cargarPaises();
    if (typeof cargarCiudades === "function") cargarCiudades();

    // Debug opcional del input de fotos
    const input = document.getElementById("input-fotos");
    if (input) {
        input.addEventListener("change", (e) => {
            console.log("📸 Fotos seleccionadas:", e.target.files);
        });
    }
});
