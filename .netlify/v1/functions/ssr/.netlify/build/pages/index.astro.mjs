/* empty css                                 */
import { e as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_D-_fW65U.mjs';
import { $ as $$FrameworkCard } from '../chunks/FrameworkCard_BQGcWS77.mjs';
import { $ as $$LibraryCard } from '../chunks/LibraryCard_DH-PBG8O.mjs';
import { s as supabase } from '../chunks/supabase_B_9mllgZ.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: frameworks } = await supabase.from("frameworks").select("*").order("name").limit(6);
  const { data: libraries } = await supabase.from("libraries").select(`
    *,
    frameworks:library_frameworks(framework_id(id, name, slug), is_primary),
    tags:library_tags(tag_id(id, name, slug))
  `).order("github_stars", { ascending: false }).limit(6);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "UI Library Directory - Find the Best UI Components for Your Project" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Hero section --> <div class="bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14"> <div class="text-center"> <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
UI Library Directory
</h1> <p class="mt-2 max-w-md mx-auto text-xs text-gray-600 sm:text-sm md:mt-4 md:text-base md:max-w-3xl">
Find the perfect UI component library for your next JavaScript project
</p> <div class="mt-6 flex justify-center gap-3"> <a href="/libraries" class="inline-flex items-center px-4 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
Browse Libraries
</a> <a href="/search" class="inline-flex items-center px-4 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
Search
</a> </div> </div> </div> </div> <!-- Frameworks section --> <div class="bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"> <div class="mb-6 flex justify-between items-center"> <h2 class="text-lg font-bold text-gray-900">Popular Frameworks</h2> <a href="/frameworks" class="text-indigo-600 hover:text-indigo-500 font-medium text-xs">
View all frameworks →
</a> </div> ${frameworks && frameworks.length > 0 ? renderTemplate`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"> ${frameworks.map((framework) => renderTemplate`${renderComponent($$result2, "FrameworkCard", $$FrameworkCard, { "framework": framework })}`)} </div>` : renderTemplate`<div class="text-center py-6"> <p class="text-gray-500 text-xs">Loading frameworks...</p> </div>`} </div> </div> <!-- Libraries section --> <div class="bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"> <div class="mb-6 flex justify-between items-center"> <h2 class="text-lg font-bold text-gray-900">Popular Libraries</h2> <a href="/libraries" class="text-indigo-600 hover:text-indigo-500 font-medium text-xs">
View all libraries →
</a> </div> ${libraries && libraries.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"> ${libraries.map((library) => renderTemplate`${renderComponent($$result2, "LibraryCard", $$LibraryCard, { "library": library })}`)} </div>` : renderTemplate`<div class="text-center py-6"> <p class="text-gray-500 text-xs">Loading libraries...</p> </div>`} </div> </div> </main> ` })}`;
}, "/home/project/src/pages/index.astro", void 0);

const $$file = "/home/project/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
