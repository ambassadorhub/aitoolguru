import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_CNJSKm56.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Cb7bGxGD.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/bass/.openclaw/workspace/aitoolguru-site/","cacheDir":"file:///home/bass/.openclaw/workspace/aitoolguru-site/node_modules/.astro/","outDir":"file:///home/bass/.openclaw/workspace/aitoolguru-site/dist/","srcDir":"file:///home/bass/.openclaw/workspace/aitoolguru-site/src/","publicDir":"file:///home/bass/.openclaw/workspace/aitoolguru-site/public/","buildClientDir":"file:///home/bass/.openclaw/workspace/aitoolguru-site/dist/client/","buildServerDir":"file:///home/bass/.openclaw/workspace/aitoolguru-site/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.BY06_M-r.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.BY06_M-r.css"}],"routeData":{"route":"/best-ai-writing-tools-uk-2026","isIndex":false,"type":"page","pattern":"^\\/best-ai-writing-tools-uk-2026\\/?$","segments":[[{"content":"best-ai-writing-tools-uk-2026","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/best-ai-writing-tools-uk-2026.astro","pathname":"/best-ai-writing-tools-uk-2026","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.BY06_M-r.css"}],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.BY06_M-r.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://aitoolguru.co.uk","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/best-ai-writing-tools-uk-2026.astro",{"propagation":"none","containsHead":true}],["/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/blog.astro",{"propagation":"none","containsHead":true}],["/home/bass/.openclaw/workspace/aitoolguru-site/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/best-ai-writing-tools-uk-2026@_@astro":"pages/best-ai-writing-tools-uk-2026.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_pL062xTZ.mjs","/home/bass/.openclaw/workspace/aitoolguru-site/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_D1C1hJSj.mjs","/home/bass/.openclaw/workspace/aitoolguru-site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.BxweVtUr.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/bass/.openclaw/workspace/aitoolguru-site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","const a=document.querySelector(\".theme-toggle\"),c=document.querySelector(\".theme-icon\"),o=document.documentElement,r=localStorage.getItem(\"theme\")||\"light\";o.setAttribute(\"data-theme\",r);c.textContent=r===\"dark\"?\"☀️\":\"🌙\";a?.addEventListener(\"click\",()=>{const e=o.getAttribute(\"data-theme\")===\"dark\"?\"light\":\"dark\";o.setAttribute(\"data-theme\",e),localStorage.setItem(\"theme\",e),c.textContent=e===\"dark\"?\"☀️\":\"🌙\"});const n=document.querySelector(\".mobile-menu-toggle\"),l=document.querySelector(\".nav-links\");n?.addEventListener(\"click\",()=>{n.classList.toggle(\"active\"),l.classList.toggle(\"active\")});const i={threshold:.1,rootMargin:\"0px 0px -50px 0px\"},s=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting&&(e.target.classList.add(\"animate-in\"),s.unobserve(e.target))})},i);document.querySelectorAll(\".animate-on-scroll\").forEach(t=>{s.observe(t)});"]],"assets":["/_astro/about.BY06_M-r.css","/favicon.svg","/google4a6a9a3b5c8d2e1f.html","/og-image.svg","/robots.txt","/sitemap.xml"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"MMJZ/RjwARIlpbZjM2Ks53nmEaFIT1U6y54D+5UG1D8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
