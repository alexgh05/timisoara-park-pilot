export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-card/60 backdrop-blur-xl">
      <div className="py-6 sm:py-10 px-4 text-center">
        <h3 className="text-base sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">Smart-Spot</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Making cities smarter, one parking spot at a time.
        </p>
        <p className="text-xs text-muted-foreground mb-4 sm:mb-6">
          © 2025 Smart-Spot
        </p>
        
        {/* ANPC Logos */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <a 
            href="https://anpc.ro/ce-este-sal/" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
          >
            <img className="h-8 sm:h-10" src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sal.svg" alt="SAL" />
          </a>
          <a 
            href="https://ec.europa.eu/consumers/odr" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
          >
            <img className="h-8 sm:h-10" src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sol.svg" alt="SOL" />
          </a>
        </div>
      </div>
    </footer>
  );
};
