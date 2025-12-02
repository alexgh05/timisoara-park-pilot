import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-[#050709]" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-950/80" />
      
      {/* Very subtle ambient glow - follows mouse slowly */}
      <div 
        className="absolute w-[1000px] h-[1000px] rounded-full transition-all duration-[5000ms] ease-out"
        style={{
          background: "radial-gradient(circle, rgba(30, 64, 110, 0.15) 0%, transparent 50%)",
          left: `calc(${mousePosition.x * 0.3 + 20}% - 500px)`,
          top: `calc(${mousePosition.y * 0.3}% - 500px)`,
        }}
      />
      
      {/* Secondary subtle glow */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full transition-all duration-[6000ms] ease-out"
        style={{
          background: "radial-gradient(circle, rgba(55, 48, 107, 0.12) 0%, transparent 50%)",
          right: `calc(${(100 - mousePosition.x) * 0.2}% - 400px)`,
          bottom: `calc(${(100 - mousePosition.y) * 0.2}% - 400px)`,
        }}
      />

      {/* Very subtle floating ambient lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-950/30 rounded-full blur-[150px] animate-float-slow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-950/25 rounded-full blur-[130px] animate-float-medium" />
      
      {/* Elegant noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Top light beam effect */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[40%] opacity-[0.04]"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
        }}
      />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
};
