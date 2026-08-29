// pages/FRole/UserRolePage.tsx


import { useMemo, useState } from "react";

import { useUsers } from "../../queries/useUsers";
import UserRolePanel from "./UserRolePanel";

import FullPageSpinner from "../../components/loading/FullPageSpinner";

import styles from "./UserRolePage.module.css";

export default function UserRolePage() {
  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");

  const {
    data: users = [],
    isLoading,
    isError,
  } = useUsers();

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      user.username
        .toLowerCase()
        .includes(keyword)
    );
  }, [users, search]);

  const selectedUser = useMemo(
    () =>
      users.find(
        (user) => user.id === selectedUserId
      ),
    [users, selectedUserId]
  );

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          사용자를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>User Role Management</h1>

          <p>
            사용자에게 Role을 할당하고 관리합니다.
          </p>
        </div>

        <div className={styles.count}>
          {filteredUsers.length} Users
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="사용자 검색..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <div className={styles.grid}>
        {filteredUsers.map((user) => (
          <article
            key={user.id}
            className={styles.card}
          >
            <div className={styles.userInfo}>
              <span className={styles.userId}>
                #{user.id}
              </span>

              <strong>{user.username}</strong>

              <div className={styles.roles}>
                {user.roles?.length ? (
                  user.roles.map((roleName) => (
                    <span
                      key={roleName}
                      className={styles.role}
                    >
                      {roleName}
                    </span>
                  ))
                ) : (
                  <span className={styles.noRole}>
                    Role 없음
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className={styles.manageButton}
              onClick={() =>
                setSelectedUserId(user.id)
              }
            >
              Role 관리
            </button>
          </article>
        ))}
      </div>

      {selectedUser && (
        <UserRolePanel
          user={selectedUser}
          onClose={() =>
            setSelectedUserId(null)
          }
        />
      )}
    </div>
  );
}