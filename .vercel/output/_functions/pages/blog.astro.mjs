import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNJSKm56.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Bbj_QSzu.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reviews", "description": "Latest AI tool reviews for UK small businesses" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto px-4 py-12"> <h1>Latest Reviews</h1> <div class="article-card"> <h2><a href="/best-ai-writing-tools-uk-2026/">Best AI Writing Tools UK 2026</a></h2> <p class="date">April 2026</p> <p>From grammar checking to full content generation, the top AI writing assistants for UK content creators, marketers, and small businesses.</p> </div> <div class="article-card"> <h2><a href="/">Best AI Tools for Small Business UK 2026: The Complete Guide</a></h2> <p class="date">March 2026</p> <p>Discover the best AI tools for small business in the UK in 2026. Honest reviews, real pricing, and recommendations for marketing, productivity, customer service, and more.</p> </div> </section> ` })}`;
}, "/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/blog.astro", void 0);

const $$file = "/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
