// pages/RolePage.tsx

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useRoles } from "../../queries/useRoles";
import { useRoleManagement } from "../../mutations/useRoleManage";
import { http } from "../../api/http";

import styles from "./RolePage.module.css";

type AdminPermission = {
  id: number;
  name: string;
  description: string | null;
};

type AdminRole = {
  id: number;
  name: string;
  description: string;
  permissions: AdminPermission[];
};


export default function RolePage() {
  const { data: roleData = [] } = useRoles();
  const roles = roleData as AdminRole[];

  const {
    saveRole,
    assignPermissions,
    removeRole,
  } = useRoleManagement();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<
    number[]
  >([]);

  const [permissionSearch, setPermissionSearch] = useState("");

  const { data: permissions = [], isLoading: isPermissionLoading } =
    useQuery({
      queryKey: ["permissions"],
      queryFn: () =>
        http.get<AdminPermission[]>("/api/admin/permissions"),
    });

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId),
    [roles, selectedRoleId]
  );

  const filteredPermissions = useMemo(() => {
    const keyword = permissionSearch.trim().toLowerCase();

    if (!keyword) return permissions;

    return permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(keyword) ||
        permission.description?.toLowerCase().includes(keyword)
    );
  }, [permissions, permissionSearch]);

  const createRole = () => {
    if (!form.name.trim()) return;

    saveRole.mutate(form, {
      onSuccess() {
        setForm({
          name: "",
          description: "",
        });
      },
    });
  };

  const updateRole = () => {
    if (editingId == null) return;

    saveRole.mutate(
      {
        id: editingId,
        ...form,
      },
      {
        onSuccess() {
          setEditingId(null);
          setForm({
            name: "",
            description: "",
          });
        },
      }
    );
  };

  const openPermissionPanel = (role: (typeof roles)[number]) => {
    setSelectedRoleId(role.id);

    setSelectedPermissionIds(
      role.permissions?.map((permission) => permission.id)
    );

    setPermissionSearch("");
  };

  const closePermissionPanel = () => {
    if (assignPermissions.isPending) return;

    setSelectedRoleId(null);
    setSelectedPermissionIds([]);
    setPermissionSearch("");
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId]
    );
  };

  const selectAllPermissions = () => {
    setSelectedPermissionIds(permissions.map((permission) => permission.id));
  };

  const clearAllPermissions = () => {
    setSelectedPermissionIds([]);
  };

  const savePermissions = () => {
    if (!selectedRoleId) return;

    assignPermissions.mutate(
      {
        roleId: selectedRoleId,
        permissionIds: selectedPermissionIds,
      },
      {
        onSuccess() {
          setSelectedRoleId(null);
          setSelectedPermissionIds([]);
          setPermissionSearch("");
        },
      }
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Role Management</h1>
          <p>Role을 생성하고 Permission을 관리합니다.</p>
        </div>
      </div>

      <div className={styles.formRow}>
        <input
          className={styles.input}
          placeholder="Role Name"
          value={form.name}
          onChange={(e) =>
            setForm((v) => ({
              ...v,
              name: e.target.value,
            }))
          }
        />

        <input
          className={styles.input}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((v) => ({
              ...v,
              description: e.target.value,
            }))
          }
        />

        {editingId == null ? (
          <button
            className={styles.button}
            onClick={createRole}
            disabled={saveRole.isPending}
          >
            생성
          </button>
        ) : (
          <>
            <button
              className={styles.button}
              onClick={updateRole}
              disabled={saveRole.isPending}
            >
              저장
            </button>

            <button
              className={styles.secondaryButton}
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  description: "",
                });
              }}
              disabled={saveRole.isPending}
            >
              취소
            </button>
          </>
        )}
      </div>

      <div className={styles.tableHeader}>
        <div>ID</div>
        <div>Role</div>
        <div>설명</div>
        <div>관리</div>
      </div>

      {roles.map((role) => {
        const permissionCount = role.permissions.length;

        return (
          <div
            key={role.id}
            className={styles.tableRow}
          >
            <div className={styles.cell}>{role.id}</div>

            <div className={styles.roleName}>
              {role.name}
            </div>

            <div className={styles.cell}>
              {role.description?.trim() || "-"}
            </div>

            <div className={styles.actionCell}>
              <button
                className={styles.permissionButton}
                onClick={() => openPermissionPanel(role)}
              >
                권한
                <span className={styles.permissionCount}>
                  {permissionCount}
                </span>
              </button>

              <button
                className={styles.button}
                onClick={() => {
                  setEditingId(role.id);
                  setForm({
                    name: role.name,
                    description: role.description,
                  });
                }}
              >
                수정
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => removeRole.mutate(role.id)}
                disabled={removeRole.isPending}
              >
                삭제
              </button>
            </div>
          </div>
        );
      })}

      {selectedRole && (
        <div className={styles.permissionOverlay}>
          <div className={styles.permissionPanel}>
            <div className={styles.permissionHeader}>
              <div>
                <span className={styles.permissionLabel}>
                  PERMISSION MANAGEMENT
                </span>

                <h2>{selectedRole.name}</h2>

                <p>
                  이 Role에 적용할 최종 Permission을 선택하세요.
                </p>
              </div>

              <button
                className={styles.closeButton}
                onClick={closePermissionPanel}
                disabled={assignPermissions.isPending}
                aria-label="권한 관리 닫기"
              >
                ×
              </button>
            </div>

            <div className={styles.permissionToolbar}>
              <input
                className={styles.permissionSearch}
                placeholder="Permission 검색..."
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
              />

              <div className={styles.selectionInfo}>
                <strong>{selectedPermissionIds.length}</strong>
                <span>/ {permissions.length} 선택</span>
              </div>
            </div>

            <div className={styles.bulkActions}>
              <button
                className={styles.textButton}
                onClick={selectAllPermissions}
                disabled={isPermissionLoading || permissions.length === 0}
              >
                전체 선택
              </button>

              <button
                className={styles.textButtonDanger}
                onClick={clearAllPermissions}
                disabled={selectedPermissionIds.length === 0}
              >
                전체 해제
              </button>
            </div>

            <div className={styles.permissionList}>
              {isPermissionLoading ? (
                <div className={styles.emptyState}>
                  Permission을 불러오는 중입니다...
                </div>
              ) : filteredPermissions.length === 0 ? (
                <div className={styles.emptyState}>
                  검색 결과가 없습니다.
                </div>
              ) : (
                filteredPermissions.map((permission) => {
                  const checked = selectedPermissionIds.includes(
                    permission.id
                  );

                  return (
                    <label
                      key={permission.id}
                      className={`${styles.permissionItem} ${
                        checked ? styles.permissionItemChecked : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          togglePermission(permission.id)
                        }
                      />

                      <div className={styles.permissionContent}>
                        <div className={styles.permissionName}>
                          {permission.name}
                        </div>

                        {permission.description && (
                          <div className={styles.permissionDescription}>
                            {permission.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className={styles.permissionNotice}>
              <span>i</span>
              <p>
                저장하면 현재 선택된 Permission 목록으로 전체 교체됩니다.
                아무것도 선택하지 않고 저장하면 모든 Permission이
                해제됩니다.
              </p>
            </div>

            <div className={styles.permissionFooter}>
              <button
                className={styles.secondaryButton}
                onClick={closePermissionPanel}
                disabled={assignPermissions.isPending}
              >
                취소
              </button>

              <button
                className={styles.savePermissionButton}
                onClick={savePermissions}
                disabled={assignPermissions.isPending}
              >
                {assignPermissions.isPending
                  ? "저장 중..."
                  : "권한 저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
