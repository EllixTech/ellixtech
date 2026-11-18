import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    minutes: z.number(),
    lang: z.enum(['en', 'es']).default('en'),
    series: z.string().optional(),
    part: z.number().optional(),
    art: z.string().default('orbit'),
    author: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    sourceName: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});
export const collections = { articles };
