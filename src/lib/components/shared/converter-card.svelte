<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Props = { title: string; Icon: typeof ArrowRight; children: Snippet };

	let { title, Icon, children }: Props = $props();
</script>

<div
	class="group flex w-full flex-col justify-between rounded-lg border border-b-2 px-8 py-6 shadow-lg
	duration-200 select-none hover:border-b-primary">
	<div class="mb-6 space-y-4">
		<div class="flex items-center gap-4">
			<div class="w-fit rounded-lg border bg-card p-2 shadow-md"><Icon /></div>
			<h2 class="text-start text-3xl font-semibold tracking-tight">{title}</h2>
		</div>

		<div class="space-y-2 text-start">
			{@render children()}
		</div>
	</div>

	<div class="flex items-center gap-1.5 text-sm text-muted-foreground">
		<span>Click to begin</span>
		<ArrowRight class="size-3.5 duration-200 group-hover:ms-2" />
	</div>
</div>
