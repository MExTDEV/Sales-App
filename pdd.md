# M.Ex.T. Sales App - Product Definition Document v0.2

## 1. Doel van de applicatie

De M.Ex.T. Sales App is een interne, offline-first bedrijfsapplicatie voor vertegenwoordigers, verkoopleiders, admins en superadmins. De app ondersteunt sales, service-informatie, cash sheet, voorraad, rapportering, gebruikersbeheer, synchronisatie en ERP-integratie.

De app is geen read-only ERP-viewer. Vertegenwoordigers zijn operationele gebruikers en mogen binnen hun rechten gegevens aanmaken of wijzigen, waaronder afspraaknotities, bezoekresultaten, klantinformatie, prospectinformatie, contactpersonen, demo-registraties en commerciële informatie.

## 2. Kernprincipes

- Offline first is een kernvereiste. Zonder offline werking heeft de applicatie onvoldoende bedrijfswaarde.
- Alle ERP-communicatie verloopt via een API-laag en adapterlaag.
- Er wordt nooit rechtstreeks gebouwd tegen Business Central- of Odoo-UI-logica.
- Alle belangrijke wijzigingen worden gelogd via `AuditLog`.
- De app ondersteunt RBAC, scope based visibility en expliciete permissies.
- Meertaligheid NL/FR/DE is een kernvereiste vanaf dag één.
- Business logic voor landen, btw, betalingen en documenten mag niet hardcoded zijn.

## 3. Primaire gebruikersrollen

### Vertegenwoordiger

- Behoort tot één land.
- Ziet alleen zichzelf.
- Ziet alleen eigen afspraken en eigen data.
- Kan eigen sales agenda gebruiken.
- Kan afspraakdetails openen.
- Kan klant/prospectinformatie via afspraakdetail raadplegen en wijzigen waar toegestaan.
- Kan demo's registreren.
- Kan cash sheet bekijken en storting melden.
- Kan eigen voorraad bekijken.
- Kan service-informatie altijd raadplegen, standaard read-only.
- Mag nooit afspraken verwijderen.

### Verkoopleider

- Behoort tot één land.
- Ziet zichzelf en het toegewezen team.
- Kan teamoverzicht bekijken.
- Kan afspraken per vertegenwoordiger opvolgen.
- Kan prestaties vergelijken.
- Kan omzet per order/factuur en productniveau bekijken.
- Kan rapportering raadplegen.

### Admin

- Heeft beheersrechten binnen expliciet toegewezen landen.
- Kan users binnen toegewezen landen aanmaken, bewerken, activeren/deactiveren.
- Kan vertegenwoordiger promoveren naar verkoopleider.
- Kan verkoopleider degraderen naar vertegenwoordiger.
- Kan password resets initiëren.
- Mag geen admins of superadmins aanmaken of beheren.
- Mag niemand promoveren naar admin of superadmin.
- Mag geen gebruikers buiten toegewezen landen beheren.

### Superadmin

- Ziet alle landen, teams en gebruikers.
- Heeft onbeperkte toegang.
- Beheert admins en superadmins.
- Beheert rollen, permissies, landen, teams, technische instellingen, synchronisatieparameters en configuraties.

## 4. Hoofdmodules

### Dashboard

Startscherm na login met welkomblok, dagstatistieken, snelle acties en blokkademeldingen.

Belangrijke cash sheet regel: "maandagochtend" betekent elke maandag vanaf 00:00 lokale tijd, bepaald op basis van het land/de timezone van de gebruiker. Als een vertegenwoordiger een open cash sheet van de vorige week heeft met onbetaalde of niet-geclearde cashlijnen, mag de werkdag niet starten. De app toont dan een blocking screen dat uitlegt dat de cash sheet moet worden opgelost voordat dashboard en agenda gebruikt kunnen worden.

Een geblokkeerde vertegenwoordiger kan alleen worden vrijgegeven door:

- een admin binnen dezelfde country scope
- een superadmin
- een finance role, als die rol later wordt toegevoegd

Vertegenwoordigers kunnen zichzelf niet deblokkeren zonder de storting te registreren.

### Mijn informatie

Persoonlijke gegevens en cijfers van de ingelogde gebruiker: naam, e-mail, rol, land, team, persoonlijke salescijfers, afspraken, omzet, verkochte items en follow-upinformatie uit appointment history.

### Mijn team

Voor verkoopleiders, admins en superadmins. Toont vertegenwoordigers, afspraken per dag, klant/prospect-verdeling, statuses, omzet orders, omzet facturen en productniveau-indicatoren.

### Sales Agenda

Bevat uitsluitend salesafspraken:

- customer appointments
- prospect appointments
- follow-up visits
- demo appointments

Hoofdentity: `Appointment`.

Statussen:

- `planned`
- `completed`
- `no_time`
- `cancelled`
- `customer_absent`
- `rescheduled`

Businessregel voor "Geen tijd":

- status wordt `no_time`
- afspraak verhuist naar de gesloten/afgewerkte sectie
- afspraak blijft zichtbaar voor rapportering
- afspraak blijft zichtbaar voor audit
- afspraak telt niet als succesvol uitgevoerd bezoek

### Appointment Detail

Klant- en prospectdata wordt niet via aparte navigatiemodules ontsloten. De workflow is:

```text
Agenda -> Appointment Detail -> Customer / Prospect information
```

Via appointment detail worden klant/prospect, contactpersonen, service-informatie, demo's, commerciële info, afspraaknotities en historiek getoond of bewerkt volgens permissies.

### Service

Service is raadpleegbaar voor vertegenwoordigers omdat zij deze informatie nodig hebben tijdens klantbezoeken.

Zonder expliciete servicepermissies is service read-only. Met expliciete permissies mag de gebruiker servicegegevens bewerken volgens rechten zoals `ViewService`, `EditService`, `ViewContracts`, `EditContracts`, `ViewAEDs`, `EditAEDs`, `ViewWorkOrders`, `EditWorkOrders`.

### Service Planning

Volledig gescheiden van Sales Agenda in versie 1.

Er worden voorlopig geen extra service-rollen toegevoegd. De huidige rollen blijven `representative`, `sales_leader`, `admin` en `superadmin`. Service capabilities worden geregeld via expliciete permissies, niet via aparte rollen.

Bevat:

- interventions
- maintenance
- installations
- work orders

Hoofdentiteiten:

- `ServiceIntervention`
- `WorkOrder`
- `MaintenanceSchedule`

Toekomstige samenvoeging met sales agenda is out of scope voor versie 1.

### Voorraad

Bevat artikelvoorraad, stockrapport, uitgiftes, terugnames, voorraadbewegingen, demo-materiaal en materiaalstatus. Voorraadbewegingen zijn traceerbaar en bij voorkeur append-only.

### Cash Sheet

Business critical module voor cash die vertegenwoordigers ontvangen en moeten storten aan M.Ex.T.

Cash sheet statuses:

- `open`
- `deposit_reported`
- `cleared`

Actie: "Deposit Executed" / "Storting uitgevoerd". Bij actie wordt status `deposit_reported`, met `depositReportedAt` en `depositReportedByUserId`.

Historische cash sheets blijven beschikbaar.

Cash sheet blocking:

- elke maandag vanaf 00:00 lokale gebruikerstijd
- gebaseerd op het land/de timezone van de gebruiker
- blokkeert wanneer de vorige week nog open cash sheet lines bevat die unpaid of uncleared zijn
- blokkeert login/workday start, dashboard en agenda
- toont een duidelijke blocking screen
- kan worden vrijgegeven door admin binnen dezelfde country scope, superadmin of toekomstige finance role

### Rapportering

Rapportering omvat afspraken, bezoekstatussen, klant/prospect-verdeling, demo's, voorraadbewegingen, synchronisatiestatus, orders en facturen. Product-level reporting is verplicht via `OrderLine` en `InvoiceLine`.

Rapportagevelden:

- item
- item category
- quantity
- turnover
- margin indien beschikbaar
- representative
- customer
- period

### Synchronisatie

Synchronisatie is offline-first, niet online-first met cache. De app gebruikt lokale database, sync queue, conflict detection, conflict resolution, retry, sync error handling en sync status screens.

Representatives mogen klant-, prospect- en contactdata offline wijzigen als ze de juiste permissies hebben. Offline wijzigingen worden altijd queued en later gesynchroniseerd. Er zijn geen hard deletes offline; inactive flags worden gebruikt waar nodig. Alle wijzigingen worden audit logged en conflicten gaan door sync conflict handling.

ERP conflict ownership is policy-based per domein en veldtype. De app of ERP wint niet automatisch altijd.

### Gebruikersbeheer

Gebruikersbeheer volgt RBAC, scope based visibility en expliciete permissies. Admins zijn beperkt tot toegewezen landen. Alleen superadmins beheren admins en superadmins.

### Technisch beheer

Bevat API-instellingen, ERP-adapters, synchronisatieparameters, logging, foutmeldingen, appversie, cachebeheer, offline databasebeheer en landconfiguratie.

## 5. Kernobjecten

- User
- Role
- Permission
- RolePermission
- UserCountryScope
- Country
- Team
- Customer
- Prospect
- ContactPerson
- Address
- Appointment
- AppointmentStatus
- AppointmentHistory
- VisitReport
- DemoRegistration
- Product
- ProductCategory
- StockLocation
- StockItem
- StockMovement
- CashSheet
- CashSheetLine
- PriceList
- PriceListItem
- Contract
- Asset
- AED
- WorkOrder
- ServiceIntervention
- MaintenanceSchedule
- Order
- OrderLine
- Invoice
- InvoiceLine
- SyncQueueItem
- SyncConflict
- AuditLog
- IntegrationLog
- CountryConfiguration
- VATConfiguration
- PaymentMethodConfiguration
- PaymentTermConfiguration

Niet voorzien in versie 1:

- aparte Customers-module
- aparte Prospects-module
- aparte Tasks-module
- `Task`
- `FollowUpAction`

## 6. Niet-functionele vereisten

- snel op tablet/laptop
- responsive
- offline-first
- veilige RBAC en scope based visibility
- NL/FR/DE vanaf dag één
- geen hardcoded UI-teksten
- eigen hosting mogelijk
- GitHub-first
- onderhoudbaar
- API-ready voor Business Central 140 en Odoo v20
- audit trails
- schaalbaar naar België, Nederland, Duitsland en toekomstige landen

## 7. Technische richting

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL of Supabase/PostgreSQL
- Prisma ORM
- Auth.js/NextAuth of Supabase Auth
- lokale database voor offline-first werking
- i18n-architectuur vanaf dag één
- API- en adapterlaag voor Business Central/Odoo

## 8. Ontwikkelfases

### Fase 1 - Visuele basis

- app shell
- mock login met rollen en landen
- sidebar/topbar/bottombar
- dashboard
- sales agenda met mockdata
- appointment detail met klant/prospectpanelen
- service read-only panel
- cash sheet waarschuwing/blokkade als UI-state
- i18n-structuur met NL/FR/DE keys
- Nederlandse bronkeys en placeholder/draft translation files voor Frans en Duits

### Fase 2 - Kernflows sales

- appointment openen
- statuswijzigingen
- geen tijd
- customer absent
- rescheduled
- appointment history
- demo registratie
- mijn team
- basisrapportering

### Fase 3 - Beheer en permissies

- gebruikersbeheer
- rollen
- permissies
- country scopes
- landen
- teams
- admin beperkingen

### Fase 4 - Cash sheet, service en voorraad

- cash sheet lines
- deposit reported flow
- service read-only/edit permissies
- contracten
- assets/AED's
- werkbonnen
- voorraad
- stockbewegingen

### Fase 5 - Backend en database

- PostgreSQL
- Prisma schema
- API-routes
- validatie
- auditlog
- rechtencontrole
- country configuration

### Fase 6 - Offline sync

- lokale database
- sync queue
- SyncConflict
- retry mechanisme
- conflict resolution
- sync status screens
- policy-based ERP conflict handling

### Fase 7 - ERP-integratie

- Business Central 140 adapter
- Odoo v20 adapter
- datamapping
- import/export jobs
- IntegrationLog
