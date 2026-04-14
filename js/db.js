/* ============================================================
   db.js — Gestión de datos en localStorage (sin backend)
   ============================================================ */

const DB_KEY = "fotos_mapa_db_v1";

/* ============================
   Cargar base de datos
   ============================ */
function cargarDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
}

/* ============================
   Guardar base de datos
   ============================ */
function guardarDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/* ============================
   Añadir foto a la base de datos
   ============================ */
function guardarFoto(pais, ciudad, id) {
    const db = cargarDB();

    db.push({
        id,
        pais,
        ciudad
    });

    guardarDB(db);
}

/* ============================
   Eliminar foto
   ============================ */
function eliminarFoto(id) {
    let db = cargarDB();
    db = db.filter(f => f.id !== id);
    guardarDB(db);
}

/* ============================
   Obtener todas las fotos
   ============================ */
function obtenerTodasLasFotos() {
    return cargarDB();
}

/* ============================
   Obtener fotos por ciudad
   ============================ */
function obtenerFotosPorCiudad(pais, ciudad) {
    const db = cargarDB();
    return db.filter(f => f.pais === pais && f.ciudad === ciudad);
}

/* ============================
   Obtener fotos por ubicación
   ============================ */
function obtenerFotosPorUbicacion(pais, ciudad) {
    return obtenerFotosPorCiudad(pais, ciudad);
}

/* ============================
   Exportar funciones
   ============================ */
window.DB = {
    cargarDB,
    guardarDB,
    guardarFoto,
    eliminarFoto,
    obtenerTodasLasFotos,
    obtenerFotosPorCiudad,
    obtenerFotosPorUbicacion
};
