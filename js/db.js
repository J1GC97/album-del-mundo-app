import { supabase } from "./supabase.js";

export const DB = {
    async guardarFoto(meta) {
        const { error } = await supabase
            .from("fotos")
            .insert(meta);

        if (error) throw error;
    },

    async obtenerTodasLasFotos() {
        const { data, error } = await supabase
            .from("fotos")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
    },

    async obtenerFotosPorCiudad(pais, ciudad) {
        const { data, error } = await supabase
            .from("fotos")
            .select("*")
            .eq("pais", pais)
            .eq("ciudad", ciudad)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
    },

    async eliminarFoto(id) {
        const { error } = await supabase
            .from("fotos")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
