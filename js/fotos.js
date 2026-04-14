import { supabase } from "./supabase.js";
import { DB } from "./db.js";

export const FOTOS = {
    async guardarFotos() {
        const input = document.getElementById("input-fotos");
        const pais = document.getElementById("select-pais").value;
        const ciudad = document.getElementById("select-ciudad").value;

        const archivos = Array.from(input.files);

        for (const archivo of archivos) {
            const id = Date.now() + "_" + archivo.name.replace(/\s+/g, "_");
            const ruta = `${pais}/${ciudad}/${id}`;

            // SUBIR ARCHIVO
            const { error: uploadError } = await supabase.storage
                .from("fotos")
                .upload(ruta, archivo, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (uploadError) {
                console.error(uploadError);
                alert("Error subiendo foto");
                continue;
            }

            // URL pública
            const { data: publicURL } = supabase.storage
                .from("fotos")
                .getPublicUrl(ruta);

            // GUARDAR METADATOS
            await DB.guardarFoto({
                id,
                pais,
                ciudad,
                url: publicURL.publicUrl
            });
        }

        alert("Fotos guardadas correctamente");
    },

    abrirPopup(lista, indice) {
        this.lista = lista;
        this.indice = indice;
        this.mostrarFoto();
        document.getElementById("popup-fotos").classList.remove("popup-oculto");

        // Activar botón eliminar
        document.getElementById("btn-eliminar-foto").onclick = () => {
            this.eliminarFotoActual();
        };
    },

    mostrarFoto() {
        const foto = this.lista[this.indice];
        document.getElementById("popup-imagen").src = foto.url;
    },

    siguiente() {
        if (this.indice < this.lista.length - 1) {
            this.indice++;
            this.mostrarFoto();
        }
    },

    anterior() {
        if (this.indice > 0) {
            this.indice--;
            this.mostrarFoto();
        }
    },

    async eliminarFotoActual() {
        const foto = this.lista[this.indice];
        const ruta = `${foto.pais}/${foto.ciudad}/${foto.id}`;

        // 1. Eliminar archivo del bucket
        await supabase.storage.from("fotos").remove([ruta]);

        // 2. Eliminar registro de la tabla
        await DB.eliminarFoto(foto.id);

        alert("Foto eliminada");

        // 3. Cerrar popup
        document.getElementById("popup-fotos").classList.add("popup-oculto");

        // 4. Recargar marcadores y galería
        if (typeof cargarMarcadores === "function") cargarMarcadores();
        if (typeof cargarGaleria === "function") cargarGaleria();
    }
};
