export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production' || true) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Deen Zone ServiceWorker registered successfully with scope:', registration.scope);
          
          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New content is available; please refresh.');
                  } else {
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('ServiceWorker registration failed:', error);
        });
    });
  }
}
