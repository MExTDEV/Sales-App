export type PstReportingAdapter = {
  generateSectorDocuments: (sectorNumber: string) => Promise<{ status: "queued"; sectorNumber: string }>;
  getReportStatus: (projectId: string) => Promise<{ status: "pending" | "generated" | "failed"; projectId: string }>;
};

export type PstServerAdapter = {
  exportProject: (projectId: string) => Promise<{ status: "queued"; projectId: string }>;
  getExportStatus: (projectId: string) => Promise<{ status: "pending" | "exported" | "error"; projectId: string }>;
  getExportLog: (projectId: string) => Promise<Array<{ at: string; message: string }>>;
};

export const mockPstReportingAdapter: PstReportingAdapter = {
  async generateSectorDocuments(sectorNumber) {
    return { status: "queued", sectorNumber };
  },
  async getReportStatus(projectId) {
    return { status: "pending", projectId };
  }
};

export const mockPstServerAdapter: PstServerAdapter = {
  async exportProject(projectId) {
    return { status: "queued", projectId };
  },
  async getExportStatus(projectId) {
    return { status: "pending", projectId };
  },
  async getExportLog() {
    return [];
  }
};
