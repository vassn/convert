<script lang="ts">
	import { CircleCheck } from '@lucide/svelte';
	import { Spinner } from '../ui/spinner';

	let { input, output }: { input: File[]; output: (File | null)[] } = $props();
</script>

<div class="mb-3 font-medium">Conversion progress</div>

<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
	<div class="flex-none">
		{#if input.length === output.length}
			<CircleCheck class="size-4 text-foreground" />
		{:else}
			<Spinner class="size-4 text-foreground" />
		{/if}
	</div>
	<div class="line-clamp-1 flex-1 wrap-anywhere">
		{#if input.length === output.length}
			Conversion finished
		{:else}
			{input[Math.min(input.length - 1, output.length)].name}
		{/if}
	</div>
	<div class="flex-none text-muted-foreground tabular-nums">
		{Math.min(output.length + 1, input.length)} / {input.length}
	</div>
</div>
