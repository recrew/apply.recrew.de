import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CLHWE9KK.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.CexZ6Maq.js","_app/immutable/chunks/index.CWYR86gM.js","_app/immutable/chunks/scheduler.vf24bg7T.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.D60PIYSB.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/CloseButton.BK39o8s4.js","_app/immutable/chunks/entry.BeXoTpd4.js","_app/immutable/chunks/Modal.BtFFE3_T.js","_app/immutable/chunks/modal.CisdjpZ1.js"];
export const stylesheets = ["_app/immutable/assets/0.D6P9xBTL.css"];
export const fonts = [];
