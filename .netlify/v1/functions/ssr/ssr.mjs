import createSSRHandler from './.netlify/build/entry.mjs';
				export default createSSRHandler({"cacheOnDemandPages":true});
				export const config = {
					includedFiles: ['**/*'],
					name: 'Astro SSR',
					nodeBundler: 'none',
					generator: '@astrojs/netlify@6.2.3',
					path: '/*',
					preferStatic: true,
				};
