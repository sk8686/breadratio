import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://breadratio.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});