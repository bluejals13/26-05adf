// pages/RolePage.tsx

import { useRoles } from "./queries/useRoles";
import { useRoleManagement } from "./mutations/useRoleManage";

export default function RolePage() {
  const { data: roles } = useRoles();
  const { saveRole, assignPermissions } = useRoleManagement();

  return (
    <div>
      <h1>Role Management</h1>

      {roles?.map((role: any) => (
        <div key={role.id}>
          <h3>{role.name}</h3>

          <button
            onClick={() =>
              saveRole.mutate({
                id: role.id,
                name: role.name,
                description: role.description,
              })
            }
          >
            Update
          </button>

          <button
            onClick={() =>
              assignPermissions.mutate({
                roleId: role.id,
                permissionIds: [1, 2, 3],
              })
            }
          >
            Assign Permissions
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          saveRole.mutate({
            name: "ADMIN",
            description: "관리자",
          })
        }
      >
        Create Role
      </button>
    </div>
  );
}

