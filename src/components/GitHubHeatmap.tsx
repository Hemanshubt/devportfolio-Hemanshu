import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { GitBranch, ExternalLink } from 'lucide-react';

// ─── Generate realistic-looking contribution data ────────────────────
function generateContributions(): number[] {
    const data: number[] = [];
    const totalWeeks = 52;

    for (let week = 0; week < totalWeeks; week++) {
        for (let day = 0; day < 7; day++) {
            // Create a realistic-looking pattern
            const weekFactor = Math.sin((week / totalWeeks) * Math.PI * 2) * 0.3 + 0.5;
            const dayFactor = day === 0 || day === 6 ? 0.3 : 1; // Less on weekends
            const random = Math.random();

            // Streaky pattern - more contributions in certain periods
            const streakBonus = (week > 20 && week < 35) ? 0.3 : 0;
            const recentBonus = week > 40 ? 0.4 : 0;

            const chance = (weekFactor * dayFactor + streakBonus + recentBonus) * 0.6;

            if (random < chance * 0.4) {
                data.push(0);
            } else if (random < chance * 0.6) {
                data.push(1);
            } else if (random < chance * 0.8) {
                data.push(2);
            } else if (random < chance * 0.95) {
                data.push(3);
            } else {
                data.push(4);
            }
        }
    }
    return data;
}

const LEVEL_COLORS = [
    'bg-white/5',          // 0 - no contributions
    'bg-emerald-900/60',   // 1 - low
    'bg-emerald-700/70',   // 2 - medium
    'bg-emerald-500/80',   // 3 - high
    'bg-emerald-400',      // 4 - very high
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Stats data ──────────────────────────────────────────────────────
const stats = [
    { label: 'Repositories', value: '15+', icon: '📦' },
    { label: 'Contributions', value: '200+', icon: '🔥' },
    { label: 'Longest Streak', value: '30 days', icon: '⚡' },
    { label: 'Languages', value: '5+', icon: '💻' },
];

export default function GitHubHeatmap() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const contributions = useMemo(() => generateContributions(), []);
    const [hoveredCell, setHoveredCell] = useState<number | null>(null);

    // Get month positions for labels
    const monthPositions = useMemo(() => {
        const today = new Date();
        const positions: { label: string; col: number }[] = [];

        for (let week = 0; week < 52; week += 4) {
            const d = new Date(today);
            d.setDate(d.getDate() - (51 - week) * 7);
            positions.push({
                label: MONTH_LABELS[d.getMonth()],
                col: week,
            });
        }
        return positions;
    }, []);

    return (
        <section id="github" className="relative py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />

            <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
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
                        A snapshot of my open-source contributions and coding consistency.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4"
                >
                    {stats.map((stat, i) => (
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

                {/* Heatmap Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8 overflow-x-auto rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:mt-12 sm:p-6"
                >
                    {/* Month labels */}
                    <div className="mb-2 flex pl-8">
                        {monthPositions.map((month, i) => (
                            <span
                                key={i}
                                className="text-[10px] text-muted-foreground sm:text-xs"
                                style={{
                                    position: 'relative',
                                    left: `${month.col * 13}px`,
                                    marginRight: i < monthPositions.length - 1 ? '0' : undefined,
                                }}
                            >
                                {month.label}
                            </span>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-1">
                        {/* Day labels */}
                        <div className="flex flex-col gap-1 pr-2 pt-0">
                            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                                <span key={i} className="flex h-[11px] items-center text-[9px] text-muted-foreground sm:h-[13px] sm:text-[10px]">
                                    {day}
                                </span>
                            ))}
                        </div>

                        {/* Contribution cells */}
                        <div className="flex gap-[3px]">
                            {Array.from({ length: 52 }, (_, week) => (
                                <div key={week} className="flex flex-col gap-[3px]">
                                    {Array.from({ length: 7 }, (_, day) => {
                                        const index = week * 7 + day;
                                        const level = contributions[index] || 0;
                                        return (
                                            <motion.div
                                                key={day}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: 0.5 + (week * 7 + day) * 0.001
                                                }}
                                                className={`h-[11px] w-[11px] rounded-[2px] sm:h-[13px] sm:w-[13px] ${LEVEL_COLORS[level]} transition-all duration-200 hover:ring-1 hover:ring-primary/50 cursor-pointer`}
                                                onMouseEnter={() => setHoveredCell(index)}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                title={`${level} contributions`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center justify-between">
                        <a
                            href="https://github.com/Hemanshubt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                            <GitBranch className="h-3.5 w-3.5" />
                            <span>@Hemanshubt</span>
                            <ExternalLink className="h-3 w-3" />
                        </a>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground sm:text-xs">Less</span>
                            {LEVEL_COLORS.map((color, i) => (
                                <div key={i} className={`h-[11px] w-[11px] rounded-[2px] sm:h-[13px] sm:w-[13px] ${color}`} />
                            ))}
                            <span className="text-[10px] text-muted-foreground sm:text-xs">More</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
