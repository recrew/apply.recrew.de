import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.C0B4pGNF.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.3ZcDkMfy.js","_app/immutable/chunks/index.D0oo-Ivb.js","_app/immutable/chunks/scheduler.Bcx0TcDP.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.DhAk6tgC.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/CloseButton.DDkWcVqz.js","_app/immutable/chunks/entry.2TpzsnG5.js","_app/immutable/chunks/Modal.Dt_PVD9a.js","_app/immutable/chunks/modal.CoUL4IX2.js"];
export const stylesheets = ["_app/immutable/assets/0.imTlxXTy.css"];
export const fonts = [];
