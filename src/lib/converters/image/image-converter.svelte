<script lang="ts">
	import ConverterCard from '$lib/components/converter/converter-card.svelte';
	import FileUpload from '$lib/components/converter/file-upload.svelte';
	import Progress from '$lib/components/converter/progress.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Download, Image, RefreshCw, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import { downloadFiles } from '../shared/download';
	import { allSupportedType, allUnderMB } from '../shared/validation';
	import ImageConverterOptions from './image-converter-options.svelte';
	import { convertCanvas } from './utils';

	let input = $state<File[]>([]);
	let output = $state<(File | null)[]>([]);
	let options = $state<ImageConverterOptions>();

	let converting = $state(false);
	let downloading = $state(false);

	const reset = () => {
		converting = false;
		input = [];
		output = [];
	};

	const setFiles = (files: File[]) => {
		if (files.length > 0 && allUnderMB(files, 500) && allSupportedType(files, ['image'])) input = files;
		else reset();
	};

	const convert = async () => {
		if (converting) return;
		const values = options?.getValues();
		if (!values) return;

		converting = true;
		output = [];

		for (const file of input) {
			let result: File | null = null;
			try {
				result = await convertCanvas(file, values);
			} catch (err) {
				if (converting) toast.error(`${file.name}: ${err instanceof Error ? err.message : 'Conversion failed'}`);
			}

			if (!converting) return;
			output.push(result);
		}

		converting = false;
	};

	const download = async () => {
		if (downloading) return;
		downloading = true;
		try {
			await downloadFiles(output);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create the download.');
		} finally {
			downloading = false;
		}
	};
</script>

<Dialog.Root onOpenChangeComplete={reset}>
	<Dialog.Trigger>
		<ConverterCard title="Image Converter" Icon={Image}>
			<p>Convert your images effortlessly to any popular format, such as JPEG, PNG, or WebP.</p>
		</ConverterCard>
	</Dialog.Trigger>

	<Dialog.Content
		class="max-h-screen scrollbar-thin overflow-y-auto sm:max-w-lg"
		showCloseButton={false}
		escapeKeydownBehavior={converting ? 'ignore' : 'close'}
		interactOutsideBehavior={converting ? 'ignore' : 'close'}>
		{#if !input.length}
			<FileUpload {setFiles} />
		{:else if !converting && !output.length}
			<div in:fade={{ duration: 200 }}>
				<ImageConverterOptions bind:this={options} />

				<Dialog.Footer class="mt-8">
					<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
						<X /> Cancel
					</Dialog.Close>
					<Button onclick={convert}>
						<RefreshCw /> Convert
					</Button>
				</Dialog.Footer>
			</div>
		{:else}
			<div in:fade={{ duration: 200 }}>
				<Progress {input} {output} />

				<Dialog.Footer class="mt-8">
					<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
						<X /> Cancel
					</Dialog.Close>
					<Button onclick={download} disabled={converting || downloading || !output.some(Boolean)}>
						{#if downloading}
							<Spinner /> Download
						{:else}
							<Download /> Download
						{/if}
					</Button>
				</Dialog.Footer>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
