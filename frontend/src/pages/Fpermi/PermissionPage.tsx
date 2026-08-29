// pages/PermissionPage.tsx

import { useState } from "react";

import {
  usePermission,
  usePermissions,
} from "../../queries/usePermissions";

import FullPageSpinner from "../../components/loading/FullPageSpinner";

import styles from "./permission.module.css";

export default function PermissionPage() {
  const {
    data: permissions = [],
    isLoading,
    isError,
  } = usePermissions();

  const [selectedId, setSelectedId] = useState<number | null>(
    null
  );

  const {
    data: selectedPermission,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = usePermission(selectedId);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Permission을 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* =========================
          TITLE
      ========================= */}

      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          Permission Catalog
        </h1>

        <p className={styles.subtitle}>
          시스템에서 사용하는 작업 권한을 조회합니다.
        </p>
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className={styles.layout}>
        {/* =========================
            PERMISSION LIST
        ========================= */}

        <section className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.idColumn}>
              ID
            </div>

            <div className={styles.nameColumn}>
              Permission
            </div>

            <div className={styles.descriptionColumn}>
              Description
            </div>
          </div>

          {permissions.length === 0 ? (
            <div className={styles.empty}>
              Permission이 없습니다.
            </div>
          ) : (
            permissions.map((permission) => {
              const isSelected =
                selectedId === permission.id;

              return (
                <button
                  key={permission.id}
                  type="button"
                  className={`${styles.row} ${
                    isSelected
                      ? styles.selectedRow
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedId(permission.id)
                  }
                >
                  <div className={styles.idColumn}>
                    {permission.id}
                  </div>

                  <div className={styles.nameColumn}>
                    <span className={styles.code}>
                      {permission.name}
                    </span>
                  </div>

                  <div
                    className={
                      styles.descriptionColumn
                    }
                  >
                    {permission.description ?? "-"}
                  </div>
                </button>
              );
            })
          )}
        </section>

        {/* =========================
            DETAIL
        ========================= */}

        <section className={styles.detailPanel}>
          {/* 아무것도 선택하지 않은 상태 */}
          {selectedId === null && (
            <div className={styles.detailEmpty}>
              <div
                className={
                  styles.detailEmptyTitle
                }
              >
                Permission을 선택하세요.
              </div>

              <div
                className={
                  styles.detailEmptyDescription
                }
              >
                왼쪽 목록에서 Permission을 선택하면
                해당 Permission을 사용하는 Role을
                확인할 수 있습니다.
              </div>
            </div>
          )}

          {/* 상세 Loading */}
          {selectedId !== null &&
            isDetailLoading && (
              <div className={styles.loading}>
                Permission 상세 정보를
                불러오는 중...
              </div>
            )}

          {/* 상세 Error */}
          {selectedId !== null &&
            !isDetailLoading &&
            isDetailError && (
              <div className={styles.error}>
                Permission 상세 정보를
                불러오지 못했습니다.
              </div>
            )}

          {/* 상세 정보 */}
          {selectedPermission &&
            !isDetailLoading &&
            !isDetailError && (
              <>
                <div
                  className={styles.detailHeader}
                >
                  <div
                    className={styles.detailCode}
                  >
                    {selectedPermission.name}
                  </div>

                  <h2
                    className={
                      styles.detailTitle
                    }
                  >
                    {selectedPermission.description ??
                      "설명이 없습니다."}
                  </h2>
                </div>

                <div
                  className={
                    styles.detailSection
                  }
                >
                  <h3
                    className={
                      styles.sectionTitle
                    }
                  >
                    Assigned Roles
                  </h3>

                  {selectedPermission.roles.length ===
                  0 ? (
                    <div className={styles.empty}>
                      이 Permission을 사용하는
                      Role이 없습니다.
                    </div>
                  ) : (
                    <ul
                      className={
                        styles.roleList
                      }
                    >
                      {selectedPermission.roles.map(
                        (role) => (
                          <li
                            key={role.id}
                            className={
                              styles.roleItem
                            }
                          >
                            <span
                              className={
                                styles.roleName
                              }
                            >
                              {role.name}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </>
            )}
        </section>
      </div>
    </div>
  );
}
