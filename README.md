# Lumé Fogászati Stúdió

A portfolio demo by **NOVA Studio**: a one-page website for a fictional private dental clinic in Szeged, designed around a calm, Apple-like glass aesthetic.

> Lumé is not a real clinic. The booking form never sends anything; every confirmation on the page says so.

## What's in it

- **Light / Dark / Auto appearance.** An iOS-style segmented control. The choice is stored in `localStorage`, "Auto" follows the OS live, an inline head script prevents a wrong-theme flash, and switching cross-fades with View Transitions where supported.
- **Floating glass navigation.** It firms up on scroll, turns to dark glass over the dark "Szemléletünk" band, and opens a full sheet menu on mobile with a focus trap and Escape to close.
- **Sections:** hero, treatments, about the clinic, approach (4-step process), booking, FAQ, contact, and footer.
- **Booking interface.** Grouped iOS-style fields, a custom treatment pop-up menu, a calendar with clinic opening rules, time slots, and inline validation that only speaks up after a field is touched.
- **Live macOS-style notification.** It appears on the first keystroke and mirrors the form as it fills in: partial data, row by row, with animated height. On submit it turns into a "Foglalási igény rögzítve" notification with a reference ID. On phones it becomes a collapsible iOS banner at the top. A "Demó" tag stays visible in every state.

## Architecture

```
src/
  app/                 layout (fonts, metadata, JSON-LD, theme script), page, global tokens
  components/
    nav/               SiteNav, AppearanceSelector
    sections/          Hero, Services, About, Approach, Faq, Contact, Footer
    booking/           BookingSection, TreatmentSelect, DatePicker, TimeSlots
    notification/      MacNotification (presentational, portal)
    ui/                icons, Photo, RevealObserver, helpers
  content/clinic.ts    all clinic copy, treatments, hours, links
  lib/
    theme/             appearance state + pre-paint script
    booking/           types, validation, schedule rules, formatting,
                       useBookingForm (state), service + channels/
```

### Delivery channels

The UI only talks to a `BookingChannel` (`src/lib/booking/channels`). The default `demo` channel waits briefly and resolves as `simulated`, and nothing leaves the browser.

To go live, point the site at your own endpoint (a serverless function, form backend or CRM webhook) at build time:

```bash
NEXT_PUBLIC_BOOKING_CHANNEL=email      # or whatsapp | api
NEXT_PUBLIC_BOOKING_ENDPOINT=https://example.com/api/booking
```

The HTTP channel POSTs `{ channel, booking, text }`, where `text` is a ready-to-send Hungarian plain-text summary. Provider secrets (Resend, SMTP, WhatsApp Cloud API) belong on that endpoint, never in the browser. With a real channel, the UI drops the demo labels automatically.

## Running

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

The site is built as a static export (`output: "export"`) and can be hosted anywhere. Set `NEXT_PUBLIC_SITE_URL` to the deployed domain so share images resolve.

## Credits

Photos come from Wikimedia Commons under CC licences. Authors are credited in the site footer.
