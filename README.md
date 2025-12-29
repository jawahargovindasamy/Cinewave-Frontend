# CineWave Frontend

A modern, high-performance movie and TV discovery web app built with Vite + React. CineWave integrates with a media API to provide search, browsing, detailed overviews, trailers, cast info, and watchlists with a responsive UI designed for speed.


## Key Features

- Fast Vite + React setup with code-splitting and optimized builds
- Browse trending movies and TV series, genres, and similar titles
- Rich media detail pages: posters, backdrops, titles, genres, cast, trailers, and episode lists
- Smart search with pagination
- Auth context wired for login/register and password reset flows
- Personal watchlist page scaffold
- Reusable UI components and skeleton loaders
- Netlify-ready deployment (includes netlify.toml and _redirects for SPA routing)
- Environment-configurable API access


## Tech Stack

- React 18, Vite, JSX
- Context API for auth state
- CSS modules and component-level CSS
- ESlint for linting
- Netlify for hosting


## Project Structure

```
Frontend/
├─ public/
│  ├─ _redirects                  # SPA routing for Netlify
│  └─ Logo svg.png
├─ src/
│  ├─ assets/                     # Static assets (images)
│  ├─ components/                 # Reusable UI components
│  │  ├─ overview/                # Overview detail page sections
│  │  ├─ CardSkeleton.jsx
│  │  ├─ Cast.jsx
│  │  ├─ Genre_Card.jsx
│  │  ├─ Hero.css
│  │  ├─ Hero.jsx
│  │  ├─ MediaCard.jsx
│  │  ├─ MovieCarousel.jsx
│  │  ├─ MovieHero.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ Overview.jsx
│  │  ├─ Pagination.jsx
│  │  ├─ SearchBar.jsx
│  │  ├─ SearchResult.jsx
│  │  ├─ Similar.jsx
│  │  ├─ TrailerPlayer.jsx
│  │  ├─ TVEpisodesSection.jsx
│  │  └─ VideoPlayer.jsx
│  ├─ context/
│  │  └─ AuthContext.jsx          # Auth provider and hooks
│  ├─ pages/                      # Route-level pages
│  │  ├─ ForgotPassword.jsx
│  │  ├─ Genres.jsx
│  │  ├─ Home.jsx
│  │  ├─ Login.jsx
│  │  ├─ Movie.jsx
│  │  ├─ MovieGenrePage.jsx
│  │  ├─ Person.jsx
│  │  ├─ Register.jsx
│  │  ├─ Search.jsx
│  │  ├─ Series.jsx
│  │  ├─ TVGenrePage.jsx
│  │  └─ Watchlist.jsx
│  ├─ services/
│  │  └─ api.js                   # API client and endpoints
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .env.example                    # Template for environment variables
├─ eslint.config.js
├─ index.html
├─ netlify.toml                    # Netlify configuration
├─ package.json
├─ vite.config.js
└─ README.md
```


## Prerequisites

- Node.js 18+ and npm 9+ (or pnpm/yarn)


## Getting Started

1. Install dependencies
   - npm: `npm install`

2. Configure environment variables
   - Copy `.env.example` to `.env` and fill the required keys (see next section)

3. Run the development server
   - `npm run dev`
   - Vite will start a dev server (defaults to http://localhost:5173)

4. Build for production
   - `npm run build`
   - Preview the build locally: `npm run preview`


## Environment Variables

Create a `.env` file at the project root based on `.env.example`.

Typical variables (example; check `.env.example` in repo):

- VITE_API_BASE_URL: Base URL of your media API (e.g., TMDB proxy or server)
- VITE_API_KEY: API key or token if required by the API
- VITE_IMAGE_BASE_URL: Base URL for poster/backdrop images

Because Vite exposes variables prefixed with VITE_, ensure all client-needed values use that prefix.


## Available Scripts

- `npm run dev` — Start dev server with HMR
- `npm run build` — Production build
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run linting (if configured in eslint.config.js)


## API Layer

The `src/services/api.js` module centralizes API calls. Configure the base URL and credentials via `.env`. Keep networking logic, interceptors, and shared helpers there. Example responsibilities:

- HTTP client configuration (base URL, headers)
- Endpoints: search, discover by genre, movie/TV details, credits, videos, similar, episodes
- Error handling and response shaping

Add new API methods here to keep components lean.


## Routing and Pages

This project uses standard React composition for route-level pages placed in `src/pages`. A typical router setup would live in `App.jsx` (Home, Search, Movie, Series, Genres, TV Genres, Person, Watchlist, Auth pages). Ensure your router handles unknown routes and redirects to `/` (handled by Netlify `_redirects` in production).


## State Management

- Authentication: `src/context/AuthContext.jsx` provides user state and related actions (login, register, logout, password reset). Components/pages consume this via context hooks.
- UI State: Components manage local UI state; for cross-component state beyond auth, lift state or introduce a lightweight store if needed.


## UI Components

- Layout: `Navbar.jsx`, `Hero.jsx`, and `MovieHero.jsx`
- Discovery: `MovieCarousel.jsx`, `Genre_Card.jsx`, `Similar.jsx`
- Details: Overview sections in `components/overview/*`, `Cast.jsx`, `TVEpisodesSection.jsx`
- Media: `TrailerPlayer.jsx`, `VideoPlayer.jsx`
- Utilities: `Pagination.jsx`, `SearchBar.jsx`, `SearchResult.jsx`, `CardSkeleton.jsx`, `OverviewSkeleton.jsx`

Use skeleton components to ensure perceived performance while data loads.


## Styling

- Global styles in `index.css` and `App.css`
- Component styles are colocated (e.g., `Hero.css`)
- Follow a mobile-first approach; ensure components are responsive


## Deployment (Netlify)

This repo includes Netlify configuration:

- `netlify.toml` — sets build and publish directories (defaults compatible with Vite) and headers if needed
- `public/_redirects` — ensures single-page app routes resolve to `index.html`

Deploy steps:

1. Push to a Git provider (GitHub/GitLab/Bitbucket)
2. Create a new Netlify site from your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify UI (same as `.env`)


## Coding Standards

- Use functional components and hooks
- Keep components small and focused
- Co-locate tests (if/when added) next to components
- Prefer composition over prop drilling (use context selectively)
- Keep API calls inside `services/api.js`


## Troubleshooting

- Blank page after deploy: Ensure `_redirects` is present and publish directory is `dist`
- 401/403 from API: Confirm `VITE_API_KEY` and CORS configuration
- Images not loading: Verify `VITE_IMAGE_BASE_URL`
- Dev server port conflicts: Set `server.port` in `vite.config.js` or run with `--port`


## Acknowledgments

- Built with Vite + React
- Uses a media API such as TMDB (configure credentials as needed)
