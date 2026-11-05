# EllixTech

Independent technical publication built with Astro 5, Tailwind CSS 4, TypeScript, and MDX.

## Local development

Requires Node.js 22.12+ (Node 24 recommended) and npm.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4321. Use `npm run check` and `npm run build` to validate. `npm run preview` serves the production build.

## Writing

Add MDX files in `src/content/articles/`. Frontmatter requires title, description, date, category, tags, and minutes. Optional fields: lang (en/es), series, part, art (orbit/types/terminal). Dates are interpreted in UTC. Content is schema-validated during builds. Keep publication dates at or before release.

To add series chapters use the same series name and unique sequential part numbers. The article layout creates the contents list and previous/next navigation.

Import `YouTube` from `../../components/YouTube.astro` in MDX and use an 11-character video ID and descriptive title. Embeds use youtube-nocookie.com and lazy loading.

## Languages

Each article declares `lang: en` or `lang: es`; the HTML language and article date formatting follow it. Article IDs can use `es/` or `en/` subdirectories without changing routing. The navigation currently uses English; translate the shared layout when adding a full Spanish UI. No placeholder translation links are shown.

## GitHub Pages, after local approval

No deployment is required for local review. When approved, commit and push to main. In repository Settings → Pages, choose GitHub Actions. The workflow checks, builds, uploads, and deploys the static site.

`public/CNAME` and Astro's site URL use ellixtech.com. Configure the domain in GitHub Pages settings, verify ownership, and point your DNS at GitHub Pages using GitHub's current documentation. Enable HTTPS after DNS validation. If the default branch differs from main, update the workflow trigger.

The starter articles are editorial examples for reviewing layouts; review and replace them before publication. No newsletter service or analytics is connected. RSS works without a backend.
