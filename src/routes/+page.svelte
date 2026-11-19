<script lang="ts">
	import AudioConverter from '$lib/converters/audio/audio-converter.svelte';
	import ImageConverter from '$lib/converters/image/image-converter.svelte';
	import VideoConverter from '$lib/converters/video/video-converter.svelte';
</script>

<section class="mb-20 space-y-4 text-center">
	<h1 class="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
		Client-Side Media Conversion. Zero Server Uploads.
	</h1>

	<p class="text-xl text-muted-foreground">
		Convert your media files directly in your browser without ever uploading a single byte to an external server.
	</p>
</section>

<section class="container mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
	<ImageConverter />
	<VideoConverter />
	<AudioConverter />
</section>
