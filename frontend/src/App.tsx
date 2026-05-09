import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { CandidateListPage } from './pages/CandidateListPage';
import { GraphqlDemoPage } from './pages/GraphqlDemoPage';
import { ResumeScorePage } from './pages/ResumeScorePage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { UserRegistrationPage } from './pages/UserRegistrationPage';

type Pathname = '/' | '/upload' | '/candidates' | '/candidate' | '/resume-score' | '/graphql-demo' | '/register' | 'not-found';

type NavItem = {
  href: '/' | '/upload' | '/candidates' | '/resume-score' | '/graphql-demo' | '/register';
  label: string;
};

const navItems: NavItem[] = [
  { href: '/', label: '首页' },
  { href: '/upload', label: '上传筛选' },
  { href: '/candidates', label: '简历管理' },
  { href: '/resume-score', label: '评分图表' },
  { href: '/graphql-demo', label: 'REST 示例' },
  { href: '/register', label: '注册页' },
];

function getPathname(pathname: string): Pathname {
  if (pathname === '/') return '/';
  if (pathname === '/upload') return '/upload';
  if (pathname === '/candidates') return '/candidates';
  if (pathname === '/candidate') return '/candidate';
  if (pathname === '/resume-score') return '/resume-score';
  if (pathname === '/graphql-demo') return '/graphql-demo';
  if (pathname === '/register') return '/register';
  return 'not-found';
}

export function navigate(pathname: '/' | '/upload' | '/candidates' | '/candidate' | '/resume-score' | '/graphql-demo' | '/register', search = '') {
  window.history.pushState({}, '', `${pathname}${search}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function navButtonClass(active: boolean) {
  return [
    'inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition',
    active
      ? 'border-accent-300 bg-accent-100 text-accent-500 shadow-sm'
      : 'border-line bg-white/65 text-ink-700 hover:border-accent-300 hover:text-accent-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-accent-300 dark:hover:text-accent-300',
  ].join(' ');
}

function sectionClass() {
  return 'rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5';
}

function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-accent-100 bg-gradient-to-br from-white via-white to-violet-50 px-6 py-8 shadow-soft sm:px-8 lg:px-10 lg:py-10 dark:border-white/10 dark:from-white/10 dark:via-slate-950/60 dark:to-violet-950/30">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-accent-200 bg-accent-100/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">
              Recruitment Workspace
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl dark:text-white">
                AI 简历筛选工作台
              </h1>
              <p className="max-w-3xl text-base leading-7 text-ink-500 sm:text-lg dark:text-slate-300">
                上传 PDF 简历、追踪流式解析进度、查看候选人画像与岗位评分，并在统一工作台内完成筛选协作。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500" onClick={() => navigate('/upload')}>
                开始上传
              </button>
              <button type="button" className="inline-flex items-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:border-accent-300 hover:text-accent-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100" onClick={() => navigate('/candidates')}>
                查看候选人
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ['Resume Parsing', 'PDF 结构化提取与文本清洗'],
              ['Live Pipeline', 'SSE 推送处理阶段与失败反馈'],
              ['Scoring Studio', '岗位技能评分与状态流转'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/60 bg-white/75 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-ink-950 dark:text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className={`${sectionClass()} w-full text-center`}>
        <div className="mx-auto max-w-xl space-y-4 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-500">404</p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">页面不存在</h2>
          <p className="text-base text-ink-500 dark:text-slate-300">这个地址没有对应内容，请返回工作台首页继续浏览。</p>
          <button type="button" className="inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500" onClick={() => navigate('/')}>
            返回首页
          </button>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [pathname, setPathname] = useState<Pathname>(() => getPathname(window.location.pathname));
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(() => new URLSearchParams(window.location.search).get('id'));
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getPathname(window.location.pathname));
      setSelectedCandidateId(new URLSearchParams(window.location.search).get('id'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen">
      <Disclosure as="header" className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65">
        {({ open }) => (
          <>
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Recruitment Workspace</p>
                <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink-950 dark:text-white">AI 简历筛选平台</h1>
                <p className="mt-1 hidden text-sm text-ink-500 md:block dark:text-slate-300">上传、筛选、管理候选人的统一前端工作台。</p>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <nav className="flex flex-wrap items-center gap-2" aria-label="Primary">
                  {navItems.map((item) => (
                    <button key={item.href} type="button" className={navButtonClass(pathname === item.href)} onClick={() => navigate(item.href)}>
                      {item.label}
                    </button>
                  ))}
                </nav>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-700 transition hover:border-accent-300 hover:text-accent-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  aria-label={theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
                >
                  {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  aria-label={theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
                >
                  {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                </button>
                <DisclosureButton className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
                </DisclosureButton>
              </div>
            </div>

            <DisclosurePanel className="border-t border-white/60 px-4 py-4 sm:px-6 lg:hidden dark:border-white/10">
              <nav className="grid gap-2" aria-label="Mobile Primary">
                {navItems.map((item) => (
                  <button key={item.href} type="button" className={navButtonClass(pathname === item.href)} onClick={() => navigate(item.href)}>
                    {item.label}
                  </button>
                ))}
              </nav>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {pathname === '/' ? <HomePage /> : null}
      {pathname === '/upload' ? <ResumeUploadPage /> : null}
      {pathname === '/candidates' ? (
        <CandidateListPage
          onOpenDetail={(candidateId) => {
            setSelectedCandidateId(candidateId);
            navigate('/candidate', `?id=${candidateId}`);
          }}
        />
      ) : null}
      {pathname === '/candidate' && selectedCandidateId ? <CandidateDetailPage candidateId={selectedCandidateId} /> : null}
      {pathname === '/resume-score' && selectedCandidateId ? <ResumeScorePage resumeId={selectedCandidateId} /> : null}
      {pathname === '/graphql-demo' ? <GraphqlDemoPage /> : null}
      {pathname === '/register' ? <UserRegistrationPage /> : null}
      {pathname === 'not-found' ? <NotFoundPage /> : null}
    </div>
  );
}

export default App;
