// pages/UserRolePage.tsx

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { userApi } from "../../api/user.api";
import { fetchRoles } from "../../api/role.api";
import { http } from "../../api/http";

import { useMe } from "../../queries/useMe";
import { usePermissions } from "../../auth/hooks/usePermissions";

import type { User } from "../../auth/auth.types";

import styles from "./UserRolePage.module.css";

type Role = {
  id: number;
  name: string;
  description?: string | null;
};

export default function UserRolePage() {
  const { data: me } = useMe();
  const { hasPermission } = usePermissions(me);

  const canAssign = hasPermission("ROLE_ASSIGN");

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [roleSearch, setRoleSearch] = useState("");

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
    enabled: canAssign,
  });

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: canAssign,
  });

  /*
   * 실제 백엔드 endpoint에 맞춰
   * 이 부분만 수정하면 됩니다.
   *
   * 예:
   * PUT /api/admin/users/{userId}/roles
   * {
   *   roleIds: [1, 2]
   * }
   */
  const assignRoles = useMutation({
    mutationFn: ({
      userId,
      roleIds,
    }: {
      userId: number;
      roleIds: number[];
    }) =>
      http.put(`/api/admin/users/${userId}/roles`, {
        roleIds,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      closePanel();
    },
  });

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user: User) =>
      [
        user.username,
        user.roles?.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [users, search]);

  const selectedUser = useMemo(
    () => users.find((user: User) => user.id === selectedUserId),
    [users, selectedUserId]
  );

  const filteredRoles = useMemo(() => {
    const keyword = roleSearch.trim().toLowerCase();

    if (!keyword) return roles;

    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(keyword) ||
        role.description?.toLowerCase().includes(keyword)
    );
  }, [roles, roleSearch]);

  function openPanel(user: User) {
    setSelectedUserId(user.id);

    const ids = roles
      .filter((role) => user.roles?.includes(role.name))
      .map((role) => role.id);

    setSelectedRoleIds(ids);
    setRoleSearch("");
  }

  function closePanel() {
    if (assignRoles.isPending) return;

    setSelectedUserId(null);
    setSelectedRoleIds([]);
    setRoleSearch("");
  }

  function toggleRole(id: number) {
    setSelectedRoleIds((current) =>
      current.includes(id)
        ? current.filter((roleId) => roleId !== id)
        : [...current, id]
    );
  }

  function selectAll() {
    setSelectedRoleIds(roles.map((role) => role.id));
  }

  function clearAll() {
    setSelectedRoleIds([]);
  }

  function saveRoles() {
    if (selectedUserId == null) return;

    assignRoles.mutate({
      userId: selectedUserId,
      roleIds: selectedRoleIds,
    });
  }

  if (!canAssign) {
    return (
      <div className={styles.denied}>
        🚫 ROLE_ASSIGN 권한이 없습니다.
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>User Role Management</h1>
          <p>사용자에게 Role을 할당하고 관리합니다.</p>
        </div>

        <div className={styles.count}>
          {filteredUsers.length} Users
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="사용자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {usersLoading ? (
        <div className={styles.empty}>사용자를 불러오는 중입니다...</div>
      ) : (
        <div className={styles.grid}>
          {filteredUsers.map((user: User) => (
            <article key={user.id} className={styles.card}>
              <div className={styles.userInfo}>
                <span className={styles.userId}>#{user.id}</span>

                <strong>{user.username}</strong>

                <div className={styles.roles}>
                  {user.roles?.length ? (
                    user.roles.map((role) => (
                      <span key={role} className={styles.role}>
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

              <button
                className={styles.manageButton}
                onClick={() => openPanel(user)}
              >
                Role 관리
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className={styles.overlay}>
          <section className={styles.panel}>
            <header className={styles.panelHeader}>
              <div>
                <span>ROLE MANAGEMENT</span>
                <h2>{selectedUser.username}</h2>
                <p>이 계정에 적용할 Role을 선택하세요.</p>
              </div>

              <button
                className={styles.close}
                onClick={closePanel}
                disabled={assignRoles.isPending}
              >
                ×
              </button>
            </header>

            <div className={styles.panelToolbar}>
              <input
                className={styles.roleSearch}
                placeholder="Role 검색..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />

              <strong>
                {selectedRoleIds.length} / {roles.length}
              </strong>
            </div>

            <div className={styles.bulk}>
              <button
                onClick={selectAll}
                disabled={rolesLoading || !roles.length}
              >
                전체 선택
              </button>

              <button
                className={styles.clear}
                onClick={clearAll}
                disabled={!selectedRoleIds.length}
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
                  검색 결과가 없습니다.
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const checked = selectedRoleIds.includes(role.id);

                  return (
                    <label
                      key={role.id}
                      className={`${styles.roleItem} ${
                        checked ? styles.checked : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(role.id)}
                      />

                      <div>
                        <strong>{role.name}</strong>

                        {role.description && (
                          <small>{role.description}</small>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className={styles.notice}>
              선택한 Role 목록으로 해당 사용자의 Role을 전체 교체합니다.
              아무것도 선택하지 않고 저장하면 모든 Role이 해제됩니다.
            </div>

            <footer className={styles.footer}>
              <button
                className={styles.cancel}
                onClick={closePanel}
                disabled={assignRoles.isPending}
              >
                취소
              </button>

              <button
                className={styles.save}
                onClick={saveRoles}
                disabled={assignRoles.isPending}
              >
                {assignRoles.isPending ? "저장 중..." : "Role 저장"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
