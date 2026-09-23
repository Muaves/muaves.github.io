(function () {
    var INTERNAL = /(^|\.)muaves\.com$/i;
    var EXTRA = ['muaves.github.io'];

    function encode(s) {
        var bytes = new TextEncoder().encode(s);
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function guard(a) {
        if (a.dataset.guarded || a.hasAttribute('data-direct')) return;
        var u;
        try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { return; }
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return;
        if (INTERNAL.test(u.hostname) || EXTRA.indexOf(u.hostname) > -1) return;
        a.href = '/redirect?ref=' + encode(u.href);
        a.dataset.guarded = '1';
        a.rel = ((a.rel || '') + ' noopener').trim();
    }

    function scan(root) {
        if (root.nodeType !== 1) return;
        if (root.matches('a[href]')) guard(root);
        root.querySelectorAll('a[href]').forEach(guard);
    }

    function start() {
        scan(document.documentElement);
        new MutationObserver(function (list) {
            list.forEach(function (m) {
                m.addedNodes.forEach(scan);
                if (m.type === 'attributes') scan(m.target);
            });
        }).observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
