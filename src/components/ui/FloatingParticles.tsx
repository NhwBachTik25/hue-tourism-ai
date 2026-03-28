'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
}

interface FloatingParticlesProps {
    count?: number;
    color?: 'green' | 'gold' | 'white';
    speed?: 'slow' | 'medium' | 'fast';
}

export function FloatingParticles({
    count = 50,
    color = 'green',
    speed = 'slow'
}: FloatingParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);
    const animationRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const getColorPalette = () => {
            switch (color) {
                case 'gold':
                    return ['rgba(255, 215, 100', 'rgba(255, 180, 50', 'rgba(255, 200, 80'];
                case 'white':
                    return ['rgba(255, 255, 255', 'rgba(220, 230, 225', 'rgba(200, 210, 205'];
                default:
                    return ['rgba(100, 200, 150', 'rgba(80, 180, 130', 'rgba(120, 220, 170'];
            }
        };

        const getSpeedMultiplier = () => {
            switch (speed) {
                case 'fast': return 1.5;
                case 'medium': return 1;
                default: return 0.5;
            }
        };

        const colors = getColorPalette();
        const speedMult = getSpeedMultiplier();

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 4 + 1,
                    speedX: (Math.random() - 0.5) * 0.3 * speedMult,
                    speedY: (Math.random() - 0.5) * 0.3 * speedMult - 0.1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle) => {
                // Mouse interaction
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.speedX -= (dx / distance) * force * 0.02;
                    particle.speedY -= (dy / distance) * force * 0.02;
                }

                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Gentle floating motion
                particle.speedY += Math.sin(Date.now() * 0.001 + particle.x) * 0.001;
                particle.speedX += Math.cos(Date.now() * 0.001 + particle.y) * 0.001;

                // Damping
                particle.speedX *= 0.99;
                particle.speedY *= 0.99;

                // Wrap around
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Pulsating opacity
                const pulse = Math.sin(Date.now() * 0.002 + particle.x * 0.01) * 0.2 + 0.8;
                const opacity = particle.opacity * pulse;

                // Draw particle glow
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 3
                );
                gradient.addColorStop(0, `${particle.color}, ${opacity})`);
                gradient.addColorStop(0.5, `${particle.color}, ${opacity * 0.3})`);
                gradient.addColorStop(1, `${particle.color}, 0)`);

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw particle core
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}, ${opacity})`;
                ctx.fill();
            });

            // Draw connections
            particlesRef.current.forEach((p1, i) => {
                particlesRef.current.slice(i + 1).forEach((p2) => {
                    const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `${p1.color}, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mounted, count, color, speed]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-5 pointer-events-none"
        />
    );
}
