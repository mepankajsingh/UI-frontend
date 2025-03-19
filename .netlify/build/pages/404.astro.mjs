/* empty css                                 */
import { e as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_D-_fW65U.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Page Not Found - UI Library Directory" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="text-center"> <h1 class="text-3xl font-bold text-gray-900">404</h1> <p class="mt-2 text-lg text-gray-600">Page not found</p> <p class="mt-1 text-sm text-gray-500">The page you're looking for doesn't exist or has been moved.</p> <div class="mt-6"> <a href="/" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
Back to home
</a> </div> </div> </main> ` })}`;
}, "/home/project/src/pages/404.astro", void 0);

const $$file = "/home/project/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
