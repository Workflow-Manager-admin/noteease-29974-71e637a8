// Fallback configuration file for older Node versions
/** @type {import('astro').AstroUserConfig} */
export default {
  server: {
    host: '0.0.0.0',
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  renderers: [],
  vite: {
    optimizeDeps: {
      exclude: [],
    },
    ssr: {
      external: [],
    },
  }
};
