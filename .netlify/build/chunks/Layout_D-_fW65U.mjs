import { e as createComponent, f as createAstro, h as addAttribute, j as renderScript, r as renderTemplate, m as maybeRenderHead, i as renderComponent, k as renderHead, l as renderSlot } from './astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                         */
import { useEffect } from 'react';
import NProgress from 'nprogress';

const $$Astro$2 = createAstro();
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/home/project/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/project/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav id="sidebar" class="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-md flex flex-col z-10" data-astro-cid-pux6a34n> <div class="p-4 border-b border-gray-800 flex items-center" data-astro-cid-pux6a34n> <a href="/" class="text-lg font-bold text-white" data-astro-cid-pux6a34n> <span class="text-indigo-400" data-astro-cid-pux6a34n><</span><span class="text-indigo-400" data-astro-cid-pux6a34n>/></span> <span class="ml-2" data-astro-cid-pux6a34n>UIriver</span> </a> </div> <div class="flex flex-col flex-grow p-4 space-y-2 overflow-y-auto" data-astro-cid-pux6a34n> <a href="/frameworks" class="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-md flex items-center" data-astro-cid-pux6a34n> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-pux6a34n> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" data-astro-cid-pux6a34n></path> </svg> <span class="text-xs" data-astro-cid-pux6a34n>Frameworks</span> </a> <a href="/libraries" class="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-md flex items-center" data-astro-cid-pux6a34n> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-pux6a34n> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" data-astro-cid-pux6a34n></path> </svg> <span class="text-xs" data-astro-cid-pux6a34n>Libraries</span> </a> <a href="/about" class="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-md flex items-center" data-astro-cid-pux6a34n> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-pux6a34n> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-pux6a34n></path> </svg> <span class="text-xs" data-astro-cid-pux6a34n>About</span> </a> </div> <div class="p-4 border-t border-gray-800" data-astro-cid-pux6a34n> <a href="/search" class="text-gray-300 hover:text-white p-2 rounded-md flex items-center" data-astro-cid-pux6a34n> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-pux6a34n> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-pux6a34n></path> </svg> <span class="text-xs" data-astro-cid-pux6a34n>Search</span> </a> </div> </nav> <!-- Mobile menu button --> <div class="fixed top-0 left-0 z-20 p-4 md:hidden" data-astro-cid-pux6a34n> <button id="mobile-menu-button" class="text-gray-800 hover:text-gray-600 focus:outline-none" data-astro-cid-pux6a34n> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-pux6a34n> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-pux6a34n></path> </svg> </button> </div> ${renderScript($$result, "/home/project/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")} `;
}, "/home/project/src/components/Navigation.astro", void 0);

const $$Astro$1 = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer${addAttribute(`bg-gray-50 border-t border-gray-200 ${Astro2.props.class || ""}`, "class")}> <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <!-- Logo and description --> <div> <div class="flex items-center"> <a href="/" class="text-lg font-bold text-gray-900"> <span class="text-indigo-600"><</span>UI<span class="text-indigo-600">/></span> UIriver
</a> </div> <p class="mt-4 text-xs text-gray-600">
Find the perfect UI component library for your next JavaScript project.
</p> </div> <!-- Quick links --> <div> <h3 class="text-xs font-semibold text-gray-900 tracking-wider uppercase">Resources</h3> <ul class="mt-4 space-y-2"> <li> <a href="/frameworks" class="text-xs text-gray-600 hover:text-indigo-600">
Frameworks
</a> </li> <li> <a href="/libraries" class="text-xs text-gray-600 hover:text-indigo-600">
Libraries
</a> </li> <li> <a href="/search" class="text-xs text-gray-600 hover:text-indigo-600">
Search
</a> </li> </ul> </div> <!-- About and contact --> <div> <h3 class="text-xs font-semibold text-gray-900 tracking-wider uppercase">Company</h3> <ul class="mt-4 space-y-2"> <li> <a href="/about" class="text-xs text-gray-600 hover:text-indigo-600">
About Us
</a> </li> <li> <a href="/contact" class="text-xs text-gray-600 hover:text-indigo-600">
Contact
</a> </li> </ul> </div> </div> <div class="mt-8 pt-8 border-t border-gray-200"> <p class="text-center text-xs text-gray-500">
&copy; ${currentYear} UIriver. All rights reserved.
</p> </div> </div> </footer>`;
}, "/home/project/src/components/Footer.astro", void 0);

function LoadingBar() {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: "ease",
      speed: 500
    });
    document.addEventListener("astro:page-load", () => {
      NProgress.done();
    });
    document.addEventListener("astro:before-preparation", () => {
      NProgress.start();
    });
    document.addEventListener("astro:after-preparation", () => {
      NProgress.set(0.4);
    });
    document.addEventListener("astro:after-swap", () => {
      NProgress.set(0.8);
    });
    return () => {
      NProgress.done();
      document.removeEventListener("astro:page-load", () => {
        NProgress.done();
      });
      document.removeEventListener("astro:before-preparation", () => {
        NProgress.start();
      });
      document.removeEventListener("astro:after-preparation", () => {
        NProgress.set(0.4);
      });
      document.removeEventListener("astro:after-swap", () => {
        NProgress.set(0.8);
      });
    };
  }, []);
  return null;
}

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" class="bg-white"> <head><meta charset="UTF-8"><meta name="description" content="Find the perfect UI component library for your next JavaScript project"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/nprogress.css"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} | UIriver</title>${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})}${renderHead()}</head> <body class="bg-white min-h-screen flex flex-col text-base"> ${renderComponent($$result, "LoadingBar", LoadingBar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/project/src/components/LoadingBar.jsx", "client:component-export": "default" })} ${renderComponent($$result, "Navigation", $$Navigation, {})} <div id="content" class="flex-grow md:ml-64 transition-all duration-300"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "Footer", $$Footer, { "id": "footer", "class": "md:ml-64 transition-all duration-300" })} </body></html>`;
}, "/home/project/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
