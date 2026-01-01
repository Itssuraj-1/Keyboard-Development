import React, { useRef, useEffect, useState } from "react";

const FaultyTerminal = ({
  text = "It works on my machine,\nplease check again",
  speed = 0.5,
  scale = 1.5,
  gridMul = [2, 1], // [x, y] density
  digitSize = 1.2,
  scanlineIntensity = 0.5,
  glitchAmount = 1.0,
  flickerAmount = 1.0,
  noiseAmp = 1.0,
  mouseReact = true,
  mouseStrength = 0.5,
  tint = "#0aff0a", // Terminal Green
  fontFamily = "monospace",
  children,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // Character set for the matrix/terminal effect
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&[]{}()<>;:^~=+-*/|\\_";

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Grid configuration
    const fontSize = 16 * scale;
    const colWidth = fontSize * 0.6 * digitSize; // Adjust width for monospaced look
    const rowHeight = fontSize * digitSize;

    const cols = Math.ceil(dimensions.width / colWidth) * gridMul[0];
    const rows = Math.ceil(dimensions.height / rowHeight) * gridMul[1];

    // Initialize grid state
    const grid = new Array(cols * rows).fill(0).map(() => ({
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: Math.random(),
      changeRate: Math.random() * 0.1 + 0.01, // How often this cell changes
    }));

    const render = (time) => {
      timeRef.current = time * 0.001 * speed;
      const t = timeRef.current;

      // Clear background
      ctx.fillStyle = "#0a0a0a"; // Dark terminal background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "top";

      // Draw Grid
      for (let i = 0; i < grid.length; i++) {
        const xIndex = i % cols;
        const yIndex = Math.floor(i / cols);

        // Calculate Position
        const x = xIndex * (dimensions.width / cols);
        const y = yIndex * (dimensions.height / rows);

        // Update Cell
        const cell = grid[i];

        // Randomly change character based on glitch amount
        if (Math.random() < cell.changeRate * glitchAmount * 0.1) {
          cell.char = chars[Math.floor(Math.random() * chars.length)];
        }

        // Distance to mouse (for interaction)
        let dist = 0;
        if (mouseReact) {
          const dx = x - mousePos.current.x;
          const dy = y - mousePos.current.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        // Calculate Opacity/Brightness
        // Base flicker + noise + mouse interaction
        const flicker = Math.sin(t * 5 + i) * 0.5 + 0.5;
        const noise = Math.random() * noiseAmp;
        let opacity =
          cell.opacity * 0.3 + flicker * 0.1 * flickerAmount + noise * 0.1;

        // Mouse interaction boosts opacity
        if (mouseReact) {
          const maxDist = 200;
          if (dist < maxDist) {
            opacity += (1 - dist / maxDist) * mouseStrength;
          }
        }

        // Apply Scanline effect (horizontal bands)
        const scanLine = Math.sin(y * 0.1 - t * 5) * 0.5 + 0.5;
        opacity *=
          1 - scanlineIntensity * 0.5 + scanLine * scanlineIntensity * 0.5;

        // Clamp opacity
        opacity = Math.max(0, Math.min(1, opacity));

        // Draw Character
        ctx.fillStyle = `${tint}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fillText(cell.char, x, y);
      }

      // Optional: Add global scanline overlay
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * scanlineIntensity})`;
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    dimensions,
    speed,
    scale,
    gridMul,
    digitSize,
    glitchAmount,
    flickerAmount,
    mouseReact,
    mouseStrength,
    tint,
    scanlineIntensity,
  ]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        {children || (
          <div className="text-center p-8 bg-black/80 border border-[#0aff0a]/30 backdrop-blur-sm rounded-lg">
            <h2 className="text-4xl md:text-5xl font-mono font-bold text-[#0aff0a] mb-4 whitespace-pre-wrap">
              {text}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaultyTerminal;
