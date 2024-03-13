export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "apply.recrew.de/_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","barkeeper-1400x600.jpg","browserconfig.xml","favicon-16x16.png","favicon-32x32.png","favicon.ico","icon-192x192.png","icon-512x512.png","manifest.json","mstile-150x150.png","safari-pinned-tab.svg","site.webmanifest","service-worker.js"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".xml":"text/xml",".json":"application/json",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.DPkKuzFu.js","app":"_app/immutable/entry/app.BUuY0u0t.js","imports":["_app/immutable/entry/start.DPkKuzFu.js","_app/immutable/chunks/entry.ByyLDtw0.js","_app/immutable/chunks/scheduler.Cnspvhtp.js","_app/immutable/chunks/index.CW3eeXTQ.js","_app/immutable/entry/app.BUuY0u0t.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/scheduler.Cnspvhtp.js","_app/immutable/chunks/index.BtlSWUi6.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/data-request/[uuid]",
				pattern: /^\/data-request\/([^/]+?)\/?$/,
				params: [{"name":"uuid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/docs",
				pattern: /^\/docs\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/thank-you",
				pattern: /^\/thank-you\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
