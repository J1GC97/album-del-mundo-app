/* ============================================================
   indexeddb.js — Almacenamiento persistente de fotos
   ============================================================ */

const DB_FOTOS = "fotos_blobs_db";
const STORE = "fotos";

function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_FOTOS, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function guardarBlob(id, blob) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(blob, id);
        tx.oncomplete = resolve;
        tx.onerror = reject;
    });
}

async function leerBlob(id) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = reject;
    });
}

async function borrarBlob(id) {
    const db = await abrirDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = reject;
    });
}

window.IDB_FOTOS = { guardarBlob, leerBlob, borrarBlob };
