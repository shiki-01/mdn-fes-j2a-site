<script>
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<div>
	<Navbar>
		<NavBrand href="/">
			<img src="https://placehold.jp/300x150.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Flowbite</span
			>
		</NavBrand>
		<NavHamburger></NavHamburger>
		<NavUl>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/rule">Rule</NavLi>
			<NavLi href="/scoreboard">ScoreBoard</NavLi>
			<NavLi href="/access">Access</NavLi>
		</NavUl>
	</Navbar>
	<slot></slot>
</div>

<style></style>
