// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://datasci.davidson.edu',
  base: '/datacats/',
  integrations: [svelte(), icon(), mdx()],

  vite: {
    plugins: [tailwindcss()]
  }
});