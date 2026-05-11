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
  const radarRows = [
    ['综合', overallScore],
    ['技能', skillScore],
    ['经验', experienceScore],
    ['教育', educationScore],
  ] as const;
  const center = 84;
  const radius = 62;
  const levels = [0.25, 0.5, 0.75, 1];
  const points = radarRows.map(([, value], index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarRows.length;
    const scaled = (Math.max(0, Math.min(100, value)) / 100) * radius;
    return [center + Math.cos(angle) * scaled, center + Math.sin(angle) * scaled] as const;
  });
  const polygonPoints = points.map(([x, y]) => `${x},${y}`).join(' ');
  const axisPoints = radarRows.map(([, _value], index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarRows.length;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (radius + 18),
      labelY: center + Math.sin(angle) * (radius + 18),
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
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
      <svg viewBox="0 0 168 168" className="mx-auto h-48 w-48 overflow-visible">
        {levels.map((level) => {
          const levelPoints = axisPoints
            .map(({ x, y }) => {
              const scaledX = center + (x - center) * level;
              const scaledY = center + (y - center) * level;
              return `${scaledX},${scaledY}`;
            })
            .join(' ');
          return <polygon key={level} points={levelPoints} fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1" />;
        })}
        {axisPoints.map(({ x, y }, index) => (
          <line key={radarRows[index][0]} x1={center} y1={center} x2={x} y2={y} stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1" />
        ))}
        <polygon points={polygonPoints} fill="rgba(91, 95, 255, 0.2)" stroke="rgb(91, 95, 255)" strokeWidth="2" />
        {points.map(([x, y], index) => (
          <circle key={radarRows[index][0]} cx={x} cy={y} r="3.5" fill="rgb(91, 95, 255)" />
        ))}
        {axisPoints.map(({ labelX, labelY }, index) => (
          <text key={`${radarRows[index][0]}-label`} x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" className="fill-ink-700 text-[10px] font-medium dark:fill-slate-200">
            {radarRows[index][0]}
          </text>
        ))}
      </svg>
    </div>
  );
}
