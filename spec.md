# Vishwpandhari Yatrinivas

## Current State
Single index.html file with inline CSS and JS. Images used external Unsplash URLs.

## Requested Changes (Diff)

### Add
- Separate style.css file
- Separate script.js file
- /assets folder with local images (hero.jpg, about.jpg, room1-3.jpg, gallery1-3.jpg)
- Booking form section with WhatsApp integration
- Back-to-top button
- Check-in/check-out date validation
- Facilities section

### Modify
- index.html links to external style.css and script.js
- All image paths changed to relative local paths (assets/hero.jpg etc.)
- Color theme: Deep Blue (#1e3a8a), Sky Blue (#38bdf8), Gold (#facc15)

### Remove
- Inline CSS and JS from HTML
- External Unsplash image URLs

## Implementation Plan
1. Generate 8 local images and place in assets/
2. Write index.html with all 9 sections linking to style.css and script.js
3. Write style.css with responsive design, color theme, grid/flex layouts
4. Write script.js with smooth scroll, form validation, WhatsApp button, back-to-top
