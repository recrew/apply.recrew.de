<script>
  import "../app.postcss";
  import {
      DarkMode,
      Footer,
      FooterCopyright, FooterLink,
      FooterLinkGroup,
      Navbar,
      NavBrand,
      NavHamburger,
      NavLi,
      NavUl
  } from "flowbite-svelte";
  import {page} from "$app/stores";
  import {base} from "$app/paths";
  import {GithubSolid} from "flowbite-svelte-icons";
  import ReusableModal from "$lib/components/ReusableModal.svelte";
</script>
<style>

</style>
<Navbar class="z-10 dark:bg-neutral-600" let:hidden let:toggle>
    <NavBrand>
        <DarkMode/>
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-3">
      <a href="{base}/"><img class="h-10" src="https://static.wixstatic.com/media/4ac443_e7a3c63994904de2ae798fc232426d39~mv2.png/v1/crop/x_540,y_1618,w_7392,h_1941/fill/w_342,h_90,al_c,q_85,usm_0.66_1.00_0.01/logo(300dpi).webp" alt="logo"></a>
    </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
<!--        <NavLi href="{base}/docs" active={$page.url.pathname.endsWith('docs')}>DOCS</NavLi>-->
        <NavLi href="https://github.com/recrew" >
            <GithubSolid/>
        </NavLi>
    </NavUl>
</Navbar>
<div class="mb-5">
    <slot />
    <Footer>
        <div class="grid place-items-center">
            <FooterCopyright href="/" by="RECREW™" year={(new Date()).getFullYear()} />
        </div>
        <FooterLinkGroup ulClass="grid grid-cols-3 text-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 ">
            <FooterLink href="https://www.recrew.info/kopie-von-legal">Impressum</FooterLink>
            <FooterLink href="https://www.recrew.info/kopie-von-dsgvo">Privacy Policy</FooterLink>
            <FooterLink href="https://www.recrew.info/kontakt">Contact</FooterLink>
        </FooterLinkGroup>
    </Footer>
    <ReusableModal/>
</div>
