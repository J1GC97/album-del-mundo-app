self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    clients.claim();
});

// No interceptamos nada: Supabase debe funcionar siempre online
self.addEventListener("fetch", () => {});
