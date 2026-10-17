# Rebuild verification — 17 October 2026

Local preview: http://localhost:5174/

## Scope

Ten routes, six watch collections. Home has seven substantial sections including a three-chapter pinned story. Every watch detail page has a gallery, story, material/movement tabs, specification table, care information and next-watch navigation. Our World adds a six-chapter sticky timeline; Savoir-faire adds scroll-controlled Three.js construction, manufacturing and finish chapters.

## Browser verification

Used the Codex in-app browser, accessibility/DOM inspection, screenshots, console logs and read-only layout measurements. Desktop viewports included 1536×1024 (the native concept size) and the app’s default 858px-wide viewport. Mobile checks used 390×844. No Playwright fallback was required.

| Check | Result |
| --- | --- |
| Page identity / meaningful content | Pass on all ten routes |
| Framework overlay | None in final renders |
| Console | No errors or warnings in the final route smoke test |
| Horizontal overflow | None on all ten routes at 390px |
| Asset/route audit | No missing referenced assets or broken internal routes |
| Production build | Pass; Three.js loads in its own deferred module |
| Home chapter controls | Chapters 1–3 change text and watch perspective; active chapter updates |
| Filter | Air reduces collection from six to two |
| Search | Non-matching text shows empty state; reset restores six |
| Compare | Navitimer + Chronomat selection opens a populated side-by-side dialog |
| Gallery | Choosing photograph 3 changes Navitimer to the caseback; enlarged image dialog opens and closes |
| Detail tabs | The case replaces the movement content and updates its selected state and image |
| Mobile navigation | Menu opens, route changes, menu closes and page scrolling continues |
| Three.js | Canvas renders the curved bracelet, reflective case and layered construction; slider updates at 55%/75% |
| Genuine model | Public Superocean Automatic 44 viewer loads and visibly renders the artist’s model |
| Timeline | 1957 link reaches that chapter; 1957 becomes active; measured top approximately 90px |
| Direct section URLs | Reloading technical-specifications reaches the correct section at approximately 145px below fixed navigation |

The automated source audit generated and inspected all ten page templates. Each watch page has seven sections; no referenced image files or internal routes were missing. The browser route audit found no broken loaded images. Lazy assets were also checked when their sections entered view.

## Design review

Concepts generated with the built-in image generator:

- `../breitling-design-v2-hero.png`
- `../breitling-design-v2-scroll.png`
- `../breitling-design-v2-details.png`

Brief: dark Swiss editorial campaign, oversized condensed headline, real watch presentation, yellow accents, three pinned watch chapters and detailed ivory/dark watch storytelling. Final browser evidence: `../breitling-preview-v2.png`. Concepts and final screenshots were opened with `view_image` for direct comparison.

| Comparison point | Outcome |
| --- | --- |
| Hierarchy | Oversized left-aligned campaign headline and large watch at right, followed by distinct section rhythms |
| Copy | Hero headline, supporting sentence, CTA and main navigation match the new concept brief |
| Type | Barlow Condensed campaign typography, DM Sans controls/body, editorial serif accents |
| Palette | Near-black, ivory and warm yellow; consistent shared tokens |
| Containers | Open product columns, editorial splits, fine-line tables and full-bleed photography |
| Imagery | Genuine reference-specific product photographs intentionally replace generated concept watch renders |
| Motion | Pinned chapter changes, scroll-linked image transforms, parallax, type reveals, progress and model disassembly |
| Responsive | Separate mobile compositions; clipped chapter photography no longer overlaps the chapter text |

Corrections during QA included an incorrect white-backed Chronomat image, mismatched collection imagery, mobile chapter overlap, menu scroll resumption and initial deep-link positioning. The new implementation was visually verified against the concept’s hierarchy, typography, palette and composition. It is not a pixel-identical reproduction: real photographs, actual model references and a simpler code-native brand mark intentionally differ from the generated designs. The inactive search icon from the concept was omitted; working collection search is on the collection page.

## Model and verification limits

The genuine model is Ethan Mulwee’s independently authored Superocean Automatic 44, hosted through Sketchfab and attributed next to the viewer. Its live viewing needs internet access. The separate Three.js Navitimer construction study is custom illustrative geometry, not official CAD. The browser confirmed the genuine model loads and renders; automated coordinate dragging inside the remote iframe was unavailable, so that drag gesture was not claimed as tested.

Reduced-motion support is implemented, but a separate reduced-motion browser session was not exercised. This was a Chromium-based desktop/mobile viewport test, not a physical-device or cross-browser lab. The deferred Three.js/model module is about 528kB before compression, producing Vite’s advisory chunk-size warning; it is not part of the home page’s initial JavaScript payload.
