<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import RiSunLine from 'remixicon-svelte/icons/sun-line';
	import RiMoonLine from 'remixicon-svelte/icons/moon-line';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<Button variant="ghost" size="icon" onclick={toggleMode} aria-label="Ganti tema">
	<RiSunLine class="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
	<RiMoonLine class="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
</Button>
