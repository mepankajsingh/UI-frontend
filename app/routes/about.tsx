import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageData } from "~/lib/supabase";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title || "About Us" },
    { name: "description", content: data?.meta_description || "Learn more about us" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pageData = await getPageData('about');
  
  return json({
    title: pageData?.title || "About Us",
    meta_description: pageData?.meta_description || "Learn more about our company and team",
    content: pageData?.content || "This is the about page content. Information about our company would go here."
  }, {
    headers: {
      // ISR configuration for Netlify
      "Cache-Control": "public, max-age=60, s-maxage=60"
    }
  });
};

export default function About() {
  const { title, content } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">{title}</h1>
        <div className="prose dark:prose-invert lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
