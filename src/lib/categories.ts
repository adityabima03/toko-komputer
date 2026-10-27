import type { Category } from '#lib/types.js';

export type CategoryGroup = {
	name: string;
	categories: Category[];
};

/** Kategori datang sudah terurut; kelompok mengikuti urutan kemunculan. */
export function groupCategories(categories: Category[]): CategoryGroup[] {
	const groups: CategoryGroup[] = [];

	for (const category of categories) {
		const current = groups.at(-1);
		if (current?.name === category.groupName) current.categories.push(category);
		else groups.push({ name: category.groupName, categories: [category] });
	}

	return groups;
}
