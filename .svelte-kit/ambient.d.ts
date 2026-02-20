
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SHELL: string;
	export const LSCOLORS: string;
	export const GHOSTTY_BIN_DIR: string;
	export const npm_package_dependencies_flowbite_svelte_icons: string;
	export const COLORTERM: string;
	export const HYPRLAND_CMD: string;
	export const LESS: string;
	export const HISTCONTROL: string;
	export const npm_package_dependencies_svelte_qrcode: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_dependencies_command_exists: string;
	export const CLUTTER_BACKEND: string;
	export const XDG_BACKEND: string;
	export const TMUX: string;
	export const npm_package_dependencies_flowbite: string;
	export const QT_WAYLAND_DISABLE_WINDOWDECORATION: string;
	export const HOSTNAME: string;
	export const HISTSIZE: string;
	export const NODE: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_package_author_url: string;
	export const npm_config_ignore_scripts: string;
	export const npm_package_dependencies__floating_ui_dom: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_dependencies__popperjs_core: string;
	export const npm_package_private: string;
	export const npm_package_dependencies_pdfjs_dist: string;
	export const TMUX_PLUGIN_MANAGER_PATH: string;
	export const npm_config_argv: string;
	export const npm_package_dependencies_values_js: string;
	export const npm_package_dependencies_cross_spawn: string;
	export const npm_config_bin_links: string;
	export const DESKTOP_SESSION: string;
	export const ELECTRON_OZONE_PLATFORM_HINT: string;
	export const GPG_TTY: string;
	export const EDITOR: string;
	export const TMUXIFIER: string;
	export const npm_package_dependencies_classnames: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const npm_config_save_prefix: string;
	export const npm_package_devDependencies_vite: string;
	export const LOGNAME: string;
	export const XDG_SESSION_DESKTOP: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_package_readmeFilename: string;
	export const npm_package_scripts_build: string;
	export const _: string;
	export const npm_package_dependencies_flowbite_typography: string;
	export const GDM_LANG: string;
	export const HOME: string;
	export const USERNAME: string;
	export const SSH_ASKPASS: string;
	export const npm_config_version_git_tag: string;
	export const LANG: string;
	export const npm_package_dependencies__sveltejs_adapter_static: string;
	export const npm_package_devDependencies_typescript: string;
	export const LS_COLORS: string;
	export const _JAVA_AWT_WM_NONREPARENTING: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_config_init_license: string;
	export const npm_package_version: string;
	export const WAYLAND_DISPLAY: string;
	export const QT_QUICK_CONTROLS_STYLE: string;
	export const VIRTUAL_ENV_DISABLE_PROMPT: string;
	export const npm_config_version_commit_hooks: string;
	export const GOROOT: string;
	export const INIT_CWD: string;
	export const QT_QPA_PLATFORM: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_script: string;
	export const npm_package_description: string;
	export const MOZ_GMP_PATH: string;
	export const NVM_DIR: string;
	export const npm_config_version_tag_prefix: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const YARN_WRAP_OUTPUT: string;
	export const GHOSTTY_RESOURCES_DIR: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const TERMINFO: string;
	export const npm_package_name: string;
	export const ZSH: string;
	export const LESSOPEN: string;
	export const npm_package_type: string;
	export const USER: string;
	export const TMUX_PANE: string;
	export const npm_package_dependencies_flowbite_svelte: string;
	export const npm_package_dependencies_svelte_easy_crop: string;
	export const HYPRLAND_INSTANCE_SIGNATURE: string;
	export const VISUAL: string;
	export const GHOSTTY_SHELL_INTEGRATION_NO_SUDO: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const npm_package_dependencies_tesseract_js: string;
	export const npm_config_version_git_sign: string;
	export const MOZ_ENABLE_WAYLAND: string;
	export const npm_config_version_git_message: string;
	export const PAGER: string;
	export const XDG_VTNR: string;
	export const XDG_SESSION_ID: string;
	export const npm_config_user_agent: string;
	export const GHOSTTY_SHELL_INTEGRATION_NO_CURSOR: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_svelte: string;
	export const XDG_RUNTIME_DIR: string;
	export const npm_config_strict_ssl: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_dependencies_svelte_i18n: string;
	export const DEBUGINFOD_IMA_CERT_PATH: string;
	export const npm_package_scripts_dev: string;
	export const HYPRCURSOR_THEME: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const XDG_DATA_DIRS: string;
	export const npm_package_dependencies_tailwind_merge: string;
	export const npm_package_scripts_check: string;
	export const GDK_BACKEND: string;
	export const PATH: string;
	export const GDK_SCALE: string;
	export const GDMSESSION: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_author_name: string;
	export const npm_package_dependencies_dayjs: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_package_license: string;
	export const MAIL: string;
	export const npm_config_registry: string;
	export const QT_SCALE_FACTOR: string;
	export const npm_config_ignore_optional: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_node_execpath: string;
	export const npm_package_bin_svelte_flowbite_boilerplate: string;
	export const npm_package_devDependencies_postcss_load_config: string;
	export const OLDPWD: string;
	export const GOPATH: string;
	export const HYPRCURSOR_SIZE: string;
	export const TERM_PROGRAM: string;
	export const npm_config_init_version: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_API_PATH: string;
	export const PUBLIC_CALENDLY_TELEPHONE: string;
	export const PUBLIC_CALENDLY_TRAINING: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SHELL: string;
		LSCOLORS: string;
		GHOSTTY_BIN_DIR: string;
		npm_package_dependencies_flowbite_svelte_icons: string;
		COLORTERM: string;
		HYPRLAND_CMD: string;
		LESS: string;
		HISTCONTROL: string;
		npm_package_dependencies_svelte_qrcode: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_dependencies_command_exists: string;
		CLUTTER_BACKEND: string;
		XDG_BACKEND: string;
		TMUX: string;
		npm_package_dependencies_flowbite: string;
		QT_WAYLAND_DISABLE_WINDOWDECORATION: string;
		HOSTNAME: string;
		HISTSIZE: string;
		NODE: string;
		npm_package_devDependencies_tslib: string;
		npm_package_author_url: string;
		npm_config_ignore_scripts: string;
		npm_package_dependencies__floating_ui_dom: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_scripts_check_watch: string;
		npm_package_dependencies__popperjs_core: string;
		npm_package_private: string;
		npm_package_dependencies_pdfjs_dist: string;
		TMUX_PLUGIN_MANAGER_PATH: string;
		npm_config_argv: string;
		npm_package_dependencies_values_js: string;
		npm_package_dependencies_cross_spawn: string;
		npm_config_bin_links: string;
		DESKTOP_SESSION: string;
		ELECTRON_OZONE_PLATFORM_HINT: string;
		GPG_TTY: string;
		EDITOR: string;
		TMUXIFIER: string;
		npm_package_dependencies_classnames: string;
		XDG_SEAT: string;
		PWD: string;
		npm_config_save_prefix: string;
		npm_package_devDependencies_vite: string;
		LOGNAME: string;
		XDG_SESSION_DESKTOP: string;
		QT_QPA_PLATFORMTHEME: string;
		XDG_SESSION_TYPE: string;
		npm_package_readmeFilename: string;
		npm_package_scripts_build: string;
		_: string;
		npm_package_dependencies_flowbite_typography: string;
		GDM_LANG: string;
		HOME: string;
		USERNAME: string;
		SSH_ASKPASS: string;
		npm_config_version_git_tag: string;
		LANG: string;
		npm_package_dependencies__sveltejs_adapter_static: string;
		npm_package_devDependencies_typescript: string;
		LS_COLORS: string;
		_JAVA_AWT_WM_NONREPARENTING: string;
		XDG_CURRENT_DESKTOP: string;
		npm_config_init_license: string;
		npm_package_version: string;
		WAYLAND_DISPLAY: string;
		QT_QUICK_CONTROLS_STYLE: string;
		VIRTUAL_ENV_DISABLE_PROMPT: string;
		npm_config_version_commit_hooks: string;
		GOROOT: string;
		INIT_CWD: string;
		QT_QPA_PLATFORM: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_script: string;
		npm_package_description: string;
		MOZ_GMP_PATH: string;
		NVM_DIR: string;
		npm_config_version_tag_prefix: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		YARN_WRAP_OUTPUT: string;
		GHOSTTY_RESOURCES_DIR: string;
		npm_package_devDependencies_svelte_check: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		TERMINFO: string;
		npm_package_name: string;
		ZSH: string;
		LESSOPEN: string;
		npm_package_type: string;
		USER: string;
		TMUX_PANE: string;
		npm_package_dependencies_flowbite_svelte: string;
		npm_package_dependencies_svelte_easy_crop: string;
		HYPRLAND_INSTANCE_SIGNATURE: string;
		VISUAL: string;
		GHOSTTY_SHELL_INTEGRATION_NO_SUDO: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		npm_package_dependencies_tesseract_js: string;
		npm_config_version_git_sign: string;
		MOZ_ENABLE_WAYLAND: string;
		npm_config_version_git_message: string;
		PAGER: string;
		XDG_VTNR: string;
		XDG_SESSION_ID: string;
		npm_config_user_agent: string;
		GHOSTTY_SHELL_INTEGRATION_NO_CURSOR: string;
		npm_execpath: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_svelte: string;
		XDG_RUNTIME_DIR: string;
		npm_config_strict_ssl: string;
		DEBUGINFOD_URLS: string;
		npm_package_dependencies_svelte_i18n: string;
		DEBUGINFOD_IMA_CERT_PATH: string;
		npm_package_scripts_dev: string;
		HYPRCURSOR_THEME: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		XDG_DATA_DIRS: string;
		npm_package_dependencies_tailwind_merge: string;
		npm_package_scripts_check: string;
		GDK_BACKEND: string;
		PATH: string;
		GDK_SCALE: string;
		GDMSESSION: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_author_name: string;
		npm_package_dependencies_dayjs: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_package_license: string;
		MAIL: string;
		npm_config_registry: string;
		QT_SCALE_FACTOR: string;
		npm_config_ignore_optional: string;
		npm_package_devDependencies_postcss: string;
		npm_node_execpath: string;
		npm_package_bin_svelte_flowbite_boilerplate: string;
		npm_package_devDependencies_postcss_load_config: string;
		OLDPWD: string;
		GOPATH: string;
		HYPRCURSOR_SIZE: string;
		TERM_PROGRAM: string;
		npm_config_init_version: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_API_PATH: string;
		PUBLIC_CALENDLY_TELEPHONE: string;
		PUBLIC_CALENDLY_TRAINING: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
