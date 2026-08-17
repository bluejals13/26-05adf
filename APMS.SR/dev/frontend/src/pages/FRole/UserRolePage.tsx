// pages/UserRolePage.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { useRoles } from "../../queries/useRoles";
import styles from "./UserRolePage.module.css";

type User = {
  id: number;
  username: string;
};

type Role = {
  id: number;
  name: string;
  description?: string | null;
};

type UserDetail = User & {
  roles?: Role[];
};

export default function UserRolePage() {
  const { data: roleData = [], isLoading: roleLoading } = useRoles();

  const roles = useMemo<Role[]>(() => {
    return Array.isArray(roleData) ? roleData : [];
  }, [roleData]);

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  const [selectedRoleIds, setSelectedRoleIds] =
    useState<Set<number>>(new Set());

  const [search, setSearch] = useState("");

  const {
    data: users = [],
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () =>
      http.get<User[]>("/api/admin/users"),
  });

  const {
    data: selectedUser,
    isLoading: detailLoading,
  } = useQuery({
    queryKey: ["admin-user", selectedUserId],
    queryFn: () =>
      http.get<UserDetail>(
        `/api/admin/users/${selectedUserId}`
      ),
    enabled: selectedUserId !== null,
  });

  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return roles;

    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(keyword) ||
        role.description?.toLowerCase().includes(keyword)
    );
  }, [roles, search]);

  const openRolePanel = (user: User) => {
    setSelectedUserId(user.id);
    setSearch("");

    // 서버에서 현재 User가 가지고 있는 Role만 선택
    setSelectedRoleIds(
      new Set(
        selectedUser?.roles?.map((role) => role.id) ?? []
      )
    );
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((current) => {
      const next = new Set(current);

      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }

      return next;
    });
  };

  const closePanel = () => {
    setSelectedUserId(null);
    setSelectedRoleIds(new Set());
    setSearch("");
  };

  const saveRoles = async () => {
    if (selectedUserId === null) return;

    await http.put(
      `/api/admin/users/${selectedUserId}/roles`,
      {
        roleIds: [...selectedRoleIds],
      }
    );

    closePanel();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>User Role Management</h1>
          <p>
            사용자에게 Role을 할당하거나 해제합니다.
          </p>
        </div>
      </header>

      {/* USER LIST */}
      <div className={styles.userGrid}>
        {userLoading ? (
          <div className={styles.empty}>
            사용자를 불러오는 중입니다...
          </div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>
            사용자가 없습니다.
          </div>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              className={`${styles.userCard} ${
                selectedUserId === user.id
                  ? styles.userCardSelected
                  : ""
              }`}
              onClick={() => openRolePanel(user)}
            >
              <strong>{user.username}</strong>
              <span>ID: {user.id}</span>
            </button>
          ))
        )}
      </div>

      {/* ROLE PANEL */}
      {selectedUserId !== null && (
        <div className={styles.overlay}>
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <span className={styles.label}>
                  USER ROLE MANAGEMENT
                </span>

                <h2>
                  {selectedUser?.username ?? "사용자"}
                </h2>

                <p>
                  사용자에게 적용할 Role을 선택하세요.
                </p>
              </div>

              <button
                className={styles.closeButton}
                onClick={closePanel}
              >
                ×
              </button>
            </header>

            <div className={styles.toolbar}>
              <input
                className={styles.search}
                placeholder="Role 검색..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <span className={styles.count}>
                <strong>
                  {selectedRoleIds.size}
                </strong>
                {" / "}
                {roles.length}
              </span>
            </div>

            <div className={styles.roleList}>
              {roleLoading || detailLoading ? (
                <div className={styles.empty}>
                  Role을 불러오는 중입니다...
                </div>
              ) : filteredRoles.length === 0 ? (
                <div className={styles.empty}>
                  등록된 Role이 없습니다.
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const checked =
                    selectedRoleIds.has(role.id);

                  return (
                    <label
                      key={role.id}
                      className={`${styles.roleItem} ${
                        checked
                          ? styles.roleItemChecked
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleRole(role.id)
                        }
                      />

                      <div>
                        <div className={styles.roleName}>
                          {role.name}
                        </div>

                        {role.description && (
                          <div
                            className={
                              styles.roleDescription
                            }
                          >
                            {role.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className={styles.notice}>
              선택된 Role 목록으로 사용자의 Role을
              전체 교체합니다.
            </div>

            <footer className={styles.footer}>
              <button
                className={styles.cancel}
                onClick={closePanel}
              >
                취소
              </button>

              <button
                className={styles.save}
                onClick={saveRoles}
              >
                Role 저장
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
