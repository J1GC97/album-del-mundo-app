import { DB } from "./db.js";
import { FOTOS } from "./fotos.js";
import { ubicaciones } from "./ubicaciones.js";

let mapa;
let clusterGroup;

export function iniciarMapa() {
    if (mapa) return;

    const worldBounds = L.latLngBounds(
        L.latLng(-85.0511, -180),
        L.latLng(85.0511, 180)
    );

    mapa = L.map('mapa', {
        zoomControl: false,
        attributionControl: false,
        maxBounds: worldBounds,
        maxBoundsViscosity: 1.0
    });

    const minZoom = mapa.getBoundsZoom(worldBounds, true);
    mapa.setMinZoom(minZoom);
    mapa.setView([20, 0], minZoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(mapa);

    clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: cluster => {
            return L.divIcon({
                html: `<div class="cluster">${cluster.getChildCount()}</div>`,
                className: 'cluster-icon',
                iconSize: L.point(40, 40)
            });
        }
    });

    mapa.addLayer(clusterGroup);

    setTimeout(() => mapa.invalidateSize(), 200);
}

export async function cargarMarcadores() {
    if (!clusterGroup) return;

    clusterGroup.clearLayers();

    const fotos = await DB.obtenerTodasLasFotos();

    fotos.forEach(foto => {
        const coords = ubicaciones[foto.pais]?.[foto.ciudad];
        if (!coords) return;

        const icono = L.divIcon({
            html: `<img src="assets/icons/camera.svg" class="icono-mapa">`,
            className: 'icono-wrapper',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: icono });

        marker.on("click", async () => {
            const fotosCiudad = await DB.obtenerFotosPorCiudad(foto.pais, foto.ciudad);
            const indice = fotosCiudad.findIndex(f => f.id === foto.id);
            FOTOS.abrirPopup(fotosCiudad, indice);
        });

        clusterGroup.addLayer(marker);
    });
}

const estiloMapa = document.createElement("style");
estiloMapa.innerHTML = `
    .icono-mapa {
        width: 28px;
        height: 28px;
        opacity: 0.85;
    }
    .cluster-icon {
        background: #ffffff;
        border: 2px solid #ccc;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: #333;
    }
    .cluster {
        font-weight: 500;
    }
`;
document.head.appendChild(estiloMapa);
