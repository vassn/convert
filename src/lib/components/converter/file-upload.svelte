<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Empty from '$lib/components/ui/empty';
	import { CloudUpload, FolderSearch } from '@lucide/svelte';

	let { setFiles }: { setFiles: (files: File[]) => void } = $props();

	let isDragged = $state(false);
	let fileInput: HTMLInputElement;

	const handleDragover = (event: DragEvent) => {
		event.preventDefault();
		isDragged = true;
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragged = false;
		if (event.dataTransfer?.files?.length) {
			setFiles(Array.from(event.dataTransfer.files));
		}
	};

	const handleFileInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files?.length) {
			setFiles(Array.from(target.files));
			target.value = '';
		}
	};
</script>

<Empty.Root
	class={['border-2 border-dashed duration-200', isDragged && 'border-muted-foreground']}
	ondragover={handleDragover}
	ondragleave={() => (isDragged = false)}
	ondrop={handleDrop}>
	<Empty.Header>
		<Empty.Media variant="icon">
			<CloudUpload />
		</Empty.Media>
		<Empty.Title>Upload Files</Empty.Title>
		<Empty.Description>Drag and drop or browse.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button size="sm" onclick={() => fileInput.click()}>
			<FolderSearch /> Browse Files
		</Button>
	</Empty.Content>
</Empty.Root>

<input type="file" hidden multiple bind:this={fileInput} onchange={handleFileInput} />
