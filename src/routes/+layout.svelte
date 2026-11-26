<script lang="ts">
	import { dev } from '$app/environment';
	import favicon from '$lib/assets/cog.svg';
	import LightSwitch from '$lib/components/shared/light-switch.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Toaster } from '$lib/components/ui/sonner';
	import interNormalWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import './layout.css';

	let { children } = $props();

	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={interNormalWoff2} crossorigin="anonymous" />
	<link rel="icon" href={favicon} />
	<title>Media Converter</title>
	<meta name="description" content="Client-Side Media Converter" />
</svelte:head>

<Toaster position="top-center" richColors={true} />

<div class="flex min-h-dvh flex-col">
	<header class="container mx-auto flex justify-end px-2 py-4">
		<LightSwitch />
	</header>

	<main class="container mx-auto flex-1 px-2 pt-20 pb-8">
		{@render children()}
	</main>

	<footer class="container mx-auto flex justify-center px-2 py-4 text-sm text-muted-foreground">
		<Dialog.Root>
			<Dialog.Trigger class="underline-offset-4 duration-200 hover:text-foreground hover:underline">
				Privacy
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title class="mb-2">Privacy</Dialog.Title>
					<Dialog.Description class="space-y-2 text-justify">
						<p>
							Files you convert are processed entirely in your browser and are never uploaded or stored. This site is
							hosted on Vercel and uses Vercel Web Analytics for anonymous, cookieless visit statistics.
						</p>
						<p>No ads, no accounts, no cookies.</p>
					</Dialog.Description>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
	</footer>
</div>
