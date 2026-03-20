# Vishwpandhari Yatrinivas

## Current State
Existing static website with HTML/CSS/JS, blue/gold theme, local images, booking form with WhatsApp integration, gallery, rooms, testimonials. No backend, no authentication, no data persistence.

## Requested Changes (Diff)

### Add
- User registration and login with role-based access (admin vs. guest)
- Booking form that persists data to backend database
- Admin panel to view, manage all bookings
- Guest dashboard to view own bookings
- On-screen booking confirmation (no email -- not on paid plan)

### Modify
- Rebuild frontend as React app with same blue/gold visual theme
- Booking form connected to backend API instead of WhatsApp only

### Remove
- Static HTML/CSS/JS files (replaced by React)
- WhatsApp-only booking (replaced by real backend booking)

## Implementation Plan
1. Select `authorization` Caffeine component for role-based auth
2. Generate Motoko backend with:
   - User roles: admin, guest
   - Booking data model: name, email, phone, checkIn, checkOut, roomType, guests, status, userId, createdAt
   - Create booking (authenticated guests)
   - Get own bookings (guests)
   - Get all bookings (admin only)
   - Update booking status (admin only)
   - Delete booking (admin only)
3. Build React frontend:
   - Login / Register pages
   - Home page with hero, about, rooms, amenities, gallery sections
   - Booking form page (authenticated)
   - Guest dashboard: view own bookings
   - Admin panel: view/manage all bookings, update status
   - Blue (#1e3a8a) / Sky Blue (#38bdf8) / Gold (#facc15) theme
