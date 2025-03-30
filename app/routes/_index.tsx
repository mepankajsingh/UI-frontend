import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageData } from "~/lib/supabase";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title || "Home Page" },
    { name: "description", content: data?.meta_description || "Welcome to our website" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pageData = await getPageData('home');
  
  return json({
    title: pageData?.title || "Welcome to our Home Page",
    meta_description: pageData?.meta_description || "This is the home page of our website",
    content: pageData?.content || "Welcome to our website! This is the home page content."
  }, {
    headers: {
      // ISR configuration for Netlify
      "Cache-Control": "public, max-age=60, s-maxage=60"
    }
  });
};

export default function Index() {
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
