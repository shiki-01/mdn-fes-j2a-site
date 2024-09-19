<script lang="ts">
	import '../app.css';
	import '@fontsource/zen-kurenaido';
	import {
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterLinkGroup,
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl
	} from 'flowbite-svelte';
	import { scrollTo, scrollTop } from 'svelte-scrolling';
	import { bg } from '$lib/img';
	import logo from '$lib/img/logo.png';
</script>

<div class="w-screen h-screen fixed top-0 left-0 z-30 mix-blend-soft-light pointer-events-none">
	<img src={bg} class="w-full h-[100vh] object-cover opacity-20" alt="bg" />
</div>

<div class="main relative overflow-hidden">
	<Navbar class="w-full h-[60px] lg:h-[70px] fixed top-0 z-[99]">
		<NavBrand href="#page">
			<button on:click={() => scrollTop()}>
				<img src={logo} class="me-3 h-6 sm:h-9" alt="Logo" />
			</button>
			<button class="self-center whitespace-nowrap text-lg md:text-lg font-semibold dark:text-white"
							on:click={() => scrollTop()}
			>辰巳のアストロブラスター
			</button
			>
		</NavBrand>
		<NavHamburger></NavHamburger>
		<NavUl>
			<a use:scrollTo={'home'} href="#home">
				Home
			</a>
			<a use:scrollTo={'rule'} href="#rule">
				Rule
			</a>
			<a use:scrollTo={'about'} href="#about">
				About
			</a>
			<a use:scrollTo={'scoreboard'} href="#scoreboard">
				ScoreBoard
			</a>
			<a use:scrollTo={'access'} href="#access">
				Access
			</a>
		</NavUl>
	</Navbar>
	<div class="main flex justify-center w-full">
		<div class="max-w-[400px] pt-[60px] lg:pt-[70px] relative">
			<slot />
		</div>
	</div>
	<Footer footerType="logo" class="dark">
		<div class="sm:flex sm:items-center sm:justify-between">
			<button on:click={() => scrollTop()}>
				<FooterBrand href="#" src={logo} alt="Logo" name="辰巳のアストロブラスター" />
			</button>
			<FooterLinkGroup
				ulClass="flex flex-wrap gap-5 items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
				<a use:scrollTo={'home'} href="#home">
					Home
				</a>
				<a use:scrollTo={'rule'} href="#rule">
					Rule
				</a>
				<a use:scrollTo={'about'} href="#about">
					About
				</a>
				<a use:scrollTo={'scoreboard'} href="#scoreboard">
					ScoreBoard
				</a>
				<a use:scrollTo={'access'} href="#access">
					Access
				</a>
			</FooterLinkGroup>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<FooterCopyright by="@tatsumi" />
	</Footer>
</div>

<style lang="postcss">
    :global(body) {
        font-family: 'Zen Kurenaido', sans-serif;
    }

    .main {
        background-image: linear-gradient(0deg, rgb(20, 73, 117), rgb(115, 255, 255))
    }
</style>