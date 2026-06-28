import { useState } from "react";
import { useMenus } from "../../queries/useMenus";
import { useMenuMutations } from "../../mutations/useMenuMutations";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePermissions } from "../../auth/hooks/usePermissions";
import type { Menu } from "../../auth/auth.types";

import FullPageSpinner from "../../components/loading/FullPageSpinner";
import styles from "./menu.module.css";

export default function MenuPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasPermission } = usePermissions(user);

  const { createMenu, deleteMenu } = useMenuMutations();

  const { data: menus = [] } = useMenus(); // ✅ 핵심 수정

  const canRead = hasPermission("MENU_READ");
  const canCreate = hasPermission("MENU_CREATE");
  //const canUpdate = hasPermission("");            // MENU_UPDATE
  const canDelete = hasPermission("MENU_DELETE");
    
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const [deletingId, setDeletingId] = useState<number | null>(null); // (선택 개선)

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
            onClick={() => createMenu.mutate({ name, price })}
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

      {menus.map((menu: Menu) => (
        <div key={menu.id} className={styles.tableRow}>
          <div className={styles.cell} data-label="ID">{menu.id}</div>
          <div className={styles.cell} data-label="Name"> {menu.name}</div>
          <div className={styles.cell} data-label="Price">{menu.price}</div>
          
          <div className={styles.actionCell}>
            
            <button className={`{styles.actionBtn} ${styles.danger}`}
              disabled={deletingId === menu.id}
            >
              Update
            </button>
   
            
          {canDelete && (
            <button className={`{styles.actionBtn} ${styles.danger}`}
              onClick={() => {
                setDeletingId(menu.id);
                deleteMenu.mutate(menu.id, {
                  onSettled: () => setDeletingId(null),
                });
              }}
              disabled={deletingId === menu.id}
            >
              Delete
            </button>
            )}
          </div>
         </div>
      ))}
    </div>
  );
}
