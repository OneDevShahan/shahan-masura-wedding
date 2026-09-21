# Shahan & Masura Wedding Invitation

A premium animated Muslim wedding invitation website built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

This project is designed for sharing with family and friends and includes elegant premium styling, animated sections, RSVP interactions, guest wishes, and mobile-friendly behavior for phones, tablets, and desktop browsers.

## Overview

Features included:

- luxury invitation design with premium warm gold and deep blue/green palette
- animated hero section and reveal effects
- countdown to wedding day
- event timeline and venue section
- RSVP form and guest wishes area
- WhatsApp, copy link, and native share support
- Google Calendar and ICS export actions
- mobile-responsive layout
- custom music toggle with mobile-safe autoplay handling

## Tech Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Prerequisites

Use Node 20 or newer.

Why this matters:

- The project was built with Vite 8 and newer React tooling.
- Node 18 may fail during build because some Vite internals require newer Node exports.

## Local Setup

1. Open the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start the local app:

```bash
npm run dev -- --host 0.0.0.0
```

4. Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173/
```

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview -- --host 0.0.0.0
```

If your local machine is still on Node 18, use Node 20 or 22 before running the build. For example:

```bash
npx -y node@20 ./node_modules/vite/bin/vite.js build
```

## Updating Wedding Information

The main invitation content is stored in:

- src/data/wedding.ts

Update these values for your own wedding:

- bride and groom names
- event dates and times
- venue name and address
- QR/share content if needed
- music source
- initial guest wishes

Example:

```ts
export const wedding = {
  bride: { name: 'Your Bride Name' },
  groom: { name: 'Your Groom Name' },
  date: { gregorian: 'Saturday, 31 October 2026' },
  venue: {
    name: 'Venue Name',
    address: 'Street Address',
    city: 'City',
    country: 'Country',
  },
}
```

## Theme and Styling

The color system is defined mostly through dynamic palette tokens in:

- src/App.tsx

Additional global styling is in:

- src/index.css

You can switch the palette by editing the palette sections in the app or by changing the CSS variables used throughout the design.

## Deployment Options

### Option 1: GitHub Pages

This repository already includes a deployment workflow in:

- .github/workflows/deploy.yml

Steps:

1. Push the code to GitHub.
2. Go to your repository on GitHub.
3. Open Settings > Pages.
4. Change the source to GitHub Actions.
5. Save settings and allow the workflow to run.

### Option 2: Render

For a static deployment on Render:

1. Sign in to Render.
2. Create a new Static Site.
3. Connect your GitHub repository.
4. Use the build command:

```bash
npm install && npm run build
```

5. Use the publish directory:

```bash
dist
```

6. Deploy.

### Option 3: Vercel or Netlify

This app also works well on Vercel and Netlify as a static Vite site:

- Build command: `npm run build`
- Publish directory: `dist`

## Important Notes

- Mobile browsers block autoplay for audio unless playback starts after a user gesture.
- The sound toggle is designed to work correctly after a tap/click.
- The RSVP and guest wishes areas are front-end demo flows and can be connected to a backend later if needed.

## Project Structure

```bash
.
├── public/
├── src/
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── index.css
├── .github/
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## License

This project is intended for personal wedding invitation use and sharing within family and friends.

## Useful Commands

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run preview -- --host 0.0.0.0
```

## Final Reminder

If you want to publish this live, the easiest path is usually:

- GitHub Pages for a quick static deploy, or
- Render for a simple static site deployment with a clean UI.

Keep the repository updated whenever you make changes to the names, date, venue, palette, or wording.
