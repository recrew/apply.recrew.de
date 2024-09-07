import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BpbcqLI9.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.B_5mp3Ph.js","_app/immutable/chunks/index.D-SVlAGp.js","_app/immutable/chunks/scheduler.C7hyZO3A.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.bPqw7aP0.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/CloseButton.C0JvLwLf.js","_app/immutable/chunks/entry.BeQCDX2s.js","_app/immutable/chunks/Modal.BChe-8nX.js","_app/immutable/chunks/modal.DPaC_Z4L.js"];
export const stylesheets = ["_app/immutable/assets/0.LPk2fgUE.css"];
export const fonts = [];
