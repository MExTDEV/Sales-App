# Awarenessplatform MVP

## Waarom niet gewoon GoPhish

GoPhish blijft een nuttige referentie voor het domeinmodel, maar het project oogt onderhoudsarm. GitHub toont v0.12.1 als laatste release op 14 september 2022 en externe advisorydatabases melden kwetsbaarheden voor de huidige versie. Voor een interne tool met Entra-integratie en geplande jaarcampagnes is een kleiner, gecontroleerd systeem daarom verstandiger.

## Doel

Een webbased tool voor toegelaten phishing-awarenesssimulaties binnen de eigen organisatie. De tool helpt campagnes plannen, ontvangers selecteren vanuit Microsoft Entra, mails op vooraf bepaalde momenten versturen en resultaten rapporteren.

## Veiligheidsgrenzen

- Geen opslag van wachtwoorden, MFA-codes, sessietokens of ingevulde gevoelige velden.
- Geen functionaliteit om spamfilters, EDR, tenant policies of browserwaarschuwingen te omzeilen.
- Elke campagne heeft een eigenaar, goedgekeurde scope, startdatum, einddatum en retentiebeleid.
- Tracking blijft beperkt tot bezorgd, geopend, geklikt, training gestart en training voltooid.
- Landing pages tonen een directe leerervaring zodra iemand interacteert.

## Kernmodules

- Admin UI: campagnes, templates, doelgroepen, jaarplanning en rapportage.
- Entra sync: Microsoft Graph-koppeling voor gebruikers en groepen met minimale rechten.
- Scheduler: maakt verzendjobs aan voor vaste momenten, spreiding per segment en rate limits.
- Mailer: verzendt via geautoriseerde provider, bijvoorbeeld Microsoft Graph sendMail of SMTP relay.
- Tracking: registreert events met pseudonieme campaign recipient IDs.
- Training pages: korte uitlegpagina's per template met concrete herkenningspunten.
- Audit: houdt bij wie campagnes aanmaakt, wijzigt, goedkeurt en verzendt.

## Datamodel eerste versie

- User: Entra ID, mail, display name, department, segment tags, active state.
- Segment: naam, type, Graph filter of group ID, laatste sync, ledenaantal.
- Template: onderwerp, HTML body, text body, taal, thema, risiconiveau, leerpagina.
- Campaign: naam, eigenaar, scope, status, template set, segment set, start/einddatum.
- Wave: campaign ID, template ID, segment ID, scheduled time, batch size, status.
- RecipientEvent: wave ID, recipient ID, event type, timestamp, user agent hash, IP prefix.

## Entra-integratie

Gebruik een app registration met admin consent en least privilege. Voor de MVP volstaan doorgaans `User.Read.All` en `GroupMember.Read.All` als application permissions. De sync haalt alleen velden op die nodig zijn voor targeting en rapportage. Filters en group IDs worden in segmenten opgeslagen, niet hardcoded in templates.

## Eerste bouwfasen

1. Prototype UI met mockdata voor templates, Entra-segmenten en jaarplanning.
2. Auth voor beheerders en rollen: viewer, campaign manager, approver.
3. Database en datamodel met migraties.
4. Entra Graph sync met dry-run preview voordat data wordt geïmporteerd.
5. Template editor en veilige render pipeline.
6. Scheduler en mailer met rate limits, test mode en auditlog.
7. Tracking endpoint en rapportage.
8. Retentie, export en governance.
