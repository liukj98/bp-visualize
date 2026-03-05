# static-deployment Specification

## Purpose
TBD - created by archiving change add-static-deployment. Update Purpose after archive.
## Requirements
### Requirement: Static Site Deployment
The project SHALL be deployable as a static site via EdgeOne Pages, producing a publicly accessible URL without requiring a user-owned server or domain.

#### Scenario: Successful deployment
- **WHEN** the project is built with `vite build`
- **THEN** the `dist/` directory SHALL contain all necessary HTML, CSS, JS, and font assets
- **AND** the output SHALL be deployable to EdgeOne Pages as a static site
- **AND** a public URL SHALL be assigned automatically upon deployment

#### Scenario: Online functionality verification
- **WHEN** a user accesses the deployed URL
- **THEN** all interactive features (network visualization, step-through training, formula display, animations) SHALL function identically to the local development environment

