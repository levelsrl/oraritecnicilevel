// Level · Facchini – serve solo per i promemoria della sera (notifiche)
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

// 🔔 promemoria della sera (20/11/2026): Tys manda la notifica, il telefono la mostra; toccandola si apre l'app
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  var icona = new URL('../icon-192.png', self.registration.scope).href;
  e.waitUntil(self.registration.showNotification(d.title || 'Level', {
    body: d.body || '', icon: icona, badge: icona, tag: d.tag || 'level', data: { url: d.url || self.registration.scope }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (l) {
    for (var i = 0; i < l.length; i++) if (l[i].url.indexOf(self.registration.scope) === 0 && 'focus' in l[i]) return l[i].focus();
    return clients.openWindow(url);
  }));
});
