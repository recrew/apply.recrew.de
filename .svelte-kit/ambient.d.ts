
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
	export const npm_package_dependencies_svelte_easy_crop: string;
	export const TERM_PROGRAM: string;
	export const npm_package_dependencies_flowbite: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const npm_package_devDependencies_typescript: string;
	export const npm_config_version_git_tag: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies_vite: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_config_init_license: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_devDependencies_postcss_load_config: string;
	export const npm_package_scripts_dev: string;
	export const TERM_SESSION_ID: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_private: string;
	export const npm_config_registry: string;
	export const npm_package_readmeFilename: string;
	export const npm_package_dependencies_dayjs: string;
	export const USER: string;
	export const npm_package_description: string;
	export const npm_package_license: string;
	export const npm_package_scripts_check_watch: string;
	export const OPENAI_API_KEY: string;
	export const npm_package_dependencies_flowbite_svelte: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_author_name: string;
	export const npm_package_dependencies_command_exists: string;
	export const npm_package_dependencies_tailwind_merge: string;
	export const PATH: string;
	export const npm_config_argv: string;
	export const _: string;
	export const LaunchInstanceID: string;
	export const npm_package_dependencies_svelte_i18n: string;
	export const npm_package_dependencies_pdfjs_dist: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_author_url: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_name: string;
	export const npm_package_scripts_build: string;
	export const npm_config_version_commit_hooks: string;
	export const XPC_FLAGS: string;
	export const npm_package_dependencies_cross_spawn: string;
	export const npm_config_bin_links: string;
	export const npm_package_dependencies_classnames: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_type: string;
	export const npm_config_save_prefix: string;
	export const npm_config_strict_ssl: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_config_version_git_message: string;
	export const npm_package_dependencies_svelte_qrcode: string;
	export const npm_package_dependencies_flowbite_typography: string;
	export const LOGNAME: string;
	export const YARN_WRAP_OUTPUT: string;
	export const PREFIX: string;
	export const npm_lifecycle_script: string;
	export const npm_config_version_git_sign: string;
	export const npm_config_ignore_scripts: string;
	export const npm_config_user_agent: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const npm_package_dependencies_tesseract_js: string;
	export const npm_package_dependencies__sveltejs_adapter_static: string;
	export const npm_package_dependencies__floating_ui_dom: string;
	export const npm_package_dependencies__popperjs_core: string;
	export const npm_package_dependencies_flowbite_svelte_icons: string;
	export const npm_config_init_version: string;
	export const npm_config_ignore_optional: string;
	export const SECURITYSESSIONID: string;
	export const npm_package_scripts_check: string;
	export const npm_node_execpath: string;
	export const npm_package_dependencies_values_js: string;
	export const npm_package_bin_svelte_flowbite_boilerplate: string;
	export const npm_config_version_tag_prefix: string;
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
		npm_package_dependencies_svelte_easy_crop: string;
		TERM_PROGRAM: string;
		npm_package_dependencies_flowbite: string;
		NODE: string;
		INIT_CWD: string;
		npm_package_devDependencies_typescript: string;
		npm_config_version_git_tag: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies_vite: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_config_init_license: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_devDependencies_postcss_load_config: string;
		npm_package_scripts_dev: string;
		TERM_SESSION_ID: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_private: string;
		npm_config_registry: string;
		npm_package_readmeFilename: string;
		npm_package_dependencies_dayjs: string;
		USER: string;
		npm_package_description: string;
		npm_package_license: string;
		npm_package_scripts_check_watch: string;
		OPENAI_API_KEY: string;
		npm_package_dependencies_flowbite_svelte: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_devDependencies_postcss: string;
		npm_execpath: string;
		npm_package_devDependencies_tslib: string;
		npm_package_devDependencies_svelte: string;
		npm_package_author_name: string;
		npm_package_dependencies_command_exists: string;
		npm_package_dependencies_tailwind_merge: string;
		PATH: string;
		npm_config_argv: string;
		_: string;
		LaunchInstanceID: string;
		npm_package_dependencies_svelte_i18n: string;
		npm_package_dependencies_pdfjs_dist: string;
		__CFBundleIdentifier: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_author_url: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_name: string;
		npm_package_scripts_build: string;
		npm_config_version_commit_hooks: string;
		XPC_FLAGS: string;
		npm_package_dependencies_cross_spawn: string;
		npm_config_bin_links: string;
		npm_package_dependencies_classnames: string;
		XPC_SERVICE_NAME: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_version: string;
		npm_package_devDependencies_svelte_check: string;
		npm_package_devDependencies_autoprefixer: string;
		SHLVL: string;
		HOME: string;
		npm_package_type: string;
		npm_config_save_prefix: string;
		npm_config_strict_ssl: string;
		HOMEBREW_PREFIX: string;
		npm_config_version_git_message: string;
		npm_package_dependencies_svelte_qrcode: string;
		npm_package_dependencies_flowbite_typography: string;
		LOGNAME: string;
		YARN_WRAP_OUTPUT: string;
		PREFIX: string;
		npm_lifecycle_script: string;
		npm_config_version_git_sign: string;
		npm_config_ignore_scripts: string;
		npm_config_user_agent: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		npm_package_dependencies_tesseract_js: string;
		npm_package_dependencies__sveltejs_adapter_static: string;
		npm_package_dependencies__floating_ui_dom: string;
		npm_package_dependencies__popperjs_core: string;
		npm_package_dependencies_flowbite_svelte_icons: string;
		npm_config_init_version: string;
		npm_config_ignore_optional: string;
		SECURITYSESSIONID: string;
		npm_package_scripts_check: string;
		npm_node_execpath: string;
		npm_package_dependencies_values_js: string;
		npm_package_bin_svelte_flowbite_boilerplate: string;
		npm_config_version_tag_prefix: string;
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
