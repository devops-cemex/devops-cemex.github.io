# CPIL — New Service Pages (Generators, Solar Panels, Vehicles)

This delivery adds three new service pages to the CPIL website, matching the
existing design system used on `power_solutions.html` and
`marine_welfare_solutions.html`.

## Files added

| Path                                               | Purpose                                                   |
|----------------------------------------------------|-----------------------------------------------------------|
| `html/services/generators.html`                    | Generators service page (York + Mikano 150 KVA)           |
| `html/services/solar_panels.html`                  | Solar bundles + estate packages + financing               |
| `html/services/vehicles.html`                      | Vehicle catalogue with category filter + financing        |
| `src/css/services_v2.css`                          | New component CSS (product, bundle, estate, finance, cat tabs, vehicle cards, CTA strip, brand strip) |
| `src/js/services_v2.js`                            | Reveal-on-scroll + vehicle category filter + fm-power in-view fallback |
| `NEW_SERVICE_PAGES_README.md`                      | This file                                                 |

## Files modified

| Path                 | What changed                                                                                                                              |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `services.html`      | Services dropdown gains three new links; main services grid gains service items 05/Generators, 06/Solar Panels, 07/Vehicles.               |

> The services dropdown in the four existing service pages (`power_solutions.html`,
> `marine_welfare_solutions.html`, `construction_services.html`,
> `facility_services.html`) still lists only the original four items. If the
> expanded dropdown should appear on every page, apply the same edit there.

## Design system notes

- No new CSS variables introduced — all tokens in `services_v2.css` inherit
  from the `:root` block declared in `services.css`.
- Accent colour (`#fec522`), surface (`#252525`), background (`#060606`),
  fonts (Roboto / Poppins / Raleway) all preserved.
- New components are namespaced:
  - `.svc-subsection*` — generic subsection header used inside the new pages
  - `.product-card*` — generators & flagship product cards
  - `.bundle-card*` — solar pricing tiers
  - `.estate-card*` — estate-scale solar packages
  - `.finance-callout*` — structured payment plan block
  - `.cat-tabs` / `.cat-tab` — vehicle category filter
  - `.vehicle-card*` — catalogue vehicle card (with filter support)
  - `.cta-strip*` — bottom-of-page promo bar
  - `.brand-strip*` — authorised distributor logo strip (vehicles page only)
- All new cards respect `prefers-reduced-motion` and progressively enhance —
  with JS disabled, items simply render visible.
- Category filter is keyboard-accessible (ArrowLeft/ArrowRight cycles tabs).

## Image assets required

Place these under `assets/imgs/services/`. Placeholder-friendly — use any
on-brand image (dark background / warm highlights). Recommended aspect
ratios are listed; the CSS scales with `object-fit: cover` so minor
deviation is fine.

### Generators page

| Filename                              | Use                             | Suggested size / aspect |
|---------------------------------------|---------------------------------|--------------------------|
| `generators_hero.jpg`                 | Page-title hero background      | 1920 × 700 (wide)        |
| `generators_intro.jpg`                | fm-power intro image            | 1200 × 900 (4:3)         |
| `generator_york_150.jpg`              | York 150 KVA product card       | 1200 × 900 (4:3)         |
| `generator_mikano_150.jpg`            | Mikano 150 KVA product card     | 1200 × 900 (4:3)         |

### Solar Panels page

| Filename                              | Use                             | Suggested size / aspect |
|---------------------------------------|---------------------------------|--------------------------|
| `solar_hero.jpg`                      | Page-title hero background      | 1920 × 700               |
| `solar_intro.jpg`                     | fm-power intro image            | 1200 × 900 (4:3)         |

> The bundle and estate cards are text-only by design (clean pricing focus).
> If product imagery is desired later, add `solar_bundle_<size>.jpg` images
> and drop them into `.bundle-card` via a new media block.

### Vehicles page

| Filename                              | Use                             | Suggested size / aspect |
|---------------------------------------|---------------------------------|--------------------------|
| `vehicles_hero.jpg`                   | Page-title hero background      | 1920 × 700               |
| `vehicles_intro.jpg`                  | fm-power intro image            | 1200 × 900 (4:3)         |
| `vehicle_changan_alsvin.jpg`          | Catalogue card — Changan Alsvin | 1280 × 800 (16:10)       |
| `vehicle_changan_eado_plus.jpg`       | Catalogue card — Eado Plus      | 1280 × 800               |
| `vehicle_changan_uni_v.jpg`           | Catalogue card — Uni-V          | 1280 × 800               |
| `vehicle_changan_cs35_plus.jpg`       | Catalogue card — CS35 Plus      | 1280 × 800               |
| `vehicle_changan_cs55_plus.jpg`       | Catalogue card — CS55 Plus      | 1280 × 800               |
| `vehicle_changan_x7_plus.jpg`         | Catalogue card — X7 Plus        | 1280 × 800               |
| `vehicle_changan_uni_k.jpg`           | Catalogue card — Uni K          | 1280 × 800               |
| `vehicle_gwm_tank_300.jpg`            | Catalogue card — Tank 300       | 1280 × 800               |
| `vehicle_gwm_tank_500.jpg`            | Catalogue card — Tank 500       | 1280 × 800               |
| `vehicle_zna_rich_6.jpg`              | Catalogue card — ZNA Rich 6     | 1280 × 800               |
| `vehicle_g10_bus.jpg`                 | Catalogue card — G10 Bus        | 1280 × 800               |
| `vehicle_star5_cargo.jpg`             | Catalogue card — Star 5 Cargo   | 1280 × 800               |
| `vehicle_star5_truck.jpg`             | Catalogue card — Star 5 Truck   | 1280 × 800               |
| `brand_changan.png`                   | Brand strip — Changan logo      | transparent PNG, 240×72  |
| `brand_gwm.png`                       | Brand strip — GWM logo          | transparent PNG, 240×72  |
| `brand_tank.png`                      | Brand strip — Tank logo         | transparent PNG, 240×72  |
| `brand_zna.png`                       | Brand strip — ZNA logo          | transparent PNG, 240×72  |
| `brand_mikano_motors.png`             | Brand strip — Mikano Motors     | transparent PNG, 240×72  |

Any source images from `cpil_new_services/` (e.g. `alsvin_car.jpg`,
`changan-uni-v_car.jpg`, `generators.jpg`, `solar_panels.jpg` etc.) can be
copied into `assets/imgs/services/` and renamed to the target filenames
above.

## Integration checklist

1. Copy/rename source imagery into `assets/imgs/services/` per the table
   above.
2. Drop the five new files into their target paths.
3. Deploy — no vendor or bundler changes are required.
4. Optional: mirror the expanded services dropdown into the existing four
   service pages so the new items appear from any page.
5. Optional: wire the `?product=` / `?bundle=` / `?vehicle=` / `?service=`
   query params on `quote.html` so the quote form pre-selects the
   requested product.
