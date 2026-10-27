import RiMacbookLine from 'remixicon-svelte/icons/macbook-line';
import RiComputerLine from 'remixicon-svelte/icons/computer-line';
import RiTv2Line from 'remixicon-svelte/icons/tv-2-line';
import RiCpuLine from 'remixicon-svelte/icons/cpu-line';
import RiArtboard2Line from 'remixicon-svelte/icons/artboard-2-line';
import RiRamLine from 'remixicon-svelte/icons/ram-line';
import RiDashboardLine from 'remixicon-svelte/icons/dashboard-line';
import RiHardDrive2Line from 'remixicon-svelte/icons/hard-drive-2-line';
import RiPlugLine from 'remixicon-svelte/icons/plug-line';
import RiTempColdLine from 'remixicon-svelte/icons/temp-cold-line';
import RiMouseLine from 'remixicon-svelte/icons/mouse-line';
import RiKeyboardLine from 'remixicon-svelte/icons/keyboard-line';
import RiHeadphoneLine from 'remixicon-svelte/icons/headphone-line';
import RiVolumeUpLine from 'remixicon-svelte/icons/volume-up-line';
import RiVidiconLine from 'remixicon-svelte/icons/vidicon-line';
import RiRouterLine from 'remixicon-svelte/icons/router-line';

const categoryIcons = {
	laptop: RiMacbookLine,
	'pc-rakitan': RiComputerLine,
	monitor: RiTv2Line,
	cpu: RiCpuLine,
	gpu: RiArtboard2Line,
	ram: RiRamLine,
	motherboard: RiDashboardLine,
	penyimpanan: RiHardDrive2Line,
	'power-supply': RiPlugLine,
	pendingin: RiTempColdLine,
	mouse: RiMouseLine,
	keyboard: RiKeyboardLine,
	headset: RiHeadphoneLine,
	earphone: RiVolumeUpLine,
	webcam: RiVidiconLine,
	jaringan: RiRouterLine
} as const;

export function categoryIcon(category: string) {
	return categoryIcons[category as keyof typeof categoryIcons] ?? RiComputerLine;
}
