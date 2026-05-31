# Awareness

Awareness is een interne webapp voor phishing-simulaties en security awareness.

## Scope

- Templates beheren voor herbruikbare awareness-mails.
- Campagnes vooraf plannen over een volledig jaar.
- Doelgroepen later synchroniseren vanuit Microsoft Entra ID via Microsoft Graph.
- Alleen awareness-events meten: ontvangen, geopend, geklikt en gemeld.
- Geen wachtwoorden, sessies of gevoelige formulierdata verzamelen.

## Huidige prototypefuncties

- Nieuwe templates aanmaken en previewen.
- Nieuwe campagnes plannen op basis van template en doelgroep.
- Ingeplande campagnes openen en instellingen aanpassen, inclusief datum, tijd, frequentie, ontvangers, afzender en pagina's.
- Templates openen en opmaken, inclusief afzender, onderwerp, preheader en body.
- Template-body opmaken met een uitgebreide WYSIWYG-editor voor koppen, quotes, vet, cursief, onderstrepen, uitlijning, lijsten, kleuren, links, CTA-knoppen, variabelen, undo/redo en HTML-preview.
- Aparte templatepagina openen om bestaande templates te beheren en nieuwe templates aan te maken.
- Campagnes starten, afronden en demo-meetpunten registreren.
- Entra-sync simuleren met doelgroepen uit Microsoft Graph.
- Recente events simuleren en tonen.
- Wijzigingen lokaal bewaren via `localStorage`.

## Eerste run

```powershell
npm run dev
```

De app draait standaard op `http://localhost:3000`.

## Entra-koppeling

De start van de connector staat in `lib/entra.ts`. Voor productie is een Entra app registration nodig met admin consent voor least-privilege Microsoft Graph permissies, typisch `User.Read.All` om gebruikers te kunnen lezen.

## Bronnen bekeken

- GoPhish release-info: `v0.12.1` is de recentste publieke release die ik vond, ongeveer 3 jaar oud.
- Microsoft Graph documentatie: gebruikers worden via `/v1.0/users` opgehaald; extra velden vragen we expliciet op met `$select`.
