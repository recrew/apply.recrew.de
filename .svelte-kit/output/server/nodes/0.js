import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.C5Adj_g5.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.BJpS8Pbc.js","_app/immutable/chunks/index.DbqL2qJR.js","_app/immutable/chunks/scheduler.pjD_K3O8.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.N1OnuFDn.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/CloseButton.Jig3E70j.js","_app/immutable/chunks/entry.ClxWyPoN.js","_app/immutable/chunks/Modal.BX4hCBj1.js","_app/immutable/chunks/modal.p_GbUfF5.js"];
export const stylesheets = ["_app/immutable/assets/0.CGoD-wqA.css"];
export const fonts = [];
