export type CampaignStatus = "draft" | "scheduled" | "active" | "complete";

export type MailTemplate = {
  id: string;
  name: string;
  subject: string;
  riskTheme: string;
  senderName?: string;
  senderEmail?: string;
  preheader?: string;
  body?: string;
};

export type CampaignFrequency = "once" | "monthly" | "quarterly";

export type Campaign = {
  id: string;
  name: string;
  templateId: string;
  audience?: string;
  frequency?: CampaignFrequency;
  sendDate?: string;
  sendWindow?: string;
  senderName?: string;
  senderEmail?: string;
  landingPage?: string;
  awarenessPage?: string;
  status: CampaignStatus;
  recipients: number;
  reportRate: number;
  clickRate: number;
};

export type ScheduleItem = {
  month: string;
  template: string;
  audience: string;
  sendWindow: string;
  status: CampaignStatus;
};

export type CampaignEvent = {
  id: string;
  type: "O" | "K" | "M";
  person: string;
  detail: string;
  time: string;
};

export type EntraSyncSummary = {
  tenant: string;
  users: number;
  groups: number;
  lastSync: string;
};

export type TargetGroup = {
  id: string;
  name: string;
  source: "Manual" | "Entra";
  users: number;
  department?: string;
};

export type EntraUser = {
  id: string;
  displayName: string;
  mail: string | null;
  userPrincipalName: string;
  department?: string | null;
  jobTitle?: string | null;
  accountEnabled?: boolean;
};
