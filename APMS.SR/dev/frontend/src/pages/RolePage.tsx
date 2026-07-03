import { useState } from "react";
import { useRoles } from "../queries/useRoles";
import { useRoleManagement } from "../mutations/useRoleManage";
import styles from "./Fmenu/menu.module.css";

export default function RolePage() {
  const { data: roles = [] } = useRoles();
  const { saveRole, removeRole } = useRoleManagement();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

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

  return (
    <div className={styles.page}>
      <div className={styles.header}>Role Management</div>

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
          >
            Create
          </button>
        ) : (
          <>
            <button
              className={styles.button}
              onClick={updateRole}
            >
              Save
            </button>

            <button
              className={styles.button}
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  description: "",
                });
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div className={styles.tableHeader}>
        <div>ID</div>
        <div>Name</div>
        <div>Description</div>
        <div>Actions</div>
      </div>

      {roles.map((role) => (
        <div
          key={role.id}
          className={styles.tableRow}
        >
          <div className={styles.cell}>{role.id}</div>

          <div className={styles.cell}>{role.name}</div>

          <div className={styles.cell}>{role.description}</div>

          <div className={styles.actionCell}>
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
              Edit
            </button>

            <button
              className={styles.actionBtn}
              onClick={() => removeRole.mutate(role.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
