# NEXT-STEPS4 - M.Ex.T. Sales App

Laatste stand: na Phase 3.6, met functionele mockmodules voor Sales, Service, Assets, Contracten en Onderhoud.

## 1. Current Project Status

De applicatie is een Next.js / TypeScript mock-first prototype met een stevige visuele en functionele basis. De app gebruikt nog geen backend, database, echte authenticatie, ERP-koppeling of offline synchronisatie. Alle workflows draaien op mock data en lokale React state.

De huidige maturiteit is hoog genoeg om verkoop- en serviceflows functioneel te demonstreren, maar nog niet geschikt voor productie. De belangrijkste waarde zit nu in UX-validatie, datamodelvalidatie en procesvalidatie met gebruikers.

Belangrijke technische keuzes:
- Next.js met TypeScript.
- Roboto via Next font loading.
- Tailwind CSS.
- Hoofdkleur `#003B83`.
- lucide-react iconen.
- i18n via `locales/nl.json`, `locales/fr.json`, `locales/de.json`.
- Mock state en mock data als tijdelijke datastructuur.
- Geen aparte Customers/Prospects/Tasks modules.

## 2. Completed Functional Areas

### Dashboard
Geïmplementeerd. Toont werkdagtegels, acties en kasbladbedrag uit mock cash sheet data. Visueel afgestemd op de Lovable-referentie.

### Mijn informatie
Geïmplementeerd als read-only profielpagina met persoonlijke gegevens, werkdagstatistieken, omzet, kasblad en synchronisatie. Mobiel nummer melden is mock-only met modal.

### Mijn team
Geïmplementeerd als mock overzicht voor sales leaders/admin/superadmin met vertegenwoordigers, dagcijfers en uitklapbare afspraken.

### Mijn agenda
Geïmplementeerd met open en afgewerkte afspraken, compacte rijen, contactgegevens, statusflows, dupliceren, geen tijd, afspraak openen en omzetinformatie bij afgewerkte afspraken.

### Mijn voorbereiding
Geïmplementeerd als bruikbaar mockscherm met voorbereidingstabel en koppeling naar afspraakfiche.

### Afspraakfiche / Bezoekfiche
Grotendeels functioneel mock:
- Afspraak afsluiten.
- Contactfiche subtabs.
- Leads tab.
- Opmerkingen.
- Vervolgafspraak.
- Offertes.
- Verkoophistoriek.
- Documenten.
- Referenties.
- Nieuwe verkoop wizard basis.

### Gebruikersbeheer
Geïmplementeerd met lijst, zoeken, default sortering, create/edit flow, actief/niet-actief, mock foto-upload en rolselectie uit technische tabel.

### Kasblad
Geïmplementeerd als mock module met lijnen, totaal te storten, cash storten modal en maandagblokkade visualisatie. Dashboard en Mijn informatie sluiten aan op de cash sheet data.

### Voorraad
Geïmplementeerd met stockoverzicht, filters, detail en mock transferaanvraag.

### Rapportering
Geïmplementeerd met dag/week/maand mockrapportering, KPI’s, charts en detailtabel.

## 3. Service Modules Current State

### Service Planning
Geïmplementeerd als Outlook-achtige planning met dag/week/maand view, Vandaag-knop en periode-navigatie:
- Dag: dag -1 / dag +1.
- Week: week -1 / week +1.
- Maand: maand -1 / maand +1.
- Maandview toont dagen buiten de maand lichter.

Filters zijn verwijderd uit de planning volgens de laatste UX-beslissing.

### Interventies
Geïmplementeerd als mock lijst/detail. Interventiedetail is read-only met gekoppelde werkbonmelding.

### Werkbonnen
Geïmplementeerd als functionele mock module:
- Overzicht met filters.
- Werkbon detail.
- Compacte professionele algemene gegevens header.
- Werkomschrijving boven uitgevoerde werken.
- Uitgevoerde werken met invoer, bewerken en verwijderen.
- Servicecontroles direct onder uitgevoerde werken.
- Gebruikte materialen onder servicecontroles.
- Materialen onderscheiden contractmateriaal versus nieuw artikel.
- Nieuwe artikelen kunnen op factuur of order gezet worden.
- Foto’s onder gebruikte materialen.
- Service-operator opmerkingen.
- Klantopmerkingen.
- Handtekeningen: links service-operator, rechts klant.
- Werkbon afsluiten met bevestigingsmodal.

Alles is mock-only. Echte handtekening, foto-opslag, stockmutaties en ERP-sync ontbreken nog.

### Assets
Geïmplementeerd als brede service-assets module, niet alleen AED:
- Assetoverzicht met filters.
- Assetdetail met algemeen, klant/locatie, servicegegevens en historiek.
- Servicecontrole-Type zichtbaar.
- Gekoppelde werkbonnen en interventies zichtbaar.
- Assettypes in Technisch beheer.

Assettypes:
- EHBO
- CARDIO
- BRAND
- BLUSMIDDELEN
- ALGEMEEN

### Contracten
Geïmplementeerd als read-only mock module:
- Contractoverzicht met KPI’s.
- Filters op contractnummer, klant, type, status, startdatum en einddatum.
- Contractdetail met algemeen, dekking, financieel, gekoppelde assets, werkbonhistoriek, interventiehistoriek en opmerkingen.
- Contracttypes in Technisch beheer.

Contracttypes:
- ONDERHOUD
- SERVICE
- FULLSERVICE
- INSPECTIE
- ALGEMEEN

### Onderhoud
Geïmplementeerd als functionele mock module:
- Onderhoudsoverzicht met KPI’s.
- Filters op klant, assettype, status, datum van/tot en contract.
- Tabel toont onderhoudsnummer, klant, asset, volgend onderhoud, laatste onderhoud, status en acties.
- Acties: Openen en Interventie plannen staan naast elkaar binnen de tabel.
- Detail met algemene gegevens, planning en historiek.
- Interventie plannen modal met mock save en succesmelding.
- Onderhoudsfrequenties in Technisch beheer.

Onderhoudsfrequenties:
- MAANDELIJKS / 1 maand
- KWARTAAL / 3 maanden
- HALFJAAR / 6 maanden
- JAARLIJKS / 12 maanden
- TWEEJAAR / 24 maanden

## 4. Technical Management Current State

Technisch beheer is alleen zichtbaar voor `superadmin`.

Subitems:
- Design
- Tabellen

Design:
- Logo upload mock.
- Favicon upload mock.
- Login background upload mock.
- Sidebar gebruikt logo/favicon mock state.

Tabellen:
- Rollen
- Contracttypes
- Assettypes
- Leadtypes
- Servicecontroles
- Onderhoudsfrequenties

Deze tabellen zijn read-only mock referentietabellen. Ze zijn bedoeld als voorbereiding op databasebeheer.

## 5. Current Role and Permission Model

Rollen:
- representative
- sales_leader
- admin
- superadmin

Technische rolwaarden in de UI:
- Vertegenwoordiger
- Verkoopsleider
- Service Operator
- Admin
- SuperAdmin

Belangrijke regels:
- Representative ziet eigen data.
- Sales leader ziet eigen team.
- Admin beheert gebruikers binnen landenscope, maar mag geen admin/superadmin maken.
- Superadmin ziet alles en beheert technische tabellen/design.
- Service editing wordt gestuurd via expliciete permissies zoals `ViewService`, `EditService`, `ViewWorkOrders`, `EditWorkOrders`.
- Service rollen zijn nog niet als echte auth-rollen geïmplementeerd; `Service Operator` bestaat als technische rolwaarde in mock gebruikersbeheer.

## 6. Current Relationship Model

De serviceketen is nu visueel en functioneel als mock herkenbaar:

Klant  
↓  
Contract  
↓  
Asset  
↓  
Onderhoud  
↓  
Interventie  
↓  
Werkbon

Belangrijk: dit is nog geen centraal gedeeld datamodel met echte relationele consistentie. Sommige schermen gebruiken eigen mock arrays in `ServicePlanningView.tsx`. Voor Phase 4 moet dit opgeschoond worden naar gedeelde mock data of een voorbereidend typed domain model.

## 7. Known Mock-Only Limitations

Nog mock-only:
- Login/authenticatie.
- Gebruikersrechten enforcement aan serverzijde.
- Backend.
- Database.
- ERP-koppeling.
- Offline sync.
- Audit logging.
- Notificaties.
- Cash deposit workflow.
- Mobiel nummer wijzigingsworkflow.
- Foto-opslag.
- Digitale handtekening.
- Werkbonstatus-synchronisatie.
- Voorraadmutaties bij gebruikte materialen.
- Contractvervalmeldingen.
- Onderhoudsgeneratie op basis van frequentie.
- Navigatie vanuit contract/asset naar echte detailroutes.

## 8. High Priority ToDo Summary

Hoog:
- Backend/datamodel ontwerpen voor klanten, afspraken, assets, contracten, onderhoud, interventies en werkbonnen.
- Offline-first architectuur uitwerken voor afspraken, werkbonnen, assets, stock en cash sheet.
- ERP-koppeling voorbereiden via API/adapters, niet rechtstreeks tegen ERP UI.
- Werkbonnen koppelen aan echte assets, interventies, voorraad en ERP.
- Servicecontrole-Type koppelen aan werkboncontroles.
- Stock verminderen bij gebruikte materialen volgens factuur/order/contractlogica.
- Digitale handtekening en foto-opslag implementeren.

Middel:
- Contractvervalmelding en contractverlenging workflow.
- Onderhoud automatisch genereren op basis van onderhoudsfrequentie.
- Assethistoriek koppelen aan interventies, werkbonnen en contracten.
- Rapportering koppelen aan echte ERP omzetgegevens.
- Voorraad transferaanvragen koppelen aan echte voorraadbewegingen.

Laag:
- Placeholdervertalingen FR/DE verfijnen.
- Export naar Excel/PDF voor rapportering.
- Extra visuele polish na gebruikersfeedback.

## 9. Recommended Development Order

1. **Service datamodel centraliseren**
   Maak gedeelde mock/domain files voor assets, contracten, onderhoud, interventies en werkbonnen. Nu staat veel in `ServicePlanningView.tsx`.

2. **Werkbon UX afronden**
   Finaliseer invoer, servicecontroles, materialenlogica, handtekeningsecties en afsluitvoorwaarden voordat backend komt.

3. **Asset/Contract/Onderhoud navigatie koppelen**
   Laat “Open Asset”, “Open Werkbon”, “Open Interventie” echte interne detailstates openen in plaats van mockmeldingen.

4. **Offline-first technische voorbereiding**
   Definieer lokale database entities, sync queue en conflictregels voor service en sales workflows.

5. **Backend API ontwerp**
   Start met typed API-contracten voor users, appointments, customers, assets, contracts, maintenance, interventions, work orders, stock and cash sheet.

6. **ERP adapterlaag**
   Ontwerp Business Central/Odoo adapters los van UI logic.

## 10. Current Architecture Snapshot

Belangrijke files:
- `components/sales/SalesApp.tsx`: centrale state/router voor interne views.
- `components/service/ServicePlanningView.tsx`: bevat momenteel Service Planning, Interventies, Werkbonnen, Assets, Contracten en Onderhoud.
- `components/technical/TechnicalTablesView.tsx`: technische referentietabellen.
- `data/technicalMock.ts`: rollen, leadtypes, assettypes, contracttypes, servicecontroles, onderhoudsfrequenties.
- `types/sales.ts`: centrale types.
- `locales/*.json`: i18n keys.
- `docs/ToDo.md`: openstaande functionele en architecturale punten.

Architectuurrisico:
`ServicePlanningView.tsx` is te groot geworden. Voor de volgende substantiële serviceontwikkeling is opsplitsen aanbevolen:
- `components/service/planning/`
- `components/service/interventions/`
- `components/service/work-orders/`
- `components/service/assets/`
- `components/service/contracts/`
- `components/service/maintenance/`
- `data/serviceMock.ts`

## 11. Recommended First Prompt For Next Session

Gebruik bij hervatten:

```text
Continue Phase 3.7 only.

Refactor the Service module for maintainability without changing business behavior.

Do not add backend, database, ERP integration, offline sync or real persistence.

Goals:
- Split components/service/ServicePlanningView.tsx into smaller service components:
  - service/planning
  - service/interventions
  - service/work-orders
  - service/assets
  - service/contracts
  - service/maintenance
- Move service mock data into data/serviceMock.ts.
- Keep all current screens and behavior working.
- Keep i18n keys unchanged unless missing.
- Preserve current visual design and table layouts.
- Run npm run typecheck and npm run build.

After completion provide changed files, refactor summary, behavior preserved, verification results and recommended next step.
```

## 12. Verification State

Laatste gekende checks na Phase 3.6 en onderhoudstabel-correcties:
- `npm run typecheck` passed.
- `npm run build` passed.

