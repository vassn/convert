<script lang="ts">
	import { dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/cog.svg';
	import LightSwitch from '$lib/components/light-switch.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Toaster } from '$lib/components/ui/sonner';
	import interNormalWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import './layout.css';

	let { children } = $props();

	injectAnalytics({ mode: dev ? 'development' : 'production' });

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

<div class="flex min-h-dvh flex-col">
	<header class="container mx-auto flex justify-between px-2 py-4">
		<div></div>
		<LightSwitch />
	</header>

	<main class="container mx-auto flex-1 px-2 pt-20 pb-8">
		{@render children()}
	</main>

	<footer
		class="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 py-4 text-sm text-muted-foreground">
		<div class="flex items-center gap-4">
			<Dialog.Root>
				<Dialog.Trigger class="underline-offset-4 hover:text-foreground hover:underline">Privacy</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-lg">
					<Dialog.Header>
						<Dialog.Title class="mb-2">Privacy</Dialog.Title>
						<Dialog.Description>
							Files you convert are processed entirely in your browser and never uploaded or stored. This site is hosted
							on Vercel, which processes standard technical data such as IP addresses to deliver the site, and uses
							Vercel Web Analytics for anonymous, cookieless visit statistics. No ads, no accounts, no cookies.
						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</footer>
</div>

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
