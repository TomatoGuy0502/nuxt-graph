<h1 align="center">
    Graph Theory Interactive Learning Platform
</h2>
<br>

<p align="center">
    <a href="https://graph-theory-tutorial.vercel.app/" target="_blank">
        <img src="https://i.imgur.com/ITzths5.png" alt="Landing Page Screenshot" width="600"/>
    </a>
</p>

<p align="center">
    Learn Graph Theory with interactive lessons and hands-on exercises.
</p>


## Tech Stack

- [Nuxt](https://nuxt.com/) - Progressive Vue.js framework
- [Nuxt Content](https://content.nuxtjs.org/) - File-based content management system within Nuxt
- [D3.js](https://d3js.org/) - A library for creating custom interactive data visualizations
- [VueUse](https://vueuse.org/) - Collection of Vue Composition Utilities
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Component library for Tailwind CSS
- [UnoCSS](https://unocss.dev/) - Providing pure CSS icons
- [Typescript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- [Vitest](https://vitest.dev/) - Unit testing powered by Vite
- [Vue Test Utils](https://test-utils.vuejs.org/) - Testing utility library for Vue.js
- [ESLint](https://eslint.org/) - A linting tool for identifying and fixing problematic patterns
- [Prettier](https://prettier.io/) - An opinionated code formatter
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager


## Run Locally

### Install
Clone the project, go to the project directory
```bash
git clone https://github.com/TomatoGuy0502/nuxt-graph
cd nuxt-graph
```

Install the dependencies
```bash
# pnpm
pnpm install

# npm
npm install

# yarn
yarn install
```

### Development
Start the development server on `http://localhost:3000`
```bash
pnpm run dev
```

### Testing
Testing the application
```bash
pnpm run test

# With coverage
pnpm run test --coverage.enabled
```

### Build
Build the application for production:
```bash
pnpm run generate
```

Locally preview production build:
```bash
pnpm run preview
```
## Project Structure

```
├── assets                  # All the assets that the build tool will process.
│   ├── css
│   └── svg
├── components              # Vue components
│   ├── content                 # Components that used in .md file
│   └── d3                      # Components that related to the graph
├── composables             # Vue composables
├── content                 # Files that will be read by Nuxt Content
│   ├── 1.basic
│   ├── 2.representation
│   └── 3.algorithm
├── layouts                 # Layout file for different pages
├── pages                   # All the pages(routes)
│   └── tutorial
│       ├── algorithm
│       ├── basic
│       └── representation
├── public                  # Contains public files(e.g. favicon.ico)
├── test
├── utils                   # Helper functions
├── app.vue                 # Main component of Nuxt 3 application
├── index.d.ts              # For typing custom page metadata
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Contains all the scripts and dependencies
├── prettier.config.js      # Prettier configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── uno.config.ts           # UnoCSS configuration
└── vitest.config.ts        # Vitest configuration
```
