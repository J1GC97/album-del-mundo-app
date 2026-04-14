/* ============================================================
   ui.js — Control de pantallas y navegación
   ============================================================ */

function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("visible"));
    document.getElementById(id).classList.add("visible");
}

/* ============================
   Botones del menú principal
   ============================ */
document.getElementById("btn-ir-añadir").addEventListener("click", () => {
    mostrarPantalla("pantalla-añadir");

    setTimeout(() => {
        if (typeof activarInputFotos === "function") activarInputFotos();
        if (typeof registrarSeleccionFotos === "function") registrarSeleccionFotos();
    }, 50);
});

document.getElementById("btn-ir-mapa").addEventListener("click", () => {
    mostrarPantalla("pantalla-mapa");

    setTimeout(() => {
        if (typeof iniciarMapa === "function") iniciarMapa();
        if (typeof cargarMarcadores === "function") cargarMarcadores();
        if (window.mapa) mapa.invalidateSize();
    }, 50);
});

document.getElementById("btn-ver-galeria").addEventListener("click", () => {
    if (typeof mostrarGaleria === "function") mostrarGaleria();
    mostrarPantalla("pantalla-galeria");
});

/* ============================
   Botones de volver
   ============================ */
document.getElementById("btn-volver-menu-1").addEventListener("click", () => {
    mostrarPantalla("pantalla-menu");
});

document.getElementById("btn-volver-menu-2").addEventListener("click", () => {
    mostrarPantalla("pantalla-menu");
});

document.getElementById("btn-volver-menu-galeria").addEventListener("click", () => {
    mostrarPantalla("pantalla-menu");
});

/* ============================
   Inicialización de la SPA
   ============================ */
window.addEventListener("DOMContentLoaded", () => {
    if (typeof cargarPaises === "function") cargarPaises();
    if (typeof cargarCiudades === "function") cargarCiudades();
});
