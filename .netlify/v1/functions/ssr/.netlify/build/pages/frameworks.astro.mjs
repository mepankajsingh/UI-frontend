/* empty css                                 */
import { e as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_D-_fW65U.mjs';
import { $ as $$FrameworkCard } from '../chunks/FrameworkCard_BQGcWS77.mjs';
import { s as supabase } from '../chunks/supabase_B_9mllgZ.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: frameworks } = await supabase.from("frameworks").select("*").order("name");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "UI Frameworks - UI Library Directory" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <div class="mb-6"> <h1 class="text-2xl font-bold text-gray-900">UI Frameworks</h1> <p class="mt-2 text-sm text-gray-600">
Browse UI component libraries by framework
</p> </div> ${frameworks && frameworks.length > 0 ? renderTemplate`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"> ${frameworks.map((framework) => renderTemplate`${renderComponent($$result2, "FrameworkCard", $$FrameworkCard, { "framework": framework })}`)} </div>` : renderTemplate`<div class="text-center py-8"> <p class="text-gray-500">No frameworks found</p> <a href="/" class="inline-flex items-center px-3 py-1.5 mt-4 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
Back to home
</a> </div>`} </main> ` })}`;
}, "/home/project/src/pages/frameworks/index.astro", void 0);

const $$file = "/home/project/src/pages/frameworks/index.astro";
const $$url = "/frameworks";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
