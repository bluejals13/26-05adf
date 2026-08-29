// pages/FRole/UserRolePanel.tsx


import { useMemo, useState } from "react";

import type { User } from "../../auth/auth.types";

import { useRoles } from "../../queries/useRoles";
import { useUserRoleManage } from "../../mutations/useUserRoleManage";

import styles from "./UserRolePanel.module.css";

type Props = {
  user: User;
  onClose: () => void;
};

export default function UserRolePanel({
  user,
  onClose,
}: Props) {
  const {
    data: roles = [],
    isLoading,
    isError,
  } = useRoles();

  const { assignRoles } = useUserRoleManage();

  const [selectedRoleNames, setSelectedRoleNames] =
    useState<string[]>(user.roles ?? []);

  const [search, setSearch] = useState("");

  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return roles;
    }

    return roles.filter(
      (role) =>
        role.name
          .toLowerCase()
          .includes(keyword) ||
        role.description
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [roles, search]);

  const toggleRole = (roleName: string) => {
    setSelectedRoleNames((current) =>
      current.includes(roleName)
        ? current.filter(
            (name) => name !== roleName
          )
        : [...current, roleName]
    );
  };

  const selectAll = () => {
    setSelectedRoleNames(
      roles.map((role) => role.name)
    );
  };

  const clearAll = () => {
    setSelectedRoleNames([]);
  };

  const handleSave = () => {
    const roleIds = roles
      .filter((role) =>
        selectedRoleNames.includes(role.name)
      )
      .map((role) => role.id);

    assignRoles.mutate(
      {
        userId: user.id,
        roleIds,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <section
        className={styles.panel}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.label}>
              ROLE MANAGEMENT
            </span>

            <h2>{user.username}</h2>

            <p>
              이 계정에 적용할 Role을 선택하세요.
            </p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={assignRoles.isPending}
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              ⌕
            </span>

            <input
              className={styles.search}
              placeholder="Role 검색..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              disabled={isLoading || isError}
            />
          </div>

          <div className={styles.counter}>
            <strong>
              {selectedRoleNames.length}
            </strong>

            <span>
              / {roles.length}
            </span>
          </div>
        </div>

        <div className={styles.bulk}>
          <button
            type="button"
            className={styles.bulkButton}
            onClick={selectAll}
            disabled={
              isLoading ||
              isError ||
              roles.length === 0
            }
          >
            전체 선택
          </button>

          <button
            type="button"
            className={`${styles.bulkButton} ${styles.clearButton}`}
            onClick={clearAll}
            disabled={
              isLoading ||
              selectedRoleNames.length === 0
            }
          >
            전체 해제
          </button>

          <span className={styles.bulkDivider} />

          <span className={styles.resultCount}>
            {filteredRoles.length}개 표시
          </span>
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.empty}>
              Role을 불러오는 중입니다...
            </div>
          ) : isError ? (
            <div className={styles.empty}>
              Role을 불러오지 못했습니다.
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className={styles.empty}>
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredRoles.map((role) => {
              const checked =
                selectedRoleNames.includes(
                  role.name
                );

              return (
                <label
                  key={role.id}
                  className={`${styles.item} ${
                    checked
                      ? styles.checked
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

                  <span
                    className={styles.checkbox}
                  >
                    {checked && "✓"}
                  </span>

                  <div className={styles.roleContent}>
                    <strong>{role.name}</strong>

                    {role.description && (
                      <small>
                        {role.description}
                      </small>
                    )}
                  </div>

                  <span className={styles.roleId}>
                    #{role.id}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <div className={styles.notice}>
          <span className={styles.noticeIcon}>
            !
          </span>

          <span>
            저장하면 선택한 Role 목록으로 해당
            사용자의 Role을 전체 교체합니다.
          </span>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerStatus}>
            <span>선택된 Role</span>

            <strong>
              {selectedRoleNames.length}
            </strong>
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
              disabled={assignRoles.isPending}
            >
              취소
            </button>

            <button
              type="button"
              className={styles.save}
              onClick={handleSave}
              disabled={
                assignRoles.isPending ||
                isLoading ||
                isError
              }
            >
              {assignRoles.isPending
                ? "저장 중..."
                : "저장"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
