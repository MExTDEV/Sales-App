# M.Ex.T. Sales App

Phase 1.1 visual foundation for the internal M.Ex.T. Sales App.

The app is currently mock-only. It implements the shell, role/country/language mock login, dashboard, sales agenda, appointment detail, service information, cash sheet blocking and sync-status placeholder. There is no real backend, database, authentication, ERP integration or offline sync yet.

## Project Structure

```txt
app/
  page.tsx                         Sales App entrypoint
  layout.tsx                       Metadata and root layout
  globals.css                      Tailwind import and base styles
components/
  agenda/                          Sales agenda list views
  appointment/                     Appointment detail and mock status actions
  cash-sheet/                      Cash sheet screen and blocking screen
  dashboard/                       Dashboard view
  layout/                          App shell, login, sidebar, topbar, bottom bar
  sales/                           State coordinator
  service/                         Service and service planning placeholders
  shared/                          Reusable UI primitives
  sync/                            Sync mock view
data/
  salesMock.ts                     Mock users, permissions, appointments and cash sheet
locales/
  nl.json                          Dutch source language
  fr.json                          French placeholder/draft translations
  de.json                          German placeholder/draft translations
types/
  sales.ts                         Strict shared types
```

## Run Locally

```bash
npm install
npm run build
npm run start:local
```

Open `http://localhost:3001`.

On Windows you can also double-click `start-salesapp-local.cmd`. It starts the stable local production server on port `3001`.

For active development with hot reload:

```bash
npm run dev:local
```

## Validate

```bash
npm run typecheck
npm run build
```

## Phase Boundaries

Do not add real backend, database, authentication, ERP integration, Business Central integration, Odoo integration or real offline sync in Phase 1.x.

Do not create separate Customers, Prospects or Tasks modules. Customer and prospect data remains inside Appointment Detail. Sales Agenda and Service Planning stay separate.
