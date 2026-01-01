import { useEffect, useRef } from "react";

/**
 * Custom cursor trail effect - soft wind-like flowing particles
 * Gentle, dreamy animation optimized for white backgrounds
 */
const CursorTrail = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class - soft and wind-like
    class Particle {
      constructor(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1.5; // Smaller, softer particles

        // Gentle, flowing movement
        this.speedX = velocityX * 0.3 + (Math.random() - 0.5) * 0.5;
        this.speedY = velocityY * 0.3 + (Math.random() - 0.5) * 0.5;

        // Add slight drift (wind effect)
        this.driftX = (Math.random() - 0.5) * 0.2;
        this.driftY = (Math.random() - 0.5) * 0.2;

        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.006; // Slower decay for dreamy effect

        // Soft, pastel colors
        const colors = [
          { h: 270, s: 50, l: 70 }, // Soft purple
          { h: 200, s: 55, l: 65 }, // Soft blue
          { h: 320, s: 45, l: 70 }, // Soft pink
          { h: 180, s: 50, l: 65 }, // Soft cyan
          { h: 290, s: 48, l: 68 }, // Soft violet
          { h: 160, s: 45, l: 70 }, // Soft teal
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.color = `hsl(${randomColor.h}, ${randomColor.s}%, ${randomColor.l}%)`;
      }

      update() {
        // Apply gentle wind drift
        this.speedX += this.driftX * 0.1;
        this.speedY += this.driftY * 0.1;

        // Gentle deceleration
        this.speedX *= 0.98;
        this.speedY *= 0.98;

        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.99; // Very slow size reduction
      }

      draw(ctx) {
        ctx.save();

        // Soft, gentle opacity
        ctx.globalAlpha = this.life * 0.6;

        // Draw soft particle with gradient
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(
          0.5,
          this.color.replace(")", ", 0.5)").replace("hsl", "hsla")
        );
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Very soft glow
        ctx.globalAlpha = this.life * 0.3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      isDead() {
        return this.life <= 0 || this.size <= 0.2;
      }
    }

    // Mouse move handler
    const handleMouseMove = (e) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;

      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        prevX: prevX,
        prevY: prevY,
      };

      // Calculate velocity for natural wind-like trail
      const velocityX = (e.clientX - prevX) * 0.1;
      const velocityY = (e.clientY - prevY) * 0.1;

      // Create fewer particles for softer effect
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push(
          new Particle(
            e.clientX + (Math.random() - 0.5) * 20,
            e.clientY + (Math.random() - 0.5) * 20,
            velocityX,
            velocityY
          )
        );
      }
    };

    // Touch support
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;

      mouseRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        prevX: prevX,
        prevY: prevY,
      };

      const velocityX = (touch.clientX - prevX) * 0.1;
      const velocityY = (touch.clientY - prevY) * 0.1;

      for (let i = 0; i < 2; i++) {
        particlesRef.current.push(
          new Particle(
            touch.clientX + (Math.random() - 0.5) * 20,
            touch.clientY + (Math.random() - 0.5) * 20,
            velocityX,
            velocityY
          )
        );
      }
    };

    // Animation loop
    const animate = () => {
      // Clear canvas with very soft fade for dreamy trail
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      // Limit particle count for performance
      if (particlesRef.current.length > 400) {
        particlesRef.current = particlesRef.current.slice(-400);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default CursorTrail;
