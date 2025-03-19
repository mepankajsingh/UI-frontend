/* empty css                                 */
import { e as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_D-_fW65U.mjs';
import { $ as $$LibraryCard } from '../chunks/LibraryCard_DH-PBG8O.mjs';
import { s as supabase } from '../chunks/supabase_B_9mllgZ.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: libraries } = await supabase.from("libraries").select(`
    *,
    frameworks:library_frameworks(
      is_primary,
      framework_id(id, name, slug)
    ),
    tags:library_tags(tag_id(id, name, slug))
  `).order("name");
  const { data: frameworks } = await supabase.from("frameworks").select("id, name, slug").order("name");
  const { data: tags } = await supabase.from("tags").select("id, name, slug").order("name");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "UI Component Libraries" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <div class="mb-8"> <h1 class="text-2xl font-bold text-gray-900 mb-2">UI Component Libraries</h1> <p class="text-gray-600">
Discover the best UI component libraries for your next project.
</p> </div> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"> ${libraries && libraries.map((library) => renderTemplate`${renderComponent($$result2, "LibraryCard", $$LibraryCard, { "library": library })}`)} </div> ${(!libraries || libraries.length === 0) && renderTemplate`<div class="text-center py-12"> <p class="text-gray-500">No libraries found.</p> </div>`} </main> ` })}`;
}, "/home/project/src/pages/libraries/index.astro", void 0);

const $$file = "/home/project/src/pages/libraries/index.astro";
const $$url = "/libraries";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
