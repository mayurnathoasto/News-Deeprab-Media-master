/**
 * JsonLd Component
 *
 * A server component for adding structured data to pages.
 * Unlike using next/script, this ensures the JSON-LD data is
 * rendered server-side and included in the initial HTML,
 * which is essential for SEO and search engine crawling.
 * 
 * Accepts any valid JSON-LD structure (object, array, or @graph format)
 */
// Accept both the specific SchemaJsonLdType and any valid JSON-LD structure
// This allows the component to work with schema markup from SEO settings API
export default function JsonLd({
  data,
}) {
  return (
    <script
      id="schema-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}