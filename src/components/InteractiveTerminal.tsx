import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minus, Maximize2 } from 'lucide-react';

// ─── ASCII art for neofetch ──────────────────────────────────────────
const NEOFETCH_ART = `
  ██╗  ██╗███╗   ███╗
  ██║  ██║████╗ ████║
  ███████║██╔████╔██║
  ██╔══██║██║╚██╔╝██║
  ██║  ██║██║ ╚═╝ ██║
  ╚═╝  ╚═╝╚═╝     ╚═╝`;

const NEOFETCH_INFO = [
    { label: 'Name', value: 'Hemanshu Mahajan' },
    { label: 'Role', value: 'DevOps & Cloud Enthusiast' },
    { label: 'Education', value: 'Integrated MCA (8.7 CGPA)' },
    { label: 'Stack', value: 'AWS · Docker · K8s · Terraform' },
    { label: 'CI/CD', value: 'Jenkins · GitLab CI · GitHub Actions' },
    { label: 'IaC', value: 'Terraform · Ansible' },
    { label: 'Monitor', value: 'Prometheus · Grafana' },
    { label: 'Shell', value: 'Bash · PowerShell' },
    { label: 'Status', value: '🟢 Open to Opportunities' },
];

// ─── Command definitions ─────────────────────────────────────────────
interface OutputLine {
    type: 'command' | 'output' | 'error' | 'ascii' | 'info' | 'blank';
    text: string;
    color?: string;
}

const HELP_OUTPUT: OutputLine[] = [
    { type: 'output', text: '╔══════════════════════════════════════════════╗' },
    { type: 'output', text: '║     🖥️  Available Commands                   ║' },
    { type: 'output', text: '╠══════════════════════════════════════════════╣' },
    { type: 'info', text: '  help        — Show this help menu' },
    { type: 'info', text: '  about       — Navigate to About section' },
    { type: 'info', text: '  skills      — Navigate to Skills section' },
    { type: 'info', text: '  projects    — Navigate to Projects section' },
    { type: 'info', text: '  blog        — Navigate to Blog section' },
    { type: 'info', text: '  contact     — Navigate to Contact section' },
    { type: 'info', text: '  whoami      — Display user info' },
    { type: 'info', text: '  neofetch    — System information display' },
    { type: 'info', text: '  uptime      — Time spent on this site' },
    { type: 'info', text: '  clear       — Clear terminal output' },
    { type: 'info', text: '  date        — Show current date & time' },
    { type: 'info', text: '  sudo hire   — 😉' },
    { type: 'output', text: '╚══════════════════════════════════════════════╝' },
];

// ─── Component ───────────────────────────────────────────────────────
export default function InteractiveTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OutputLine[]>([
        { type: 'output', text: '🖥️  Welcome to Hemanshu\'s Terminal v1.0.0' },
        { type: 'output', text: 'Type "help" for available commands.' },
        { type: 'blank', text: '' },
    ]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef(Date.now());

    // Auto-scroll to bottom on new output
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input when terminal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard shortcut to toggle terminal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return true;
        }
        return false;
    }, []);

    const getUptime = useCallback(() => {
        const diff = Date.now() - startTimeRef.current;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }, []);

    const executeCommand = useCallback((cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        const lines: OutputLine[] = [
            { type: 'command', text: `$ ${cmd}` },
        ];

        switch (trimmed) {
            case 'help':
                lines.push(...HELP_OUTPUT);
                break;

            case 'about':
            case 'skills':
            case 'projects':
            case 'blog':
            case 'contact':
            case 'certifications':
            case 'education':
                if (scrollToSection(trimmed)) {
                    lines.push({ type: 'output', text: `📍 Navigating to ${trimmed}...`, color: '#22c55e' });
                } else {
                    lines.push({ type: 'error', text: `Section "${trimmed}" not found.` });
                }
                break;

            case 'whoami':
                lines.push(
                    { type: 'output', text: '👤 Hemanshu Mahajan', color: '#00d4ff' },
                    { type: 'info', text: '   Role: DevOps & Cloud Enthusiast' },
                    { type: 'info', text: '   Location: India' },
                    { type: 'info', text: '   Focus: CI/CD · Cloud · IaC · Containers' },
                    { type: 'info', text: '   Status: 🟢 Open to opportunities' },
                );
                break;

            case 'neofetch': {
                const artLines = NEOFETCH_ART.split('\n');
                artLines.forEach((line, i) => {
                    const infoLine = NEOFETCH_INFO[i - 1];
                    const rightSide = infoLine ? `  ${infoLine.label}: ${infoLine.value}` : '';
                    lines.push({ type: 'ascii', text: line.padEnd(28) + rightSide });
                });
                break;
            }

            case 'uptime':
                lines.push({ type: 'output', text: `⏱️  Session uptime: ${getUptime()}`, color: '#22c55e' });
                break;

            case 'date':
                lines.push({ type: 'output', text: `📅 ${new Date().toLocaleString()}`, color: '#00d4ff' });
                break;

            case 'clear':
                setHistory([]);
                return;

            case 'sudo hire':
            case 'sudo hire hemanshu':
                lines.push(
                    { type: 'output', text: '🚀 Initiating recruitment protocol...', color: '#22c55e' },
                    { type: 'output', text: '✅ Candidate: Hemanshu Mahajan', color: '#00d4ff' },
                    { type: 'output', text: '✅ Skills: Verified ✓', color: '#22c55e' },
                    { type: 'output', text: '✅ Enthusiasm Level: Maximum 🔥', color: '#ff9900' },
                    { type: 'output', text: '📧 Contact: Scroll to #contact or email directly!', color: '#8b5cf6' },
                );
                scrollToSection('contact');
                break;

            case 'ls':
                lines.push(
                    { type: 'output', text: 'about/   skills/   projects/   blog/' },
                    { type: 'output', text: 'certifications/   education/   contact/' },
                );
                break;

            case 'pwd':
                lines.push({ type: 'output', text: '/home/hemanshu/portfolio' });
                break;

            case 'echo hello':
            case 'echo "hello"':
                lines.push({ type: 'output', text: 'hello 👋' });
                break;

            case '':
                return;

            default:
                if (trimmed.startsWith('echo ')) {
                    lines.push({ type: 'output', text: trimmed.slice(5) });
                } else if (trimmed.startsWith('cd ')) {
                    const section = trimmed.slice(3).replace('/', '');
                    if (scrollToSection(section)) {
                        lines.push({ type: 'output', text: `📍 Navigating to ${section}...`, color: '#22c55e' });
                    } else {
                        lines.push({ type: 'error', text: `bash: cd: ${section}: No such directory` });
                    }
                } else {
                    lines.push({ type: 'error', text: `bash: ${trimmed}: command not found. Type "help" for available commands.` });
                }
        }

        lines.push({ type: 'blank', text: '' });
        setHistory(prev => [...prev, ...lines]);
    }, [scrollToSection, getUptime]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setCommandHistory(prev => [input, ...prev]);
            setHistoryIndex(-1);
        }
        executeCommand(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    const getLineColor = (line: OutputLine) => {
        if (line.color) return line.color;
        switch (line.type) {
            case 'command': return '#22c55e';
            case 'error': return '#ef4444';
            case 'ascii': return '#00d4ff';
            case 'info': return '#a1a1aa';
            default: return '#e4e4e7';
        }
    };

    return (
        <>
            {/* Floating Terminal Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-black/80 text-primary shadow-lg shadow-primary/20 backdrop-blur-xl transition-colors hover:border-primary/60 hover:bg-black/90 sm:h-14 sm:w-14"
                        title="Open Terminal (Ctrl+`)"
                    >
                        <Terminal className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="absolute -right-1 -top-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Terminal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-4 right-4 z-50 w-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0e17]/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:top-6 sm:right-6 sm:w-[480px]"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Title Bar */}
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <button onClick={() => setIsOpen(false)} className="group h-3 w-3 rounded-full bg-[#ff5f57] transition-all hover:brightness-110">
                                        <X className="h-3 w-3 text-[#4a0000] opacity-0 group-hover:opacity-100" />
                                    </button>
                                    <button className="h-3 w-3 rounded-full bg-[#ffbd2e]">
                                        <Minus className="h-3 w-3 text-[#4a3500] opacity-0" />
                                    </button>
                                    <button className="h-3 w-3 rounded-full bg-[#28c840]">
                                        <Maximize2 className="h-3 w-3 text-[#003a0a] opacity-0" />
                                    </button>
                                </div>
                                <span className="ml-2 font-mono text-xs text-white/50">hemanshu@portfolio: ~</span>
                            </div>
                            <span className="font-mono text-[10px] text-white/30">Ctrl+` to toggle</span>
                        </div>

                        {/* Output Area */}
                        <div
                            ref={scrollRef}
                            className="h-[300px] overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:h-[350px] sm:text-sm"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
                        >
                            {history.map((line, i) => (
                                <div key={i} style={{ color: getLineColor(line) }} className="whitespace-pre-wrap">
                                    {line.type === 'blank' ? <br /> : line.text}
                                </div>
                            ))}

                            {/* Input Line */}
                            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
                                <span className="text-[#22c55e] shrink-0">$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent text-white outline-none caret-primary placeholder:text-white/20"
                                    placeholder="type a command..."
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
