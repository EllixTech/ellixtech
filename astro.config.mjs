import {defineConfig} from 'astro/config';import mdx from '@astrojs/mdx';import sitemap from '@astrojs/sitemap';import tailwind from '@tailwindcss/vite';
export default defineConfig({site:'https://ellixtech.com',integrations:[mdx(),sitemap()],vite:{plugins:[tailwind()],server:{watch:{ignored:["**/.pnpm-store/**"]}}},markdown:{shikiConfig:{themes:{light:'github-light',dark:'github-dark'}}},devToolbar:{enabled:false}});

