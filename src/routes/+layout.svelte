<script>
    import "../app.postcss";
    import {
        DarkMode,
        Footer,
        FooterCopyright,
        FooterLink,
        FooterLinkGroup,
        Navbar,
        NavBrand,
        NavHamburger,
        NavLi,
        NavUl,
    } from "flowbite-svelte";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { GithubSolid } from "flowbite-svelte-icons";
    import ReusableModal from "$lib/components/ReusableModal.svelte";
    import { onMount } from "svelte";
    import { token } from "$lib/stores/auth";
    import { user } from "$lib/stores/user";
    import { post } from "$lib/api";
    import decodeJwt from "$lib/utils/decodeJwt";
    import MagicLogin from "$lib/components/MagicLogin.svelte";

    onMount(async () => {
        if ($page.url.searchParams.get("token")) {
            try {
                // get JWT token from URL
                const jwt = await post(
                    "/auth/magic-link/" + $page.url.searchParams.get("token"),
                );
                token.set(jwt.token);
                const decoded = decodeJwt(jwt.token);
                console.log(decoded);
                sessionStorage.token = jwt.token;
                user.set(decoded);
                sessionStorage.user = JSON.stringify(decoded);
            } catch (e) {
                console.log("Token invalid or expired");
                token.set(null);
            } finally {
                $page.url.searchParams.delete("token");
                window.location.href = $page.url.href;
            }
        }
    });
</script>

<svelte:head>
    <title>Der flexibelste Nebenjob der Stadt</title>
</svelte:head>
<Navbar class="z-10 dark:bg-neutral-600" let:hidden let:toggle>
    <NavBrand>
        <DarkMode />
        <span
            class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-3"
        >
            <a href="{base}/"
                ><img
                    class="h-10"
                    src="/recrew-web-banner.webp"
                    alt="logo"
                /></a
            >
        </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi href="https://www.instagram.com/recrewjobs/">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 16 16"
                ><path
                    fill="currentColor"
                    d="M8 0C5.829 0 5.556.01 4.703.048C3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7C.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297c.04.852.174 1.433.372 1.942c.205.526.478.972.923 1.417c.444.445.89.719 1.416.923c.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417c.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046c.78.035 1.204.166 1.486.275c.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485c.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598c-.28.11-.704.24-1.485.276c-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598a2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485c-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486c.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276c.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92a.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217a4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334a2.667 2.667 0 0 1 0-5.334"
                /></svg
            >
        </NavLi>
    </NavUl>
</Navbar>
<div class="mb-5">
    {#if $token || !$page.url.pathname.match(/^\/evaluation\/[^/]+$/)}
        <slot />
    {:else}
        <div class="mt-5">
            <MagicLogin />
        </div>
    {/if}
    <Footer>
        <div class="grid place-items-center">
            <FooterCopyright
                href="/"
                by="RETECH™"
                year={new Date().getFullYear()}
            />
        </div>
        <FooterLinkGroup
            ulClass="grid grid-cols-3 text-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 "
        >
            <FooterLink href="https://www.recrew.info/kopie-von-legal"
                >Impressum</FooterLink
            >
            <FooterLink href="https://www.recrew.info/kopie-von-dsgvo"
                >Privacy Policy</FooterLink
            >
            <FooterLink href="https://www.recrew.info/kontakt">Contact</FooterLink>
        </FooterLinkGroup>
    </Footer>
    <ReusableModal />
</div>

<style>
</style>
