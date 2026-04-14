console.log("🔥 app.js cargado correctamente");

/* ============================================================
   Cargar DB desde localStorage al iniciar la SPA
   ============================================================ */
function cargarDBLocal() {
    try {
        const db = localStorage.getItem("fotos_mapa_db_v1");

        if (!db) {
            console.warn("⚠️ No hay DB en localStorage, creando una vacía");
            localStorage.setItem("fotos_mapa_db_v1", JSON.stringify([]));
            return [];
        }

        const datos = JSON.parse(db);
        console.log("📦 DB cargada desde localStorage:", datos);
        return datos;

    } catch (e) {
        console.error("❌ Error cargando DB local:", e);
        return [];
    }
}

/* ============================================================
   Guardar DB en localStorage
   ============================================================ */
function guardarDBLocal(db) {
    localStorage.setItem("fotos_mapa_db_v1", JSON.stringify(db));
    console.log("💾 DB guardada:", db);
}

/* ============================================================
   ACTIVAR INPUT DE FOTOS (solo debug visual)
   ============================================================ */
function activarInputFotos() {
    const input = document.getElementById("input-fotos");
    if (!input) return;

    console.log("🎯 Listener del input ACTIVADO");

    input.addEventListener("change", (e) => {
        console.log("🔥 EVENTO CHANGE DETECTADO");
        console.log("📸 Fotos seleccionadas:", e.target.files);
    });
}

/* ============================================================
   Inicio de la SPA
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    cargarDBLocal();
    activarInputFotos();
});
