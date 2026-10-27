# ParkGo — Premium Parking Website

A responsive, polished parking-booking website inspired by the supplied ParkGo design reference. Built with semantic HTML, modern CSS, and vanilla JavaScript—no build step required.

## Run locally

1. Extract the project folder.
2. Open `index.html` in a modern browser, or serve the folder locally (recommended):

   ```bash
   python -m http.server 8080
   ```

3. Visit `http://localhost:8080`.

## Included interactions

- Responsive desktop/mobile navigation and “More” menu.
- Vehicle selector (Car, Bike, Van, Bus, Truck, EV).
- Location and arrival date/time validation.
- Search results drawer with sample parking options and reserve actions.
- Sign-in and sign-up modal with client-side validation.
- Category carousel controls and category-to-search selection.
- Nearby parking shortcuts, premium pass, business, app-store and support feedback.
- Toast notifications, smooth scrolling, subtle motion and reduced-motion support.

## Production integration notes

This is a complete front-end implementation. The booking results are illustrative sample data and account forms intentionally validate locally; connect them to your actual API, authentication provider, payment gateway, inventory system, and booking database before accepting real bookings or payments. Replace sample support/contact details and store links with verified business information. Photography and the Lucide icon script are loaded from external CDNs, and Google Fonts are loaded remotely.

## Files

- `index.html` — page structure and accessible interactive components
- `styles.css` — responsive design system, layouts, states and animations
- `app.js` — all UI behavior and client-side validation
