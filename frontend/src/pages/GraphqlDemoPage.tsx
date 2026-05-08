import { useLazyQuery, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
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

function inputClassName() {
  return 'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-accent-300 focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-white';
}

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
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-accent-100 bg-gradient-to-br from-white via-white to-violet-50 px-6 py-8 shadow-soft dark:border-white/10 dark:from-white/10 dark:via-slate-950/60 dark:to-violet-950/30">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">GraphQL Demo</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-950 dark:text-white">用户查询示例</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink-500 dark:text-slate-300">通过 Apollo Client 调用后端 GraphQL 接口，演示列表查询与按 ID 查询结果，并使用统一的状态反馈样式。</p>
      </section>

      <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">用户列表</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">查询 `users`，展示当前系统中的用户数据。</p>
          </div>
          <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">query users</span>
        </div>

        {loading ? <p className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">Loading users…</p> : null}
        {error ? <p className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{error.message}</p> : null}
        {!loading && !error && data?.users.length === 0 ? <p className="mt-6 rounded-3xl border border-dashed border-line-strong px-4 py-5 text-sm text-ink-500 dark:border-white/10 dark:text-slate-300">No users found.</p> : null}

        {!loading && !error && data?.users.length ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.users.map((user) => (
              <li key={user.id} className="rounded-[1.75rem] border border-line bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-lg font-semibold text-ink-950 dark:text-white">{user.name}</h3>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-ink-400 dark:text-slate-400">ID</dt>
                    <dd className="mt-1 font-medium text-ink-900 dark:text-white">{user.id}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-400 dark:text-slate-400">Email</dt>
                    <dd className="mt-1 text-ink-600 dark:text-slate-300">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-400 dark:text-slate-400">Phone</dt>
                    <dd className="mt-1 text-ink-600 dark:text-slate-300">{user.phone}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">按 ID 查询用户</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">手动触发 `user(id)` 查询，验证按条件检索和状态反馈。</p>
          </div>
          <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">query user(id)</span>
        </div>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input className={inputClassName()} id="user-id" value={userId} onChange={(event) => setUserId(event.target.value)} />
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500">
            查询
          </button>
        </form>

        {userResult.called && userResult.loading ? <p className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">Loading user…</p> : null}
        {userResult.error ? <p className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{userResult.error.message}</p> : null}
        {userResult.called && !userResult.loading && !userResult.error && !userResult.data?.user ? <p className="mt-6 rounded-3xl border border-dashed border-line-strong px-4 py-5 text-sm text-ink-500 dark:border-white/10 dark:text-slate-300">No user found for that id.</p> : null}

        {userResult.data?.user ? (
          <article className="mt-6 rounded-[1.75rem] border border-line bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
            <h3 className="text-lg font-semibold text-ink-950 dark:text-white">{userResult.data.user.name}</h3>
            <div className="mt-4 grid gap-2 text-sm text-ink-600 dark:text-slate-300">
              <p>ID: {userResult.data.user.id}</p>
              <p>Email: {userResult.data.user.email}</p>
              <p>Phone: {userResult.data.user.phone}</p>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
