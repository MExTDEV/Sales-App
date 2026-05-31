# M.Ex.T. Sales App - Screens and Sitemap v0.2

## 1. Navigation rules

- Do not create separate Customers or Prospects navigation modules in version 1.
- Customer and prospect information is accessed through Appointment Detail.
- Do not create a separate Tasks module in version 1.
- Follow-up information belongs to Appointment and AppointmentHistory.
- Sales Agenda and Service Planning are separate modules.
- Service information is always viewable by representatives, read-only unless explicit edit permissions exist.

## 2. Screen inventory

### Authentication and blocking

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Login | Authenticate user | Login/e-mail, password, localized validation, offline/sync notice | All |
| Cash Sheet Block | Prevent representative from starting workday every Monday from 00:00 local user time when previous-week cash is unresolved | Blocking message, cash sheet status, unpaid/uncleared lines, contact/admin instruction | Representative |
| Logout | End session | Confirmation or direct action | All |

### App shell

| Screen/part | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Sidebar | Main navigation | Dashboard, My Info, My Team, Sales Agenda, Service, Service Planning, Inventory, Cash Sheet, Reports, Sync, User Management, Technical Management | Role-based |
| Topbar | Context | User, role, country, language, online/offline status, sync status | All |
| Bottombar | Tablet/mobile navigation | Dashboard, Agenda, Cash Sheet, Sync, More | All |

### Dashboard

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Dashboard | Work start page | Welcome, daily stats, closed appointments, turnover, sync status, cash sheet warnings | All |

Dashboard rules:

- For representatives, dashboard is blocked when Monday cash sheet is not cleared.
- Monday cash sheet blocking starts every Monday at 00:00 local user time, based on the user's country/timezone.
- Dashboard stats must distinguish successful visits from `no_time`, `cancelled`, `customer_absent` and `rescheduled`.

### My information

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| My information | Personal profile and figures | Name, e-mail, role, country, team, preferred language, personal sales figures, appointment history follow-up | All |

### My team

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Team overview | Follow assigned team | Representatives, daily appointments, statuses, customer/prospect split, order turnover, invoice turnover | Sales Leader, Admin by country scope, Superadmin |
| Representative day detail | Detail per representative | Appointment status, customer/prospect number, time, order totals, invoice totals, product-level indicators | Sales Leader, Admin, Superadmin |

### Sales Agenda

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Sales Agenda Today | Daily sales worklist | Planned/open appointments and closed appointments | Representative, Sales Leader |
| Appointment Detail | Operational appointment workspace | Customer/prospect information, contact persons, address, service panel, commercial info, notes, history, demo registration | Representative, Sales Leader |
| Duplicate Appointment | Create new appointment from existing appointment | New date/time popup, relation to original appointment | Representative, Sales Leader |
| Status Action | Close or change status | Completed, Geen tijd, Cancelled, Customer absent, Rescheduled | Representative, Sales Leader |

Appointment status sections:

- Open section: `planned`
- Closed section: `completed`, `no_time`, `cancelled`, `customer_absent`, `rescheduled`

"Geen tijd" rules:

- Sets status to `no_time`
- Moves appointment to closed section
- Remains reportable and auditable
- Does not count as successfully executed visit

### Appointment Detail panels

| Panel | Purpose | Data model |
| --- | --- | --- |
| Customer/Prospect info | View/edit relation data according to permissions | Customer, Prospect |
| Contact persons | View/edit/set inactive contact persons | ContactPerson |
| Address | View/edit/set inactive address data | Address or customer/prospect address fields |
| Service info | View service data, edit only with permission | Contract, Asset, AED, WorkOrder, ServiceIntervention |
| Demo registration | Register demo | DemoRegistration |
| Commercial info | Notes/results/commercial fields | Appointment, VisitReport, AppointmentHistory |
| History | Audit-friendly appointment history | AppointmentHistory, AuditLog |

### Service

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Service overview | View service information | Contracts, AEDs/assets, work orders, interventions, maintenance | All authenticated users with ViewService; representative read-only by default |
| Contracts | View/edit contracts | Contract list/detail | ViewContracts/EditContracts |
| Assets / AEDs | View/edit assets and AEDs | Asset status, AED maintenance data | ViewAEDs/EditAEDs |
| Work Orders | View/edit work orders | Work order status, technician, dates | ViewWorkOrders/EditWorkOrders |
| Interventions | View/edit interventions | Intervention status, timing, notes | Service permissions |
| Maintenance | View/edit maintenance schedules | Maintenance planning and status | Service permissions |

### Service Planning

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Service Planning Day | Plan service work | Interventions, maintenance, installations, work orders | Service department, Service planners, Technical managers |
| Service Planning Week | Weekly service planning | Calendar with filters | Service planners, Technical managers |
| Service Planning Month | Monthly overview | Capacity and status view | Service planners, Technical managers |

Version 1 rule: Service Planning is separate from Sales Agenda.

### Inventory

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Article stock | View stock | Product, quantity, location, status | Representative own stock, managers scoped |
| Stock report | Analyze stock | Product/location/user totals | Sales Leader, Admin, Superadmin |
| Issues | Register material issue | Product, quantity, issuer, receiver | Permission-based |
| Returns | Register material return | Product, quantity, returner, receiver | Permission-based |
| Stock movements | Trace history | Movement type, product, quantity, user, timestamp | Permission-based |
| Demo material | Track demo material | Status and appointment/demo link | Permission-based |

### Cash Sheet

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Cash Sheet Current Week | View current cash sheet | Week, year, status, total incl. VAT, lines | Representative |
| Cash Sheet History | View historical sheets | Week/year filter, statuses, totals | Representative own, managers scoped |
| Deposit Executed | Report deposit | Confirmation, status change to `deposit_reported` | Representative |
| Cash Sheet Admin Review | Clear cash sheet | Review lines, mark cleared | Admin scoped, Superadmin |
| Cash Sheet Unblock | Administratively unblock a representative | Reason, country scope check, audit log | Same-country Admin, Superadmin, future Finance role |

### Reports

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Appointment reports | Analyze appointment execution | Planned/completed/no_time/cancelled/customer_absent/rescheduled | Sales Leader, Admin, Superadmin |
| Order report | Product-level order reporting | Item, category, quantity, turnover, margin, representative, customer, period | Sales Leader, Admin, Superadmin |
| Invoice report | Product-level invoice reporting | Item, category, quantity, turnover, margin, representative, customer, period | Sales Leader, Admin, Superadmin |
| Demo report | Analyze demos | Product, result, representative, customer/prospect | Sales Leader, Admin, Superadmin |
| Inventory report | Analyze stock movements | Issues, returns, demo material | Admin, Superadmin |
| Sync report | Analyze sync status | Queue, conflicts, failures | Admin, Superadmin |

### Synchronization

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Sync status | Show offline-first state | Online/offline, last sync, pending records, errors | All |
| Sync queue | Inspect queue | Entity, operation, status, attempt count | Admin, Superadmin |
| Sync conflicts | Resolve conflicts | Local value, server value, resolution action | Admin, Superadmin, user for own data where allowed |
| Sync errors | Retry or inspect errors | Error message, retry, logs | Admin, Superadmin |

### User Management

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| User list | Manage users inside scope | User, role, country, team, active state | Admin scoped, Superadmin |
| Create user | Add user | User fields, role, country scope | Admin scoped, Superadmin |
| Edit user | Modify user | Profile, role within allowed promotions, country/team | Admin scoped, Superadmin |
| Password reset | Initiate reset | Reset action and audit | Admin scoped, Superadmin |
| Role management | Manage roles/permissions | Roles, permissions, scopes | Superadmin |
| Country scopes | Assign admin country rights | User-country rights | Superadmin |

### Technical Management

| Screen | Purpose | Main elements | Roles |
| --- | --- | --- | --- |
| Technical settings | Manage app/integration settings | API, adapter selection, sync parameters | Superadmin |
| Country configuration | Manage country-specific business rules | VAT, payment methods, payment terms, document formatting | Superadmin |
| Logging | Inspect logs | Audit and integration logs | Superadmin |
| App version | Version information | Build/release/environment | Admin, Superadmin |
| Offline database management | Inspect local DB status | Storage status, reset procedures | Superadmin |

## 3. Sitemap

```text
Login
App
  Dashboard
  My information
  My team
    Representative day detail
  Sales Agenda
    Appointment Detail
      Customer / Prospect information
      Contact persons
      Address
      Service info
      Demo registration
      Commercial info
      Appointment history
    Duplicate Appointment
    Status Action
  Service
    Contracts
    Assets / AEDs
    Work Orders
    Interventions
    Maintenance
  Service Planning
    Day
    Week
    Month
  Inventory
    Article stock
    Stock report
    Issues
    Returns
    Stock movements
    Demo material
  Cash Sheet
    Current week
    History
    Deposit Executed
    Admin Review
  Reports
    Appointments
    Orders product-level
    Invoices product-level
    Demos
    Inventory
    Sync
  Synchronization
    Status
    Queue
    Conflicts
    Errors
  User Management
    Users
    Create user
    Edit user
    Password reset
    Roles and permissions
    Country scopes
  Technical Management
    Technical settings
    Country configuration
    Logs
    App version
    Offline database
```

## 4. Important non-screens

- Customer/prospect data exists, but no separate Customers or Prospects module in version 1.
- Follow-up information exists, but no separate Tasks module in version 1.
- Sales Agenda and Service Planning may be merged in the future, but that is out of scope for version 1.
