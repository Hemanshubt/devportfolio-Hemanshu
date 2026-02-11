import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

interface Confetti {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    size: number;
    vx: number;
    vy: number;
}

const CONFETTI_COLORS = ['#00d4ff', '#22c55e', '#8b5cf6', '#ff9900', '#ef4444', '#ffd43b', '#f472b6'];

const DEPLOY_LINES = [
    '$ git push origin main',
    '🔄 Triggering CI/CD pipeline...',
    '✅ Build passed',
    '✅ Tests passed (42/42)',
    '✅ Security scan clean',
    '✅ Docker image built',
    '✅ Pushed to registry',
    '🚀 Deploying to production...',
    '',
    '🎉 Production Deployed Successfully!',
    '🌍 https://hemanshudev.cloud/is live!',
];

export default function KonamiEasterEgg() {
    const [activated, setActivated] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);
    const [confetti, setConfetti] = useState<Confetti[]>([]);
    const codeIndex = useRef(0);
    const confettiId = useRef(0);

    // Listen for Konami Code
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const expected = KONAMI_CODE[codeIndex.current];
            if (e.key.toLowerCase() === expected.toLowerCase()) {
                codeIndex.current++;
                if (codeIndex.current === KONAMI_CODE.length) {
                    setActivated(true);
                    codeIndex.current = 0;
                }
            } else {
                codeIndex.current = 0;
                // Check if the pressed key is the start of the code
                if (e.key === KONAMI_CODE[0]) {
                    codeIndex.current = 1;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Animate deploy lines
    useEffect(() => {
        if (!activated) return;

        let lineIndex = 0;
        const interval = setInterval(() => {
            lineIndex++;
            setVisibleLines(lineIndex);
            if (lineIndex >= DEPLOY_LINES.length) {
                clearInterval(interval);
                // Start confetti after all lines
                generateConfetti();
            }
        }, 300);

        return () => clearInterval(interval);
    }, [activated]);

    const generateConfetti = useCallback(() => {
        const newConfetti: Confetti[] = [];
        for (let i = 0; i < 100; i++) {
            newConfetti.push({
                id: confettiId.current++,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                rotation: Math.random() * 360,
                size: Math.random() * 10 + 5,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
            });
        }
        setConfetti(newConfetti);

        // Auto-close after 6 seconds
        setTimeout(() => {
            setActivated(false);
            setVisibleLines(0);
            setConfetti([]);
        }, 6000);
    }, []);

    if (!activated) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
                onClick={() => {
                    setActivated(false);
                    setVisibleLines(0);
                    setConfetti([]);
                }}
            >
                {/* Confetti */}
                {confetti.map((c) => (
                    <motion.div
                        key={c.id}
                        initial={{ x: `${c.x}vw`, y: `${c.y}vh`, rotate: 0 }}
                        animate={{
                            x: `${c.x + c.vx * 20}vw`,
                            y: '110vh',
                            rotate: c.rotation + 720,
                        }}
                        transition={{ duration: 3 + Math.random() * 2, ease: 'linear' }}
                        className="pointer-events-none absolute"
                        style={{
                            width: c.size,
                            height: c.size,
                            backgroundColor: c.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        }}
                    />
                ))}

                {/* Terminal Window */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative mx-4 w-full max-w-lg overflow-hidden rounded-xl border border-white/20 bg-[#0a0e17] shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title bar */}
                    <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                        <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                        </div>
                        <span className="ml-2 font-mono text-xs text-white/50">deploy.sh — production</span>
                    </div>

                    {/* Deploy output */}
                    <div className="space-y-2 p-5 font-mono text-sm">
                        {DEPLOY_LINES.slice(0, visibleLines).map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`${line.includes('🎉') ? 'text-lg font-bold text-emerald-400' :
                                        line.includes('✅') ? 'text-emerald-400' :
                                            line.includes('🚀') ? 'text-cyan-400' :
                                                line.includes('🔄') ? 'text-yellow-400' :
                                                    line.includes('$') ? 'text-green-400' :
                                                        line.includes('🌍') ? 'text-purple-400' :
                                                            'text-white/70'
                                    }`}
                            >
                                {line || <br />}
                            </motion.div>
                        ))}
                        {visibleLines < DEPLOY_LINES.length && (
                            <span className="inline-flex animate-pulse text-primary">▋</span>
                        )}
                    </div>

                    {/* Celebration banner */}
                    {visibleLines >= DEPLOY_LINES.length && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
                        >
                            <span className="text-2xl">🚀🎉✨</span>
                            <p className="mt-1 font-mono text-xs text-emerald-400">
                                You found the easter egg! (click anywhere to close)
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
