import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { REGISTER_USER } from '../graphql/queries';

type RegisterUserData = {
  registerUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};

type RegisterUserVariables = {
  input: {
    name: string;
    phone: string;
  };
};

function inputClassName() {
  return 'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-accent-300 focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-white';
}

export function UserRegistrationPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [registerUser, result] = useMutation<RegisterUserData, RegisterUserVariables>(REGISTER_USER);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      return;
    }

    await registerUser({
      variables: {
        input: {
          name: trimmedName,
          phone: trimmedPhone,
        },
      },
    });
  };

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
      <section className="rounded-[2rem] border border-accent-100 bg-gradient-to-br from-white via-white to-violet-50 px-6 py-8 shadow-soft dark:border-white/10 dark:from-white/10 dark:via-slate-950/60 dark:to-violet-950/30">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">User Registration</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-950 dark:text-white">用户注册</h1>
        <p className="mt-3 text-base leading-7 text-ink-500 dark:text-slate-300">填写用户名和手机号，前端会调用 GraphQL mutation 完成注册，并由后端触发短信通知占位逻辑。</p>
      </section>

      <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">注册表单</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">调用 `registerUser` mutation 创建用户并展示返回结果。</p>
          </div>
          <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">mutation registerUser</span>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-ink-800 dark:text-slate-200">用户名</span>
            <input className={inputClassName()} id="register-name" value={name} onChange={(event) => setName(event.target.value)} />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-ink-800 dark:text-slate-200">手机号</span>
            <input className={inputClassName()} id="register-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>

          <div>
            <button type="submit" className="inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={result.loading}>
              {result.loading ? '提交中…' : '注册用户'}
            </button>
          </div>
        </form>

        {result.error ? <p className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{result.error.message}</p> : null}

        {result.data?.registerUser ? (
          <article className="mt-6 rounded-[1.75rem] border border-line bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
            <h3 className="text-lg font-semibold text-ink-950 dark:text-white">{result.data.registerUser.name}</h3>
            <div className="mt-4 grid gap-2 text-sm text-ink-600 dark:text-slate-300">
              <p>ID: {result.data.registerUser.id}</p>
              <p>Email: {result.data.registerUser.email}</p>
              <p>Phone: {result.data.registerUser.phone}</p>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
