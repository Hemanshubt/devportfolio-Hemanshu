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
    { type: 'info', text: '  ai <query>  — Ask AI about Hemanshu' },
    { type: 'info', text: '  ai help     — Show sample AI questions' },
    { type: 'info', text: '  sudo hire   — 😉' },
    { type: 'output', text: '╚══════════════════════════════════════════════╝' },
];

// ─── Component ───────────────────────────────────────────────────────
export default function InteractiveTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OutputLine[]>([
        { type: 'output', text: '🖥️  Welcome to Hemanshu\'s Terminal v1.0.0' },
        { type: 'output', text: 'Type "help" to start, or "ai help" for questions.' },
        { type: 'blank', text: '' },
    ]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isMatrix, setIsMatrix] = useState(false);
    // Add fake file system for cd/ls
    const [currentPath, setCurrentPath] = useState('~');
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

    const executeCommand = useCallback(async (cmd: string) => {
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

            case 'coffee':
                lines.push({ type: 'output', text: '☕ Brewing Java... Done!', color: '#fbbf24' });
                break;

            case 'hack':
                setHistory(prev => [...prev,
                { type: 'command', text: `$ ${trimmed}` },
                { type: 'output', text: '🔒 Initiating brute force attack...', color: '#ef4444' }
                ]);

                await new Promise(r => setTimeout(r, 1000));
                setHistory(prev => [...prev, { type: 'output', text: '🔓 Bypassing firewall (Port 443)...', color: '#f59e0b' }]);

                await new Promise(r => setTimeout(r, 1200));
                setHistory(prev => [...prev, { type: 'output', text: '💻 Accessing mainframe...', color: '#22c55e' }]);

                await new Promise(r => setTimeout(r, 1200));
                setHistory(prev => [...prev,
                { type: 'output', text: 'ACCESS GRANTED 🔓', color: '#00ff00' },
                { type: 'info', text: 'Congratulations! You are officially a hacker now. 😎' },
                { type: 'blank', text: '' }
                ]);
                return;

            case 'matrix':
                setIsMatrix(prev => !prev);
                lines.push({ type: 'output', text: isMatrix ? 'Deactivating Matrix mode...' : 'Entering the Matrix... 🟢' });
                break;

            case 'sudo rm -rf /':
                lines.push(
                    { type: 'error', text: '🚨 PERMISSION DENIED: Nice try! You cannot delete Hemanshu\'s hard work.' },
                    { type: 'info', text: '   (Did you really think that would work? 😉)' }
                );
                break;

            case 'echo hello':
            case 'echo "hello"':
                lines.push({ type: 'output', text: 'hello 👋' });
                break;

            case 'ai help':
            case 'ai questions':
                lines.push({ type: 'info', text: '🤖 AI Assistant - Sample Questions:' });
                lines.push({ type: 'info', text: ' ' });
                lines.push({ type: 'info', text: '📌 Personal' });
                lines.push({ type: 'info', text: '  • Who is Hemanshu?' });
                lines.push({ type: 'info', text: '  • What is his education?' });
                lines.push({ type: 'info', text: ' ' });
                lines.push({ type: 'info', text: '💻 Technical' });
                lines.push({ type: 'info', text: '  • List his DevOps skills' });
                lines.push({ type: 'info', text: '  • Does he know Kubernetes?' });
                lines.push({ type: 'info', text: ' ' });
                lines.push({ type: 'info', text: '🚀 Projects' });
                lines.push({ type: 'info', text: '  • Explain the "Scalable AWS Deployment" project' });
                lines.push({ type: 'info', text: '  • Link to the Flask app repo' });
                lines.push({ type: 'info', text: ' ' });
                lines.push({ type: 'info', text: '📄 Contact' });
                lines.push({ type: 'info', text: '  • Show me his LinkedIn' });
                lines.push({ type: 'info', text: '  • How can I contact him?' });
                break;

            case 'ai':
                lines.push({ type: 'error', text: 'Usage: ai <your question>' });
                lines.push({ type: 'info', text: 'Try asking:' });
                lines.push({ type: 'info', text: '  • ai who is hemanshu?' });
                lines.push({ type: 'info', text: '  • ai list technical skills' });
                lines.push({ type: 'info', text: '  • ai show me his linkedin' });
                lines.push({ type: 'info', text: '💡 Type "ai help" for a full list.' });
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
                } else if (trimmed.startsWith('ai ')) {
                    const question = cmd.slice(3);
                    lines.push({ type: 'info', text: '🤔 Thinking...' });

                    // Show "Thinking..." immediately before async operation
                    setHistory(prev => [...prev, ...lines]);

                    try {
                        // Call the server-side proxy (API key and prompt kept server-side)
                        const response = await fetch('/api/gemini', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ question }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.error || `Server error: ${response.status}`);
                        }

                        // Initialize empty output line for streaming
                        setHistory(prev => {
                            const newHistory = [...prev];
                            if (newHistory[newHistory.length - 1].text === '🤔 Thinking...') {
                                newHistory.pop();
                            }
                            newHistory.push({ type: 'output', text: '', color: '#a78bfa' });
                            return newHistory;
                        });

                        // Process the SSE stream from the proxy
                        const reader = response.body?.getReader();
                        if (!reader) throw new Error('No response body');

                        const decoder = new TextDecoder();
                        let buffer = '';
                        let currentText = '';

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const streamLines = buffer.split('\n');
                            buffer = streamLines.pop() || '';

                            for (const line of streamLines) {
                                if (line.startsWith('data: ')) {
                                    const jsonStr = line.slice(6);
                                    if (jsonStr.trim() === '[DONE]') continue;
                                    try {
                                        const json = JSON.parse(jsonStr);
                                        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                                        if (text) {
                                            currentText += text;
                                            setHistory(prev => {
                                                const newHistory = [...prev];
                                                const lastIndex = newHistory.length - 1;
                                                if (lastIndex >= 0 && newHistory[lastIndex].type === 'output') {
                                                    newHistory[lastIndex] = { ...newHistory[lastIndex], text: `🤖 ${currentText.trim()}` };
                                                }
                                                return newHistory;
                                            });
                                        }
                                    } catch {
                                        // ignore partial JSON
                                    }
                                }
                            }
                        }

                        return; // Return early to avoid adding extra blank line

                    } catch (error) {
                        setHistory(prev => {
                            const newHistory = [...prev];
                            if (newHistory[newHistory.length - 1].text === '🤔 Thinking...') {
                                newHistory.pop();
                            }

                            const result = [...newHistory];
                            const msg = error instanceof Error ? error.message : 'Failed to fetch AI response';

                            if (msg.includes('Too many requests') || msg.includes('overloaded')) {
                                result.push({ type: 'error', text: '🚨 AI is currently overloaded (Rate Limit).' });
                                result.push({ type: 'info', text: 'Please wait a minute and try again.' });
                            } else {
                                result.push({ type: 'error', text: `Error: ${msg}` });
                            }

                            result.push({ type: 'blank', text: '' });
                            return result;
                        });
                        return;
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
        if (e.key === 'Enter') {
            return; // Handled by form submit
        }

        // Tab Autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            const lower = input.toLowerCase().trim();

            // AI Question Cycling
            const AI_QUESTIONS = [
                'ai who is hemanshu?',
                'ai list his technical skills',
                'ai show me his linkedin',
                'ai explain the scalable aws project',
                'ai what is his cgpa?',
                'ai where is he based?',
                'ai help'
            ];

            if (lower === 'ai' || AI_QUESTIONS.includes(input)) {
                const currentIndex = AI_QUESTIONS.indexOf(input);
                const nextIndex = (currentIndex + 1) % AI_QUESTIONS.length;
                setInput(AI_QUESTIONS[nextIndex]);
                return;
            }

            // Standard Command Autocomplete
            const COMMANDS = ['help', 'about', 'skills', 'projects', 'blog', 'contact', 'whoami', 'neofetch', 'uptime', 'clear', 'date', 'ai', 'sudo'];
            const matches = COMMANDS.filter(c => c.startsWith(lower));

            if (matches.length === 1) {
                setInput(matches[0]);
            } else if (matches.length > 1) {
                // If multiple matches (e.g. s -> skills, sudo), maybe do nothing or cycle?
                // For now, simple completion for unique prefix
            }
            return;
        }

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
        if (isMatrix) return '#00ff00';
        if (line.color) return line.color;
        switch (line.type) {
            case 'command': return '#22c55e';
            case 'error': return '#ef4444';
            case 'ascii': return '#00d4ff';
            case 'info': return '#a1a1aa';
            default: return '#e4e4e7';
        }
    };

    const formatText = (text: string) => {
        // First split by links [Text](URL)
        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

        return parts.map((part, i) => {
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
                return (
                    <a
                        key={i}
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
                    >
                        {linkMatch[1]}
                    </a>
                );
            }

            // If not a link, parse bold **Text**
            const boldParts = part.split(/(\*\*.*?\*\*)/g);
            return (
                <span key={i}>
                    {boldParts.map((subPart, j) => {
                        if (subPart.startsWith('**') && subPart.endsWith('**')) {
                            return <strong key={j} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                        }
                        return subPart;
                    })}
                </span>
            );
        });
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
                        className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-black/80 text-primary shadow-lg shadow-primary/20 backdrop-blur-xl transition-colors hover:border-primary/60 hover:bg-black/90 sm:bottom-24 sm:right-8 sm:h-14 sm:w-14"
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
                        drag
                        dragMomentum={false}
                        dragConstraints={{
                            top: -window.innerHeight + 200,
                            left: -window.innerWidth + 200,
                            right: 0,
                            bottom: 0,
                        }}
                        className="fixed bottom-4 right-4 z-50 w-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0e17]/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:bottom-6 sm:right-6 sm:w-[480px]"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Title Bar — drag handle */}
                        <div
                            className="flex cursor-grab items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5 active:cursor-grabbing"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <button onClick={() => setIsOpen(false)} className="group h-3 w-3 rounded-full bg-[#ff5f57] transition-all hover:brightness-110">
                                        <X className="h-3 w-3 text-[#4a0000] opacity-0 group-hover:opacity-100" />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="group h-3 w-3 rounded-full bg-[#ffbd2e] transition-all hover:brightness-110" title="Minimize">
                                        <Minus className="h-3 w-3 text-[#4a3500] opacity-0 group-hover:opacity-100" />
                                    </button>
                                    <button className="group h-3 w-3 rounded-full bg-[#28c840] transition-all hover:brightness-110">
                                        <Maximize2 className="h-3 w-3 text-[#003a0a] opacity-0 group-hover:opacity-100" />
                                    </button>
                                </div>
                                <span className="ml-2 font-mono text-xs text-white/50">hemanshu@portfolio: ~</span>
                            </div>
                            <span className="font-mono text-[10px] text-white/30">Ctrl+` to toggle</span>
                        </div>

                        {/* Output Area — not draggable */}
                        <div
                            ref={scrollRef}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`h-[300px] overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:h-[350px] sm:text-sm transition-all duration-300 ${isMatrix ? 'bg-black tracking-wider' : ''}`}
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: isMatrix ? '#00ff00 #000' : '#333 transparent',
                                textShadow: isMatrix ? '0 0 5px rgba(0, 255, 0, 0.7)' : 'none'
                            }}
                        >
                            {history.map((line, i) => (
                                <div key={i} style={{ color: getLineColor(line) }} className="whitespace-pre-wrap">
                                    {line.type === 'blank' ? <br /> : (line.type === 'ascii' ? line.text : formatText(line.text))}
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
