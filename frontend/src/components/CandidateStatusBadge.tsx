import { getCandidateStatusMeta } from './status';

type CandidateStatusBadgeProps = {
  status: string;
};

export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
  const meta = getCandidateStatusMeta(status);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${meta.tone}`}>
      {meta.pending ? <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" /> : null}
      {meta.label}
    </span>
  );
}
