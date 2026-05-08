type ScoreChartProps = {
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
};

export function ScoreChart({ overallScore, skillScore, experienceScore, educationScore }: ScoreChartProps) {
  const rows = [
    ['综合匹配度', overallScore],
    ['技能匹配度', skillScore],
    ['经验相关性', experienceScore],
    ['教育契合度', educationScore],
  ] as const;

  return (
    <div className="grid gap-4">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-2 sm:grid-cols-[7rem_1fr_3rem] sm:items-center">
          <span className="text-sm font-medium text-ink-700 dark:text-slate-200">{label}</span>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-accent-500 to-sky-400" style={{ width: `${value}%` }} />
          </div>
          <strong className="text-sm font-semibold text-ink-950 dark:text-white">{value}</strong>
        </div>
      ))}
    </div>
  );
}
