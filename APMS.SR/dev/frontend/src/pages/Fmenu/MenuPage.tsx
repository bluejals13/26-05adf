import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMenus } from "../../queries/useMenus";
import { useMenuMutations } from "../../mutations/useMenuMutations";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePermissions } from "../../auth/hooks/usePermissions";
import type { Menu } from "../../auth/auth.types";

import FullPageSpinner from "../../components/loading/FullPageSpinner";
import styles from "./menu.module.css";

// import Button from "../../style/common/Button";    이거 나중에 할 것.

export default function MenuPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasPermission } = usePermissions(user);

  const { createMenu, deleteMenu } = useMenuMutations();  // 현 .tsx 에서 수정메뉴 요청 안함

  const { data: menus = [] } = useMenus(); // ✅ 핵심 수정

  const canRead = hasPermission("MENU_READ");
  const canCreate = hasPermission("MENU_CREATE");
  const canUpdate = hasPermission("MENU_UPDATE");
  const canDelete = hasPermission("MENU_DELETE");
  
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  if (authLoading) return <FullPageSpinner />;
  if (!canRead) return <div>🚫 권한 없음</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>Menu Admin</div>

      {canCreate && (
        <div className={styles.formRow}>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
          <input
            className={styles.input}
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <button 
            className={`${styles.button} ${styles.danger}`}
            onClick={() => createMenu.mutate({ name, price })}
            disabled={createMenu.isPending}
          >
            {createMenu.isPending ? "작성중..." : "작성"}
          </button>
        </div>
      )}

      <div className={styles.tableHeader}>
        <div>ID</div>
        <div>Name</div>
        <div>Price</div>
        {(canUpdate || canDelete) && <div>Action</div>}
      </div>

      {menus.map((menu: Menu) => (
        <div key={menu.id} className={styles.tableRow}>
          <div className={styles.cell} data-label="ID">{menu.id}</div>
          <div className={styles.cell} data-label="Name"> {menu.name}</div>
          <div className={styles.cell} data-label="Price">{menu.price}</div>
          
          <div className={styles.actionCell}>
            
            
            {canUpdate && (
            <button className={`${styles.button} ${styles.danger}`}
              onClick={() => navigate(`/admin/menu/${menu.id}/edit`)}
            >
              수정
            </button>
             )}
            
          {canDelete && (
            <button className={`${styles.actionBtn} ${styles.danger}`}
              onClick={() => {
                deleteMenu.mutate(menu.id);
              }}
            >  
              삭제
            </button>
            )}
          </div>
         </div>
      ))}
    </div>
  );
}
