import { iniciarMapa, cargarMarcadores } from "./mapa.js";
import { cargarGaleria } from "./fotos.js";

export function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("visible"));
    document.getElementById(id).classList.add("visible");
}

document.getElementById("btn-ir-añadir").addEventListener("click", () => {
    mostrarPantalla("pantalla-añadir");
});

document.getElementById("btn-ir-mapa").addEventListener("click", () => {
    mostrarPantalla("pantalla-mapa");

    setTimeout(() => {
        iniciarMapa();
        cargarMarcadores();
        if (window.mapa) mapa.invalidateSize();
    }, 150);
});

document.getElementById("btn-ver-galeria").addEventListener("click", () => {
    cargarGaleria();
    mostrarPantalla("pantalla-galeria");
});

document.getElementById("btn-volver-menu-1").addEventListener("click", () => {
    mostrarPantalla("pantalla-menu");
});

document.getElementById("btn-volver-menu-2").addEventListener("click", () => {
    mostrarPantalla("pantalla-menu");
});

document.getElementById("btn-volver-menu-galeria").addEventListener("click", () => {
    mostrarPantalla("pantalla-menu");
});

window.addEventListener("DOMContentLoaded", () => {});
