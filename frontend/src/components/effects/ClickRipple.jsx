import { useEffect, useRef } from "react";

/**
 * Custom click ripple effect - creates expanding rings and particles on click
 */
const ClickRipple = () => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const particlesRef = useRef([]);
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

    // Ripple class
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 100;
        this.speed = 3;
        this.opacity = 1;
        this.lineWidth = 3;
      }

      update() {
        this.radius += this.speed;
        this.opacity = 1 - this.radius / this.maxRadius;
        this.lineWidth = 3 * this.opacity;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      isDead() {
        return this.radius >= this.maxRadius;
      }
    }

    // Burst Particle class
    class BurstParticle {
      constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = Math.random() * 3 + 2;
        this.radius = Math.random() * 2 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;

        // White to light blue gradient
        const hue = Math.random() * 60 + 200;
        this.color = `hsl(${hue}, 80%, 70%)`;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
        this.radius *= 0.96;
        this.speed *= 0.95;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Click handler
    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Create ripples
      ripplesRef.current.push(new Ripple(x, y));

      // Delayed second ripple
      setTimeout(() => {
        ripplesRef.current.push(new Ripple(x, y));
      }, 100);

      // Create burst particles
      const particleCount = 16;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        particlesRef.current.push(new BurstParticle(x, y, angle));
      }
    };

    // Touch support
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.update();
        ripple.draw(ctx);
        return !ripple.isDead();
      });

      // Update and draw burst particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouchStart);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
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
        zIndex: 2,
      }}
    />
  );
};

export default ClickRipple;
