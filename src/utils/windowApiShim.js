// Universal shim to avoid crashes when running in a pure browser (no Electron preload)
(function(){
  if (typeof window === 'undefined') return;

  const makeNoopProxy = () => new Proxy(function(){}, {
    apply() { /* noop */ },
    get(target, prop) {
      // special case for "on*" style callbacks: return a function that accepts a callback and never calls it
      if (typeof prop === 'string' && prop.startsWith('on')) return function(){ /* noop */ };
      return makeNoopProxy();
    }
  });

  if (!window.windowApi) {
    window.windowApi = new Proxy({}, {
      get() { return makeNoopProxy(); }
    });
  }
  if (!window.playerApi) {
    window.playerApi = new Proxy({}, {
      get() { return makeNoopProxy(); }
    });
  }
})();
