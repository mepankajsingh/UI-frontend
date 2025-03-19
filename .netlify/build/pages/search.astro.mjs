/* empty css                                 */
import { e as createComponent, f as createAstro, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_D-_fW65U.mjs';
import { $ as $$LibraryCard } from '../chunks/LibraryCard_DH-PBG8O.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from '../chunks/supabase_B_9mllgZ.mjs';
export { renderers } from '../renderers.mjs';

function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Search for UI libraries...",
          className: "w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm",
          "aria-label": "Search query"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          children: "Search"
        }
      )
    ] }),
    !initialQuery && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Try searching for library names, features, or frameworks" })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  const query = Astro2.url.searchParams.get("q") || "";
  let libraries = [];
  if (query) {
    const { data } = await supabase.from("libraries").select(`
      *,
      frameworks:library_frameworks(framework_id(id, name, slug), is_primary),
      tags:library_tags(tag_id(id, name, slug))
    `).or(`name.ilike.%${query}%, description.ilike.%${query}%`).order("github_stars", { ascending: false });
    libraries = data || [];
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": query ? `Search results for "${query}" - UI Library Directory` : "Search - UI Library Directory" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Hero section --> <div class="bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <h1 class="text-2xl font-bold text-gray-900 mb-4">Search UI Libraries</h1> <div class="max-w-2xl"> ${renderComponent($$result2, "SearchBar", SearchBar, { "initialQuery": query, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/project/src/components/SearchBar.jsx", "client:component-export": "default" })} </div> </div> </div> <!-- Results section --> ${query && renderTemplate`<div class="bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <h2 class="text-xl font-semibold text-gray-900 mb-4"> ${libraries.length > 0 ? `Found ${libraries.length} ${libraries.length === 1 ? "result" : "results"} for "${query}"` : `No results found for "${query}"`} </h2> ${libraries.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${libraries.map((library) => renderTemplate`${renderComponent($$result2, "LibraryCard", $$LibraryCard, { "library": library })}`)} </div>` : renderTemplate`<div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"> <p class="text-gray-600 mb-4">
We couldn't find any libraries matching your search. Try:
</p> <ul class="list-disc pl-5 text-gray-600 space-y-1"> <li>Using different keywords</li> <li>Checking for typos</li> <li>Using more general terms</li> <li>Browsing libraries by <a href="/frameworks" class="text-indigo-600 hover:text-indigo-500">framework</a> instead</li> </ul> </div>`} </div> </div>`} ${!query && renderTemplate`<div class="bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"> <h3 class="text-lg font-medium text-gray-900 mb-2">Search Tips</h3> <ul class="list-disc pl-5 text-gray-600 space-y-1"> <li>Search by library name (e.g., "Material UI", "Chakra")</li> <li>Search by feature (e.g., "datepicker", "dropdown")</li> <li>Search by framework (e.g., "React", "Vue")</li> <li>Search by category (e.g., "form", "layout")</li> </ul> <div class="mt-4 pt-4 border-t border-gray-100"> <p class="text-gray-600">
Not sure what to search for? Browse libraries by <a href="/frameworks" class="text-indigo-600 hover:text-indigo-500">framework</a> or <a href="/tags" class="text-indigo-600 hover:text-indigo-500">tag</a> instead.
</p> </div> </div> </div> </div>`} </main> ` })}`;
}, "/home/project/src/pages/search.astro", void 0);

const $$file = "/home/project/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
