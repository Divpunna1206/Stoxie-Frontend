import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function FuturisticBackground() {
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetPositionRef = useRef({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to 0-1 range
      targetPositionRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const animate = () => {
      // Smooth lerp interpolation
      mousePositionRef.current = {
        x: mousePositionRef.current.x + (targetPositionRef.current.x - mousePositionRef.current.x) * 0.05,
        y: mousePositionRef.current.y + (targetPositionRef.current.y - mousePositionRef.current.y) * 0.05,
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs - Electric Cyan */}
      <motion.div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #00FFFF 0%, #00D4FF 30%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Magenta/Purple orb */}
      <motion.div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #FF00FF 0%, #C026D3 30%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          scale: {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Center purple orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #A855F7 0%, #7C3AED 30%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Electric green accent orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #00FF88 0%, #00D4AA 30%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          scale: {
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const colors = ['#00FFFF', '#FF00FF', '#00FF88', '#A855F7'];
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: color,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Grid pattern with cyan */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(#00FFFF 1px, transparent 1px),
              linear-gradient(90deg, #00FFFF 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Scanning lines - Cyan */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30"
        animate={{
          y: ['0vh', '100vh'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scanning lines - Magenta */}
      <motion.div
        className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF00FF] to-transparent opacity-30"
        animate={{
          x: ['0vw', '100vw'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
