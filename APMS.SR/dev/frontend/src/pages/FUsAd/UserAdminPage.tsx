import { useMemo } from "react";
import styles from "./UserAdminPage.module.css";

import { useUsers } from "../../queries/useUsers";
import { useUserMutations } from "../../mutations/useUserMutations";
import { usePermissions } from "../../auth/hooks/usePermissions";

import { useAuth } from "../../auth/hooks/useAuth";
import FullPageSpinner from "../../components/loading/FullPageSpinner";

import type { UserStatus } from "../../auth/auth.types";
import { User } from "../../auth/auth.types";


export default function UserAdminPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);

  const canRead = hasPermission("USER_READ");
  const canUpdate = hasPermission("USER_UPDATE");
  const canDelete = hasPermission("USER_DELETE");

  const { data: users = [], isLoading, error } = useUsers();
  const { changeStatus, deleteUser } = useUserMutations();

  const activeUsers = useMemo(
    () =>
      users.filter(
        (u: AdminUser) =>
          u.status !== "DELETED" &&
          u.status !== "DELETE_PENDING"
      ),
    [users]
  );

  const pendingUsers = useMemo(
    () =>
      users.filter(
        (u: AdminUser) =>
          u.status === "DELETE_PENDING"
      ),
    [users]
  );

  if (!canRead) {
    return (
      <div className={styles.denied}>
        USER_READ 권한 없음
      </div>
    );
  }

  if (isLoading) return <FullPageSpinner />;

  if (error) {
    return <div className={styles.error}>에러 발생</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Admin</h1>

      {/* ACTIVE USERS */}
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
            <div>{user.status}</div>
            <div>{user.permissions.join(", ")}</div>

            {(canUpdate || canDelete) && (
              <div className={styles.actions}>
                {canUpdate && (
                  <select
                    value={user.status}
                    onChange={(e) =>
                      changeStatus.mutate({
                        id: user.id,
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
                        id: user.id,
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
          <h2 className={styles.sectionTitle}>
            삭제 대기
          </h2>

          {pendingUsers.map((user) => (
            <div key={user.id} className={styles.row}>
              <div>{user.username}</div>

              <button
                onClick={() =>
                  changeStatus.mutate({
                    id: user.id,
                    status: "ACTIVE",
                  })
                }
              >
                복구
              </button>

              <button
                className={styles.danger}
                onClick={() => deleteUser.mutate(user.id)}
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
