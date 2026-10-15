import RiMacbookLine from 'remixicon-svelte/icons/macbook-line';
import RiComputerLine from 'remixicon-svelte/icons/computer-line';
import RiCpuLine from 'remixicon-svelte/icons/cpu-line';
import RiTv2Line from 'remixicon-svelte/icons/tv-2-line';
import RiKeyboardLine from 'remixicon-svelte/icons/keyboard-line';
import RiRouterLine from 'remixicon-svelte/icons/router-line';

const categoryIcons = {
	laptop: RiMacbookLine,
	'pc-rakitan': RiComputerLine,
	komponen: RiCpuLine,
	monitor: RiTv2Line,
	aksesoris: RiKeyboardLine,
	jaringan: RiRouterLine
} as const;

export function categoryIcon(category: string) {
	return categoryIcons[category as keyof typeof categoryIcons] ?? RiComputerLine;
}
