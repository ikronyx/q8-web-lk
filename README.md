# Q8 Petrol (Lanka) — Rebrand Front-End

## Folder structure

q8-petrol-rebrand/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── images/
    │   ├── hero-poster.svg
    │   └── og-cover.svg
    └── video/
        └── q8-energy-hero.mp4  ← add your own file here

## Brand palette

- Primary green: `#05783C`
- Accent red: `#CA1326`
- Black: `#020202`
- Supporting shades are documented at the top of `css/styles.css`.

## Hero video

Place an optimized MP4 at:

`assets/video/q8-energy-hero.mp4`

Recommended:
- 1920×1080 source
- H.264 MP4
- 8–15 seconds, seamless loop
- muted / no audio track
- ideally under 8–12 MB
- dark cinematic footage of refinery infrastructure, tanker vessels, terminals, ports or global energy logistics

The supplied `hero-poster.svg` acts as a fallback if the video is absent or slow.

## Leadership images

The current leadership cards use initials as image placeholders. Replace the `.portrait-placeholder`
inside each card with your own `<img>` element, for example:

```html
<img src="assets/images/mohamed-shahan-noordeen.jpg" alt="Mohamed Shahan Noordeen" />
```

Then add:

```css
.leader-card__portrait > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Privacy and cookie preferences

The site includes:
- Accept all
- Reject optional
- Manage preferences
- Essential / analytics / marketing categories
- localStorage-backed privacy preferences
- gating hooks in `js/main.js`

No third-party analytics is enabled by default. If you later add Google Analytics, Meta Pixel, etc.,
load those scripts only inside the consent hooks after the corresponding preference is granted.

## Fonts

The page currently loads Manrope + DM Sans from Google Fonts. If your compliance policy requires
strict first-party assets, self-host those fonts and remove the Google Fonts links.

## Launch notes

Before production:
1. Add the final hero MP4.
2. Replace leadership placeholders with approved portraits.
3. Add actual company email/address where required.
4. Connect the trade enquiry CTA to your preferred form or CRM.
5. Add legal Privacy Policy / Terms pages if required by your deployment jurisdiction.
6. Compress all images (WebP/AVIF) and video.
7. Run Lighthouse accessibility/performance checks.


## Image placement strategy

The redesign now includes controlled editorial image zones so photography can strengthen the site
without making it feel like a generic stock-photo corporate template.

Suggested image files:

- `assets/images/profile-trade.jpg`
- `assets/images/trading-energy.jpg`
- `assets/images/trading-commodities.jpg`
- `assets/images/hub-kuwait.jpg`
- `assets/images/hub-sri-lanka.jpg`
- `assets/images/leadership-governance.jpg`

Recommended treatment:
- Prefer authentic refinery, tanker, port, terminal, commodity, trade-documentation or executive imagery.
- Avoid cliché handshakes, random office teams, excessive flags, or over-saturated stock photography.
- Use WebP/AVIF where possible.
- Keep one strong image per visual block rather than inserting imagery inside every card.
- Leadership portraits remain suitable for each leader card, but the rest of the site intentionally uses
  larger editorial imagery so the visual hierarchy remains professional.

The image placeholders are designed so you can replace the placeholder contents directly with `<img>`
without changing card proportions or surrounding layout.
