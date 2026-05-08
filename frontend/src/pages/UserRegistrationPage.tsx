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
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">User Registration</p>
        <h1>用户注册</h1>
        <p className="lead">填写用户名和手机号，前端会调用 GraphQL mutation 完成注册，并由后端触发短信通知占位逻辑。</p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>注册表单</h2>
          <span className="endpoint">mutation registerUser</span>
        </div>

        <form className="lookup-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">用户名</label>
          <div className="lookup-row">
            <input id="register-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <label htmlFor="register-phone">手机号</label>
          <div className="lookup-row">
            <input id="register-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </div>

          <div className="lookup-row">
            <button type="submit" disabled={result.loading}>
              {result.loading ? '提交中…' : '注册用户'}
            </button>
          </div>
        </form>

        {result.error ? <p className="state-block state-error">{result.error.message}</p> : null}

        {result.data?.registerUser ? (
          <article className="detail-card">
            <h3>{result.data.registerUser.name}</h3>
            <p>ID: {result.data.registerUser.id}</p>
            <p>Email: {result.data.registerUser.email}</p>
            <p>Phone: {result.data.registerUser.phone}</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
