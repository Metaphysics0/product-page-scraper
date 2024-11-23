import { join } from 'path';
import type { Config } from 'tailwindcss';

import fluid, { extract, screens, fontSize } from 'fluid-tailwind';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: {
		files: [
			'./src/**/*.{html,js,svelte,ts}',
			// 3. Append the path to the Skeleton package
			join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
		],
		extract
	},
	theme: {
		screens,
		fontSize,
		extend: {}
	},
	plugins: [
		// 4. Append the Skeleton plugin (after other plugins)
		fluid,
		skeleton({
			themes: { preset: [{ name: 'modern', enhancements: true }] }
		})
	]
} satisfies Config;

export default config;
