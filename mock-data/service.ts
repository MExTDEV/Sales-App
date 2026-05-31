export type ServiceLocalStockItem = {
  description: string;
  itemNo: string;
  materialType: "contract" | "new";
  stock: number;
};

export const serviceLocalStockItems: ServiceLocalStockItem[] = [
  { itemNo: "AED-PAD", description: "AED elektroden volwassenen", stock: 4, materialType: "contract" },
  { itemNo: "AED-BAT-HS1", description: "Batterij Philips HeartStart HS1", stock: 2, materialType: "contract" },
  { itemNo: "SAFETY-SIGN", description: "Veiligheidspictogram nooduitgang", stock: 6, materialType: "new" },
  { itemNo: "BLUS-ZEGEL", description: "Veiligheidszegel brandblusser", stock: 12, materialType: "contract" },
  { itemNo: "EHBO-10", description: "EHBO koffer horeca", stock: 3, materialType: "new" },
  { itemNo: "AED-CASE", description: "AED draagtas", stock: 0, materialType: "new" }
];
