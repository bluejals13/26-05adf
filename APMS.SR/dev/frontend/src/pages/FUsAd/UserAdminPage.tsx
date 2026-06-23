import { useMemo } from "react";
import styles from "./UserAdminPage.module.css";

import { useUsers } from "../../queries/useUsers";
import { useUserMutations } from "../../mutations/useUserMutations";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { useAuth } from "../../auth/hooks/useAuth";
import FullPageSpinner from "../../components/loading/FullPageSpinner";

import type { User, UserStatus } from "../../auth/auth.types";

export default function UserAdminPage() {
  const { user, isLoading: authLoading } = useAuth();

  // auth 기반 permission
  const { hasPermission } = usePermissions(user);

  const canRead = hasPermission("USER_READ");
  const canUpdate = hasPermission("USER_UPDATE");
  const canDelete = hasPermission("USER_DELETE");

  // ✅ user 있을 때만 users API 실행
  const {
    data: users = [],
    isLoading,
    isFetching,
    error,
  } = useUsers({
    enabled: !!user,
  });

  const refreshing = isFetching && !isLoading;

  const { changeStatus, deleteUser } = useUserMutations();

  const activeUsers = useMemo(() => {
    return users.filter(
      (u) => u.status !== "DELETED" && u.status !== "DELETE_PENDING"
    );
  }, [users]);

  const pendingUsers = useMemo(() => {
    return users.filter(
      (u) => u.status === "DELETE_PENDING"
    );
  }, [users]);

  // 🔍 debug
  console.log("auth user:", user);
  console.log("users:", users);
  console.log("loading:", isLoading);
  console.log("error:", error);

  // =====================
  // guards (중요 순서)
  // =====================
  if (authLoading) return <FullPageSpinner />;
  if (!user) return null;

  if (!canRead) {
    return <div className={styles.denied}>USER_READ 권한 없음</div>;
  }

  if (isLoading) return <FullPageSpinner />;
  if (error) return <div className={styles.error}>에러 발생</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Admin</h1>
   {refreshing && (
    <div className={styles.refresh}>
      사용자 정보 갱신중...
    </div>
   )}

      {/* ACTIVE USERS */}
      <div className={styles.table}>
        <div className={styles.header}>
          <div>ID</div>
          <div>Username</div>
          <div>Status</div>
          <div>Permissions</div>
          {(canUpdate || canDelete) && <div>Actions</div>}
        </div>

        {activeUsers.map((u) => (
          <div key={u.id} className={styles.row}>
            <div>{u.id}</div>
            <div>{u.username}</div>
            <div>{u.status}</div>
            <div>{u.permissions.join(", ")}</div>

            {(canUpdate || canDelete) && (
              <div className={styles.actions}>
                {canUpdate && (
                  <select
                    value={u.status}
                    onChange={(e) =>
                      changeStatus.mutate({
                        id: u.id,
                        status: e.target.value as UserStatus,
                      })
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                )}

                {canDelete && (
                  <button
                    onClick={() =>
                      changeStatus.mutate({
                        id: u.id,
                        status: "DELETE_PENDING",
                      })
                    }
                  >
                    삭제대기
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DELETE PENDING */}
      {pendingUsers.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>삭제 대기</h2>

          {pendingUsers.map((u) => (
            <div key={u.id} className={styles.row}>
              <div>{u.username}</div>

              <button
                onClick={() =>
                  changeStatus.mutate({
                    id: u.id,
                    status: "ACTIVE",
                  })
                }
              >
                복구
              </button>

              <button
                className={styles.danger}
                onClick={() => deleteUser.mutate(u.id)}
              >
                영구삭제
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
