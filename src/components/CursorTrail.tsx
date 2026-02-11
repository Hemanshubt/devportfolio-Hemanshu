import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    alpha: number;
    color: string;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
}

const COLORS = ['#00d4ff', '#22c55e', '#8b5cf6', '#ff9900'];

export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const prevMousePos = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>(0);
    const isDesktop = useRef(true);

    const createParticle = useCallback((x: number, y: number) => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.8 + 0.2;
        const maxLife = 30 + Math.random() * 20;

        particles.current.push({
            x,
            y,
            size: Math.random() * 3 + 1.5,
            alpha: 0.8,
            color,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife,
        });

        // Cap particles for performance
        if (particles.current.length > 80) {
            particles.current.splice(0, particles.current.length - 80);
        }
    }, []);

    useEffect(() => {
        // Only enable on desktop
        const checkDesktop = () => {
            isDesktop.current = window.innerWidth > 768 && !('ontouchstart' in window);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e: MouseEvent) => {
            prevMousePos.current = { ...mousePos.current };
            mousePos.current = { x: e.clientX, y: e.clientY };

            if (!isDesktop.current) return;

            // Calculate mouse speed for particle density
            const dx = mousePos.current.x - prevMousePos.current.x;
            const dy = mousePos.current.y - prevMousePos.current.y;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Create particles based on speed
            const count = Math.min(Math.floor(speed / 5) + 1, 3);
            for (let i = 0; i < count; i++) {
                const t = i / count;
                createParticle(
                    prevMousePos.current.x + dx * t + (Math.random() - 0.5) * 8,
                    prevMousePos.current.y + dy * t + (Math.random() - 0.5) * 8,
                );
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current = particles.current.filter(p => {
                p.life++;
                if (p.life >= p.maxLife) return false;

                const progress = p.life / p.maxLife;
                p.x += p.vx;
                p.y += p.vy + 0.1; // slight gravity
                p.alpha = (1 - progress) * 0.7;
                p.size *= 0.98;

                // Draw particle with glow
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                return true;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
            window.removeEventListener('resize', checkDesktop);
            cancelAnimationFrame(animationRef.current);
        };
    }, [createParticle]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[45]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
