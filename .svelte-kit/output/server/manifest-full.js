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
		client: {"start":"_app/immutable/entry/start.BEZLSYPo.js","app":"_app/immutable/entry/app.Dj0JNa12.js","imports":["_app/immutable/entry/start.BEZLSYPo.js","_app/immutable/chunks/entry.BeXoTpd4.js","_app/immutable/chunks/scheduler.vf24bg7T.js","_app/immutable/chunks/index.CWYR86gM.js","_app/immutable/entry/app.Dj0JNa12.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/scheduler.vf24bg7T.js","_app/immutable/chunks/index.D60PIYSB.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js'))
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
				id: "/test",
				pattern: /^\/test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/thank-you",
				pattern: /^\/thank-you\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
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
