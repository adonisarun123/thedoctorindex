// Outside Next.js, `import "server-only"` throws by design. Scripts that reuse
// the service layer preload this shim so the guard is a no-op there — they
// *are* server code. Usage: tsx --require ./scripts/server-only-shim.cjs …
const Module = require("node:module");
const load = Module._load;
Module._load = function (request, ...rest) {
  if (request === "server-only") return {};
  return load.call(this, request, ...rest);
};
