# M.Ex.T. Sales App - Permissions and Visibility v0.1

## 1. Authorization model

The application uses three layers:

1. RBAC: base role assignment.
2. Scope Based Visibility: which countries, teams and users are visible.
3. Explicit Permissions: module/action-level capabilities.

All checks must be enforced server-side. UI hiding is useful but never sufficient.

## 2. Roles

### Representative

- Belongs to one country.
- Sees only himself/herself.
- Sees only own appointments and own data.
- Can view service information read-only.
- Can edit own operational sales data where permissions allow.
- Can never delete appointments.

### Sales Leader

- Belongs to one country.
- Sees himself/herself.
- Sees assigned team.
- Can view team agenda, performance and reporting.

### Admin

- Has rights only in assigned countries.
- Sees representatives and sales leaders in assigned country scope.
- Manages users inside assigned country scope.

Admin may:

- create users within assigned countries
- edit users within assigned countries
- activate/deactivate users
- promote representative to sales leader
- demote sales leader to representative
- initiate password resets

Admin may not:

- create admins
- create superadmins
- promote anyone to admin
- promote anyone to superadmin
- manage users outside assigned countries

### Superadmin

- Sees all countries.
- Sees all teams.
- Sees all users.
- Has unrestricted access.
- Manages admins and superadmins.

## 3. Country visibility

Current countries:

- Belgium
- Netherlands
- Germany

Future countries must be addable by configuration.

Visibility rules:

| Role | Country visibility | User visibility |
| --- | --- | --- |
| Representative | Own country | Self only |
| Sales Leader | Own country | Self and assigned team |
| Admin | Assigned countries | Representatives and sales leaders inside assigned countries |
| Superadmin | All countries | All users |

## 4. Core permissions

### Sales Agenda

- `ViewOwnAppointments`
- `EditOwnAppointments`
- `ChangeOwnAppointmentStatus`
- `DuplicateOwnAppointment`
- `ViewTeamAppointments`
- `ViewAllAppointments`

Representatives may not receive delete appointment permission.

### Appointment Detail

- `ViewAppointmentDetail`
- `EditAppointmentNotes`
- `EditVisitResult`
- `EditCommercialInfo`
- `ViewAppointmentHistory`

### Customer and Prospect Data

- `ViewCustomerData`
- `EditCustomerData`
- `ViewProspectData`
- `EditProspectData`
- `SetCustomerInactive`
- `SetProspectInactive`

No version 1 separate customer/prospect navigation permission is needed.

### Contact Persons and Addresses

- `ViewContactPersons`
- `EditContactPersons`
- `SetContactPersonInactive`
- `ViewAddresses`
- `EditAddresses`
- `SetAddressInactive`

Representatives may not delete addresses or contact persons.

### Service

- `ViewService`
- `EditService`
- `ViewContracts`
- `EditContracts`
- `ViewAEDs`
- `EditAEDs`
- `ViewWorkOrders`
- `EditWorkOrders`
- `ViewServiceInterventions`
- `EditServiceInterventions`
- `ViewMaintenance`
- `EditMaintenance`

Representatives always have read-only service visibility where customer context allows. Editing requires explicit edit permissions.

Do not add separate service roles for now. Service access is controlled with explicit permissions assigned to the existing roles:

- `representative`
- `sales_leader`
- `admin`
- `superadmin`

### Service Planning

- `ViewServicePlanning`
- `EditServicePlanning`
- `AssignServiceWork`

Service Planning is not Sales Agenda.

### Inventory

- `ViewOwnStock`
- `ViewTeamStock`
- `ViewCountryStock`
- `ManageStock`
- `CreateStockMovement`
- `ViewStockMovements`

### Cash Sheet

- `ViewOwnCashSheet`
- `ReportOwnDeposit`
- `ViewScopedCashSheets`
- `ClearCashSheet`
- `UnblockCashSheetWorkday`

Cash sheet unblock rules:

- Representatives cannot unblock themselves without registering the deposit.
- Admins may unblock only representatives inside the same assigned country scope.
- Superadmins may unblock any representative.
- A future finance role may receive unblock rights if the role is added later.
- Every unblock must be audit logged with reason, timestamp and user.

### Reporting

- `ViewOwnReports`
- `ViewTeamReports`
- `ViewCountryReports`
- `ViewGlobalReports`
- `ViewProductLevelReporting`

### Users and Admin

- `ViewUsers`
- `CreateRepresentative`
- `CreateSalesLeader`
- `EditScopedUsers`
- `ActivateDeactivateScopedUsers`
- `PromoteRepresentativeToSalesLeader`
- `DemoteSalesLeaderToRepresentative`
- `InitiatePasswordReset`
- `ManageAdmins`
- `ManageSuperadmins`
- `ManageRoles`
- `ManagePermissions`
- `ManageCountryScopes`

Only superadmin may receive `ManageAdmins`, `ManageSuperadmins`, `ManageRoles`, `ManagePermissions` and `ManageCountryScopes`.

### Technical

- `ViewTechnicalSettings`
- `EditTechnicalSettings`
- `ViewAuditLog`
- `ViewIntegrationLog`
- `ManageCountryConfiguration`
- `ManageSyncSettings`

## 5. Destructive actions

All destructive or sensitive actions require:

- confirmation
- warning text
- audit logging
- permission check
- scope check

Prefer:

- inactive flags
- statuses
- soft delete

Avoid hard deletes.
