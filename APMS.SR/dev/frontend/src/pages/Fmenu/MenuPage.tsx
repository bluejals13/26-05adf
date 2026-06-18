import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

import FullPageSpinner from "../components/FullPageSpinner";

import styles from "./menu.module.css";

type Menu = {
  id: number;
  name: string;
  price: number;
};

type MenuRequest = {
  name: string;
  price: number;
};

export default function MenuPage() {
  const { isLoggedIn, user, isLoading } = useAuth();
  const { hasPermission } = usePermissions(user);

  const canRead = hasPermission("MENU_READ");
  const canCreate = hasPermission("MENU_CREATE");
  const canDelete = hasPermission("MENU_DELETE");

  const [menus, setMenus] = useState<Menu[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);

  const [actionLoading, setActionLoading] = useState<number | "create" | null>(null);  // 버튼 UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMenus = useCallback(async () => {
    if (!canRead) return;
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch<Menu[]>("/api/admin/menus");
      setMenus(data);
      
    } catch {
      setError("메뉴 조회 실패");
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);
  
  //if (isLoading) return <FullPageSpinner />;
  
  if (loading) { return <div>로딩 중...</div>; }

  if (error) { return <div style={{ color: "red" }}>{error}</div>; }
  
  if (!canRead) { return <div>🚫 MENU_READ 권한이 없습니다</div>; }

  const createMenu = async () => {
    if (!name || price <= 0) return;
    try {
      setActionLoading("create");
      await apiFetch("/admin/menus", {
        method: "POST",
        body: JSON.stringify({ name, price } satisfies MenuRequest),
      });

      setName("");
      setPrice(0);
      fetchMenus();
    } finally {
      setActionLoading(null);
    }
  };

  const deleteMenu = async (id: number) => {
    try {
      setActionLoading(id);
      await apiFetch(`/admin/menus/${id}`, {
        method: "DELETE",
      });
      
      setMenus((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>Menu Admin</div>

      {canCreate && (
        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={styles.input}
            type="number"
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <button className={styles.button} onClick={createMenu} 
            disabled={ actionLoading === "create" || !name || price <= 0 }>
            {actionLoading === "create" ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      <div className={styles.tableHeader}>
        <div className={styles.cell}>ID</div>
        <div className={styles.cell}>Name</div>
        <div className={styles.cell}>Price</div>
        {canDelete && <div className={styles.cell}>Action</div>}
      </div>

      {menus.map((menu) => (
        <div className={styles.tableRow} key={menu.id}>
          <div className={styles.cell}>{menu.id}</div>
          <div className={styles.cell}>{menu.name}</div>
          <div className={styles.cell}>{menu.price}</div>

          {canDelete && (
            <div className={styles.cell}>
              <button className={styles.actionBtn}
                onClick={() => deleteMenu(menu.id)}
                disabled={actionLoading === menu.id}>
                {actionLoading === menu.id ? "..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
