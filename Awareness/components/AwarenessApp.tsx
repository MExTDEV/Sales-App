"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  campaignEvents as seedEvents,
  campaigns as seedCampaigns,
  entraSyncSummary as seedSync,
  targetGroups as seedGroups,
  templates as seedTemplates
} from "@/lib/sample-data";
import type {
  Campaign,
  CampaignEvent,
  CampaignFrequency,
  CampaignStatus,
  EntraSyncSummary,
  MailTemplate,
  TargetGroup
} from "@/lib/types";

type AppState = {
  templates: MailTemplate[];
  campaigns: Campaign[];
  events: CampaignEvent[];
  groups: TargetGroup[];
  sync: EntraSyncSummary;
};

const storageKey = "awareness-app-state-v1";

const statusLabel: Record<CampaignStatus, string> = {
  draft: "Concept",
  scheduled: "Gepland",
  active: "Actief",
  complete: "Afgerond"
};

const frequencyLabel: Record<CampaignFrequency, string> = {
  once: "Eenmalig",
  monthly: "Maandelijks",
  quarterly: "Per kwartaal"
};

const initialState: AppState = {
  templates: seedTemplates,
  campaigns: seedCampaigns,
  events: seedEvents,
  groups: seedGroups,
  sync: seedSync
};

export default function AwarenessApp() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AppState>(initialState);
  const [activeForm, setActiveForm] = useState<"campaign" | "template" | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(seedCampaigns[0]?.id ?? "");
  const [openCampaignId, setOpenCampaignId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(seedTemplates[0]?.id ?? "");
  const [openTemplatesScreen, setOpenTemplatesScreen] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [toast, setToast] = useState("Demo data geladen. Wijzigingen worden lokaal bewaard.");

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      setState(parsed);
      setSelectedCampaignId(parsed.campaigns[0]?.id ?? "");
      setSelectedTemplateId(parsed.templates[0]?.id ?? "");
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [mounted, state]);

  const selectedCampaign = useMemo(
    () => state.campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? state.campaigns[0],
    [selectedCampaignId, state.campaigns]
  );
  const openCampaign = useMemo(
    () => state.campaigns.find((campaign) => campaign.id === openCampaignId),
    [openCampaignId, state.campaigns]
  );
  const selectedTemplate = useMemo(
    () => state.templates.find((template) => template.id === selectedTemplateId) ?? state.templates[0],
    [selectedTemplateId, state.templates]
  );
  const scheduledCampaigns = state.campaigns.filter((campaign) => campaign.status === "scheduled");
  const activeCampaigns = state.campaigns.filter((campaign) => campaign.status === "active");
  const averageReportRate = average(state.campaigns.map((campaign) => campaign.reportRate));
  const averageClickRate = average(state.campaigns.map((campaign) => campaign.clickRate));

  function addEvent(type: CampaignEvent["type"], person: string, detail: string) {
    const event: CampaignEvent = {
      id: crypto.randomUUID(),
      type,
      person,
      detail,
      time: new Intl.DateTimeFormat("nl-BE", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date())
    };

    setState((current) => ({
      ...current,
      events: [event, ...current.events].slice(0, 8)
    }));
  }

  function handleCreateTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const template = templateFromForm(formData, crypto.randomUUID());

    setState((current) => ({
      ...current,
      templates: [template, ...current.templates]
    }));
    setSelectedTemplateId(template.id);
    setOpenTemplatesScreen(true);
    setIsCreatingTemplate(false);
    setActiveForm(null);
    setToast(`Template "${template.name}" is toegevoegd.`);
    event.currentTarget.reset();
  }

  function handleUpdateTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTemplate) {
      return;
    }

    const updatedTemplate = templateFromForm(new FormData(event.currentTarget), selectedTemplate.id);
    setState((current) => ({
      ...current,
      templates: current.templates.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    }));
    setToast(`Template "${updatedTemplate.name}" is opgeslagen.`);
  }

  function handleCreateCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const campaign = campaignFromForm(new FormData(event.currentTarget), crypto.randomUUID(), state.groups);

    setState((current) => ({
      ...current,
      campaigns: [campaign, ...current.campaigns]
    }));
    setSelectedCampaignId(campaign.id);
    setActiveForm(null);
    setToast(`Campagne "${campaign.name}" is ingepland.`);
    event.currentTarget.reset();
  }

  function handleUpdateCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCampaign) {
      return;
    }

    const updatedCampaign = campaignFromForm(
      new FormData(event.currentTarget),
      selectedCampaign.id,
      state.groups,
      selectedCampaign
    );
    setState((current) => ({
      ...current,
      campaigns: current.campaigns.map((campaign) =>
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign
      )
    }));
    setToast(`Instellingen voor "${updatedCampaign.name}" zijn opgeslagen.`);
  }

  function updateCampaignStatus(id: string, status: CampaignStatus) {
    setState((current) => ({
      ...current,
      campaigns: current.campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, status } : campaign
      )
    }));
    const campaign = state.campaigns.find((item) => item.id === id);
    setSelectedCampaignId(id);
    setToast(`${campaign?.name ?? "Campagne"} staat nu op ${statusLabel[status].toLowerCase()}.`);
  }

  function simulateEntraSync() {
    const importedGroups: TargetGroup[] = [
      { id: "entra-finance", name: "Finance", source: "Entra", users: 28, department: "Finance" },
      { id: "entra-sales", name: "Sales", source: "Entra", users: 42, department: "Sales" },
      { id: "entra-operations", name: "Operations", source: "Entra", users: 51, department: "Operations" }
    ];

    setState((current) => ({
      ...current,
      groups: mergeGroups(current.groups, importedGroups),
      sync: {
        tenant: "Demo tenant",
        users: 121,
        groups: importedGroups.length,
        lastSync: new Intl.DateTimeFormat("nl-BE", {
          dateStyle: "short",
          timeStyle: "short"
        }).format(new Date())
      }
    }));
    setToast("Entra-sync gesimuleerd: 121 gebruikers en 3 groepen geimporteerd.");
  }

  function simulateCampaignEvent(campaign: Campaign) {
    const clickRate = Math.min(campaign.clickRate + 3, 100);
    const reportRate = Math.min(campaign.reportRate + 5, 100);

    setState((current) => ({
      ...current,
      campaigns: current.campaigns.map((item) =>
        item.id === campaign.id ? { ...item, clickRate, reportRate } : item
      )
    }));
    setSelectedCampaignId(campaign.id);
    addEvent("K", "Demo gebruiker", `interactie geregistreerd voor ${campaign.name}`);
    setToast(`Nieuwe meetpunten toegevoegd aan "${campaign.name}".`);
  }

  function resetDemoData() {
    setState(initialState);
    setSelectedCampaignId(seedCampaigns[0]?.id ?? "");
    setOpenCampaignId(null);
    setOpenTemplatesScreen(false);
    setIsCreatingTemplate(false);
    setSelectedTemplateId(seedTemplates[0]?.id ?? "");
    setToast("Demo data is teruggezet.");
  }

  function openCampaignScreen(id: string) {
    setSelectedCampaignId(id);
    setOpenCampaignId(id);
  }

  function openTemplateScreen(id?: string) {
    if (id) {
      setSelectedTemplateId(id);
      setIsCreatingTemplate(false);
    }

    setOpenTemplatesScreen(true);
  }

  function openTemplateCreator() {
    setOpenTemplatesScreen(true);
    setIsCreatingTemplate(true);
  }

  if (!mounted) {
    return (
      <main className="shell">
        <aside className="sidebar" aria-label="Primaire navigatie">
          <div>
            <p className="eyebrow">Awareness</p>
            <h1>Phishing-simulaties voor eigen medewerkers</h1>
          </div>
        </aside>
        <section className="content">
          <p className="toast" role="status">Dashboard laden...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primaire navigatie">
        <div>
          <p className="eyebrow">Awareness</p>
          <h1>Phishing-simulaties voor eigen medewerkers</h1>
        </div>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#planning">Jaarplanning</a>
          <a href="#campaign-settings">Campagne</a>
          <button type="button" onClick={() => openTemplateScreen()}>Templates</button>
          <a href="#entra">Entra</a>
          <a href="#events">Events</a>
        </nav>
        <div className="policyBox">
          <strong>Guardrails</strong>
          <span>Geen wachtwoorden opslaan. Alleen meten: ontvangen, geopend, geklikt en gerapporteerd.</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Werkend prototype</p>
            <h2 id="dashboard">Campagne-overzicht</h2>
          </div>
          <div className="buttonGroup">
            <button className="ghostButton" type="button" onClick={resetDemoData}>Reset demo</button>
            <button className="primaryButton" type="button" onClick={() => setActiveForm("campaign")}>
              Nieuwe campagne
            </button>
          </div>
        </header>

        <p className="toast" role="status">{toast}</p>

        <section className="metrics" aria-label="Kerncijfers">
          <Metric label="Templates" value={state.templates.length.toString()} detail="klaar voor hergebruik" />
          <Metric label="Gepland" value={scheduledCampaigns.length.toString()} detail="campagnes in wachtrij" />
          <Metric label="Actief" value={activeCampaigns.length.toString()} detail="worden nu opgevolgd" />
          <Metric label="Rapportage" value={`${averageReportRate}%`} detail={`klikratio ${averageClickRate}%`} />
        </section>

        {activeForm === "campaign" ? (
          <CampaignForm
            groups={state.groups}
            templates={state.templates}
            onCancel={() => setActiveForm(null)}
            onSubmit={handleCreateCampaign}
          />
        ) : null}

        {activeForm === "template" ? (
          <TemplateCreateForm onCancel={() => setActiveForm(null)} onSubmit={handleCreateTemplate} />
        ) : null}

        <section className="workGrid">
          <article className="panel wide" id="planning">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Vooraf bepaald</p>
                <h3>Jaarplanning</h3>
              </div>
              <button className="ghostButton" type="button" onClick={() => setActiveForm("campaign")}>
                Inplannen
              </button>
            </div>
            <div className="timeline">
              {state.campaigns.map((campaign) => (
                <button
                  className={`timelineItem selectable ${selectedCampaign?.id === campaign.id ? "selected" : ""}`}
                  key={campaign.id}
                  type="button"
                  onClick={() => openCampaignScreen(campaign.id)}
                >
                  <time>{campaign.sendDate ? formatDate(campaign.sendDate) : "Datum kiezen"}</time>
                  <div>
                    <strong>{campaign.name}</strong>
                    <span>
                      {templateName(campaign.templateId, state.templates)} · {campaign.audience ?? "Geen doelgroep"} · {campaign.recipients} ontvangers
                    </span>
                    <small>{frequencyLabel[campaign.frequency ?? "once"]} · {campaign.sendWindow ?? "Geen tijdstip"}</small>
                  </div>
                  <span className={`status ${campaign.status}`}>{statusLabel[campaign.status]}</span>
                  <span className="openHint">Open</span>
                </button>
              ))}
            </div>
          </article>

          <article className="panel" id="entra">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Microsoft Graph</p>
                <h3>Entra-sync</h3>
              </div>
              <button className="ghostButton" type="button" onClick={simulateEntraSync}>Sync demo</button>
            </div>
            <dl className="syncList">
              <div>
                <dt>Tenant</dt>
                <dd>{state.sync.tenant}</dd>
              </div>
              <div>
                <dt>Gebruikers</dt>
                <dd>{state.sync.users}</dd>
              </div>
              <div>
                <dt>Doelgroepen</dt>
                <dd>{state.groups.length}</dd>
              </div>
              <div>
                <dt>Laatste sync</dt>
                <dd>{state.sync.lastSync}</dd>
              </div>
            </dl>
            <div className="groupList">
              {state.groups.map((group) => (
                <span key={group.id}>{group.name} <small>{group.users}</small></span>
              ))}
            </div>
          </article>
        </section>

        <section className="workGrid">
          <article className="panel" id="templates">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Bibliotheek</p>
                <h3>Mailtemplates</h3>
              </div>
              <button className="ghostButton" type="button" onClick={openTemplateCreator}>
                Template maken
              </button>
            </div>
            <div className="templateList">
              {state.templates.map((template) => (
                <button
                  className={`templateRow selectable ${selectedTemplate?.id === template.id ? "selected" : ""}`}
                  key={template.id}
                  type="button"
                  onClick={() => openTemplateScreen(template.id)}
                >
                  <div>
                    <strong>{template.name}</strong>
                    <span>{template.subject}</span>
                  </div>
                  <small>{template.riskTheme}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Templatebeheer</p>
                <h3>Opmaken en bewerken</h3>
              </div>
              <button className="ghostButton" type="button" onClick={() => openTemplateScreen()}>
                Open templates
              </button>
            </div>
            <p className="muted">
              Open de templatepagina om bestaande mails te bewerken of een nieuwe mailtemplate aan te maken.
            </p>
          </article>
        </section>

        <section className="workGrid">
          <article className="panel wide" id="events">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Events</p>
                <h3>Recente activiteit</h3>
              </div>
              <button className="ghostButton" type="button" onClick={() => addEvent("M", "Demo melder", "rapporteerde een simulatie")}>
                Melding simuleren
              </button>
            </div>
            <div className="eventList">
              {state.events.map((event) => (
                <div className="eventRow" key={event.id}>
                  <span>{event.type}</span>
                  <div>
                    <strong>{event.person}</strong>
                    <small>{event.detail}</small>
                  </div>
                  <time>{event.time}</time>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div>
              <p className="eyebrow">Volgende bouwblok</p>
              <h3>Backend klaarzetten</h3>
            </div>
            <p className="muted">
              Deze UI werkt nu lokaal. De volgende stap is een API met database-tabellen voor templates,
              doelgroepen, campagnes, verzendjobs en events.
            </p>
          </article>
        </section>
      </section>

      {openCampaign ? (
        <section className="screenOverlay" aria-label="Campagne-instellingen">
          <div className="screenHeader">
            <button className="ghostButton" type="button" onClick={() => setOpenCampaignId(null)}>
              Terug naar dashboard
            </button>
            <div>
              <p className="eyebrow">Jaarplanning</p>
              <h2>{openCampaign.name}</h2>
            </div>
          </div>
          <CampaignSettingsForm
            campaign={openCampaign}
            groups={state.groups}
            templates={state.templates}
            onSubmit={handleUpdateCampaign}
            onStart={(id) => updateCampaignStatus(id, "active")}
            onComplete={(id) => updateCampaignStatus(id, "complete")}
            onSimulate={simulateCampaignEvent}
          />
        </section>
      ) : null}

      {openTemplatesScreen ? (
        <section className="screenOverlay" aria-label="Templatebeheer">
          <div className="screenHeader">
            <button className="ghostButton" type="button" onClick={() => setOpenTemplatesScreen(false)}>
              Terug naar dashboard
            </button>
            <div>
              <p className="eyebrow">Mailtemplates</p>
              <h2>Templates maken en bewerken</h2>
            </div>
          </div>
          <div className="templateScreen">
            <article className="panel">
              <div className="panelHeader">
                <div>
                  <p className="eyebrow">Bibliotheek</p>
                  <h3>Bestaande templates</h3>
                </div>
                <button className="ghostButton" type="button" onClick={openTemplateCreator}>
                  Nieuw
                </button>
              </div>
              <div className="templateList">
                {state.templates.map((template) => (
                  <button
                    className={`templateRow selectable ${!isCreatingTemplate && selectedTemplate?.id === template.id ? "selected" : ""}`}
                    key={template.id}
                    type="button"
                    onClick={() => openTemplateScreen(template.id)}
                  >
                    <div>
                      <strong>{template.name}</strong>
                      <span>{template.subject}</span>
                    </div>
                    <small>{template.riskTheme}</small>
                  </button>
                ))}
              </div>
            </article>

            {isCreatingTemplate ? (
              <TemplateCreateForm onCancel={() => setIsCreatingTemplate(false)} onSubmit={handleCreateTemplate} />
            ) : (
              <TemplateSettingsForm template={selectedTemplate} onSubmit={handleUpdateTemplate} />
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function CampaignForm({
  groups,
  templates,
  onCancel,
  onSubmit
}: {
  groups: TargetGroup[];
  templates: MailTemplate[];
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="panel formPanel" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Nieuwe campagne</p>
        <h3>Plan een simulatie</h3>
      </div>
      <CampaignFields groups={groups} templates={templates} />
      <div className="buttonGroup">
        <button className="ghostButton" type="button" onClick={onCancel}>Annuleren</button>
        <button className="primaryButton" type="submit">Campagne plannen</button>
      </div>
    </form>
  );
}

function CampaignSettingsForm({
  campaign,
  groups,
  templates,
  onSubmit,
  onStart,
  onComplete,
  onSimulate
}: {
  campaign?: Campaign;
  groups: TargetGroup[];
  templates: MailTemplate[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onSimulate: (campaign: Campaign) => void;
}) {
  if (!campaign) {
    return (
      <article className="panel" id="campaign-settings">
        <p className="muted">Klik op een ingeplande mail om de instellingen te openen.</p>
      </article>
    );
  }

  return (
    <form className="panel formPanel" id="campaign-settings" key={campaign.id} onSubmit={onSubmit}>
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Campagne-instellingen</p>
          <h3>{campaign.name}</h3>
        </div>
        <span className={`status ${campaign.status}`}>{statusLabel[campaign.status]}</span>
      </div>
      <CampaignFields campaign={campaign} groups={groups} templates={templates} />
      <div className="buttonGroup">
        <button className="primaryButton" type="submit">Instellingen opslaan</button>
        {campaign.status === "scheduled" ? (
          <button className="ghostButton" type="button" onClick={() => onStart(campaign.id)}>Start campagne</button>
        ) : null}
        {campaign.status === "active" ? (
          <>
            <button className="ghostButton" type="button" onClick={() => onSimulate(campaign)}>Meetpunt toevoegen</button>
            <button className="ghostButton" type="button" onClick={() => onComplete(campaign.id)}>Afronden</button>
          </>
        ) : null}
      </div>
    </form>
  );
}

function CampaignFields({
  campaign,
  groups,
  templates
}: {
  campaign?: Campaign;
  groups: TargetGroup[];
  templates: MailTemplate[];
}) {
  return (
    <div className="formGrid">
      <label>
        Naam
        <input name="name" required defaultValue={campaign?.name} placeholder="Bijv. Q2 pakketmelding" />
      </label>
      <label>
        Template
        <select name="templateId" required defaultValue={campaign?.templateId}>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </label>
      <label>
        Doelgroep
        <select name="audience" required defaultValue={campaign?.audience ?? groups[0]?.name}>
          {groups.map((group) => (
            <option key={group.id} value={group.name}>{group.name}</option>
          ))}
        </select>
      </label>
      <label>
        Ontvangers
        <input min="1" name="recipients" type="number" defaultValue={campaign?.recipients ?? 25} required />
      </label>
      <label>
        Datum
        <input name="sendDate" type="date" defaultValue={campaign?.sendDate ?? ""} />
      </label>
      <label>
        Tijdstip
        <input name="sendWindow" required defaultValue={campaign?.sendWindow ?? ""} placeholder="wo 09:15" />
      </label>
      <label>
        Frequentie
        <select name="frequency" defaultValue={campaign?.frequency ?? "once"}>
          <option value="once">Eenmalig</option>
          <option value="monthly">Maandelijks</option>
          <option value="quarterly">Per kwartaal</option>
        </select>
      </label>
      <label>
        Status
        <select name="status" defaultValue={campaign?.status ?? "scheduled"}>
          <option value="draft">Concept</option>
          <option value="scheduled">Gepland</option>
          <option value="active">Actief</option>
          <option value="complete">Afgerond</option>
        </select>
      </label>
      <label>
        Afzendernaam
        <input name="senderName" defaultValue={campaign?.senderName ?? ""} placeholder="IT Service Desk" />
      </label>
      <label>
        Afzenderadres
        <input name="senderEmail" type="email" defaultValue={campaign?.senderEmail ?? ""} placeholder="servicedesk@example.com" />
      </label>
      <label>
        Simulatiepagina
        <input name="landingPage" type="url" defaultValue={campaign?.landingPage ?? ""} placeholder="https://..." />
      </label>
      <label>
        Awarenesspagina
        <input name="awarenessPage" type="url" defaultValue={campaign?.awarenessPage ?? ""} placeholder="https://..." />
      </label>
    </div>
  );
}

function TemplateCreateForm({
  onCancel,
  onSubmit
}: {
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="panel formPanel" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Nieuwe template</p>
        <h3>Maak een awareness-mail</h3>
      </div>
      <TemplateFields />
      <div className="buttonGroup">
        <button className="ghostButton" type="button" onClick={onCancel}>Annuleren</button>
        <button className="primaryButton" type="submit">Template bewaren</button>
      </div>
    </form>
  );
}

function TemplateSettingsForm({
  template,
  onSubmit
}: {
  template?: MailTemplate;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!template) {
    return (
      <article className="panel">
        <p className="muted">Klik op een template om de editor te openen.</p>
      </article>
    );
  }

  return (
    <form className="panel formPanel" key={template.id} onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Template opmaken</p>
        <h3>{template.name}</h3>
      </div>
      <TemplateFields template={template} />
      <div className="previewBox">
        <strong>Preview onderwerp</strong>
        <p>{template.subject}</p>
      </div>
      <div className="buttonGroup">
        <button className="primaryButton" type="submit">Template opslaan</button>
      </div>
    </form>
  );
}

function TemplateFields({ template }: { template?: MailTemplate }) {
  return (
    <div className="formGrid">
      <label>
        Naam
        <input name="name" required defaultValue={template?.name} placeholder="Bijv. Factuurcontrole" />
      </label>
      <label>
        Thema
        <input name="riskTheme" required defaultValue={template?.riskTheme} placeholder="Urgentie" />
      </label>
      <label>
        Afzendernaam
        <input name="senderName" defaultValue={template?.senderName ?? ""} placeholder="IT Service Desk" />
      </label>
      <label>
        Afzenderadres
        <input name="senderEmail" type="email" defaultValue={template?.senderEmail ?? ""} placeholder="servicedesk@example.com" />
      </label>
      <label className="fullField">
        Onderwerp
        <input name="subject" required defaultValue={template?.subject} placeholder="Actie vereist voor je account" />
      </label>
      <label className="fullField">
        Preheader
        <input name="preheader" defaultValue={template?.preheader ?? ""} placeholder="Korte tekst die in de mailpreview verschijnt" />
      </label>
      <label className="fullField">
        Body
        <RichTextEditor initialValue={template?.body ?? ""} name="body" />
      </label>
    </div>
  );
}

function RichTextEditor({ initialValue, name }: { initialValue: string; name: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(initialValue);
  const [showHtml, setShowHtml] = useState(false);

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  function applyBlock(format: string) {
    runCommand("formatBlock", format);
  }

  function addLink() {
    const url = window.prompt("URL voor de link");

    if (!url) {
      return;
    }

    runCommand("createLink", url);
  }

  function insertToken(token: string) {
    runCommand("insertText", token);
  }

  function insertButton() {
    const label = window.prompt("Tekst op de knop", "Bekijk melding");
    const url = window.prompt("URL van de knop", "https://awareness.local/");

    if (!label || !url) {
      return;
    }

    runCommand(
      "insertHTML",
      `<p><a href="${escapeAttribute(url)}" style="display:inline-block;padding:10px 14px;background:#204075;color:#ffffff;text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a></p>`
    );
  }

  function syncValue() {
    setValue(editorRef.current?.innerHTML ?? "");
  }

  return (
    <div className="wysiwyg">
      <input name={name} type="hidden" value={value} />
      <div className="wysiwygToolbar" aria-label="Template body toolbar">
        <div className="toolbarGroup">
          <select aria-label="Tekststijl" defaultValue="P" onChange={(event) => applyBlock(event.target.value)}>
            <option value="P">Paragraaf</option>
            <option value="H2">Kop 2</option>
            <option value="H3">Kop 3</option>
            <option value="BLOCKQUOTE">Quote</option>
          </select>
        </div>
        <div className="toolbarGroup">
          <button type="button" onClick={() => runCommand("bold")} title="Vet">B</button>
          <button type="button" onClick={() => runCommand("italic")} title="Cursief">I</button>
          <button type="button" onClick={() => runCommand("underline")} title="Onderstrepen">U</button>
          <button type="button" onClick={() => runCommand("strikeThrough")} title="Doorhalen">S</button>
        </div>
        <div className="toolbarGroup">
          <button type="button" onClick={() => runCommand("justifyLeft")} title="Links uitlijnen">L</button>
          <button type="button" onClick={() => runCommand("justifyCenter")} title="Centreren">C</button>
          <button type="button" onClick={() => runCommand("justifyRight")} title="Rechts uitlijnen">R</button>
        </div>
        <div className="toolbarGroup">
          <button type="button" onClick={() => runCommand("insertUnorderedList")} title="Opsomming">•</button>
          <button type="button" onClick={() => runCommand("insertOrderedList")} title="Genummerde lijst">1.</button>
          <button type="button" onClick={() => runCommand("outdent")} title="Inspringing verkleinen">←</button>
          <button type="button" onClick={() => runCommand("indent")} title="Inspringing vergroten">→</button>
        </div>
        <div className="toolbarGroup">
          <label className="colorControl" title="Tekstkleur">
            A
            <input type="color" defaultValue="#18201c" onChange={(event) => runCommand("foreColor", event.target.value)} />
          </label>
          <label className="colorControl" title="Markeerkleur">
            Bg
            <input type="color" defaultValue="#fff3bf" onChange={(event) => runCommand("hiliteColor", event.target.value)} />
          </label>
        </div>
        <div className="toolbarGroup">
          <button type="button" onClick={addLink} title="Link toevoegen">Link</button>
          <button type="button" onClick={insertButton} title="CTA-knop invoegen">Knop</button>
          <button type="button" onClick={() => runCommand("insertHorizontalRule")} title="Scheiding invoegen">HR</button>
        </div>
        <div className="toolbarGroup tokenGroup">
          <button type="button" onClick={() => insertToken("{{firstName}}")}>Voornaam</button>
          <button type="button" onClick={() => insertToken("{{department}}")}>Afdeling</button>
          <button type="button" onClick={() => insertToken("{{manager}}")}>Manager</button>
        </div>
        <div className="toolbarGroup">
          <button type="button" onClick={() => runCommand("undo")} title="Ongedaan maken">Undo</button>
          <button type="button" onClick={() => runCommand("redo")} title="Opnieuw">Redo</button>
          <button type="button" onClick={() => runCommand("removeFormat")} title="Opmaak wissen">Tx</button>
          <button type="button" onClick={() => setShowHtml((current) => !current)} title="HTML tonen">HTML</button>
        </div>
      </div>
      <div
        className="wysiwygEditor"
        contentEditable
        dangerouslySetInnerHTML={{ __html: initialValue || "Hallo {{firstName}}, " }}
        onBlur={syncValue}
        onInput={syncValue}
        ref={editorRef}
        role="textbox"
        aria-label="Body"
      />
      {showHtml ? <pre className="htmlPreview">{value}</pre> : null}
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function campaignFromForm(
  formData: FormData,
  id: string,
  groups: TargetGroup[],
  current?: Campaign
): Campaign {
  const audience = String(formData.get("audience"));
  const group = groups.find((item) => item.name === audience);

  return {
    id,
    name: String(formData.get("name")),
    templateId: String(formData.get("templateId")),
    audience,
    frequency: String(formData.get("frequency") ?? "once") as CampaignFrequency,
    sendDate: String(formData.get("sendDate") ?? ""),
    sendWindow: String(formData.get("sendWindow")),
    senderName: String(formData.get("senderName") ?? ""),
    senderEmail: String(formData.get("senderEmail") ?? ""),
    landingPage: String(formData.get("landingPage") ?? ""),
    awarenessPage: String(formData.get("awarenessPage") ?? ""),
    status: String(formData.get("status") ?? current?.status ?? "scheduled") as CampaignStatus,
    recipients: Number(formData.get("recipients")) || group?.users || current?.recipients || 1,
    reportRate: current?.reportRate ?? 0,
    clickRate: current?.clickRate ?? 0
  };
}

function templateFromForm(formData: FormData, id: string): MailTemplate {
  return {
    id,
    name: String(formData.get("name")),
    subject: String(formData.get("subject")),
    riskTheme: String(formData.get("riskTheme")),
    senderName: String(formData.get("senderName") ?? ""),
    senderEmail: String(formData.get("senderEmail") ?? ""),
    preheader: String(formData.get("preheader") ?? ""),
    body: String(formData.get("body"))
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

function templateName(templateId: string, templates: MailTemplate[]) {
  return templates.find((template) => template.id === templateId)?.name ?? "Onbekende template";
}

function mergeGroups(existing: TargetGroup[], incoming: TargetGroup[]) {
  const byName = new Map(existing.map((group) => [group.name, group]));

  for (const group of incoming) {
    byName.set(group.name, group);
  }

  return Array.from(byName.values());
}
