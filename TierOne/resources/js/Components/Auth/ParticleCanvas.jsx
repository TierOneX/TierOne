import { useEffect, useRef } from "react";

/**
 * ParticleCanvas — Red de partículas flotantes con líneas de conexión.
 * Temática gaming/tech: puntos rojos y blancos que se conectan al acercarse.
 */
export default function ParticleCanvas({ className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const spawn = () => {
            const count = Math.floor((canvas.width * canvas.height) / 14000);
            particles = Array.from({ length: Math.min(count, 55) }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.4 + 0.4,
                red: Math.random() > 0.75, // 25% de puntos en rojo
            }));
        };

        const CONNECT_DIST = 110;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Actualizar posiciones
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            }

            // Dibujar líneas de conexión
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.18;
                        const isRedPair = particles[i].red || particles[j].red;
                        ctx.strokeStyle = isRedPair
                            ? `rgba(227,24,55,${alpha})`
                            : `rgba(255,255,255,${alpha * 0.7})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Dibujar puntos
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.red
                    ? "rgba(227,24,55,0.75)"
                    : "rgba(255,255,255,0.35)";
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            resize();
            spawn();
        };

        resize();
        spawn();
        draw();
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        />
    );
}
