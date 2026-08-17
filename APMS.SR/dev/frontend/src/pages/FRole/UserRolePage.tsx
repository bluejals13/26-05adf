// pages/UserRolePage.tsx

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { userApi } from "../../api/user.api";
import { fetchRoles } from "../../api/role.api";
import type { User } from "../../auth/auth.types";
import type { Role } from "../../queries/role";
import { http } from "../../api/http";

import styles from "./UserRolePage.module.css";

type UserWithRoles = User & {
  roles?: string[];
};

type AssignRolesRequest = {
  roleNames: string[];
};

const assignUserRoles = async (
  userId: number,
  roleNames: string[]
): Promise<void> => {
  await http.post(`/api/admin/users/${userId}/roles`, {
    roleNames,
  } satisfies AssignRolesRequest);
};

export default function UserRolePage() {
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    isLoading: usersLoading,
  } = useQuery<UserWithRoles[]>({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });

  const {
    data: roles = [],
    isLoading: rolesLoading,
  } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const saveRoles = useMutation({
    mutationFn: () => {
      if (selectedUserId == null) {
        throw new Error("사용자가 선택되지 않았습니다.");
      }

      return assignUserRoles(
        selectedUserId,
        selectedRoleNames
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      closePanel();
    },
  });

  const selectedUser = useMemo(
    () =>
      users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return roles;
    }

    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(keyword) ||
        role.description?.toLowerCase().includes(keyword)
    );
  }, [roles, search]);

  const openPanel = (user: UserWithRoles) => {
    setSelectedUserId(user.id);

    // 기존 Role을 체크 상태로 초기화
    setSelectedRoleNames(
      Array.from(new Set(user.roles ?? []))
    );

    setSearch("");
  };

  const closePanel = () => {
    if (saveRoles.isPending) return;

    setSelectedUserId(null);
    setSelectedRoleNames([]);
    setSearch("");
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoleNames((current) =>
      current.includes(roleName)
        ? current.filter((name) => name !== roleName)
        : [...current, roleName]
    );
  };

  const selectAll = () => {
    setSelectedRoleNames(
      Array.from(new Set(roles.map((role) => role.name)))
    );
  };

  const clearAll = () => {
    setSelectedRoleNames([]);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>User Role Management</h1>
          <p>
            사용자에게 Role을 할당하고 관리합니다.
          </p>
        </div>

        <div className={styles.summary}>
          <strong>{users.length}</strong>
          <span>Users</span>
        </div>
      </header>

      {/* 검색 */}
      <div className={styles.searchBox}>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="사용자 검색..."
        />
      </div>

      {/* USER LIST */}
      {usersLoading ? (
        <div className={styles.empty}>
          사용자를 불러오는 중입니다...
        </div>
      ) : users.length === 0 ? (
        <div className={styles.empty}>
          사용자가 없습니다.
        </div>
      ) : (
        <div className={styles.userGrid}>
          {users.map((user) => {
            const userRoles = Array.from(
              new Set(user.roles ?? [])
            );

            return (
              <div
                key={user.id}
                className={styles.userCard}
              >
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div className={styles.userText}>
                    <strong>{user.username}</strong>

                    <div className={styles.roleList}>
                      {userRoles.length > 0 ? (
                        userRoles.map((role) => (
                          <span
                            key={role}
                            className={styles.roleBadge}
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className={styles.noRole}>
                          Role 없음
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className={styles.manageButton}
                  onClick={() => openPanel(user)}
                >
                  Role 관리
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ROLE PANEL */}
      {selectedUser && (
        <div
          className={styles.overlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closePanel();
            }
          }}
        >
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <span className={styles.label}>
                  USER ROLE MANAGEMENT
                </span>

                <h2>{selectedUser.username}</h2>

                <p>
                  사용자에게 적용할 Role을 선택하세요.
                </p>
              </div>

              <button
                className={styles.closeButton}
                onClick={closePanel}
                disabled={saveRoles.isPending}
                aria-label="닫기"
              >
                ×
              </button>
            </header>

            <div className={styles.toolbar}>
              <input
                className={styles.roleSearch}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Role 검색..."
              />

              <div className={styles.selectedCount}>
                <strong>{selectedRoleNames.length}</strong>
                <span>/ {roles.length}</span>
              </div>
            </div>

            <div className={styles.bulkActions}>
              <button
                className={styles.textButton}
                onClick={selectAll}
                disabled={rolesLoading || roles.length === 0}
              >
                전체 선택
              </button>

              <button
                className={styles.dangerTextButton}
                onClick={clearAll}
                disabled={selectedRoleNames.length === 0}
              >
                전체 해제
              </button>
            </div>

            <div className={styles.roleList}>
              {rolesLoading ? (
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
                    selectedRoleNames.includes(role.name);

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
                          toggleRole(role.name)
                        }
                      />

                      <div className={styles.roleContent}>
                        <div className={styles.roleName}>
                          {role.name}
                        </div>

                        <div className={styles.roleDescription}>
                          {role.description?.trim() || "-"}
                        </div>
                      </div>

                      {checked && (
                        <span className={styles.checkedMark}>
                          ✓
                        </span>
                      )}
                    </label>
                  );
                })
              )}
            </div>

            <div className={styles.notice}>
              <span>i</span>
              <p>
                저장하면 현재 선택된 Role 목록으로
                사용자의 Role이 교체됩니다.
                아무것도 선택하지 않으면 모든 Role이
                해제됩니다.
              </p>
            </div>

            <footer className={styles.footer}>
              <button
                className={styles.cancelButton}
                onClick={closePanel}
                disabled={saveRoles.isPending}
              >
                취소
              </button>

              <button
                className={styles.saveButton}
                onClick={() => saveRoles.mutate()}
                disabled={saveRoles.isPending}
              >
                {saveRoles.isPending
                  ? "저장 중..."
                  : "Role 저장"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
