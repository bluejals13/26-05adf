import { useState } from "react";
import { useMenus } from "../../queries/useMenus";
import { useMenuMutations } from "../../mutations/useMenuMutations";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePermissions } from "../../auth/hooks/usePermissions";
import type { Menu } from "../../api/menu.api";

import FullPageSpinner from "../../components/loading/FullPageSpinner";

import styles from "./menu.module.css";

export default function MenuPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasPermission } = usePermissions(user);

  const { createMenu, deleteMenu } = useMenuMutations();

  const canRead = hasPermission("MENU_READ");
  const canCreate = hasPermission("MENU_CREATE");
  const canDelete = hasPermission("MENU_DELETE");


  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  if (authLoading) return <FullPageSpinner />;
  if (!canRead) return <div>🚫 권한 없음</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>Menu Admin</div>

      {canCreate && (
        <div className={styles.formRow}>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <button
            onClick={() =>
              createMenu.mutate({ name, price })
            }
            disabled={createMenu.isPending}
          >
            {createMenu.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      <div className={styles.tableHeader}>
        <div>ID</div>
        <div>Name</div>
        <div>Price</div>
        {canDelete && <div>Action</div>}
      </div>

      {menus.map((menu) => (
        <div key={menu.id} className={styles.tableRow}>
          <div>{menu.id}</div>
          <div>{menu.name}</div>
          <div>{menu.price}</div>

          {canDelete && (
            <button
              onClick={() => deleteMenu.mutate(menu.id)}
              disabled={deleteMenu.isPending}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
