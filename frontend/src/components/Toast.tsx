type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 max-w-sm rounded-3xl border border-success-100 bg-white/95 px-4 py-3 text-sm font-medium text-success-700 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:text-emerald-300">
      {message}
    </div>
  );
}
