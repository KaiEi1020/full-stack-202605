import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { GET_USER, GET_USERS } from '../graphql/queries';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type UsersQueryData = {
  users: User[];
};

type UserQueryData = {
  user: User | null;
};

type UserQueryVariables = {
  id: string;
};

export function GraphqlDemoPage() {
  const [userId, setUserId] = useState('1');
  const { data, loading, error } = useQuery<UsersQueryData>(GET_USERS);
  const [loadUser, userResult] = useLazyQuery<UserQueryData, UserQueryVariables>(GET_USER);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedId = userId.trim();
    if (!trimmedId) {
      return;
    }

    void loadUser({ variables: { id: trimmedId } });
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">GraphQL Demo</p>
        <h1>用户查询示例</h1>
        <p className="lead">这个页面通过 Apollo Client 调用后端 GraphQL 接口，并展示列表查询与按 id 查询结果。</p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>用户列表</h2>
          <span className="endpoint">query users</span>
        </div>

        {loading ? <p className="state-block">Loading users…</p> : null}
        {error ? <p className="state-block state-error">{error.message}</p> : null}
        {!loading && !error && data?.users.length === 0 ? <p className="state-block">No users found.</p> : null}

        {!loading && !error && data?.users.length ? (
          <ul className="user-list">
            {data.users.map((user) => (
              <li key={user.id} className="user-card">
                <h3>{user.name}</h3>
                <dl>
                  <div>
                    <dt>ID</dt>
                    <dd>{user.id}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{user.phone}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>按 ID 查询用户</h2>
          <span className="endpoint">query user(id)</span>
        </div>

        <form className="lookup-form" onSubmit={handleSubmit}>
          <label htmlFor="user-id">用户 ID</label>
          <div className="lookup-row">
            <input id="user-id" value={userId} onChange={(event) => setUserId(event.target.value)} />
            <button type="submit">查询</button>
          </div>
        </form>

        {userResult.called && userResult.loading ? <p className="state-block">Loading user…</p> : null}
        {userResult.error ? <p className="state-block state-error">{userResult.error.message}</p> : null}
        {userResult.called && !userResult.loading && !userResult.error && !userResult.data?.user ? (
          <p className="state-block">No user found for that id.</p>
        ) : null}

        {userResult.data?.user ? (
          <article className="detail-card">
            <h3>{userResult.data.user.name}</h3>
            <p>ID: {userResult.data.user.id}</p>
            <p>Email: {userResult.data.user.email}</p>
            <p>Phone: {userResult.data.user.phone}</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
