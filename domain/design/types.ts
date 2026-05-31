import type { AuditableEntity } from "@/domain/shared/types";

export type DesignSetting = AuditableEntity & {
  assetKey: "logo" | "favicon" | "loginBackground";
  fileName?: string;
  previewUrl?: string;
};
