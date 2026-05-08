import { useEffect, useState } from 'react';
import { GraphqlDemoPage } from './pages/GraphqlDemoPage';
import { UserRegistrationPage } from './pages/UserRegistrationPage';
import './App.css';

type Pathname = '/' | '/graphql-demo' | '/register' | 'not-found';

function getPathname(pathname: string): Pathname {
  if (pathname === '/') {
    return '/';
  }

  if (pathname === '/graphql-demo') {
    return '/graphql-demo';
  }

  if (pathname === '/register') {
    return '/register';
  }

  return 'not-found';
}

function navigate(pathname: '/' | '/graphql-demo' | '/register') {
  window.history.pushState({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function App() {
  const [pathname, setPathname] = useState<Pathname>(() => getPathname(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getPathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Full Stack Demo</p>
          <h1>GraphQL + User Module</h1>
        </div>
        <nav className="nav-links" aria-label="Primary">
          <button type="button" className={pathname === '/' ? 'nav-link is-active' : 'nav-link'} onClick={() => navigate('/')}>
            首页
          </button>
          <button
            type="button"
            className={pathname === '/graphql-demo' ? 'nav-link is-active' : 'nav-link'}
            onClick={() => navigate('/graphql-demo')}
          >
            GraphQL Demo
          </button>
          <button
            type="button"
            className={pathname === '/register' ? 'nav-link is-active' : 'nav-link'}
            onClick={() => navigate('/register')}
          >
            用户注册
          </button>
        </nav>
      </header>

      {pathname === '/' ? (
        <main className="page-shell">
          <section className="panel hero-panel">
            <p className="eyebrow">Overview</p>
            <h2>前后端联调示例</h2>
            <p className="lead">后端提供 GraphQL 用户查询与注册接口，前端通过 Apollo Client 发起请求并展示结果。</p>
            <div className="hero-actions">
              <button type="button" className="primary-action" onClick={() => navigate('/graphql-demo')}>
                打开 GraphQL Demo
              </button>
              <button type="button" className="primary-action secondary-action" onClick={() => navigate('/register')}>
                打开注册页面
              </button>
            </div>
          </section>
        </main>
      ) : null}

      {pathname === '/graphql-demo' ? <GraphqlDemoPage /> : null}
      {pathname === '/register' ? <UserRegistrationPage /> : null}

      {pathname === 'not-found' ? (
        <main className="page-shell">
          <section className="panel">
            <p className="eyebrow">404</p>
            <h2>页面不存在</h2>
            <p className="lead">这个路径没有对应页面，请返回首页继续查看示例。</p>
            <button type="button" className="primary-action" onClick={() => navigate('/')}>
              返回首页
            </button>
          </section>
        </main>
      ) : null}
    </div>
  );
}

export default App;
