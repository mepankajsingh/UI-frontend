/* empty css                                    */
import { e as createComponent, f as createAstro, m as maybeRenderHead, i as renderComponent, r as renderTemplate, h as addAttribute } from '../../chunks/astro/server_4wHZWm2f.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_D-_fW65U.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { s as supabase } from '../../chunks/supabase_B_9mllgZ.mjs';
import { $ as $$LibraryCard } from '../../chunks/LibraryCard_DH-PBG8O.mjs';
export { renderers } from '../../renderers.mjs';

// Function to get npm download stats for a package
async function getNpmDownloads(packageName) {
  if (!packageName) return null;
  
  try {
    // Calculate date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Format dates as YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    console.log(`Fetching npm stats for ${packageName} from ${formattedStartDate} to ${formattedEndDate}`);
    
    // Fetch download data from npm API
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${formattedStartDate}:${formattedEndDate}/${packageName}`
    );
    
    if (!response.ok) {
      console.error(`Error fetching npm stats: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Received npm stats for ${packageName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error in getNpmDownloads for ${packageName}:`, error);
    return null;
  }
}

// Function to calculate total downloads from npm data
function getTotalDownloads(downloadsData) {
  if (!downloadsData || !downloadsData.downloads || !Array.isArray(downloadsData.downloads)) {
    return 0;
  }
  
  return downloadsData.downloads.reduce((total, day) => total + day.downloads, 0);
}

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
function DownloadStatsChart({ packageName }) {
  const [downloadsData, setDownloadsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!packageName) {
        if (isMounted) {
          setLoading(false);
          setError("No package name provided");
        }
        return;
      }
      try {
        console.log(`Fetching download stats for package: ${packageName}`);
        if (isMounted) setLoading(true);
        const data = await getNpmDownloads(packageName);
        console.log(`Download data received for ${packageName}:`, data);
        if (isMounted && data && data.downloads && data.downloads.length > 0) {
          setDownloadsData(data);
          const labels = data.downloads.map((day) => {
            const date = new Date(day.day);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          });
          const downloads = data.downloads.map((day) => day.downloads);
          setChartData({
            labels,
            datasets: [
              {
                fill: true,
                label: `Downloads for ${packageName}`,
                data: downloads,
                borderColor: "rgb(75, 85, 99)",
                backgroundColor: "rgba(75, 85, 99, 0.1)",
                tension: 0.3,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 2
              }
            ]
          });
          setChartOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    const index = tooltipItems[0].dataIndex;
                    const date = new Date(data.downloads[index].day);
                    return date.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
                  },
                  label: (context) => {
                    return `Downloads: ${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              x: {
                display: true,
                ticks: {
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 7,
                  font: {
                    size: 8
                  }
                },
                grid: {
                  display: false
                }
              },
              y: {
                display: true,
                ticks: {
                  font: {
                    size: 8
                  },
                  callback: function(value) {
                    if (value >= 1e6) {
                      return (value / 1e6).toFixed(1) + "M";
                    }
                    if (value >= 1e3) {
                      return (value / 1e3).toFixed(0) + "k";
                    }
                    return value;
                  }
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.05)"
                }
              }
            }
          });
          setLoading(false);
          setError(null);
        } else if (isMounted) {
          setError(`No data available for ${packageName}`);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching download stats for ${packageName}:`, err);
        if (isMounted) {
          setError(`Failed to load download statistics: ${err.message}`);
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [packageName]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-md p-3 h-40 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse text-gray-400", children: [
      "Loading stats for ",
      packageName,
      "..."
    ] }) });
  }
  if (error || !chartData) {
    return /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-md p-3 h-40 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: error || `No download data available for ${packageName}` }) });
  }
  const canRenderChart = typeof window !== "undefined" && chartData && chartOptions;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md p-3", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xs font-medium text-gray-700 mb-2", children: "Downloads (Last 30 Days)" }),
    /* @__PURE__ */ jsx("div", { className: "h-40", children: canRenderChart ? /* @__PURE__ */ jsx(Line, { data: chartData, options: chartOptions }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Preparing chart..." }) }) })
  ] });
}

const $$Astro$1 = createAstro();
const $$RelatedLibraries = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$RelatedLibraries;
  const { currentLibraryId, frameworkId, limit = 3 } = Astro2.props;
  const { data: relatedLibraries } = await supabase.from("library_frameworks").select(`
    library_id,
    libraries:library_id(
      *,
      frameworks:library_frameworks(
        is_primary,
        framework_id(id, name, slug)
      )
    )
  `).eq("framework_id", frameworkId).neq("library_id", currentLibraryId).order("libraries(npm_downloads)", { ascending: false }).order("libraries(last_update)", { ascending: false }).limit(limit);
  const libraries = relatedLibraries ? relatedLibraries.map((item) => item.libraries).filter((library) => library !== null) : [];
  return renderTemplate`${libraries.length > 0 && renderTemplate`${maybeRenderHead()}<div class="mt-8"><h2 class="text-lg font-medium text-gray-900 mb-4">Related Libraries</h2><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">${libraries.map((library) => renderTemplate`${renderComponent($$result, "LibraryCard", $$LibraryCard, { "library": library })}`)}</div></div>`}`;
}, "/home/project/src/components/RelatedLibraries.astro", void 0);

function ImageModal({ isOpen, imageUrl, alt, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs("div", { className: "relative max-w-full max-h-full", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity",
            onClick: onClose,
            children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imageUrl,
            alt,
            className: "max-h-[90vh] max-w-[90vw] object-contain",
            onClick: (e) => e.stopPropagation()
          }
        )
      ] })
    }
  );
}

function GalleryImage({ image, index, libraryName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const alt = image.alt || `${libraryName} screenshot ${index + 1}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "border border-gray-200 rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]",
        onClick: () => setIsModalOpen(true),
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image.url,
            alt,
            className: "w-full h-40 object-cover",
            onError: (e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      ImageModal,
      {
        isOpen: isModalOpen,
        imageUrl: image.url,
        alt,
        onClose: () => setIsModalOpen(false)
      }
    )
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: library } = await supabase.from("libraries").select(`
    *,
    frameworks:library_frameworks(
      is_primary,
      framework_id(id, name, slug)
    )
  `).eq("slug", slug).single();
  if (!library) {
    return Astro2.redirect("/404");
  }
  const imageUrl = library.icon_url || library.logo_url || "/favicon.svg";
  let galleryImages = [];
  if (library.gallery_images) {
    try {
      if (typeof library.gallery_images === "object") {
        galleryImages = Array.isArray(library.gallery_images) ? library.gallery_images : [];
      } else {
        galleryImages = JSON.parse(library.gallery_images);
      }
      if (galleryImages.length > 0 && typeof galleryImages[0] === "string") {
        galleryImages = galleryImages.map((url) => ({ url }));
      }
    } catch (error) {
      console.error("Error parsing gallery images:", error);
      galleryImages = [];
    }
  }
  if (library.npm_package_name) {
    const downloadsData = await getNpmDownloads(library.npm_package_name);
    getTotalDownloads(downloadsData);
  }
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
  const sortedFrameworks = library.frameworks ? [...library.frameworks].sort((a, b) => a.is_primary ? -1 : 1) : [];
  const primaryFramework = sortedFrameworks.length > 0 ? sortedFrameworks.find((fw) => fw.is_primary)?.framework_id : null;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${library.name} - UIriver` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> <div class="bg-white border border-gray-200 rounded-lg overflow-hidden"> <div class="p-6"> <div class="flex items-center mb-4"> <!-- Increased logo size --> <div class="w-16 h-16 flex items-center justify-center mr-4"> <img${addAttribute(imageUrl, "src")}${addAttribute(`${library.name} logo`, "alt")} class="max-w-full max-h-full object-contain" onerror="this.onerror=null; this.src='/favicon.svg';"> </div> <div> <h1 class="text-xl font-bold text-gray-900">${library.name}</h1> ${sortedFrameworks.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1 mt-1"> ${sortedFrameworks.map(({ framework_id }) => renderTemplate`<a${addAttribute(`/frameworks/${framework_id.slug}`, "href")} class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200"> ${framework_id.name} </a>`)} </div>`} </div> ${library.github_stars && renderTemplate`<div class="ml-auto flex items-center text-gray-600 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"></path> </svg> ${formatNumber(library.github_stars)} </div>`} </div> <p class="text-sm text-gray-600 mb-4">${library.description}</p> <!-- Enhanced Key metrics with smaller font size and removed "Updated" word --> <div class="flex flex-wrap gap-6 mb-6 bg-gray-50 p-4 rounded-lg"> ${library.total_components && renderTemplate`<div class="flex items-center text-gray-700 text-xs"> <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path> </svg> <span>${library.total_components} Components</span> </div>`} ${library.npm_downloads && renderTemplate`<div class="flex items-center text-gray-700 text-xs"> <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path> </svg> <span>${formatNumber(library.npm_downloads)} Downloads</span> </div>`} ${library.github_forks && renderTemplate`<div class="flex items-center text-gray-700 text-xs"> <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path> </svg> <span>${formatNumber(library.github_forks)} Forks</span> </div>`} ${library.last_update && renderTemplate`<div class="flex items-center text-gray-700 text-xs"> <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span>${new Date(library.last_update).toLocaleDateString()}</span> </div>`} ${library.latest_version && renderTemplate`<div class="flex items-center text-gray-700 text-xs"> <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> <span>v${library.latest_version}</span> </div>`} </div> <!-- Converted buttons to links with grey styling --> <div class="flex flex-wrap gap-3 mb-6"> ${library.website_url && renderTemplate`<a${addAttribute(library.website_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs text-gray-600 hover:text-gray-800 hover:underline"> <svg class="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path> </svg>
Website
</a>`} ${library.github_url && renderTemplate`<a${addAttribute(library.github_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs text-gray-600 hover:text-gray-800 hover:underline"> <svg class="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path> </svg>
GitHub
</a>`} ${library.npm_url && renderTemplate`<a${addAttribute(library.npm_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs text-gray-600 hover:text-gray-800 hover:underline"> <svg class="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path d="M0 0v24h24V0H0zm6.672 19.992H4.008V8.016h2.664v11.976zm6.672 0H10.68V8.016h2.664v11.976zm6.672 0h-4.008V8.016h4.008v11.976z"></path> </svg>
npm
</a>`} ${library.docs_url && renderTemplate`<a${addAttribute(library.docs_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs text-gray-600 hover:text-gray-800 hover:underline"> <svg class="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v5a2 2 0 0 0 2 2h5v9H6z"></path> </svg>
Documentation
</a>`} </div>  ${galleryImages.length > 0 && renderTemplate`<div class="mb-6"> <h2 class="text-sm font-medium text-gray-900 mb-3">Gallery</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> ${galleryImages.map((image, index) => renderTemplate`${renderComponent($$result2, "GalleryImage", GalleryImage, { "image": image, "index": index, "libraryName": library.name, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/project/src/components/GalleryImage.jsx", "client:component-export": "default" })}`)} </div> </div>`}  ${library.npm_package_name && renderTemplate`<div class="mb-6"> ${renderComponent($$result2, "DownloadStatsChart", DownloadStatsChart, { "packageName": library.npm_package_name, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/project/src/components/DownloadStatsChart.jsx", "client:component-export": "default" })} </div>`} </div>  <div class="p-6 pt-0"> <div class="flex flex-col md:flex-row gap-6 mb-6"> <div class="md:w-1/2"> <h2 class="text-sm font-medium text-gray-900 mb-3">Library Details</h2> <dl class="space-y-2"> ${library.pricing && renderTemplate`<div class="flex"> <dt class="text-xs w-32 font-medium text-gray-500">Pricing:</dt> <dd class="text-xs text-gray-700 capitalize">${library.pricing}</dd> </div>`} ${library.customization && renderTemplate`<div class="flex"> <dt class="text-xs w-32 font-medium text-gray-500">Customization:</dt> <dd class="text-xs text-gray-700 capitalize">${library.customization}</dd> </div>`} ${library.styling && renderTemplate`<div class="flex"> <dt class="text-xs w-32 font-medium text-gray-500">Styling:</dt> <dd class="text-xs text-gray-700 capitalize">${library.styling}</dd> </div>`} </dl> </div> ${library.installation_command && renderTemplate`<div class="md:w-1/2"> <h2 class="text-sm font-medium text-gray-900 mb-3">Installation</h2> <div class="bg-gray-50 rounded-md p-3 font-mono text-xs overflow-x-auto"> ${library.installation_command} </div> </div>`} </div> </div> </div>  ${primaryFramework && renderTemplate`${renderComponent($$result2, "RelatedLibraries", $$RelatedLibraries, { "currentLibraryId": library.id, "frameworkId": primaryFramework.id, "limit": 5 })}`} </main> ` })}`;
}, "/home/project/src/pages/libraries/[slug].astro", void 0);

const $$file = "/home/project/src/pages/libraries/[slug].astro";
const $$url = "/libraries/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
