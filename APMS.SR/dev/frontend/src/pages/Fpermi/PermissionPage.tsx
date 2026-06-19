import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePermissions } from "../../auth/hooks/usePermissions";

import styles from "./permission.module.css";

type RoleDto = {
  id: number;
  name: string;
};

type UserDto = {
  id: number;
  username: string;
};

type PermissionDetail = {
  id: number;
  name: string;
  description: string | null;
  roles: RoleDto[];
  users: UserDto[];
};

type Permission = {
  id: number;
  name: string;
  description: string;
};

export default function PermissionPage() {
  const { hasPermission } = usePermissions(me);
  const { data: me, isLoading: meLoading } = useMe();

  const canView = hasPermission("PERMISSION_READ");
  
  const [selectedPermission, setSelectedPermission] = useState<PermissionDetail | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {    // 퍼미션 검증 로직
    try { setLoading(true);
      setError(null);
      const data = await apiFetch<Permission[]>(
          "/api/admin/permissions"
      );
      setPermissions(data);
    } catch {
      setError("권한 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPermissionDetail = async (id: number) => {
    try {
      const data = await apiFetch<PermissionDetail>(
        `/api/admin/permissions/${id}`
      );
      setSelectedPermission(data);
        } catch (e) {
      console.error("detail fetch failed");
    }
  };
  

  useEffect(() => {      // 트리거 만 시도
    if (!me) return;
    if (!canView) return;
    
    fetchPermissions();
  }, [me, canView]);

  if (meLoading  || loading) return <div>Loading...</div>;

  if (!canView) {
    return (
      <div className={styles.denied}>
        🚫 PERMISSION_READ 권한이 없습니다
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Permission 관리</h1>
      
      <div className={styles.layout}>
        
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div>ID</div>
            <div>Name</div>
            <div>Description</div>
          </div>
  
          {permissions.map((p) => (
            <div key={p.id} className={styles.row}
              onClick={() => fetchPermissionDetail(p.id)} >
              
              <div>{p.id}</div>
              <div className={styles.code}>{p.name}</div>
              <div>{p.description}</div>
            </div>
          ))}
        </div>
        
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
