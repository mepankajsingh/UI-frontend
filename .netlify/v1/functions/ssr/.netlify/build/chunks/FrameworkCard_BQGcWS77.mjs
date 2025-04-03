import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';

const $$Astro = createAstro();
const $$FrameworkCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FrameworkCard;
  const { framework } = Astro2.props;
  const imageUrl = framework.icon_url || framework.logo_url || "/favicon.svg";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/frameworks/${framework.slug}`, "href")} class="block group"> <div class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow duration-200"> <div class="w-12 h-12 flex items-center justify-center mb-3"> <img${addAttribute(imageUrl, "src")}${addAttribute(`${framework.name} logo`, "alt")} class="max-w-full max-h-full object-contain" onerror="this.onerror=null; this.src='/favicon.svg';"> </div> <h3 class="text-sm font-medium text-gray-900 text-center group-hover:text-indigo-600"> ${framework.name} </h3> </div> </a>`;
}, "/home/project/src/components/FrameworkCard.astro", void 0);

export { $$FrameworkCard as $ };
