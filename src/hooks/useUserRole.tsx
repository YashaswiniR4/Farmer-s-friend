import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type AppRole = "admin" | "moderator" | "user" | "field_officer";

interface UseUserRoleReturn {
  role: AppRole | null;
  isAdmin: boolean;
  isModerator: boolean;
  isFieldOfficer: boolean;
  loading: boolean;
}

const ADMIN_EMAIL = "admin@krushimitra.com"; // 🔑 CHANGE IF NEEDED

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      // ✅ HARD ADMIN FALLBACK (THIS FIXES EVERYTHING)
      if (user.email === ADMIN_EMAIL) {
        setRole("admin");
        setLoading(false);
        return;
      }

      // Existing DB-based role logic (kept)
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        setRole("user"); // safe default
      } else {
        setRole((data?.role as AppRole) || "user");
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return {
    role,
    isAdmin: role === "admin",
    isModerator: role === "moderator" || role === "admin",
    isFieldOfficer: role === "field_officer" || role === "admin",
    loading,
  };
};
