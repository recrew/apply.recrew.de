export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "apply.recrew.de/_app",
	assets: new Set([".htaccess","android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","barkeeper-1400x600.jpg","browserconfig.xml","favicon-16x16.png","favicon-32x32.png","favicon.ico","icon-192x192.png","icon-512x512.png","manifest.json","mstile-144x144.png","mstile-150x150.png","mstile-310x150.png","mstile-310x310.png","mstile-70x70.png","recrew-web-banner.webp","safari-pinned-tab.svg","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".xml":"text/xml",".json":"application/json",".webp":"image/webp",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.DQ3T52ko.js","app":"_app/immutable/entry/app.xa7rIs3L.js","imports":["_app/immutable/entry/start.DQ3T52ko.js","_app/immutable/chunks/entry.BFumyoDX.js","_app/immutable/chunks/scheduler.pjD_K3O8.js","_app/immutable/chunks/index.DbqL2qJR.js","_app/immutable/entry/app.xa7rIs3L.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/scheduler.pjD_K3O8.js","_app/immutable/chunks/index.N1OnuFDn.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
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
				id: "/data-request",
				pattern: /^\/data-request\/?$/,
				params: [],
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
				id: "/schedule",
				pattern: /^\/schedule\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/thank-you",
				pattern: /^\/thank-you\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
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
