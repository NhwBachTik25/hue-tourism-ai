'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

export function AnimatedBackground() {
    const { resolvedTheme } = useTheme();
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mounted, setMounted] = useState(false);
    const animationRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        const isDark = resolvedTheme === 'dark';
        const particleCount = isDark ? 80 : 40;
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: isDark ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
                speedX: isDark ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 0.3,
                speedY: isDark ? Math.random() * 1 + 0.5 : Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.3,
            });
        }

        setParticles(newParticles);

        // Animation loop
        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            newParticles.forEach((particle) => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around screen
                if (particle.y > canvas.height) {
                    particle.y = -10;
                    particle.x = Math.random() * canvas.width;
                }
                if (particle.y < -10) {
                    particle.y = canvas.height + 10;
                }
                if (particle.x > canvas.width) {
                    particle.x = 0;
                }
                if (particle.x < 0) {
                    particle.x = canvas.width;
                }

                // Draw particle
                ctx.beginPath();

                if (isDark) {
                    // Snow effect - white circles with glow
                    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                    ctx.shadowBlur = 3;
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Light mode - subtle colored bubbles/sparkles
                    const hue = (particle.id * 30) % 360;
                    ctx.fillStyle = `hsla(${hue}, 70%, 70%, ${particle.opacity * 0.4})`;
                    ctx.shadowColor = `hsla(${hue}, 70%, 70%, 0.3)`;
                    ctx.shadowBlur = 5;
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.shadowBlur = 0;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mounted, resolvedTheme]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: resolvedTheme === 'dark' ? 0.6 : 0.4 }}
        />
    );
}
