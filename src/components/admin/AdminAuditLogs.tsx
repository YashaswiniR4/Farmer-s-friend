import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Search, Clock, User, FileText } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: Json | null;
  new_value: Json | null;
  details: string | null;
  created_at: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
}

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    
    const { data: logsData, error: logsError } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (logsError) {
      console.error("Error fetching audit logs:", logsError);
      setLoading(false);
      return;
    }

    setLogs(logsData || []);

    // Fetch profiles for admin names
    const adminIds = [...new Set((logsData || []).map((log) => log.admin_user_id))];
    if (adminIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", adminIds);

      const profileMap: Record<string, string> = {};
      (profilesData || []).forEach((p: Profile) => {
        profileMap[p.user_id] = p.full_name || "Unknown";
      });
      setProfiles(profileMap);
    }

    setLoading(false);
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("create") || action.includes("add") || action.includes("assign")) {
      return "default";
    }
    if (action.includes("delete") || action.includes("remove")) {
      return "destructive";
    }
    if (action.includes("update") || action.includes("change")) {
      return "secondary";
    }
    return "outline";
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "user_role":
        return <User className="h-4 w-4" />;
      case "product":
        return <FileText className="h-4 w-4" />;
      case "order":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const entityTypes = ["all", ...new Set(logs.map((log) => log.entity_type))];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profiles[log.admin_user_id]?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter;

    return matchesSearch && matchesEntity;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : type.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audit logs found
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getEntityIcon(log.entity_type)}
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline">{log.entity_type}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Admin: </span>
                    <span>{profiles[log.admin_user_id] || "Unknown"}</span>
                  </div>
                  
                  {log.details && (
                    <div className="text-sm mt-1 text-muted-foreground">
                      {log.details}
                    </div>
                  )}
                  
                  {(log.old_value || log.new_value) && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded">
                      {log.old_value && (
                        <div>
                          <span className="font-medium">Old: </span>
                          <code>{JSON.stringify(log.old_value)}</code>
                        </div>
                      )}
                      {log.new_value && (
                        <div>
                          <span className="font-medium">New: </span>
                          <code>{JSON.stringify(log.new_value)}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAuditLogs;
