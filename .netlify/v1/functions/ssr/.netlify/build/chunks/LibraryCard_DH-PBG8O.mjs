import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';

const $$Astro = createAstro();
const $$LibraryCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LibraryCard;
  const { library } = Astro2.props;
  function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "k";
    }
    return num.toString();
  }
  const primaryFramework = library.frameworks?.find((fw) => fw.is_primary)?.framework_id;
  const imageUrl = library.icon_url || library.logo_url || "/favicon.svg";
  return renderTemplate`${maybeRenderHead()}<div class="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"> <a${addAttribute(`/libraries/${library.slug}`, "href")} class="block group"> <div class="p-4 flex flex-col items-center"> <div class="w-12 h-12 flex items-center justify-center mb-3"> <img${addAttribute(imageUrl, "src")}${addAttribute(`${library.name} logo`, "alt")} class="max-w-full max-h-full object-contain" onerror="this.onerror=null; this.src='/favicon.svg';"> </div> <h3 class="text-sm font-medium text-gray-900 text-center group-hover:text-indigo-600 mb-1"> ${library.name} </h3>  ${primaryFramework && renderTemplate`<div class="text-xs text-gray-500 text-center"> ${primaryFramework.name} </div>`} </div> </a>  <div class="px-4 pb-4 flex items-center justify-center space-x-4 text-xs text-gray-500">  ${library.total_components && renderTemplate`<div class="flex items-center group relative"> <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path> </svg> <span>${formatNumber(library.total_components)}</span> <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-indigo-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-medium"> <div class="absolute w-3 h-3 bg-indigo-700 transform rotate-45 -bottom-1 left-1/2 -ml-1.5"></div> ${library.total_components.toLocaleString()} Components
</div> </div>`}  ${library.npm_downloads && renderTemplate`<div class="flex items-center group relative"> <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path> </svg> <span>${formatNumber(library.npm_downloads)}</span> <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-indigo-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-medium"> <div class="absolute w-3 h-3 bg-indigo-700 transform rotate-45 -bottom-1 left-1/2 -ml-1.5"></div> ${library.npm_downloads.toLocaleString()} Downloads
</div> </div>`}  ${library.github_forks && renderTemplate`<div class="flex items-center group relative"> <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path> </svg> <span>${formatNumber(library.github_forks)}</span> <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-indigo-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-medium"> <div class="absolute w-3 h-3 bg-indigo-700 transform rotate-45 -bottom-1 left-1/2 -ml-1.5"></div> ${library.github_forks.toLocaleString()} Forks
</div> </div>`} </div> </div>`;
}, "/home/project/src/components/LibraryCard.astro", void 0);

export { $$LibraryCard as $ };
