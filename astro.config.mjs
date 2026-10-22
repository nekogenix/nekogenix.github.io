import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://nekogenix.github.io',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
