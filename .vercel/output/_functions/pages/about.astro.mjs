import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNJSKm56.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Bbj_QSzu.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About", "description": "Meet Quinn, the expert behind AI Tool Guru's honest reviews" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-gradient-to-br from-blue-900 to-blue-600 text-white py-16 text-center"> <div class="max-w-4xl mx-auto px-4"> <h1 class="text-4xl md:text-5xl font-bold mb-4">About AI Tool Guru</h1> <p class="text-xl opacity-90 max-w-2xl mx-auto">Honest reviews from someone who's actually tested the tools</p> </div> </section> <section class="max-w-4xl mx-auto px-4 py-12"> <article class="prose lg:prose-xl mx-auto"> <h2>Who We Are</h2> <p>AI Tool Guru was founded in 2026 with a simple mission: cut through the marketing hype and give UK small business owners the straight truth about AI tools.</p> <p>We're not funded by venture capital. We're not owned by a big tech conglomerate. We're an independent site run by people who actually use these tools day in, day out.</p> <h2>Meet Quinn</h2> <p>Quinn leads our reviews and testing. With a background in digital marketing and small business operations, Quinn spends 40+ hours a month testing AI tools so you don't have to waste your money on software that doesn't deliver.</p> <p>Before starting AI Tool Guru, Quinn ran marketing for several UK SMEs and became frustrated with the gap between what AI tools promised and what they actually delivered. That frustration became this site.</p> <h2>Our Review Process</h2> <p>Every tool we review goes through the same rigorous process:</p> <ul> <li><strong>Hands-on testing</strong> for minimum 2 weeks with real business scenarios</li> <li><strong>Pricing verification</strong>, we check what you'll actually pay, not just the headline rate</li> <li><strong>User feedback analysis</strong> from G2, Trustpilot, Reddit, and customer support forums</li> <li><strong>Comparison testing</strong> against direct competitors in the same category</li> <li><strong>Long-term value assessment</strong>, will this tool still be worth it in 6 months?</li> </ul> <h2>Our Affiliate Policy</h2> <p>We participate in affiliate programmes for some of the tools we review. This means we may earn a commission if you purchase through our links.</p> <p>However, our reviews are never influenced by affiliate relationships. We regularly recommend tools with no affiliate programme when they're genuinely the best option. Our reputation depends on honesty, not commission rates.</p> <h2>Get In Touch</h2> <p>Have a tool you'd like us to review? Found an error in our pricing? Just want to say hello?</p> <p>Email us at: <a href="mailto:hello@aitoolguru.co.uk" class="text-blue-600 hover:underline">hello@aitoolguru.co.uk</a></p> <h2>Stay Updated</h2> <p>Subscribe to our newsletter for weekly AI tool reviews, exclusive deals, and early access to new guides.</p> <!-- Newsletter signup form will go here --> <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 my-6"> <p class="text-blue-800 font-semibold">📧 Newsletter coming soon</p> <p class="text-blue-600">Join 500+ UK business owners getting weekly AI tool reviews. Launching May 2026.</p> </div> </article> </section> ` })}`;
}, "/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/about.astro", void 0);

const $$file = "/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
