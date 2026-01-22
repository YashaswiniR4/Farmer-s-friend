import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";

interface AuditLogEntry {
  action: string;
  entity_type: string;
  entity_id?: string;
  old_value?: Json;
  new_value?: Json;
  details?: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = async (entry: AuditLogEntry) => {
    if (!user) {
      console.error("No user found for audit logging");
      return;
    }

    const { error } = await supabase.from("audit_logs").insert({
      admin_user_id: user.id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      old_value: entry.old_value,
      new_value: entry.new_value,
      details: entry.details,
    });

    if (error) {
      console.error("Failed to create audit log:", error);
    }
  };

  return { logAction };
};
