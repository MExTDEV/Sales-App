export const mockQuotes = [
  { id: "quote-1", date: "2026-05-28", number: "OFF-260184", status: "sent", amountExclVat: 325, amountInclVat: 393.25 },
  { id: "quote-2", date: "2026-05-18", number: "OFF-260119", status: "approved", amountExclVat: 1240, amountInclVat: 1500.4 },
  { id: "quote-3", date: "2026-04-30", number: "OFF-260088", status: "draft", amountExclVat: 680, amountInclVat: 822.8 },
  { id: "quote-4", date: "2026-03-11", number: "OFF-260041", status: "rejected", amountExclVat: 210, amountInclVat: 254.1 },
  { id: "quote-5", date: "2026-01-22", number: "OFF-250912", status: "expired", amountExclVat: 940, amountInclVat: 1137.4 }
] satisfies Array<{
  amountExclVat: number;
  amountInclVat: number;
  date: string;
  id: string;
  number: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
}>;

export const mockSalesDocuments = [
  { id: "doc-1", date: "2026-05-20", number: "INV-260614", type: "invoice", amountExclVat: 425, amountInclVat: 514.25 },
  { id: "doc-2", date: "2026-05-13", number: "ORD-260581", type: "order", amountExclVat: 180, amountInclVat: 217.8 },
  { id: "doc-3", date: "2026-04-26", number: "INV-260492", type: "invoice", amountExclVat: 780, amountInclVat: 943.8 },
  { id: "doc-4", date: "2026-03-05", number: "CRN-260033", type: "credit_note", amountExclVat: -95, amountInclVat: -114.95 }
] satisfies Array<{
  amountExclVat: number;
  amountInclVat: number;
  date: string;
  id: string;
  number: string;
  type: "invoice" | "order" | "credit_note";
}>;

export const mockSalesItems = [
  { id: "item-1", itemNo: "AED-SET-01", description: "AED refill set", quantity: 3, totalExclVat: 285, totalInclVat: 344.85, lastSaleDate: "2026-05-20", documents: 2 },
  { id: "item-2", itemNo: "EHBO-10", description: "EHBO koffer horeca", quantity: 2, totalExclVat: 320, totalInclVat: 387.2, lastSaleDate: "2026-05-13", documents: 1 },
  { id: "item-3", itemNo: "BRAND-02", description: "Blusdeken professioneel", quantity: 6, totalExclVat: 210, totalInclVat: 254.1, lastSaleDate: "2026-04-26", documents: 2 }
];

export const mockCustomerDocuments = [
  { id: "file-1", fileName: "contract-aed-2026.pdf", type: "contract", addedAt: "2026-05-24", source: "ERP" },
  { id: "file-2", fileName: "offerte-off-260184.pdf", type: "quote", addedAt: "2026-05-28", source: "App" },
  { id: "file-3", fileName: "factuur-inv-260614.pdf", type: "invoice", addedAt: "2026-05-20", source: "ERP" },
  { id: "file-4", fileName: "werkbon-service-1842.pdf", type: "work_order", addedAt: "2026-05-17", source: "Service" },
  { id: "file-5", fileName: "foto-locatie.jpg", type: "photo", addedAt: "2026-05-28", source: "App" },
  { id: "file-6", fileName: "algemene-afspraken.pdf", type: "pdf", addedAt: "2026-04-12", source: "Backoffice" }
] satisfies Array<{
  addedAt: string;
  fileName: string;
  id: string;
  source: string;
  type: "pdf" | "contract" | "quote" | "invoice" | "work_order" | "photo" | "other";
}>;

export const initialReferences = [
  {
    id: "REF-0001",
    company: "Apotheek Centrum",
    contact: "Sofie Peeters",
    phone: "+32 486 12 45 78",
    email: "sofie.peeters@apotheekcentrum.be",
    address: "Mechelsesteenweg 184, 2018 Antwerpen",
    note: "Te benaderen voor AED-referentie in apotheeksegment.",
    addedAt: "2026-05-24"
  },
  {
    id: "REF-0002",
    company: "Sportclub Noord",
    contact: "Ahmed El Amrani",
    phone: "+32 472 74 10 44",
    email: "ahmed@sportclubnoord.be",
    address: "Noordlaan 42, 2000 Antwerpen",
    note: "Positieve ervaring met EHBO-opleiding.",
    addedAt: "2026-05-18"
  }
];
