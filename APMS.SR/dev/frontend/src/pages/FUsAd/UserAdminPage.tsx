import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../api";
import { usePermissions } from "../../hooks/usePermissions";
import { useMe } from "../../queries/useMe";

import styles from "./UserAdminPage.module.css";


type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETE_PENDING" | "DELETED";  // 활성, 정지 , 제거 예정, 삭제


type User = {
  id: number;
  username: string;
  permissions: string[];
  status: UserStatus; };


export default function UserAdminPage() {
  const { data: me, isLoading: meLoading } = useMe();
  const { hasPermission } = usePermissions(me);
  
  //const nextStatus = e.target.value;
  //if ( nextStatus === "ACTIVE" || nextStatus === "SUSPENDED" ) { changeStatus(user.id, nextStatus); }
  
  const canRead = hasPermission("USER_READ");
  const canUpdate = hasPermission("USER_UPDATE");
  const canDelete = hasPermission("USER_DELETE");
  
  const [users, setUsers] = useState<User[]>([]);      // 사용자 목록 객체
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusLoading, setStatusLoading] = useState<number | null>(null);  // 상태 변경 시 버튼 잠금
  const [actionLoading, setActionLoading] = useState<number | null>(null);  // 상태 삭제 시 버튼 잠금
  
  
  
  const activeUsers = useMemo(
    () => users.filter((u) => u.status !== "DELETED" && u.status !== "DELETE_PENDING"),
    [users] );

  const pendingUsers = useMemo(
    () => users.filter((u) => u.status === "DELETE_PENDING"),
    [users] );
  
  
  const fetchUsers = useCallback(async () => {
    try { setLoading(true);
      setError(null);
         
      const data = await apiFetch<User[]>("/api/admin/users");
      setUsers(data);
    } catch { setError("유저 목록을 불러오지 못했습니다.");
    } finally { setLoading(false); } }, []);

  
  
  
  useEffect(() => {
    if (!me) return;
    if (!canRead) return;

    fetchUsers();
  }, [me, canRead, fetchUsers]);



  
  const changeStatus = async ( id: number, status: UserStatus ) => {
    try { setStatusLoading(id);
         
        await apiFetch( `/api/admin/users/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, }), } );
         
         
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u ) ) );
         
    } catch { alert("상태 변경 실패");
    } finally { setStatusLoading(null); } };
  
  
  
  const moveToDeletePending = async (id: number) => {
    try { setActionLoading(id);
         
      await apiFetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ status: "DELETE_PENDING", }), });

         
      setUsers(prev => prev.map(u => u.id === id ? 
      { ...u, status: "DELETE_PENDING" } : u ) );
    } catch { alert("삭제 대기 처리 실패"); 
    } finally { setActionLoading(null); } };


  
  const restoreUser = async ( id: number ) => {
    try { setActionLoading(id);

      await apiFetch( `/api/admin/users/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({
          status: "ACTIVE", }), } );
      
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: "ACTIVE", } : u ));
         
    } catch { alert("복구 실패");
    } finally { setActionLoading(null); } };
  
  
  
  const hardDeleteUser = async ( id: number ) => {
    const ok = confirm( "정말 영구 삭제하시겠습니까?\n복구할 수 없습니다." );
    if (!ok) return;
    try { setActionLoading(id);

      await apiFetch( `/api/admin/users/${id}`, { method: "DELETE", } );

      setUsers((prev) => prev.filter( (u) => u.id !== id ) );
      
    } catch { alert("삭제 실패");
    } finally { setActionLoading(null); } };
  
  
  
  
  if (meLoading  || loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!canRead) {
    return <div className={styles.denied}>USER_READ 권한이 없습니다</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Admin</h1>
      
      {/* 일반 사용자 */}
      <div className={styles.table}>
        <div className={styles.header}>
          <div>ID</div>
          <div>Username</div>
          <div>Status</div>
          <div>Permissions</div>
          
          {(canUpdate || canDelete) && <div>Actions</div>}
        </div>

        {activeUsers.map((user) => (
          <div key={user.id} className={styles.row}>
            
            <div>{user.id}</div>
            <div>{user.username}</div>

            <div>
              <span className={`${styles.status} ${styles[user.status.toLowerCase() ] }`} >
                {user.status}
              </span>
            </div>

            <div className={styles.permissions}>
              {user.permissions?.join(", ") || "-"} /* 퍼미션 방어 코드 */
            </div>

            {(canUpdate || canDelete) && (
              <div className={styles.actions}>
                {canUpdate && (
                  <select
                    value={user.status}
                    disabled={statusLoading === user.id}
                    onChange={(e) => changeStatus(user.id, e.target.value as UserStatus) }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                )}

                {canDelete && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => moveToDeletePending(user.id)}
                    disabled={actionLoading === user.id}
                  >
                    삭제대기
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      
      {/* 삭제 대기 */}
      {pendingUsers.length > 0 && (
      <>
      <h2 className={ styles.sectionTitle } >
        삭제 대기 목록
      </h2>
      

      <div className={styles.table}>
        <div className={styles.header}>
          <div>ID</div>
          <div>Username</div>
          <div>Status</div>
          <div>Permissions</div>
          <div>Actions</div>
        </div>
        
        
        {pendingUsers.map((user) => ( 
        <div  key={user.id}
            className={`${styles.row} ${styles.pendingRow}`}
          >
          
            <div>{user.id}</div>
            <div>{user.username}</div>
          
            <div> <span className={ styles.status } 
              > DELETE_PENDING </span>
            </div>
          
          
            <div className={ styles.permissions } >
              {user.permissions?.join( ", " ) || "-"}
            </div>
          
          
            <div className={ styles.actions } >
              <button disabled={ actionLoading === user.id }
                onClick={() => restoreUser( user.id ) }
              > 복구
              </button>

              <button className={ styles.danger }
                disabled={ actionLoading === user.id }
                onClick={() => hardDeleteUser( user.id ) }
              > 영구삭제
              </button>
            </div>
          
          </div>
          
        ))}
      </div>
      </>
      )}
    </div>
  );
}
