/*
 * Retires the old offline copy of the game that lived at /fish-fight/ (renamed NibbleNaut, now at
 * /NibbleNaut/). Installed copies pick this up through their normal update check: it deletes only
 * the caches that hold the old /fish-fight/ files (the new game at /NibbleNaut/ shares this site
 * and the cache-name prefix, so its caches are left alone), then unregisters itself. It never
 * reloads an open page, so a match in progress is not interrupted.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const oldShell = new URL('./index.html', self.registration.scope).href;
      for (const name of await caches.keys()) {
        if (!name.startsWith('fish-fight-v')) continue;
        const cache = await caches.open(name);
        if (await cache.match(oldShell)) await caches.delete(name);
      }
      await self.registration.unregister();
    })(),
  );
});
