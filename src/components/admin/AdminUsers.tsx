import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserCog, Shield, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  village: string | null;
  district: string | null;
  role: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  const fetchUsers = async () => {
    setLoading(true);
    
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    if (profilesRes.error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } else {
      setProfiles(profilesRes.data || []);
    }

    if (rolesRes.data) {
      const rolesMap = new Map<string, string>();
      rolesRes.data.forEach((r: UserRole) => rolesMap.set(r.user_id, r.role));
      setUserRoles(rolesMap);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    const existingRole = userRoles.get(userId);
    const roleValue = newRole as "admin" | "moderator" | "user";
    const profile = profiles.find(p => p.user_id === userId);
    const userName = profile?.full_name || "Unknown User";

    if (existingRole) {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: roleValue })
        .eq("user_id", userId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user role",
          variant: "destructive",
        });
        return;
      }

      await logAction({
        action: "update_role",
        entity_type: "user_role",
        entity_id: userId,
        old_value: { role: existingRole },
        new_value: { role: newRole },
        details: `Changed ${userName}'s role from ${existingRole} to ${newRole}`,
      });
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: roleValue }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to assign user role",
          variant: "destructive",
        });
        return;
      }

      await logAction({
        action: "assign_role",
        entity_type: "user_role",
        entity_id: userId,
        new_value: { role: newRole },
        details: `Assigned ${newRole} role to ${userName}`,
      });
    }

    toast({
      title: "Updated",
      description: "User role updated successfully",
    });
    fetchUsers();
  };

  const removeUserRole = async (userId: string) => {
    const existingRole = userRoles.get(userId);
    const profile = profiles.find(p => p.user_id === userId);
    const userName = profile?.full_name || "Unknown User";

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove user role",
        variant: "destructive",
      });
    } else {
      await logAction({
        action: "remove_role",
        entity_type: "user_role",
        entity_id: userId,
        old_value: { role: existingRole },
        details: `Removed ${existingRole} role from ${userName}`,
      });

      toast({
        title: "Removed",
        description: "User role removed",
      });
      fetchUsers();
    }
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.phone?.includes(searchTerm) ||
      profile.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (userId: string) => {
    const role = userRoles.get(userId);
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        );
      case "field_officer":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Field Officer
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Moderator
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <UserCog className="h-3 w-3" />
            User
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProfiles.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Profile Role</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.full_name || "—"}
                    </TableCell>
                    <TableCell>{profile.phone || "—"}</TableCell>
                    <TableCell>
                      {profile.village && profile.district
                        ? `${profile.village}, ${profile.district}`
                        : profile.village || profile.district || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{profile.role || "farmer"}</Badge>
                    </TableCell>
                    <TableCell>{getRoleBadge(profile.user_id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={userRoles.get(profile.user_id) || "user"}
                          onValueChange={(value) => updateUserRole(profile.user_id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="field_officer">Field Officer</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {userRoles.has(profile.user_id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUserRole(profile.user_id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
