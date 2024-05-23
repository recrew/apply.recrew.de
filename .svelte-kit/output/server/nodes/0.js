import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Dx2YHmda.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.DhNW-1Ob.js","_app/immutable/chunks/index.B4p_thPL.js","_app/immutable/chunks/scheduler.DrIHIsRK.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.BfVcQvBH.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/CloseButton.CbTJE-vF.js","_app/immutable/chunks/entry.CWby8ymr.js","_app/immutable/chunks/Modal.CcRxN4zU.js","_app/immutable/chunks/modal.BwIg8ITt.js"];
export const stylesheets = ["_app/immutable/assets/0.D9kvglU9.css"];
export const fonts = [];
