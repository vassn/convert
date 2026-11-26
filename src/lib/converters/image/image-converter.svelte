<script lang="ts">
	import ConverterCard from '$lib/components/shared/converter-card.svelte';
	import FileUpload from '$lib/components/shared/file-upload.svelte';
	import Progress from '$lib/components/shared/progress.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Download, Image, RefreshCw, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import { downloadFiles } from '../utils/download';
	import { allSupportedType, allUnderMB } from '../utils/validation';
	import ImageConverterOptions from './image-converter-options.svelte';
	import { convertCanvas } from './utils';

	type Stage = 'upload' | 'options' | 'converting' | 'done' | 'downloading';

	let stage = $state<Stage>('upload');
	let input = $state<File[]>([]);
	let output = $state<(File | null)[]>([]);
	let options = $state<ImageConverterOptions>();

	const is = (...stages: Stage[]) => stages.includes(stage);

	const reset = () => {
		stage = 'upload';
		input = [];
		output = [];
	};

	const setFiles = (files: File[]) => {
		if (files.length > 0 && allUnderMB(files, 500) && allSupportedType(files, ['image'])) {
			input = files;
			stage = 'options';
		}
	};

	const convert = async () => {
		if (is('converting')) return;

		const optionValues = options?.getValues();
		if (!optionValues) return;

		stage = 'converting';
		output = [];

		for (const file of input) {
			let result: File | null = null;
			try {
				result = await convertCanvas(file, optionValues);
			} catch (err) {
				if (is('converting')) {
					toast.error(`${file.name}: Conversion failed`);
					console.error(err);
				}
			}

			if (!is('converting')) return;
			output.push(result);
		}

		stage = 'done';
	};

	const download = async () => {
		if (!is('done')) return;

		stage = 'downloading';

		try {
			await downloadFiles(output);
		} catch (err) {
			toast.error('Download failed');
			console.error(err);
		} finally {
			if (is('downloading')) stage = 'done';
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
		escapeKeydownBehavior={is('converting', 'downloading') ? 'ignore' : 'close'}
		interactOutsideBehavior={is('converting', 'downloading') ? 'ignore' : 'close'}>
		{#if is('upload')}
			<FileUpload {setFiles} />
		{:else if is('options')}
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

					<Button onclick={download} disabled={!is('done') || !output.some(Boolean)}>
						{#if is('downloading')}
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
