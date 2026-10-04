import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { GitBranch, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchUserContributions, ContributionCalendar } from '@/services/githubService';

/**
 * GitHubHeatmap — displays REAL contribution data from the GitHub GraphQL API.
 *
 * No fake/generated data. If the API is unavailable, an honest error state is shown.
 * Fake contribution generation (Math.random) has been intentionally removed.
 */

const GITHUB_USERNAME = 'Hemanshubt';

// Map GitHub's contribution color strings to Tailwind classes
function colorToClass(color: string): string {
  if (!color || color === '#ebedf0') return 'bg-white/5';
  if (color === '#9be9a8') return 'bg-emerald-900/60';
  if (color === '#40c463') return 'bg-emerald-700/70';
  if (color === '#30a14e') return 'bg-emerald-500/80';
  if (color === '#216e39') return 'bg-emerald-400';
  // Fallback: treat any non-zero color as a mid-level contribution
  return 'bg-emerald-700/70';
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/30 p-10 text-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="font-semibold text-foreground">Could not load contribution data</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The GitHub API may be temporarily unavailable. Real data will appear once the connection is restored.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function HeatmapSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex gap-[3px]">
        {Array.from({ length: 52 }, (_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, d) => (
              <div
                key={d}
                className="h-[11px] w-[11px] animate-pulse rounded-[2px] bg-white/5 sm:h-[13px] sm:w-[13px]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GitHubHeatmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [data, setData] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchUserContributions(GITHUB_USERNAME);
      if (result) {
        setData(result);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInView) loadData();
  }, [isInView]);

  // Flatten weeks → cells for the grid
  const cells = useMemo(() => {
    if (!data) return [];
    return data.weeks.flatMap(week => week.contributionDays);
  }, [data]);

  // Month label positions
  const monthPositions = useMemo(() => {
    if (!data || data.weeks.length === 0) return [];
    const positions: { label: string; col: number }[] = [];
    data.weeks.forEach((week, wi) => {
      const firstDay = week.contributionDays[0];
      if (!firstDay) return;
      const month = new Date(firstDay.date).getMonth();
      // Show label at start of each month (when week index is the first of that month)
      if (wi === 0 || new Date(data.weeks[wi - 1].contributionDays[0]?.date ?? '').getMonth() !== month) {
        positions.push({ label: MONTH_LABELS[month], col: wi });
      }
    });
    return positions;
  }, [data]);

  // Derived stats — computed from real data only
  const stats = useMemo(() => {
    if (!data) return null;
    const total = data.totalContributions;
    let activeDays = 0;
    let maxDaily = 0;

    cells.forEach(day => {
      if (day.contributionCount > 0) {
        activeDays++;
        if (day.contributionCount > maxDaily) maxDaily = day.contributionCount;
      }
    });

    return { total, activeDays, maxDaily };
  }, [data, cells]);

  return (
    <section id="github" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">GitHub</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text">Coding Activity</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Real contribution data pulled live from the GitHub GraphQL API.
          </p>
        </motion.div>

        {/* Stats Cards — only shown when real data is available */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid grid-cols-3 gap-3 sm:mt-12 sm:gap-4"
          >
            {[
              { label: 'Contributions', value: stats.total.toLocaleString(), icon: '🔥' },
              { label: 'Active Days', value: stats.activeDays.toLocaleString(), icon: '📅' },
              { label: 'Best Day', value: stats.maxDaily.toString(), icon: '⚡' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm transition-colors hover:border-primary/30"
              >
                <span className="text-2xl">{stat.icon}</span>
                <div className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12"
        >
          {loading && <HeatmapSkeleton />}
          {!loading && error && <ErrorState onRetry={loadData} />}
          {!loading && !error && data && (
            <div className="overflow-x-auto rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:p-6">
              {/* Month labels */}
              <div className="relative mb-2 h-4 pl-8">
                {monthPositions.map((m) => (
                  <span
                    key={m.label + m.col}
                    className="absolute text-[10px] text-muted-foreground sm:text-xs"
                    style={{ left: `${32 + m.col * 14}px` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 pr-2">
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                    <span
                      key={i}
                      className="flex h-[11px] items-center text-[9px] text-muted-foreground sm:h-[13px] sm:text-[10px]"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Contribution cells */}
                <div className="flex gap-[3px]">
                  {data.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.contributionDays.map((day) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.15, delay: 0.5 + wi * 0.005 }}
                          className={`h-[11px] w-[11px] cursor-pointer rounded-[2px] transition-all duration-200 hover:ring-1 hover:ring-primary/50 sm:h-[13px] sm:w-[13px] ${colorToClass(day.color)}`}
                          onMouseEnter={() => setHoveredCell({ date: day.date, count: day.contributionCount })}
                          onMouseLeave={() => setHoveredCell(null)}
                          title={`${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${day.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tooltip */}
              {hoveredCell && (
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{hoveredCell.count}</span>
                  {' '}contribution{hoveredCell.count !== 1 ? 's' : ''} on {hoveredCell.date}
                </div>
              )}

              {/* Legend + link */}
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>@{GITHUB_USERNAME}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground sm:text-xs">Less</span>
                  {['bg-white/5', 'bg-emerald-900/60', 'bg-emerald-700/70', 'bg-emerald-500/80', 'bg-emerald-400'].map((c, i) => (
                    <div key={i} className={`h-[11px] w-[11px] rounded-[2px] sm:h-[13px] sm:w-[13px] ${c}`} />
                  ))}
                  <span className="text-[10px] text-muted-foreground sm:text-xs">More</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
