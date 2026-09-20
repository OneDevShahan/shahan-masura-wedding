# Shahan & Masura Wedding Invitation

A premium animated Muslim wedding invitation built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

This project is designed as a beautiful digital invitation for sharing with family and friends, featuring:

- premium luxury emerald and gold theme
- animated opening and story sections
- countdown to the event
- venue and directions section
- RSVP section
- guest wishes section
- calendar and share actions
- mobile-responsive layout for iPhone, Android, and desktop browsers

## Features

- React 19 + TypeScript
- Vite 8
- Tailwind CSS
- Framer Motion animations
- Local RSVP mock flow for UI demonstration
- WhatsApp / copy link / native share support
- Google Calendar integration
- ICS download support
- GitHub Pages deployment workflow

## Local Development

Requirements:

- Node 20+

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev -- --host 0.0.0.0
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview -- --host 0.0.0.0
```

## Deployment

This repo includes a GitHub Actions workflow for GitHub Pages deployment:

- .github/workflows/deploy.yml

For GitHub Pages:

1. Create a GitHub repository
2. Push the code
3. Go to repository Settings > Pages
4. Set source to GitHub Actions

## Notes

The RSVP and guest wishes currently work as a frontend mock for demonstration. For real production data capture, it is recommended to connect them to:

- Google Forms
- Formspree
- Supabase
- Firebase
- a custom backend

## Project Structure

```bash
src/
  App.tsx
  data/wedding.ts
  hooks/
  services/
  utils/
```

## License

This project is intended for personal wedding invitation use.
