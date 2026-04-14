/* ============================================================
   fotos.js — Gestión local de fotos + IndexedDB + popup + galería
   ============================================================ */

let fotosSeleccionadas = [];
let fotosPopup = [];
let indicePopup = 0;
let popupDesdeGaleria = false;

/* ============================================================
   Cargar países y ciudades
   ============================================================ */

const selectPais = document.getElementById("select-pais");
const selectCiudad = document.getElementById("select-ciudad");

function cargarPaises() {
    Object.keys(ubicaciones).forEach(pais => {
        const opt = document.createElement("option");
        opt.value = pais;
        opt.textContent = pais;
        selectPais.appendChild(opt);
    });
}

function cargarCiudades() {
    selectCiudad.innerHTML = "";
    const pais = selectPais.value;

    Object.keys(ubicaciones[pais]).forEach(ciudad => {
        const opt = document.createElement("option");
        opt.value = ciudad;
        opt.textContent = ciudad;
        selectCiudad.appendChild(opt);
    });
}

selectPais.addEventListener("change", cargarCiudades);

cargarPaises();
cargarCiudades();

/* ============================================================
   Manejar selección de fotos
   ============================================================ */

function registrarSeleccionFotos() {
    const input = document.getElementById("input-fotos");
    if (!input) return;

    input.addEventListener("change", (e) => {
        fotosSeleccionadas = Array.from(e.target.files);
        console.log("📸 Fotos seleccionadas:", fotosSeleccionadas);
    });
}

/* ============================================================
   Guardar fotos (IndexedDB + localStorage)
   ============================================================ */

document.getElementById("btn-guardar-fotos").addEventListener("click", guardarTodo);

async function guardarTodo() {
    if (fotosSeleccionadas.length === 0) {
        alert("Selecciona al menos una foto.");
        return;
    }

    const pais = selectPais.value;
    const ciudad = selectCiudad.value;

    try {
        for (const archivo of fotosSeleccionadas) {
            const id = Date.now() + "_" + archivo.name;

            // Guardar blob real en IndexedDB
            await IDB_FOTOS.guardarBlob(id, archivo);

            // Guardar metadatos en localStorage
            DB.guardarFoto(pais, ciudad, id);
        }

        fotosSeleccionadas = [];
        document.getElementById("input-fotos").value = "";

        alert("Fotos guardadas permanentemente.");
    } catch (e) {
        console.error("❌ Error en guardarTodo:", e);
        alert("Hubo un error guardando las fotos.");
    }
}

/* ============================================================
   POPUP DE FOTOS
   ============================================================ */

const popup = document.getElementById("popup-fotos");
const popupImg = document.getElementById("popup-imagen");
const btnCerrar = document.getElementById("cerrar-popup");
const btnAnterior = document.getElementById("foto-anterior");
const btnSiguiente = document.getElementById("foto-siguiente");

function abrirPopup(fotos, indiceInicial, desdeGaleria = false) {
    fotosPopup = fotos;
    indicePopup = indiceInicial;
    popupDesdeGaleria = desdeGaleria;

    mostrarFotoPopup();
    popup.classList.remove("popup-oculto");

    if (popupDesdeGaleria || fotosPopup.length <= 1) {
        btnAnterior.style.display = "none";
        btnSiguiente.style.display = "none";
    } else {
        btnAnterior.style.display = "flex";
        btnSiguiente.style.display = "flex";
    }

    document.getElementById("btn-eliminar-foto").onclick = eliminarFotoActual;
}

async function mostrarFotoPopup() {
    const foto = fotosPopup[indicePopup];

    const blob = await IDB_FOTOS.leerBlob(foto.id);
    if (!blob) {
        popupImg.src = "";
        return;
    }

    popupImg.src = URL.createObjectURL(blob);

    if (popupDesdeGaleria || fotosPopup.length <= 1) {
        btnAnterior.style.display = "none";
        btnSiguiente.style.display = "none";
    } else {
        btnAnterior.style.display = "flex";
        btnSiguiente.style.display = "flex";
    }
}

btnAnterior.addEventListener("click", () => {
    indicePopup = (indicePopup - 1 + fotosPopup.length) % fotosPopup.length;
    mostrarFotoPopup();
});

btnSiguiente.addEventListener("click", () => {
    indicePopup = (indicePopup + 1) % fotosPopup.length;
    mostrarFotoPopup();
});

btnCerrar.addEventListener("click", () => {
    popup.classList.add("popup-oculto");
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.add("popup-oculto");
    }
});

/* ============================================================
   Eliminar foto
   ============================================================ */

async function eliminarFotoActual() {
    const foto = fotosPopup[indicePopup];

    if (!confirm("¿Seguro que quieres eliminar esta foto?")) return;

    DB.eliminarFoto(foto.id);
    await IDB_FOTOS.borrarBlob(foto.id);

    popup.classList.add("popup-oculto");

    cargarMarcadores();
}

/* ============================================================
   GALERÍA DE FOTOS — Mosaico
   ============================================================ */

async function mostrarGaleria() {
    const contenedor = document.getElementById("galeria-fotos");
    contenedor.innerHTML = "";

    const fotos = DB.obtenerTodasLasFotos();

    for (const foto of fotos) {
        const blob = await IDB_FOTOS.leerBlob(foto.id);
        if (!blob) continue;

        const url = URL.createObjectURL(blob);

        const img = document.createElement("img");
        img.src = url;

        img.onclick = () => {
            const fotosCiudad = DB.obtenerFotosPorCiudad(foto.pais, foto.ciudad);
            const indice = fotosCiudad.findIndex(f => f.id === foto.id);
            abrirPopup(fotosCiudad, indice, true);
        };

        contenedor.appendChild(img);
    }
}

/* ============================================================
   Exponer funciones globales
   ============================================================ */

window.FOTOS = {
    abrirPopup,
    mostrarGaleria
};
