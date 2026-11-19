<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/cog.svg';
	import LightSwitch from '$lib/components/light-switch.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import interNormalWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
	import './layout.css';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="font" type="font/woff2" href={interNormalWoff2} crossorigin="anonymous" />
	<title>Media Converter</title>
	<meta name="description" content="Client-Side Media Converter" />
</svelte:head>

<Toaster position="top-center" richColors={true} />

<header class="container mx-auto flex justify-between px-2 py-4">
	<div></div>

	<LightSwitch />
</header>

<main class="container mx-auto p-2 pt-20">
	{@render children()}
</main>

<style>
	:global(:root) {
		view-transition-name: none;
	}

	:global(main) {
		view-transition-name: main-content;
	}

	::view-transition-group(main-content) {
		animation-duration: 200ms;
	}

	@view-transition {
		navigation: auto;
	}
</style>
