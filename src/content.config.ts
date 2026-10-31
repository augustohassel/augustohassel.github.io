import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Augusto Hassel'),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Archivo / R'),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };

