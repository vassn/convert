<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '../ui/button';

	let sunRef: HTMLSpanElement;
	let moonRef: HTMLSpanElement;

	function handleToggle() {
		sunRef.classList.add('light-switch-rotate-sun');
		sunRef.addEventListener('animationend', () => sunRef.classList.remove('light-switch-rotate-sun'), {
			once: true
		});

		moonRef.classList.add('light-switch-rotate-moon');
		moonRef.addEventListener('animationend', () => moonRef.classList.remove('light-switch-rotate-moon'), {
			once: true
		});

		toggleMode();
	}
</script>

<ModeWatcher defaultMode="dark" />

<Button variant="ghost" size="icon-lg" onclick={handleToggle}>
	<span bind:this={sunRef} class="hidden dark:block">
		<Sun class="size-5 sm:size-6" />
	</span>
	<span bind:this={moonRef} class="block dark:hidden">
		<Moon class="size-5 sm:size-6" />
	</span>
</Button>

<style>
	:global(.light-switch-rotate-moon) {
		animation: rotate-moon 200ms ease-in-out;
	}

	@keyframes rotate-moon {
		from {
			transform: rotate(90deg);
		}
		to {
			transform: rotate(0deg);
		}
	}

	:global(.light-switch-rotate-sun) {
		animation: rotate-sun 250ms ease-in-out;
	}

	@keyframes rotate-sun {
		from {
			transform: rotate(-90deg);
		}
		to {
			transform: rotate(0deg);
		}
	}
</style>
