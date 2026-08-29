// RolePermissionPanel.tsx


import { useEffect, useMemo, useState } from "react";

import { useRoles } from "../../queries/useRoles";
import { usePermissions } from "../../queries/usePermissions";
import { useRoleManagement } from "../../mutations/useRoleManage";

import styles from "./RolePermissionPanel.module.css";

type Props = {
  roleId: number;
  onClose: () => void;
};

export default function RolePermissionPanel({
  roleId,
  onClose,
}: Props) {
  const { data: roles = [] } = useRoles();

  const {
    data: permissions = [],
    isLoading,
    isError,
  } = usePermissions();

  const { assignPermissions } = useRoleManagement();

  const [selectedPermissionIds, setSelectedPermissionIds] =
    useState<number[]>([]);

  const [permissionSearch, setPermissionSearch] =
    useState("");

  const role = roles.find(
    (item) => item.id === roleId
  );

  useEffect(() => {
    setSelectedPermissionIds(
      role?.permissions?.map(
        (permission) => permission.id
      ) ?? []
    );

    setPermissionSearch("");
  }, [roleId, role?.permissions]);

  const filteredPermissions = useMemo(() => {
    const keyword =
      permissionSearch.trim().toLowerCase();

    if (!keyword) {
      return permissions;
    }

    return permissions.filter(
      (permission) =>
        permission.name
          .toLowerCase()
          .includes(keyword) ||
        permission.description
          ?.toLowerCase()
          .includes(keyword)
    );
  }, [permissions, permissionSearch]);

  const togglePermission = (
    permissionId: number
  ) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter(
            (id) => id !== permissionId
          )
        : [...current, permissionId]
    );
  };

  const selectAllPermissions = () => {
    setSelectedPermissionIds(
      permissions.map(
        (permission) => permission.id
      )
    );
  };

  const clearAllPermissions = () => {
    setSelectedPermissionIds([]);
  };

  const savePermissions = () => {
    assignPermissions.mutate(
      {
        roleId,
        permissionIds: selectedPermissionIds,
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
              PERMISSION MANAGEMENT
            </span>

            <h2>
              {role?.name ?? "Role"}
            </h2>

            <p>
              이 Role에 적용할 Permission을
              선택하세요.
            </p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={
              assignPermissions.isPending
            }
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        {isLoading && (
          <div className={styles.empty}>
            Permission을 불러오는 중입니다...
          </div>
        )}

        {isError && (
          <div className={styles.empty}>
            Permission을 불러오지 못했습니다.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>
                  ⌕
                </span>

                <input
                  className={styles.search}
                  placeholder="Permission 검색..."
                  value={permissionSearch}
                  onChange={(event) =>
                    setPermissionSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className={styles.counter}>
                <strong>
                  {selectedPermissionIds.length}
                </strong>

                <span>
                  / {permissions.length}
                </span>
              </div>
            </div>

            <div className={styles.bulk}>
              <button
                type="button"
                className={styles.bulkButton}
                onClick={selectAllPermissions}
                disabled={
                  permissions.length === 0
                }
              >
                전체 선택
              </button>

              <button
                type="button"
                className={`${styles.bulkButton} ${styles.clearButton}`}
                onClick={clearAllPermissions}
                disabled={
                  selectedPermissionIds.length ===
                  0
                }
              >
                전체 해제
              </button>

              <span className={styles.bulkDivider} />

              <span className={styles.resultCount}>
                {filteredPermissions.length}개 표시
              </span>
            </div>

            <div className={styles.permissionList}>
              {filteredPermissions.length === 0 ? (
                <div className={styles.empty}>
                  검색 결과가 없습니다.
                </div>
              ) : (
                filteredPermissions.map(
                  (permission) => {
                    const checked =
                      selectedPermissionIds.includes(
                        permission.id
                      );

                    return (
                      <label
                        key={permission.id}
                        className={`${styles.permissionItem} ${
                          checked
                            ? styles.checked
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            togglePermission(
                              permission.id
                            )
                          }
                        />

                        <span
                          className={
                            styles.checkbox
                          }
                        >
                          {checked && "✓"}
                        </span>

                        <div
                          className={
                            styles.permissionContent
                          }
                        >
                          <strong>
                            {permission.name}
                          </strong>

                          {permission.description && (
                            <small>
                              {
                                permission.description
                              }
                            </small>
                          )}
                        </div>

                        <span
                          className={
                            styles.permissionId
                          }
                        >
                          #{permission.id}
                        </span>
                      </label>
                    );
                  }
                )
              )}
            </div>

            <div className={styles.notice}>
              <span className={styles.noticeIcon}>
                !
              </span>

              <span>
                저장하면 현재 선택한 Permission
                목록으로 전체 교체됩니다.
              </span>
            </div>

            <footer className={styles.footer}>
              <div className={styles.footerStatus}>
                <span>선택된 권한</span>
                <strong>
                  {selectedPermissionIds.length}
                </strong>
              </div>

              <div className={styles.footerActions}>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={onClose}
                  disabled={
                    assignPermissions.isPending
                  }
                >
                  취소
                </button>

                <button
                  type="button"
                  className={styles.save}
                  onClick={savePermissions}
                  disabled={
                    assignPermissions.isPending
                  }
                >
                  {assignPermissions.isPending
                    ? "저장 중..."
                    : "권한 저장"}
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
