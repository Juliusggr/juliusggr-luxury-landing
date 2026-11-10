# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, TypeScript, and Tailwind CSS. Chosen explicitly in the brief.

## Users

Recruiters and hiring managers evaluating Julio Cesar for a web or software role. They arrive with little time, scan for judgment and craft, and leave with a way to write or download a CV.

## Product Purpose

A personal interview portfolio. Success is a recruiter understanding the work, the practice, and how to make contact without reading a long biography.

## Positioning

End-to-end web and desktop work, stated through shipped code and a self-directed practice. The site does not apologize for experience it does not claim, and it does not invent clients.

## Operating Context

A single scrolling page used in an interview tab, often alongside GitHub. Language and theme persist in the browser. The CV download follows the active language.

## Capabilities and Constraints

- Spanish by default, English as a full alternate. Confirmed copy for the headline, bio, focus, and footer is the brief's Spanish.
- Command palette on Ctrl+K / Cmd+K: copy email, download the CV, open GitHub, switch language, switch theme.
- View transitions via Astro ClientRouter.
- Visual system is bound to the koysor.me screen recording supplied with the brief: forest field, four hairline columns, serif display, mono chrome, expanding showreel, project anatomy, terracotta close.
- Email on this machine's git identity: Juliusggrdev@proton.me. Change it in `src/data/site.ts` if that is not the public address.
- LinkedIn URL is unknown. The link stays out until `site.linkedin` is set.
- The only public repository as of this writing is `Juliusggr/fablecraft`. Other featured projects are not invented. Add them in `src/data/site.ts`.

## Brand Commitments

- Name in the header: JULIO CESAR.
- Portrait: the train photograph, quiet grayscale at rest, ochre jacket returning on hover.
- Palette locked by the brief: `#0B261C`, `#F4F1EA`, `#A3B3AC`, `#4ADE80`, `#C84B11`.
- Faces locked by the brief: Instrument Serif, Inter, JetBrains Mono.

## Evidence on Hand

- Portrait file copied into `public/julio.jpg`.
- Public repo: https://github.com/Juliusggr/fablecraft — a from-scratch voxel sandbox in the browser, no libraries, no external assets.
- No client list, no testimonials, no measured Lighthouse score for this site. The quality card quotes the brief's standard; it is not a lab report.
- Showreel frames are original illustrations of that voxel project, not captured product screenshots. Replace them when real stills exist.

## Product Principles

- Say only what a recruiter can verify.
- One page, short lines, no percentage bars.
- The work occupies the frame; the interface stays a grid, a menu, and a way out.
- Spanish and English carry the same claims.
- Contact is one gesture: copy the email, or take the CV.
