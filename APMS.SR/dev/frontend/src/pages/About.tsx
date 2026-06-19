import { useEffect, useState } from "react";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { useMe } from "../../queries/useMe";

type MeResponse = {
  id: number;
  username: string;
  roles: string[];
  permissions: string[];
};

export default function About() {
  const { data: me, isLoading, isError, error } = useMe<MeResponse>();
  const { hasPermission } = usePermissions(me);

  const canDebug = hasPermission("DEBUG_READ");


  if (isLoading) {
    return <div>로딩 중...</div>;
  }


  if (isError) {
    return (<div style={{ color: "red" }}>{error instanceof Error
          ? error.message : "에러 발생"} </div>); }



  return (
    <div style={{ padding: 20 }}>
      <h1>RBAC Debug Page</h1>

      <h2>👤 User Info</h2>
      <pre>{JSON.stringify(me, null, 2)}</pre>

      <h2>🔐 API /me Response</h2>
      <pre>{JSON.stringify(me, null, 2)}</pre>

      <h2>🧩 Roles</h2>
      <ul>
        {me?.roles?.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>

      <h2>🛡 Permissions</h2>
      <ul>
        {me?.permissions?.map((perm) => (
          <li key={perm}>{perm}</li>
        ))}
      </ul>

      {/* debug permission gated */}
      {canDebug && (
        <>
          <h2>🧪 Debug Section</h2>
          <pre>
            {JSON.stringify(
              {
                debug: true,
                timestamp: new Date().toISOString(),
              },
              null,
              2
            )}
          </pre>
        </>
       )}
    </div>
  );
}
