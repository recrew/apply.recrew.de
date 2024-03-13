import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DqkDQLFa.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/runtime.C6_E4hEI.js","_app/immutable/chunks/index.CW3eeXTQ.js","_app/immutable/chunks/scheduler.Cnspvhtp.js","_app/immutable/chunks/_commonjsHelpers.Cpj98o6Y.js","_app/immutable/chunks/index.BtlSWUi6.js","_app/immutable/chunks/bundle-mjs.C064607j.js","_app/immutable/chunks/Frame.BIqxq4Wl.js","_app/immutable/chunks/CloseButton.C8sNavZP.js","_app/immutable/chunks/entry.ByyLDtw0.js","_app/immutable/chunks/GithubSolid.BPn0QHAY.js","_app/immutable/chunks/modal.BvO721lX.js"];
export const stylesheets = ["_app/immutable/assets/0.FyVzDOxj.css"];
export const fonts = [];
