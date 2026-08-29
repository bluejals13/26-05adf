// pages/RolePage.tsx

import { useState } from "react";

import { useRoles } from "../../queries/useRoles";
import { useRoleManagement } from "../../mutations/useRoleManage";

import FullPageSpinner from "../../components/loading/FullPageSpinner";

import RolePermissionPanel from "./RolePermissionPanel";

import styles from "./RolePage.module.css";

const emptyForm = {
  name: "",
  description: "",
};

export default function RolePage() {
  const {
    data: roles = [],
    isLoading,
    isError,
  } = useRoles();

  const {
    saveRole,
    removeRole,
  } = useRoleManagement();

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [selectedRoleId, setSelectedRoleId] =
    useState<number | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;

    saveRole.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
      },
      {
        onSuccess: resetForm,
      }
    );
  };

  const handleUpdate = () => {
    if (editingId == null) return;
    if (!form.name.trim()) return;

    saveRole.mutate(
      {
        id: editingId,
        name: form.name.trim(),
        description: form.description.trim(),
      },
      {
        onSuccess: resetForm,
      }
    );
  };

  const handleEdit = (
    role: (typeof roles)[number]
  ) => {
    setEditingId(role.id);

    setForm({
      name: role.name,
      description: role.description ?? "",
    });
  };

  const closePermissionPanel = () => {
    setSelectedRoleId(null);
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          Role을 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* =========================
          HEADER
      ========================= */}

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ACCESS CONTROL
          </div>

          <h1>Role Management</h1>

          <p>
            Role을 생성하고 각 Role에 부여된
            Permission을 관리합니다.
          </p>
        </div>

        <div className={styles.count}>
          <strong>{roles.length}</strong>
          <span>Roles</span>
        </div>
      </header>

      {/* =========================
          FORM
      ========================= */}

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <div>
            <h2>
              {editingId == null
                ? "새 Role 생성"
                : "Role 수정"}
            </h2>

            <p>
              {editingId == null
                ? "시스템에서 사용할 새로운 Role을 등록합니다."
                : "Role 정보를 수정합니다."}
            </p>
          </div>

          {editingId != null && (
            <span className={styles.editingBadge}>
              EDITING
            </span>
          )}
        </div>

        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="Role Name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            disabled={saveRole.isPending}
          />

          <input
            className={styles.input}
            placeholder="Description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            disabled={saveRole.isPending}
          />

          <div className={styles.formActions}>
            {editingId == null ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleCreate}
                disabled={
                  saveRole.isPending ||
                  !form.name.trim()
                }
              >
                {saveRole.isPending
                  ? "생성 중..."
                  : "Role 생성"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleUpdate}
                  disabled={
                    saveRole.isPending ||
                    !form.name.trim()
                  }
                >
                  {saveRole.isPending
                    ? "저장 중..."
                    : "변경사항 저장"}
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={resetForm}
                  disabled={saveRole.isPending}
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          ROLE LIST HEADER
      ========================= */}

      <div className={styles.listHeader}>
        <div>
          <h2>Roles</h2>

          <span>
            등록된 Role 목록
          </span>
        </div>

        {roles.length > 0 && (
          <span className={styles.listCount}>
            {roles.length}개
          </span>
        )}
      </div>

      {/* =========================
          ROLE LIST
      ========================= */}

      {roles.length === 0 ? (
        <div className={styles.emptyCard}>
          <strong>
            등록된 Role이 없습니다.
          </strong>

          <span>
            위의 입력창에서 새로운 Role을 생성하세요.
          </span>
        </div>
      ) : (
        <div className={styles.roleList}>
          {roles.map((role) => (
            <article
              key={role.id}
              className={styles.roleCard}
            >
              <div className={styles.roleInfo}>
                <div className={styles.roleMeta}>
                  <span className={styles.roleId}>
                    #{role.id}
                  </span>

                  <span className={styles.roleBadge}>
                    ROLE
                  </span>
                </div>

                <h3>{role.name}</h3>

                <p>
                  {role.description?.trim() ||
                    "설명이 없습니다."}
                </p>
              </div>

              <div className={styles.rolePermissions}>
                <span>
                  Permissions
                </span>

                <strong>
                  {role.permissions?.length ?? 0}
                </strong>
              </div>

              <div className={styles.actionCell}>
                <button
                  type="button"
                  className={styles.permissionButton}
                  onClick={() =>
                    setSelectedRoleId(role.id)
                  }
                  disabled={
                    removeRole.isPending
                  }
                >
                  권한 관리
                  <span>
                    {role.permissions?.length ?? 0}
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() =>
                    handleEdit(role)
                  }
                  disabled={
                    saveRole.isPending ||
                    removeRole.isPending
                  }
                >
                  수정
                </button>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() =>
                    removeRole.mutate(role.id)
                  }
                  disabled={
                    saveRole.isPending ||
                    removeRole.isPending
                  }
                >
                  {removeRole.isPending
                    ? "삭제 중..."
                    : "삭제"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =========================
          PERMISSION PANEL
      ========================= */}

      {selectedRoleId !== null && (
        <RolePermissionPanel
          roleId={selectedRoleId}
          onClose={closePermissionPanel}
        />
      )}
    </div>
  );
}