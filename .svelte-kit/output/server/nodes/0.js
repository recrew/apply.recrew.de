import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DWQuh1y-.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.BIifMfOM.js","_app/immutable/chunks/index.BIQDw6vW.js","_app/immutable/chunks/scheduler.Dutb4BKE.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.D7Q73iL7.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/CloseButton.BBaBqNfH.js","_app/immutable/chunks/entry.Ckrfqi1_.js","_app/immutable/chunks/modal.DtP4y9GP.js"];
export const stylesheets = ["_app/immutable/assets/0.B1wf1aPR.css"];
export const fonts = [];
