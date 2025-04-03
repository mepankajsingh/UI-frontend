import { renderers } from './renderers.mjs';
import { a as actions } from './chunks/_noop-actions_CfKMStZn.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_B0dsn2Fa.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/contact.astro.mjs');
const _page4 = () => import('./pages/frameworks/_slug_.astro.mjs');
const _page5 = () => import('./pages/frameworks.astro.mjs');
const _page6 = () => import('./pages/libraries/_slug_.astro.mjs');
const _page7 = () => import('./pages/libraries.astro.mjs');
const _page8 = () => import('./pages/search.astro.mjs');
const _page9 = () => import('./pages/tags/_slug_.astro.mjs');
const _page10 = () => import('./pages/tags.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/contact.astro", _page3],
    ["src/pages/frameworks/[slug].astro", _page4],
    ["src/pages/frameworks/index.astro", _page5],
    ["src/pages/libraries/[slug].astro", _page6],
    ["src/pages/libraries/index.astro", _page7],
    ["src/pages/search.astro", _page8],
    ["src/pages/tags/[slug].astro", _page9],
    ["src/pages/tags/index.astro", _page10],
    ["src/pages/index.astro", _page11]
]);
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions,
    middleware: undefined
});
const _args = {
    "middlewareSecret": "d148b3fb-b359-4926-9c02-c41baceb5eb9"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
