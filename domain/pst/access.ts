import type { MockUser } from "@/types/sales";

export function canAccessPst(user: MockUser) {
  if (!user.isActive || !user.hasPstAccess) {
    return false;
  }

  return user.role === "superadmin" || user.role === "admin" || user.role === "sales_leader" || user.role === "representative";
}

export function canManagePst(user: MockUser) {
  return canAccessPst(user) && (user.role === "superadmin" || user.role === "admin");
}

export function canEditPstWorkflow(user: MockUser) {
  return canManagePst(user) || user.role === "sales_leader";
}
