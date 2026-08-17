import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/http";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { useMe } from "../../queries/useMe";

import styles from "./permission.module.css";

type Permission = {
  id: number;
  name: string;
  description: string | null;
};

type PermissionDetail = {
  id: number;
  name: string;
  description: string | null;
  roles: {
    id: number;
    name: string;
  }[];
};

export default function PermissionPage() {
  const { data: me } = useMe();
  const { hasPermission } = usePermissions(me);

  const canView = hasPermission("PERMISSION_READ");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Permission 목록 조회
  const {
    data: permissions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => http.get<Permission[]>("/api/admin/permissions"),
    enabled: canView,
  });

  // 선택한 Permission 상세 조회
  const {
    data: selectedPermission,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ["permission", selectedId],
    queryFn: () =>
      http.get<PermissionDetail>(
        `/api/admin/permissions/${selectedId}`
      ),
    enabled: canView && selectedId !== null,
  });

  if (!canView) {
    return (
      <div className={styles.denied}>
        🚫 PERMISSION_READ 권한이 없습니다.
      </div>
    );
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        Permission 목록을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Permission Catalog</h1>

        <p className={styles.subtitle}>
          시스템에 정의된 Permission과 해당 Permission을 사용하는 Role을
          조회합니다.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Permission 목록 */}
        <section className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.idColumn}>ID</div>
            <div className={styles.nameColumn}>Name</div>
            <div className={styles.descriptionColumn}>
              Description
            </div>
          </div>

          {permissions.length === 0 ? (
            <div className={styles.empty}>
              등록된 Permission이 없습니다.
            </div>
          ) : (
            permissions.map((permission) => {
              const isSelected = selectedId === permission.id;

              return (
                <button
                  type="button"
                  key={permission.id}
                  className={`${styles.row} ${
                    isSelected ? styles.selectedRow : ""
                  }`}
                  onClick={() => setSelectedId(permission.id)}
                >
                  <div className={styles.idColumn}>
                    {permission.id}
                  </div>

                  <div className={`${styles.nameColumn} ${styles.code}`}>
                    {permission.name}
                  </div>

                  <div className={styles.descriptionColumn}>
                    {permission.description ?? "-"}
                  </div>
                </button>
              );
            })
          )}
        </section>

        {/* Permission 상세 */}
        <section className={styles.detailPanel}>
          {!selectedId && (
            <div className={styles.detailEmpty}>
              <div className={styles.detailEmptyTitle}>
                Permission을 선택하세요.
              </div>

              <div className={styles.detailEmptyDescription}>
                Permission을 선택하면 설명과 해당 Permission을 가진
                Role을 확인할 수 있습니다.
              </div>
            </div>
          )}

          {selectedId && isDetailLoading && (
            <div className={styles.loading}>
              Permission 상세 정보를 불러오는 중...
            </div>
          )}

          {selectedId && isDetailError && (
            <div className={styles.error}>
              Permission 상세 정보를 불러오지 못했습니다.
            </div>
          )}

          {selectedPermission && (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.detailCode}>
                  {selectedPermission.name}
                </div>

                <h2 className={styles.detailTitle}>
                  {selectedPermission.description ?? "-"}
                </h2>
              </div>

              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>
                  Assigned Roles
                </h3>

                {selectedPermission.roles.length === 0 ? (
                  <div className={styles.empty}>
                    이 Permission을 사용하는 Role이 없습니다.
                  </div>
                ) : (
                  <ul className={styles.roleList}>
                    {selectedPermission.roles.map((role) => (
                      <li
                        key={role.id}
                        className={styles.roleItem}
                      >
                        <span className={styles.roleName}>
                          {role.name}
                        </span>
                      </li>
                    ))}
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
