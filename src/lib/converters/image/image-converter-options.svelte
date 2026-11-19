<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Input } from '$lib/components/ui/input';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { CircleQuestionMark } from '@lucide/svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import type { Options } from './utils';

	const MB = 1_000_000;

	const formats: { value: Options['format']; label: string }[] = [
		{ value: 'jpeg', label: 'JPEG' },
		{ value: 'png', label: 'PNG' },
		{ value: 'webp', label: 'WebP' }
	];

	let selectedFormat = $state<Options['format']>('jpeg');
	let sizeLimitMb = $state('');
	let jpegBgColor = $state<string | undefined>(undefined);

	const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

	const maskHex = (raw: string) => {
		const digits = raw
			.replace(/[^0-9a-f]/gi, '')
			.slice(0, 6)
			.toUpperCase();
		if (digits) return `#${digits}`;
		return raw.trim().startsWith('#') ? '#' : '';
	};

	const maskDecimal = (raw: string) => {
		const cleaned = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '');
		const [whole, ...rest] = cleaned.split('.');
		if (rest.length === 0) return whole.slice(0, 4);
		return `${whole.slice(0, 4)}.${rest.join('').slice(0, 2)}`;
	};

	const parseSizeLimit = (raw: string): number | undefined => {
		const mb = Number(raw);
		return raw && Number.isFinite(mb) && mb > 0 ? Math.round(mb * MB) : undefined;
	};

	export const getValues = (): Options => ({
		format: selectedFormat,
		bgColor: selectedFormat === 'jpeg' && jpegBgColor && HEX.test(jpegBgColor) ? jpegBgColor : undefined,
		targetBytes: selectedFormat === 'png' ? undefined : parseSizeLimit(sizeLimitMb)
	});
</script>

{#snippet infoTrigger()}
	<HoverCard.Trigger>
		{#snippet child({ props })}
			<button type="button" aria-label="More info" {...props}>
				<CircleQuestionMark class="size-4" />
			</button>
		{/snippet}
	</HoverCard.Trigger>
{/snippet}

{#snippet bgColorInfo()}
	<HoverCard.Root openDelay={200} closeDelay={50}>
		{@render infoTrigger()}
		<HoverCard.Content side="top" class="text-xs text-muted-foreground">
			<p>The solid HEX color used to replace transparent areas during conversion.</p>
		</HoverCard.Content>
	</HoverCard.Root>
{/snippet}

{#snippet sizeLimitInfo()}
	<HoverCard.Root openDelay={200} closeDelay={50}>
		{@render infoTrigger()}
		<HoverCard.Content side="top" class="space-y-2 text-xs text-muted-foreground">
			<p>The largest file size allowed for each converted image. Leave empty for no limit.</p>
		</HoverCard.Content>
	</HoverCard.Root>
{/snippet}

<Field.Group class="w-full">
	<Field.Set>
		<Field.Legend variant="label">Export format</Field.Legend>
		<Field.Description>Select the format you want your images converted into.</Field.Description>

		<RadioGroup.Root
			bind:value={selectedFormat}
			onValueChange={() => (sizeLimitMb = '')}
			class="grid grid-cols-2 gap-2 sm:grid-cols-3">
			{#each formats as format (format.value)}
				<Field.Label for="format-{format.value}">
					<Field.Field orientation="horizontal">
						<RadioGroup.Item value={format.value} id="format-{format.value}" />
						<Field.Content>
							<Field.Title>{format.label}</Field.Title>
						</Field.Content>
					</Field.Field>
				</Field.Label>
			{/each}
		</RadioGroup.Root>
	</Field.Set>

	<Field.Set>
		{#key selectedFormat}
			<div in:fly={{ duration: 300, y: 12, easing: cubicInOut }}>
				<Field.Group class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#if selectedFormat === 'png'}
						<Field.Field class="w-full">
							<Field.Label for="quality">Export quality</Field.Label>
							<Input id="quality" value="Lossless" disabled />
						</Field.Field>

						<Field.Field class="w-full">
							<Field.Label for="bg-color">Background color</Field.Label>
							<Input id="bg-color" value="Transparent" disabled />
						</Field.Field>
					{:else}
						<Field.Field class="w-full">
							<Field.Label for="size-limit">Maximum file size {@render sizeLimitInfo()}</Field.Label>
							<InputGroup.Root>
								<InputGroup.Input
									id="size-limit"
									type="text"
									inputmode="decimal"
									placeholder="No limit"
									autocomplete="off"
									spellcheck="false"
									aria-invalid={!!sizeLimitMb && parseSizeLimit(sizeLimitMb) === undefined}
									value={sizeLimitMb}
									oninput={(e) => {
										const masked = maskDecimal(e.currentTarget.value);
										e.currentTarget.value = masked;
										sizeLimitMb = masked;
									}} />
								<InputGroup.Addon align="inline-end">MB</InputGroup.Addon>
							</InputGroup.Root>
						</Field.Field>

						{#if selectedFormat === 'jpeg'}
							<Field.Field class="w-full">
								<Field.Label for="bg-color">Background color {@render bgColorInfo()}</Field.Label>
								<Input
									id="bg-color"
									type="text"
									placeholder="#FFFFFF"
									maxlength={7}
									autocomplete="off"
									spellcheck="false"
									aria-invalid={!!jpegBgColor && !HEX.test(jpegBgColor)}
									value={jpegBgColor}
									oninput={(e) => {
										const masked = maskHex(e.currentTarget.value);
										e.currentTarget.value = masked;
										jpegBgColor = masked;
									}} />
							</Field.Field>
						{:else}
							<Field.Field class="w-full">
								<Field.Label for="bg-color">Background color</Field.Label>
								<Input id="bg-color" value="Transparent" disabled />
							</Field.Field>
						{/if}
					{/if}
				</Field.Group>
			</div>
		{/key}
	</Field.Set>
</Field.Group>
