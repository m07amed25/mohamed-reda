# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

For production, build with the public portfolio URL as the Vite base so social crawlers receive absolute Open Graph URLs. Replace the example URL with the deployment URL, including its trailing slash.

```sh
npm run build -- --base=https://portfolio.example/
```

## Contact form

The form posts to `/api/contact`. The server sends the inquiry to the configured Gmail address, with the visitor’s address as Reply-To, and emails the visitor a copy of their submission. Both emails have HTML and plain-text versions.

- **Local development:** Copy `.env.example` to `.env` and set `GMAIL_USER` and `GMAIL_APP_PASSWORD`. Use the Gmail address that owns the [Google App Password](https://support.google.com/accounts/answer/185833). Run `npm run dev`; Vite serves the form and API on the same port. `npm run preview` also serves the API locally.
- **Vercel:** Add the same two variables to the project’s server environment and redeploy. Keep the password out of Git and never prefix it with `VITE_`. The included Vercel Node function serves `/api/contact`; a static-only upload of `dist` will not serve the API.
- **Verification:** `npm test` checks form submissions and email rendering without contacting Gmail.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
