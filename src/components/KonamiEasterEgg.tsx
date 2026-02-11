import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type "deploy" anywhere on the page to trigger!
const SECRET_WORD = 'deploy';

const CONFETTI_COLORS = ['#00d4ff', '#22c55e', '#8b5cf6', '#ff9900', '#ef4444', '#ffd43b', '#f472b6'];

const DEPLOY_LINES = [
    { text: '$ git push origin main', color: 'text-green-400' },
    { text: '🔄 Triggering CI/CD pipeline...', color: 'text-yellow-400' },
    { text: '✅ Build passed', color: 'text-emerald-400' },
    { text: '✅ Tests passed (42/42)', color: 'text-emerald-400' },
    { text: '✅ Security scan clean', color: 'text-emerald-400' },
    { text: '✅ Docker image built', color: 'text-emerald-400' },
    { text: '✅ Pushed to registry', color: 'text-emerald-400' },
    { text: '🚀 Deploying to production...', color: 'text-cyan-400' },
    { text: '', color: '' },
    { text: '🎉 Production Deployed Successfully!', color: 'text-lg font-bold text-emerald-400' },
    { text: '🌍 https://hemanshudev.cloud/ is live!', color: 'text-purple-400' },
];

// ─── Confetti particle type ──────────────────────────────────────────
interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    size: number;
    drift: number;
}

export default function KonamiEasterEgg() {
    const [activated, setActivated] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const sequencePos = useRef(0);
    const confettiCounter = useRef(0);

    // ─── Keyboard listener using e.code for reliability ──────────────
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // Skip if typing in form fields
            const el = e.target as HTMLElement;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) return;

            // Quick trigger: Ctrl+Shift+K
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyK') {
                e.preventDefault();
                setActivated(true);
                sequencePos.current = 0;
                return;
            }

            // Match typed letters against SECRET_WORD ("deploy")
            const expected = SECRET_WORD[sequencePos.current];
            const pressed = e.key.toLowerCase();

            // Only care about single letter keys
            if (pressed.length !== 1) return;

            if (pressed === expected) {
                sequencePos.current++;

                if (sequencePos.current >= SECRET_WORD.length) {
                    setActivated(true);
                    sequencePos.current = 0;
                }
            } else {
                sequencePos.current = 0;
                // Re-check if this letter starts the word
                if (pressed === SECRET_WORD[0]) {
                    sequencePos.current = 1;
                }
            }
        };

        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
    }, []);

    // ─── Animate deploy lines when activated ─────────────────────────
    useEffect(() => {
        if (!activated) return;

        setVisibleLines(0);
        setConfetti([]);

        let line = 0;
        const timer = setInterval(() => {
            line++;
            setVisibleLines(line);
            if (line >= DEPLOY_LINES.length) {
                clearInterval(timer);
                // Launch confetti
                const pieces: ConfettiPiece[] = [];
                for (let i = 0; i < 80; i++) {
                    pieces.push({
                        id: confettiCounter.current++,
                        x: Math.random() * 100,
                        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                        size: Math.random() * 8 + 4,
                        drift: (Math.random() - 0.5) * 40,
                    });
                }
                setConfetti(pieces);
            }
        }, 350);

        // Auto-dismiss after 8 seconds
        const dismiss = setTimeout(() => {
            setActivated(false);
            setVisibleLines(0);
            setConfetti([]);
        }, 8000);

        return () => {
            clearInterval(timer);
            clearTimeout(dismiss);
        };
    }, [activated]);

    const close = useCallback(() => {
        setActivated(false);
        setVisibleLines(0);
        setConfetti([]);
    }, []);

    return (
        <AnimatePresence>
            {activated && (
                <motion.div
                    key="konami-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md"
                    onClick={close}
                >
                    {/* Confetti pieces */}
                    {confetti.map((c) => (
                        <motion.div
                            key={c.id}
                            initial={{ y: '-10vh', x: `${c.x}vw`, opacity: 1 }}
                            animate={{ y: '110vh', x: `${c.x + c.drift}vw`, rotate: 720 }}
                            transition={{ duration: 3 + Math.random() * 2, ease: 'linear' }}
                            className="pointer-events-none absolute"
                            style={{
                                width: c.size,
                                height: c.size,
                                backgroundColor: c.color,
                                borderRadius: c.id % 2 === 0 ? '50%' : '2px',
                            }}
                        />
                    ))}

                    {/* Deploy terminal */}
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0, y: 60 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0, y: 60 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                        className="relative mx-4 w-full max-w-lg overflow-hidden rounded-xl border border-white/20 bg-[#0a0e17] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* macOS title bar */}
                        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                            <div className="flex gap-1.5">
                                <button onClick={close} className="h-3 w-3 rounded-full bg-[#ff5f57] transition hover:brightness-125" />
                                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                            </div>
                            <span className="ml-2 font-mono text-xs text-white/50">deploy.sh — production</span>
                        </div>

                        {/* Line-by-line deploy output */}
                        <div className="space-y-2 p-5 font-mono text-sm">
                            {DEPLOY_LINES.slice(0, visibleLines).map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={line.color}
                                >
                                    {line.text || <br />}
                                </motion.div>
                            ))}
                            {visibleLines < DEPLOY_LINES.length && (
                                <span className="inline-flex animate-pulse text-cyan-400">▋</span>
                            )}
                        </div>

                        {/* Celebration banner */}
                        <AnimatePresence>
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
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
