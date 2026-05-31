# M.Ex.T. Sales App - Localization v0.1

## 1. Core decision

Multilingual support is a core requirement from day one.

Supported languages:

- Dutch
- French
- German

New languages must be addable later without code rewrites.

## 2. User language

Each user has:

- `preferredLanguage`

The entire application follows the user's preferred language after login.

Before login, the app may use browser language or a default language.

## 3. No hardcoded UI texts

No hardcoded UI text is allowed in components, screens, validation or dialogs.

Translate:

- menus
- buttons
- labels
- warnings
- notifications
- validation messages
- dialogs
- reports
- table headers
- empty states
- confirmation messages
- destructive action warnings

## 4. Translation key structure

Recommended key groups:

```text
common.*
navigation.*
auth.*
dashboard.*
agenda.*
appointment.*
service.*
servicePlanning.*
inventory.*
cashSheet.*
reports.*
sync.*
admin.*
technical.*
validation.*
warnings.*
permissions.*
countries.*
```

Example:

```text
appointment.actions.noTime
appointment.status.no_time
cashSheet.actions.depositExecuted
cashSheet.blocking.notClearedMonday
```

Phase 1 translation file structure:

```text
locales/
  nl/
    common.json
    navigation.json
    auth.json
    dashboard.json
    agenda.json
    appointment.json
    service.json
    cashSheet.json
    sync.json
    validation.json
    warnings.json
  fr/
    same files with placeholder or draft translations
  de/
    same files with placeholder or draft translations
```

Dutch is the initial source language. French and German files must exist from Phase 1, but final translations are not required yet.

## 5. Locale-sensitive formatting

The system must localize:

- dates
- times
- currency
- numbers
- percentages
- week numbers
- document labels

Formatting depends on:

- user language
- user country
- customer country where legally relevant

## 6. Reports

Reports must translate:

- titles
- filters
- columns
- totals
- statuses
- export labels
- validation and empty states

Report data itself is not translated unless it is a controlled code/status. Product/customer names remain as source data.

## 7. Status labels

Internal status codes stay stable and language-independent.

Example:

- internal code: `no_time`
- Dutch label: `Geen tijd`
- French label: to be translated
- German label: to be translated

Do not store translated labels as business logic.

## 8. Country configuration and language

Countries currently:

- Belgium
- Netherlands
- Germany

Country-specific business rules are not the same as language.

Examples:

- Belgian user can use Dutch, French or German depending on preference.
- VAT rules come from country configuration, not language.

## 9. Development rule

Phase 1 must already use translation keys even with mock data.

Do not build the UI first with hardcoded Dutch text and translate later. That creates avoidable rework.

Initial placeholder policy:

- Dutch keys contain source text.
- French and German files may temporarily mirror Dutch text or contain marked draft placeholders.
- Missing translation keys must be visible during development.
- No component may contain user-facing text directly.
