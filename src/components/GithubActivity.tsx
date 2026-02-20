import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { githubService, ContributionCalendar } from '../services/githubService';
import './GithubActivity.css';

/**
 * GithubActivity Component
 * A modern GitHub contribution dashboard powered by the GraphQL API.
 * Features a fallback to image-based widget if API access is unavailable.
 */
const GithubActivity = () => {
    const GITHUB_USERNAME = "Hemanshubt";
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Instruct user to add this to .env
    const years = [2026, 2025, 2024, 2023];

    const [selectedYear, setSelectedYear] = useState<number | 'All'>(years[0]);
    const [contributionData, setContributionData] = useState<ContributionCalendar | null>(null);
    const [allTimeData, setAllTimeData] = useState<{ [key: number]: ContributionCalendar } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!!GITHUB_TOKEN);
    const [error, setError] = useState<string | null>(null);

    // Fetch data via GraphQL
    const loadContributions = useCallback(async () => {
        if (!GITHUB_TOKEN) {
            setError("No GitHub Token found. Falling back to image widget.");
            return;
        }

        setIsLoading(true);
        setError(null);

        if (selectedYear === 'All') {
            try {
                const results = await Promise.all(
                    years.map(year => githubService.fetchUserContributions(GITHUB_USERNAME, GITHUB_TOKEN, year))
                );
                const dataMap: { [key: number]: ContributionCalendar } = {};
                results.forEach((res, i) => {
                    if (res) dataMap[years[i]] = res;
                });
                setAllTimeData(dataMap);
            } catch (err) {
                setError("Failed to fetch all-time data.");
            }
        } else {
            const data = await githubService.fetchUserContributions(GITHUB_USERNAME, GITHUB_TOKEN, selectedYear);
            if (data) {
                setContributionData(data);
            } else {
                setError("Failed to fetch GraphQL data. Using image fallback.");
            }
        }
        setIsLoading(false);
    }, [GITHUB_USERNAME, GITHUB_TOKEN, selectedYear]);

    useEffect(() => {
        loadContributions();
    }, [loadContributions]);

    // Derived statistics
    const stats = useMemo(() => {
        if (selectedYear === 'All') {
            if (!allTimeData) return null;
            let total = 0;
            let activeDays = 0;
            let maxDaily = 0;

            Object.values(allTimeData).forEach(yearData => {
                total += yearData.totalContributions;
                yearData.weeks.forEach(week => {
                    week.contributionDays.forEach(day => {
                        if (day.contributionCount > 0) {
                            activeDays++;
                            if (day.contributionCount > maxDaily) maxDaily = day.contributionCount;
                        }
                    });
                });
            });

            return {
                total,
                activeDays,
                maxDaily,
                avgPerDay: (total / (years.length * 365)).toFixed(2)
            };
        }

        if (!contributionData) return null;

        const total = contributionData.totalContributions;
        let activeDays = 0;
        let maxDaily = 0;

        contributionData.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                if (day.contributionCount > 0) {
                    activeDays++;
                    if (day.contributionCount > maxDaily) maxDaily = day.contributionCount;
                }
            });
        });

        return {
            total,
            activeDays,
            maxDaily,
            avgPerDay: (total / 365).toFixed(2)
        };
    }, [contributionData, allTimeData, selectedYear, years.length]);

    // Month labels calculation
    const monthLabels = useMemo(() => {
        if (!contributionData) return [];
        const labels: { month: string; index: number }[] = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        contributionData.weeks.forEach((week, index) => {
            const date = new Date(week.contributionDays[0].date);
            const month = monthNames[date.getMonth()];

            if (index === 0 || new Date(contributionData.weeks[index - 1].contributionDays[0].date).getMonth() !== date.getMonth()) {
                labels.push({ month, index });
            }
        });

        return labels;
    }, [contributionData]);

    // GitHub's official contribution theme for legend
    const githubTheme = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

    return (
        <section className="gh-dashboard-section" id="github-activity">
            <div className="gh-dashboard-container">
                <header className="gh-dashboard-header">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="gh-dashboard-title">Contribution Dashboard</h2>
                        <p className="gh-dashboard-subtitle">Real-time GitHub activity insights</p>
                    </motion.div>

                    <div className="gh-year-pills">
                        <button
                            className={`year-pill ${selectedYear === 'All' ? 'active' : ''}`}
                            onClick={() => setSelectedYear('All')}
                        >
                            All Time
                        </button>
                        {years.map(year => (
                            <button
                                key={year}
                                className={`year-pill ${selectedYear === year ? 'active' : ''}`}
                                onClick={() => setSelectedYear(year)}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="gh-dashboard-grid">
                    {/* Stats Cards */}
                    <AnimatePresence mode="wait">
                        {stats && (
                            <motion.div
                                className="gh-stats-row"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                key={`stats-${selectedYear}`}
                            >
                                <div className="gh-stat-card">
                                    <span className="stat-label">Total Contributions</span>
                                    <span className="stat-value">{stats.total}</span>
                                </div>
                                <div className="gh-stat-card">
                                    <span className="stat-label">Active Days</span>
                                    <span className="stat-value">{stats.activeDays}</span>
                                </div>
                                <div className="gh-stat-card">
                                    <span className="stat-label">Daily Average</span>
                                    <span className="stat-value">{stats.avgPerDay}</span>
                                </div>
                                <div className="gh-stat-card">
                                    <span className="stat-label">Max in a Day</span>
                                    <span className="stat-value">{stats.maxDaily}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Chart Area - Only show if not 'All' or if Loading */}
                    {(isLoading || selectedYear !== 'All') && (
                        <div className="gh-main-card">
                            {isLoading ? (
                                <div className="gh-loading">
                                    <div className="loading-spinner"></div>
                                    <span>Querying GitHub GraphQL API...</span>
                                </div>
                            ) : (
                                <div className="gh-graph-view">
                                    {error && !contributionData ? (
                                        /* Image Fallback if specified year fetch fails */
                                        <div className="gh-fallback-view">
                                            <div className="fallback-header">
                                                <span className="badge">Image Fallback</span>
                                                <p className="text-xs opacity-60 mt-1">{error}</p>
                                            </div>
                                            <div className="gh-heatmap-wrapper">
                                                <img
                                                    src={`https://ghchart.rshah.org/00b0ff/${GITHUB_USERNAME}?year=${selectedYear}`}
                                                    alt="GitHub Contributions Fallback"
                                                    className="gh-heatmap-img"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="gh-heatmap-wrapper">
                                                <div className="gh-months-row" style={{ display: 'grid', gridTemplateColumns: `repeat(${contributionData?.weeks.length || 0}, 11px)` }}>
                                                    {monthLabels.map((label, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="gh-month-label"
                                                            style={{ gridColumnStart: label.index + 1 }}
                                                        >
                                                            {label.month}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="gh-graph-grid">
                                                    {contributionData?.weeks.map((week, wIndex) => (
                                                        <div key={wIndex} className="gh-graph-week">
                                                            {week.contributionDays.map((day, dIndex) => (
                                                                <div
                                                                    key={`${wIndex}-${dIndex}`}
                                                                    className="gh-graph-day"
                                                                    style={{ backgroundColor: day.color }}
                                                                    title={`${day.contributionCount} contributions on ${day.date}`}
                                                                    onClick={() => window.open(`https://github.com/${GITHUB_USERNAME}?tab=overview&from=${day.date}&to=${day.date}`, '_blank')}
                                                                />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="gh-calendar-footer">
                                                <span className="github-note">Data from GitHub GraphQL v4</span>
                                                <div className="github-legend-container">
                                                    <span>Less</span>
                                                    <div className="github-legend">
                                                        {githubTheme.map((color, i) => (
                                                            <div key={i} className="legend-box" style={{ backgroundColor: color }} />
                                                        ))}
                                                    </div>
                                                    <span>More</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!GITHUB_TOKEN && (
                    <div className="gh-token-notice">
                        <p><strong>Pro-tip:</strong> To enable real-time dashboard analytics, add <code>VITE_GITHUB_TOKEN</code> to your <code>.env</code> file.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GithubActivity;
