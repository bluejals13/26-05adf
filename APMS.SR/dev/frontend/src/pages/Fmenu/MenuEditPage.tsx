import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { usePermissions } from "../../auth/hooks/usePermissions";

import { useMenus } from "../../queries/useMenus";
import { useMenuMutations } from "../../mutations/useMenuMutations";

import FullPageSpinner from "../../components/loading/FullPageSpinner";
import styles from "./menu.module.css";

export default function MenuEditPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasPermission } = usePermissions(user);

  const canUpdate = hasPermission("MENU_UPDATE");
  
  const { id } = useParams();
  const navigate = useNavigate();

  const menuId = Number(id);

  const { data: menu, isLoading } = useMenu(menuId);
  const { updateMenu } = useMenuMutations();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  
  if (authLoading) return <FullPageSpinner />;
  if (!canUpdate) return <div>🚫 권한 없음</div>;
  
  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setPrice(menu.price);
    }
  }, [menu]);

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className={styles.page}>
      <h2>메뉴 수정</h2>

      <div className={styles.formRow}>
        <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)}/>

        <input className={styles.input} type="number" 
          value={price} onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div className={styles.actionCell}>
        <button className={styles.button}
          onClick={() => { updateMenu.mutate(
              { id: menuId, data: { name, price } },
              { onSuccess: () => { navigate("/admin/menu");
              } } ); } }
          
          disabled={updateMenu.isPending}
          >
          
          {updateMenu.isPending ? "수정중..." : "저장"}
        </button>

        <button className={styles.button}
          onClick={() => navigate("/admin/menu")}
        >
          취소
        </button>
      </div>
    </div>
  );
}
