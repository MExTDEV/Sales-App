import type {
  Campaign,
  CampaignEvent,
  EntraSyncSummary,
  MailTemplate,
  ScheduleItem,
  TargetGroup
} from "./types";

export const templates: MailTemplate[] = [
  {
    id: "template-expense",
    name: "Onkostennota",
    subject: "Nieuwe goedkeuring nodig voor je onkostennota",
    riskTheme: "Urgentie",
    senderName: "Finance Team",
    senderEmail: "finance@example.com",
    preheader: "Er wacht een interne goedkeuring.",
    body: "Hallo {{firstName}}, er wacht een onkostennota op controle. Bekijk de awareness-link om de signalen te herkennen."
  },
  {
    id: "template-password",
    name: "Wachtwoordbeleid",
    subject: "Controleer je accountinstellingen vandaag",
    riskTheme: "Accountveiligheid",
    senderName: "IT Service Desk",
    senderEmail: "servicedesk@example.com",
    preheader: "Korte controle van je instellingen.",
    body: "Hallo {{firstName}}, dit is een simulatie rond accountveiligheid. We meten geen wachtwoorden of sessies."
  },
  {
    id: "template-shipping",
    name: "Pakketmelding",
    subject: "Levering kon niet worden bevestigd",
    riskTheme: "Persoonlijke context",
    senderName: "Parcel Desk",
    senderEmail: "notifications@example.com",
    preheader: "Bekijk de status van je levering.",
    body: "Hallo {{firstName}}, deze oefening toont hoe pakketmeldingen druk kunnen zetten op gebruikers."
  },
  {
    id: "template-hr",
    name: "HR-document",
    subject: "Nieuw document beschikbaar in HR-portaal",
    riskTheme: "Interne imitatie",
    senderName: "HR Team",
    senderEmail: "hr@example.com",
    preheader: "Er staat een document klaar.",
    body: "Hallo {{firstName}}, dit scenario oefent herkenning van interne imitatie zonder gevoelige data te vragen."
  }
];

export const campaigns: Campaign[] = [
  {
    id: "campaign-jan",
    name: "Q1 onkostennota",
    templateId: "template-expense",
    audience: "Finance, Sales",
    frequency: "quarterly",
    sendDate: "2026-01-13",
    sendWindow: "di 09:30",
    senderName: "Finance Team",
    senderEmail: "finance@example.com",
    landingPage: "https://awareness.local/finance",
    awarenessPage: "https://awareness.local/learn/urgentie",
    status: "complete",
    recipients: 128,
    reportRate: 42,
    clickRate: 8
  },
  {
    id: "campaign-mar",
    name: "Accountcontrole",
    templateId: "template-password",
    audience: "IT, Operations",
    frequency: "monthly",
    sendDate: "2026-03-12",
    sendWindow: "do 10:15",
    senderName: "IT Service Desk",
    senderEmail: "servicedesk@example.com",
    landingPage: "https://awareness.local/account-check",
    awarenessPage: "https://awareness.local/learn/accountveiligheid",
    status: "active",
    recipients: 96,
    reportRate: 38,
    clickRate: 11
  },
  {
    id: "campaign-jun",
    name: "Zomerleveringen",
    templateId: "template-shipping",
    audience: "Alle medewerkers",
    frequency: "once",
    sendDate: "2026-06-10",
    sendWindow: "wo 08:45",
    senderName: "Parcel Desk",
    senderEmail: "notifications@example.com",
    landingPage: "https://awareness.local/package",
    awarenessPage: "https://awareness.local/learn/context",
    status: "scheduled",
    recipients: 144,
    reportRate: 0,
    clickRate: 0
  },
  {
    id: "campaign-sep",
    name: "HR-portaal",
    templateId: "template-hr",
    audience: "Nieuwe medewerkers",
    frequency: "once",
    sendDate: "2026-09-07",
    sendWindow: "ma 11:00",
    senderName: "HR Team",
    senderEmail: "hr@example.com",
    landingPage: "https://awareness.local/hr",
    awarenessPage: "https://awareness.local/learn/interne-imitatie",
    status: "scheduled",
    recipients: 132,
    reportRate: 0,
    clickRate: 0
  }
];

export const yearlySchedule: ScheduleItem[] = [
  {
    month: "Jan",
    template: "Onkostennota",
    audience: "Finance, Sales",
    sendWindow: "di 09:30",
    status: "complete"
  },
  {
    month: "Mrt",
    template: "Wachtwoordbeleid",
    audience: "IT, Operations",
    sendWindow: "do 10:15",
    status: "active"
  },
  {
    month: "Jun",
    template: "Pakketmelding",
    audience: "Alle medewerkers",
    sendWindow: "wo 08:45",
    status: "scheduled"
  },
  {
    month: "Sep",
    template: "HR-document",
    audience: "Nieuwe medewerkers",
    sendWindow: "ma 11:00",
    status: "scheduled"
  }
];

export const campaignEvents: CampaignEvent[] = [
  {
    id: "event-1",
    type: "M",
    person: "Sofie Peeters",
    detail: "rapporteerde de simulatie via Outlook",
    time: "09:14"
  },
  {
    id: "event-2",
    type: "K",
    person: "Tom Janssens",
    detail: "opende de bewustwordingspagina",
    time: "09:06"
  },
  {
    id: "event-3",
    type: "O",
    person: "Nora Willems",
    detail: "opende de mail",
    time: "08:58"
  }
];

export const entraSyncSummary: EntraSyncSummary = {
  tenant: "Nog te koppelen",
  users: 0,
  groups: 0,
  lastSync: "Niet gestart"
};

export const targetGroups: TargetGroup[] = [
  {
    id: "group-all",
    name: "Alle medewerkers",
    source: "Manual",
    users: 144
  },
  {
    id: "group-new",
    name: "Nieuwe medewerkers",
    source: "Manual",
    users: 32
  }
];
