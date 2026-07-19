# Taste Trail Kerala

A premium, Kerala-inspired food discovery platform that helps people find street food vendors across Kerala and supports local businesses through visibility, hygiene transparency, and honest reviews.

## Features

- **Landing page** with hero search, featured dishes, and live stats
- **Explore vendors** with search and filters (district, cuisine, rating, hygiene score, open now)
- **Interactive map** with vendor pins placed across Kerala's 14 districts
- **Vendor detail pages** with photo gallery, menu, hygiene certificate, and reviews
- **Vendor registration** form with menu and hygiene certificate upload
- **User dashboard** with saved vendors, review history, and recently viewed
- Dark mode, toast notifications, loading skeletons, and scroll animations
- Fully responsive, built for desktop and mobile

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) for icons

This project uses dummy JSON data for vendors and reviews, so it runs entirely in the browser with no backend required. It's structured to be easy to connect to Firebase (or any backend) later.

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/PournamyPS/taste-trail-kerala.git
cd taste-trail-kerala
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project structure

```
taste-trail-kerala/
├── src/
│   ├── App.jsx        # Main application (all pages and components)
│   ├── index.css       # Tailwind entry point
│   └── main.jsx        # React entry point
├── vite.config.js      # Vite + Tailwind plugin config
├── package.json
└── README.md
```

## Notes

- The map page uses a placeholder for the Google Maps API key. Replace it with a real key before using live map data.
- All vendor, menu, and review data is dummy data defined directly in `App.jsx` for demo purposes.

## License

This project is open for personal and educational use.
