async function cargarGaleria() {
    const contenedor = document.getElementById("galeria-fotos");
    contenedor.innerHTML = "";

    const fotos = await DB.obtenerTodasLasFotos();

    fotos.forEach((foto, index) => {
        const img = document.createElement("img");
        img.src = foto.url;
        img.classList.add("foto-galeria");

        img.addEventListener("click", () => {
            FOTOS.abrirPopup(fotos, index);
        });

        contenedor.appendChild(img);
    });
}
