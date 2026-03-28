'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    twinkleSpeed: number;
    twinklePhase: number;
}

interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
    angle: number;
}

export function StarfieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);
    const animationRef = useRef<number | null>(null);
    const starsRef = useRef<Star[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);

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
            initStars();
        };

        const initStars = () => {
            const starCount = Math.floor((canvas.width * canvas.height) / 8000);
            starsRef.current = [];

            for (let i = 0; i < starCount; i++) {
                starsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.02 + 0.01,
                    twinkleSpeed: Math.random() * 0.02 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2,
                });
            }
        };

        const createShootingStar = () => {
            if (shootingStarsRef.current.length < 3 && Math.random() < 0.002) {
                shootingStarsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    length: Math.random() * 80 + 40,
                    speed: Math.random() * 8 + 4,
                    opacity: 1,
                    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                });
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear with fade effect for trails
            ctx.fillStyle = 'rgba(10, 20, 15, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            starsRef.current.forEach((star) => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
                const opacity = star.opacity * twinkle;

                // Star glow
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 3
                );
                gradient.addColorStop(0, `rgba(200, 255, 220, ${opacity})`);
                gradient.addColorStop(0.5, `rgba(150, 200, 170, ${opacity * 0.3})`);
                gradient.addColorStop(1, 'rgba(100, 150, 130, 0)');

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Star core
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            });

            // Create and draw shooting stars
            createShootingStar();

            shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity -= 0.015;

                if (star.opacity <= 0) return false;

                // Draw shooting star trail
                const tailX = star.x - Math.cos(star.angle) * star.length;
                const tailY = star.y - Math.sin(star.angle) * star.length;

                const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
                gradient.addColorStop(0, 'rgba(100, 200, 150, 0)');
                gradient.addColorStop(0.8, `rgba(150, 255, 200, ${star.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(star.x, star.y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Star head
                ctx.beginPath();
                ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();

                return true;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initial clear
        ctx.fillStyle = 'rgba(10, 20, 15, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #0a1410 0%, #0f1f18 50%, #152920 100%)' }}
        />
    );
}
