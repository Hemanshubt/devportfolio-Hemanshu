import { Terminal, Github, Star, GitFork } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect } from 'react';

function CountUp({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Footer() {
  const [repoStats, setRepoStats] = useState({ stars: 0, forks: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const repoUrl = "https://github.com/Hemanshubt/devportfolio-Hemanshu";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchStats = async () => {
      // Don't sync if already syncing (though with setTimeout it shouldn't happen)
      setIsSyncing(true);

      try {
        // Add cache-breaker and abort controller for clean polling
        const cacheBuster = `?t=${Date.now()}`;
        const response = await fetch(`${repoUrl.replace('github.com', 'api.github.com/repos')}${cacheBuster}`);

        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();

        if (data && typeof data.stargazers_count === 'number') {
          setRepoStats({
            stars: data.stargazers_count,
            forks: data.forks_count
          });
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          console.log(`[GitHub API] Sync successful: ${data.stargazers_count} stars`);
        }
      } catch (err) {
        console.warn('[GitHub API] Polling:', err instanceof Error ? err.message : 'Error');
      } finally {
        // Visual indicator duration
        setTimeout(() => setIsSyncing(false), 1000);

        // Schedule next poll in 10 seconds
        timeoutId = setTimeout(fetchStats, 10000);
      }
    };

    fetchStats();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [repoUrl]);

  return (
    <footer className="border-t border-border bg-card/10 py-12 backdrop-blur-sm sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          {/* Logo Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 font-mono text-base font-bold text-primary sm:text-lg md:justify-start">
              <Terminal className="h-5 w-5" />
              <span>devops.engineer</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Built with React & DevOps Best Practices
            </p>
          </div>

          {/* GitHub Stats Section */}
          <div className="flex flex-col items-center gap-4">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3"
            >
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all duration-500 
                ${isSyncing ? 'border-primary bg-primary/20 scale-[1.02]' : 'border-primary/20 bg-primary/5'} 
                hover:border-primary/50 hover:bg-primary/10`}
              >
                <div className="relative">
                  <Github className={`h-4 w-4 text-primary transition-transform duration-500 ${isSyncing ? 'rotate-[360deg]' : ''}`} />
                  {isSyncing && (
                    <span className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-primary/50" />
                  )}
                </div>
                <span className="font-mono text-xs font-medium text-foreground">
                  hemanshu/devportfolio
                </span>
              </div>

              <div className="flex items-center justify-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Star className="h-3.5 w-3.5 text-yellow-500" />
                  <span className="font-bold text-foreground">
                    <CountUp value={repoStats.stars} />
                  </span>
                  <span>Stars</span>
                </motion.div>
                <div className="h-3 w-[1px] bg-border" />
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <GitFork className="h-3.5 w-3.5 text-primary" />
                  <span className="font-bold text-foreground">
                    <CountUp value={repoStats.forks} />
                  </span>
                  <span>Forks</span>
                </motion.div>
              </div>

              {lastUpdated && (
                <div className="font-mono text-[9px] text-muted-foreground/60 transition-opacity flex items-center justify-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-green-500/50" />
                  Last Synced: {lastUpdated}
                </div>
              )}
            </a>
          </div>

          {/* Status & Copyright Section */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1 text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                System Status: Operational
              </div>
            </div>

            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-secondary opacity-70">terminal@host:~$</span>
              <span className="ml-2 italic opacity-60">© {new Date().getFullYear()} Hemanshu Mahajan</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
