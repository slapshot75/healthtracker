// Registriert den Service Worker für Offline-Nutzung und Home-Bildschirm-Installation.
// Fehler werden nur protokolliert: die App funktioniert auch ohne Service Worker.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.warn('Service Worker konnte nicht registriert werden:', err);
    });
  });
}
