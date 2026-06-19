import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/http";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { useMe } from "../../queries/useMe";

import styles from "./permission.module.css";

type Permission = {
  id: number;
  name: string;
  description: string;
};

type PermissionDetail = {
  id: number;
  name: string;
  description: string | null;
  roles: { id: number; name: string }[];
  users: { id: number; username: string }[];
};

export default function PermissionPage() {
  const { data: me } = useMe();
  const { hasPermission } = usePermissions(me);

  const canView = hasPermission("PERMISSION_READ");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ list query
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => http.get<Permission[]>("/api/admin/permissions"),
    enabled: canView,
  });

  // ✅ detail query
  const { data: selectedPermission } = useQuery({
    queryKey: ["permission", selectedId],
    queryFn: () =>
      http.get<PermissionDetail>(
        `/api/admin/permissions/${selectedId}`
      ),
    enabled: !!selectedId,
  });

  if (!canView) {
    return (
      <div className={styles.denied}>
        🚫 PERMISSION_READ 권한이 없습니다
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Permission 관리</h1>

      <div className={styles.layout}>
        {/* LIST */}
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div>ID</div>
            <div>Name</div>
            <div>Description</div>
          </div>

          {permissions.map((p) => (
            <div
              key={p.id}
              className={styles.row}
              onClick={() => setSelectedId(p.id)}
            >
              <div>{p.id}</div>
              <div className={styles.code}>{p.name}</div>
              <div>{p.description}</div>
            </div>
          ))}
        </div>

        {/* DETAIL */}
        {selectedPermission && (
          <div className={styles.detailPanel}>
            <h2>{selectedPermission.name}</h2>

            <h3>Roles</h3>
            <ul>
              {selectedPermission.roles.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>

            <h3>Users</h3>
            <ul>
              {selectedPermission.users.map((u) => (
                <li key={u.id}>{u.username}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
