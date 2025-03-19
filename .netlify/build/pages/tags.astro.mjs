/* empty css                                 */
import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate, i as renderComponent } from '../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_D-_fW65U.mjs';
import 'clsx';
import { s as supabase } from '../chunks/supabase_B_9mllgZ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$TagCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TagCard;
  const { tag } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/tags/${tag.slug}`, "href")} class="block group"> <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"> <h3 class="text-sm font-medium text-gray-900 group-hover:text-indigo-600"> ${tag.name} </h3> ${tag.count !== void 0 && renderTemplate`<p class="text-xs text-gray-500 mt-1"> ${tag.count} ${tag.count === 1 ? "library" : "libraries"} </p>`} </div> </a>`;
}, "/home/project/src/components/TagCard.astro", void 0);

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: tags } = await supabase.from("tags").select("*").order("name");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tags - UI Library Directory" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <div class="mb-6"> <h1 class="text-2xl font-bold text-gray-900">Tags</h1> <p class="mt-2 text-sm text-gray-600">
Browse UI component libraries by tag
</p> </div> ${tags && tags.length > 0 ? renderTemplate`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"> ${tags.map((tag) => renderTemplate`${renderComponent($$result2, "TagCard", $$TagCard, { "tag": tag })}`)} </div>` : renderTemplate`<div class="text-center py-8"> <p class="text-gray-500">No tags found</p> <a href="/" class="inline-flex items-center px-3 py-1.5 mt-4 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
Back to home
</a> </div>`} </main> ` })}`;
}, "/home/project/src/pages/tags/index.astro", void 0);

const $$file = "/home/project/src/pages/tags/index.astro";
const $$url = "/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
