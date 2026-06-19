// pages/About.tsx		//로그인 계정의 롤 퍼미션 토큰 확인 용 페이지

import { useMe } from "../queries/useMe";
import { usePermissions } from "../auth/hooks/usePermissions";

import FullPageSpinner from "../../components/loading/FullPageSpinner";

import type { User } from "../auth/auth.types";


export default function About() {
  const { data: me, isLoading, isError, error } = useMe();
  const { hasPermission } = usePermissions(me);

  const canDebug = hasPermission("DEBUG_READ");


  if (isLoading) return <FullPageSpinner />;


  if (isError) {
    return (<div style={{ color: "red" }}>{error instanceof Error
          ? error.message : "에러 발생"} </div>); }

  return (
    <div style={{ padding: 20 }}>
      <h1>RBAC Debug Page</h1>

      <pre>{JSON.stringify(me, null, 2)}</pre>

      <h2>🧩 Roles</h2>
      <ul>
        {(me?.roles ?? []).map((role: string) => (
          <li key={role}>{role}</li>
        ))}
      </ul>

      <h2>🛡 Permissions</h2>
      <ul>
        {(me?.permissions ?? []).map((perm: string) => (
          <li key={perm}>{perm}</li>
        ))}
      </ul>


      <h2>🧪 Debug Section</h2>
      {canDebug && <div>DEBUG ENABLED</div>}
    </div>
  );
}
