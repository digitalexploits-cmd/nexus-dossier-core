# Nexus Facility V2 — Agent Operating Rules

GitHub is the source of truth for Nexus Facility V2. Read every root-level Nexus specification file before editing code.

## Non-negotiable rules

1. Never commit directly to `main`.
2. Work only on the branch assigned to you.
3. Do not modify or publish the current production Lovable project.
4. Do not merge your own pull request.
5. Do not change architecture, bay responsibilities, public claims, proprietary content, or major visual direction without recording a proposal in `DECISIONS.md` and obtaining Anthony McGee's approval.
6. Keep the application portable outside Lovable. Avoid Lovable-only asset URLs and unnecessary vendor lock-in.
7. Do not add a database, authentication, heavy 3D engine, paid dependency, analytics vendor, or external service unless explicitly approved.
8. Do not expose exact proprietary algorithm parameters, kill zones, transforms, filters, or implementation details.
9. Distinguish verified evidence, recorded public-dataset playback, hypothesis, prototype, and illustrative simulation.
10. Run build, lint, and available tests before requesting review.

## Required pull-request summary

Every pull request must state:

- Assigned scope
- Files changed
- Visible behavior changed
- Architectural decisions
- Build/lint/test results
- Screenshots or recordings when visual behavior changed
- Known limitations and unresolved risks
- Whether Anthony's approval is required before merge

## Significant-change approval gate

Stop before implementing any change that materially affects:

- Overall information architecture
- Hero environments or bay identity
- Public-facing technical claims
- Collection or storage of visitor data
- Dependencies, hosting, database, or authentication
- Product positioning or pricing
- Weather/audio behavior that changes the intended experience
- Removal of existing user content
- Anything difficult to reverse

Minor fixes, cleanup, typing, accessibility repairs, test additions, documentation, and exact refinements inside an approved design may proceed without a new approval request.
