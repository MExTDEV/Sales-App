# M.Ex.T. Sales App - Database Entities v0.2

## 1. Database principles

- PostgreSQL or Supabase/PostgreSQL is the system database.
- The application is offline first and requires a local database on the client.
- All important modifications are logged in `AuditLog`.
- Avoid hard deletes. Prefer statuses, inactive flags and soft deletes.
- ERP communication uses API and adapter layers only.
- External references use `externalSystem`, `externalId` and `externalUpdatedAt`.
- Country-specific business rules are configuration, never hardcoded.

Standard fields for mutable entities:

- `id`
- `createdAt`
- `updatedAt`
- `deletedAt`
- `createdByUserId`
- `updatedByUserId`
- `externalSystem`
- `externalId`
- `externalUpdatedAt`
- `version`

Inactive fields for addresses/contact persons and similar records:

- `isActive`
- `inactiveReason`
- `inactiveAt`
- `inactiveByUserId`

## 2. Identity, RBAC and visibility

### User

- `id`
- `loginName`
- `email`
- `passwordHash` or auth provider reference
- `displayName`
- `preferredLanguage`
- `primaryCountryId`
- `teamId`
- `roleId`
- `isActive`
- `lastLoginAt`

### Role

Initial role codes:

- `representative`
- `sales_leader`
- `admin`
- `superadmin`

Fields:

- `id`
- `code`
- `name`
- `description`
- `isSystemRole`

### Permission

- `id`
- `code`
- `module`
- `action`
- `description`

Examples:

- `ViewService`
- `EditService`
- `ViewContracts`
- `EditContracts`
- `ViewAEDs`
- `EditAEDs`
- `ViewWorkOrders`
- `EditWorkOrders`

### RolePermission

- `roleId`
- `permissionId`

### UserCountryScope

Defines admin/superadmin visibility and management scope.

- `id`
- `userId`
- `countryId`
- `canManageUsers`
- `canViewReports`
- `canManageConfiguration`

### Country

Current countries:

- Belgium
- Netherlands
- Germany

Fields:

- `id`
- `code`
- `name`
- `defaultLanguage`
- `timezone`
- `currencyCode`
- `isActive`

### Team

- `id`
- `name`
- `countryId`
- `leaderUserId`
- `isActive`

## 3. Country-specific configuration

### CountryConfiguration

- `id`
- `countryId`
- `documentLocale`
- `invoiceNumberFormat`
- `documentNumberFormat`
- `legalText`
- `isActive`

### VATConfiguration

- `id`
- `countryId`
- `code`
- `percentage`
- `description`
- `isExempt`
- `validFrom`
- `validTo`

### PaymentMethodConfiguration

- `id`
- `countryId`
- `code`
- `name`
- `requiresReference`
- `isActive`

### PaymentTermConfiguration

- `id`
- `countryId`
- `code`
- `name`
- `days`
- `isActive`

## 4. Customers, prospects and contact data

There are no separate Customers or Prospects modules in version 1. These entities are accessed through Appointment Detail.

### Customer

- `id`
- `customerNumber`
- `name`
- `countryId`
- `vatNumber`
- `phone`
- `email`
- `commercialNotes`
- `isActive`
- `inactiveReason`
- `inactiveAt`
- `inactiveByUserId`
- `externalSystem`
- `externalId`

Offline rule: representatives may edit permitted customer fields offline. Exact field-level rules must be refined before ERP integration. No offline hard delete is allowed.

### Prospect

- `id`
- `prospectNumber`
- `name`
- `countryId`
- `status`
- `assignedUserId`
- `commercialNotes`
- `isActive`
- `inactiveReason`
- `inactiveAt`
- `inactiveByUserId`
- `externalSystem`
- `externalId`

Offline rule: representatives may edit permitted prospect fields offline. Exact field-level rules must be refined before ERP integration. No offline hard delete is allowed.

### Address

Representatives may set addresses inactive, but may not delete them.

- `id`
- `customerId` nullable
- `prospectId` nullable
- `type`
- `addressLine1`
- `addressLine2`
- `postalCode`
- `city`
- `countryId`
- `isActive`
- `inactiveReason`
- `inactiveAt`
- `inactiveByUserId`

### ContactPerson

Representatives may set contact persons inactive, but may not delete them.

- `id`
- `customerId` nullable
- `prospectId` nullable
- `firstName`
- `lastName`
- `email`
- `phone`
- `roleTitle`
- `isPrimary`
- `isActive`
- `inactiveReason`
- `inactiveAt`
- `inactiveByUserId`

Rule: exactly one of `customerId` or `prospectId` must be filled.

Offline rule: representatives may edit permitted contact fields offline and may set contacts inactive. No offline hard delete is allowed.

## 5. Sales agenda

### Appointment

Sales appointment only. Service planning does not use this entity in version 1.

- `id`
- `assignedUserId`
- `customerId` nullable
- `prospectId` nullable
- `contactPersonId` nullable
- `appointmentType`
- `statusId`
- `startsAt`
- `endsAt`
- `addressId` nullable
- `label`
- `notes`
- `visitResult`
- `commercialInfo`
- `duplicatedFromAppointmentId` nullable
- `rescheduledFromAppointmentId` nullable
- `closedAt` nullable
- `closedByUserId` nullable
- `externalSystem`
- `externalId`

Deletion rule: representatives may never delete appointments.

### AppointmentStatus

Required codes:

- `planned`
- `completed`
- `no_time`
- `cancelled`
- `customer_absent`
- `rescheduled`

Fields:

- `id`
- `code`
- `name`
- `sortOrder`
- `isClosed`
- `countsAsSuccessfulVisit`

Rules:

- `completed` counts as successful visit.
- `no_time`, `cancelled`, `customer_absent` and `rescheduled` are closed/reportable/auditable but do not count as successful executed visits.

### AppointmentHistory

Follow-up information belongs here, not in a separate Tasks module.

- `id`
- `appointmentId`
- `userId`
- `eventType`
- `oldStatusId` nullable
- `newStatusId` nullable
- `note`
- `followUpText`
- `createdAt`

### VisitReport

- `id`
- `appointmentId`
- `userId`
- `visitDate`
- `summary`
- `result`
- `commercialInfo`
- `createdAt`

### DemoRegistration

- `id`
- `appointmentId` nullable
- `customerId` nullable
- `prospectId` nullable
- `userId`
- `productId`
- `demoDate`
- `result`
- `notes`
- `createdAt`

Do not create `Task` or `FollowUpAction` for version 1.

## 6. Products, prices and stock

### Product

- `id`
- `sku`
- `name`
- `description`
- `productCategoryId`
- `isDemoMaterial`
- `isActive`
- `externalSystem`
- `externalId`

### ProductCategory

- `id`
- `code`
- `name`

### PriceList

- `id`
- `name`
- `countryId`
- `currencyCode`
- `validFrom`
- `validTo`
- `isActive`

### PriceListItem

- `id`
- `priceListId`
- `productId`
- `unitPrice`
- `vatConfigurationId`

### StockLocation

- `id`
- `name`
- `locationType`
- `countryId` nullable
- `teamId` nullable
- `userId` nullable

### StockItem

- `id`
- `productId`
- `stockLocationId`
- `quantity`
- `status`
- `serialNumber` nullable
- `lotNumber` nullable
- `updatedAt`

### StockMovement

- `id`
- `productId`
- `fromLocationId` nullable
- `toLocationId` nullable
- `quantity`
- `movementType`
- `status`
- `performedByUserId`
- `relatedAppointmentId` nullable
- `relatedDemoRegistrationId` nullable
- `movementDate`
- `notes`

## 7. Cash sheet

### CashSheet

- `id`
- `userId`
- `weekNumber`
- `year`
- `status`
- `totalAmountInclVat`
- `depositReportedAt` nullable
- `depositReportedByUserId` nullable
- `clearedAt` nullable
- `clearedByUserId` nullable
- `blockedAt` nullable
- `unblockedAt` nullable
- `unblockedByUserId` nullable
- `unblockReason` nullable

Statuses:

- `open`
- `deposit_reported`
- `cleared`

Rule: every Monday from 00:00 local user time, based on the user's country/timezone, representatives with an open previous-week cash sheet containing unpaid or uncleared cash lines may not start the workday. Login, dashboard and agenda are blocked until resolved.

Unblock rule: only an admin within the same country scope, a superadmin, or a future finance role may unblock. Representatives cannot unblock themselves without registering the deposit.

### CashSheetLine

- `id`
- `cashSheetId`
- `date`
- `documentNo`
- `customerName`
- `amountInclVat`
- `isPaid`
- `isCleared`
- `clearedAt` nullable
- `createdAt`

### CashSheetUnblockLog

- `id`
- `cashSheetId`
- `representativeUserId`
- `unblockedByUserId`
- `unblockReason`
- `createdAt`

Every unblock is also written to `AuditLog`.

## 8. Orders, invoices and reporting

### Order

- `id`
- `orderNumber`
- `customerId` nullable
- `prospectId` nullable
- `userId`
- `orderDate`
- `totalAmount`
- `currencyCode`
- `status`
- `externalSystem`
- `externalId`

### OrderLine

- `id`
- `orderId`
- `productId`
- `productCategoryId`
- `quantity`
- `unitPrice`
- `turnover`
- `margin` nullable
- `vatConfigurationId` nullable

### Invoice

- `id`
- `invoiceNumber`
- `customerId`
- `userId` nullable
- `invoiceDate`
- `totalAmount`
- `currencyCode`
- `status`
- `externalSystem`
- `externalId`

### InvoiceLine

- `id`
- `invoiceId`
- `productId`
- `productCategoryId`
- `quantity`
- `unitPrice`
- `turnover`
- `margin` nullable
- `vatConfigurationId` nullable

Product-level reporting must use order/invoice lines, not totals only.

## 9. Service and service planning

### Contract

- `id`
- `contractNumber`
- `customerId`
- `startDate`
- `endDate`
- `status`
- `contractType`
- `externalSystem`
- `externalId`

### Asset

- `id`
- `customerId`
- `assetNumber`
- `name`
- `assetType`
- `serialNumber`
- `locationDescription`
- `status`
- `externalSystem`
- `externalId`

### AED

- `id`
- `assetId`
- `batteryExpiryDate`
- `padExpiryDate`
- `lastInspectionDate`
- `nextMaintenanceDate`

### WorkOrder

- `id`
- `workOrderNumber`
- `customerId`
- `assetId` nullable
- `assignedTechnicianId` nullable
- `status`
- `plannedAt`
- `completedAt` nullable
- `description`
- `externalSystem`
- `externalId`

### ServiceIntervention

- `id`
- `workOrderId` nullable
- `customerId`
- `assetId` nullable
- `technicianUserId` nullable
- `interventionType`
- `status`
- `startsAt`
- `endsAt`
- `notes`

### MaintenanceSchedule

- `id`
- `assetId`
- `customerId`
- `scheduleType`
- `frequency`
- `nextDueAt`
- `lastCompletedAt` nullable
- `status`
- `assignedTechnicianId` nullable

## 10. Synchronization and audit

### SyncQueueItem

- `id`
- `entityType`
- `entityId`
- `operation`
- `payload`
- `status`
- `attemptCount`
- `lastAttemptAt`
- `nextRetryAt`
- `errorMessage`
- `createdByUserId`
- `createdAt`

### SyncConflict

- `id`
- `syncQueueItemId`
- `entityType`
- `entityId`
- `localPayload`
- `remotePayload`
- `conflictType`
- `resolutionStatus`
- `resolvedByUserId` nullable
- `resolvedAt` nullable
- `resolutionPayload` nullable

### AuditLog

- `id`
- `userId`
- `entityType`
- `entityId`
- `action`
- `before`
- `after`
- `ipAddress`
- `userAgent`
- `createdAt`

### IntegrationLog

- `id`
- `externalSystem`
- `direction`
- `endpoint`
- `status`
- `requestSummary`
- `responseSummary`
- `errorMessage`
- `createdAt`

## 11. Relationship overview

```text
Country 1--n Team
Country 1--n User
Country 1--n CountryConfiguration
Country 1--n VATConfiguration
Country 1--n PaymentMethodConfiguration
Country 1--n PaymentTermConfiguration

Role n--n Permission
User n--n Country through UserCountryScope
Team 1--n User

Customer 1--n Address
Prospect 1--n Address
Customer 1--n ContactPerson
Prospect 1--n ContactPerson

User 1--n Appointment
Appointment 1--n AppointmentHistory
Appointment 1--n VisitReport
Appointment 1--n DemoRegistration

ProductCategory 1--n Product
Product 1--n OrderLine
Product 1--n InvoiceLine

CashSheet 1--n CashSheetLine
Order 1--n OrderLine
Invoice 1--n InvoiceLine

Customer 1--n Contract
Customer 1--n Asset
Asset 0--1 AED
Asset 1--n MaintenanceSchedule
WorkOrder 1--n ServiceIntervention

SyncQueueItem 0--n SyncConflict
User 1--n AuditLog
```
