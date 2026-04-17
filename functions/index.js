// Entry point for Cloudflare Pages Functions
// This file is required when using site.entry-point configuration
// Routes are handled by file-based routing in functions/api/

export default {
  async fetch(request, env, ctx) {
    // Default response for root path
    const url = new URL(request.url);
    if (url.pathname === '/') {
      // Let static assets handle this
      return new Response('Mission Control API', { status: 200 });
    }
    // For API routes, they should be caught by file-based routing
    return new Response('Not Found', { status: 404 });
  }
};