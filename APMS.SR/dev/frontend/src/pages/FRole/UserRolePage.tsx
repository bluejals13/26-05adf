// pages/UserRolePage.tsx


import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { userApi } from "../../api/user.api";
import { fetchRoles } from "../../api/role.api";
import type { Role as AdminRole } from "../../queries/role";
import type { User } from "../../auth/auth.types";
import { http } from "../../api/http";

import styles from "./UserRolePage.module.css";

type UserRoleValue =
  | string
  | {
      id?: number;
      name?: string;
    };

type UserWithRoles = Omit<User, "roles"> & {
  roles?: UserRoleValue[];
};

const getRoleName = (role: UserRoleValue): string => {
  if (typeof role === "string") {
    return role;
  }

  return role.name ?? "";
};

const getUserRoleNames = (user: UserWithRoles): string[] => {
  return Array.from(
    new Set(
      (user.roles ?? [])
        .map(getRoleName)
        .map((name) => name.trim())
        .filter(Boolean)
    )
  );
};

const assignUserRoles = async (
  userId: number,
  roleNames: string[]
): Promise<void> => {
  await http.post(`/api/admin/users/${userId}/roles`, {
    roleNames,
  });
};

export default function UserRolePage() {
  const queryClient = useQueryClient();

  const [userSearch, setUserSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  const [selectedRoleNames, setSelectedRoleNames] =
    useState<string[]>([]);

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
  } = useQuery<AdminRole[]>({
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      closePanel();
    },
  });

  const selectedUser = useMemo(
    () =>
      users.find(
        (user) => user.id === selectedUserId
      ) ?? null,
    [users, selectedUserId]
  );

  /*
   * 사용자 검색
   */
  const filteredUsers = useMemo(() => {
    const keyword = userSearch
      .trim()
      .toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) => {
      const roleNames = getUserRoleNames(user);

      return (
        user.username
          .toLowerCase()
          .includes(keyword) ||
        roleNames.some((role) =>
          role.toLowerCase().includes(keyword)
        )
      );
    });
  }, [users, userSearch]);

  /*
   * Role 검색
   */
  const filteredRoles = useMemo(() => {
    const keyword = roleSearch
      .trim()
      .toLowerCase();

    if (!keyword) {
      return roles;
    }

    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(keyword) ||
        role.description
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [roles, roleSearch]);

  const openPanel = (user: UserWithRoles) => {
    setSelectedUserId(user.id);

    /*
     * 기존 Role을 그대로 선택 상태로 만든다.
     *
     * 문자열 / 객체 응답 모두 대응
     * 중복도 제거
     */
    setSelectedRoleNames(
      getUserRoleNames(user)
    );

    setRoleSearch("");
  };

  const closePanel = () => {
    if (saveRoles.isPending) {
      return;
    }

    setSelectedUserId(null);
    setSelectedRoleNames([]);
    setRoleSearch("");
  };

  /*
   * Role 카드 클릭
   */
  const toggleRole = (roleName: string) => {
    setSelectedRoleNames((current) => {
      if (current.includes(roleName)) {
        return current.filter(
          (name) => name !== roleName
        );
      }

      return [
        ...new Set([
          ...current,
          roleName,
        ]),
      ];
    });
  };

  const selectAll = () => {
    setSelectedRoleNames(
      Array.from(
        new Set(
          roles.map((role) => role.name)
        )
      )
    );
  };

  const clearAll = () => {
    setSelectedRoleNames([]);
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}

      <header className={styles.header}>
        <div>
          <h1>User Role Management</h1>

          <p>
            사용자별 Role을 관리합니다.
          </p>
        </div>

        <div className={styles.userCount}>
          <strong>{users.length}</strong>
          <span>Users</span>
        </div>
      </header>

      {/* USER SEARCH */}

      <div className={styles.searchArea}>
        <input
          className={styles.userSearch}
          value={userSearch}
          onChange={(e) =>
            setUserSearch(e.target.value)
          }
          placeholder="사용자 또는 Role 검색..."
        />
      </div>

      {/* USER LIST */}

      {usersLoading ? (
        <div className={styles.emptyState}>
          사용자를 불러오는 중입니다...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className={styles.emptyState}>
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className={styles.userGrid}>
          {filteredUsers.map((user) => {
            const roleNames =
              getUserRoleNames(user);

            return (
              <article
                key={user.id}
                className={styles.userCard}
              >
                <div className={styles.userMain}>
                  <div className={styles.avatar}>
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className={styles.userInfo}>
                    <div className={styles.username}>
                      {user.username}
                    </div>

                    <div className={styles.roles}>
                      {roleNames.length > 0 ? (
                        roleNames.map((role) => (
                          <span
                            key={role}
                            className={styles.roleBadge}
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span
                          className={styles.unassigned}
                        >
                          미할당
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className={styles.manageButton}
                  onClick={() =>
                    openPanel(user)
                  }
                >
                  Role 관리
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* ROLE PANEL */}

      {selectedUser && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePanel();
            }
          }}
        >
          <section className={styles.panel}>
            {/* PANEL HEADER */}

            <header className={styles.panelHeader}>
              <div>
                <span className={styles.label}>
                  USER ROLE
                </span>

                <h2>
                  {selectedUser.username}
                </h2>

                <p>
                  필요한 Role을 선택하세요.
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

            {/* SEARCH */}

            <div className={styles.roleToolbar}>
              <input
                className={styles.roleSearch}
                value={roleSearch}
                onChange={(e) =>
                  setRoleSearch(e.target.value)
                }
                placeholder="Role 검색..."
              />

              <div
                className={
                  styles.selectedCounter
                }
              >
                <strong>
                  {selectedRoleNames.length}
                </strong>

                <span>
                  / {roles.length}
                </span>
              </div>
            </div>

            {/* BULK */}

            <div className={styles.bulkActions}>
              <button
                className={styles.textButton}
                onClick={selectAll}
                disabled={
                  rolesLoading ||
                  roles.length === 0
                }
              >
                전체 선택
              </button>

              <button
                className={
                  styles.textButtonDanger
                }
                onClick={clearAll}
                disabled={
                  selectedRoleNames.length === 0
                }
              >
                전체 해제
              </button>
            </div>

            {/* ROLE CARDS */}

            <div className={styles.roleList}>
              {rolesLoading ? (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  Role을 불러오는 중입니다...
                </div>
              ) : filteredRoles.length ===
                0 ? (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  등록된 Role이 없습니다.
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const selected =
                    selectedRoleNames.includes(
                      role.name
                    );

                  return (
                    <button
                      type="button"
                      key={role.id}
                      className={`${styles.roleCard} ${
                        selected
                          ? styles.roleCardSelected
                          : ""
                      }`}
                      onClick={() =>
                        toggleRole(
                          role.name
                        )
                      }
                    >
                      <div
                        className={
                          styles.roleIcon
                        }
                      >
                        {selected ? "✓" : "＋"}
                      </div>

                      <div
                        className={
                          styles.roleCardContent
                        }
                      >
                        <strong>
                          {role.name}
                        </strong>

                        <span>
                          {role.description?.trim() ||
                            "설명 없음"}
                        </span>
                      </div>

                      <div
                        className={
                          styles.roleState
                        }
                      >
                        {selected
                          ? "선택됨"
                          : "선택"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* NOTICE */}

            <div className={styles.notice}>
              <span>i</span>

              <p>
                저장하면 현재 선택된 Role 목록으로
                교체됩니다. 모든 Role을 해제하려면
                전체 해제 후 저장하세요.
              </p>
            </div>

            {/* FOOTER */}

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
                onClick={() =>
                  saveRoles.mutate()
                }
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
