/* empty css                                    */
import { e as createComponent, f as createAstro, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_D-_fW65U.mjs';
import { $ as $$LibraryCard } from '../../chunks/LibraryCard_DH-PBG8O.mjs';
import { s as supabase } from '../../chunks/supabase_B_9mllgZ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: tag } = await supabase.from("tags").select("*").eq("slug", slug).single();
  if (!tag) {
    return Astro2.redirect("/404");
  }
  const { data: libraries } = await supabase.from("library_tags").select(`
    library:library_id(
      *,
      frameworks:library_frameworks(framework_id(id, name, slug), is_primary),
      tags:library_tags(tag_id(id, name, slug))
    )
  `).eq("tag_id", tag.id);
  const librariesData = libraries?.map((item) => item.library).filter(Boolean) || [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${tag.name} UI Libraries - UI Library Directory` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="mb-6"> <h1 class="text-2xl font-bold text-gray-900 mb-2"> <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2"> ${tag.name} </span>
UI Libraries
</h1> <p class="text-sm text-gray-600">
Component libraries and design systems tagged with "${tag.name}"
</p> </div> ${librariesData && librariesData.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${librariesData.map((library) => renderTemplate`${renderComponent($$result2, "LibraryCard", $$LibraryCard, { "library": library })}`)} </div>` : renderTemplate`<div class="text-center py-8 bg-white border border-gray-200 rounded-lg"> <h3 class="text-base font-medium text-gray-900 mb-1">No libraries found</h3> <p class="text-sm text-gray-500">
We don't have any component libraries tagged with "${tag.name}" yet.
</p> </div>`} </main> ` })}`;
}, "/home/project/src/pages/tags/[slug].astro", void 0);

const $$file = "/home/project/src/pages/tags/[slug].astro";
const $$url = "/tags/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
