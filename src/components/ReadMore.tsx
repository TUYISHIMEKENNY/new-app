import { useState, useRef, useEffect } from "react";

interface ReadMoreProps {
  children: React.ReactNode;
  lines?: number;
  className?: string;
}

export function ReadMore({ children, lines = 3, className = "" }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        // Temporarily remove line-clamp to get full height
        const isCurrentlyExpanded = isExpanded;
        if (!isCurrentlyExpanded) {
           // We can check if scrollHeight > clientHeight when clamped
           setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
        }
      }
    };

    checkTruncation();
    // Add resize listener to recheck when window resizes
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [children, isExpanded]);

  return (
    <div className={className}>
      <div 
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out ${!isExpanded ? 'overflow-hidden' : ''}`}
        style={!isExpanded ? { 
          display: '-webkit-box', 
          WebkitLineClamp: lines, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden' 
        } : {}}
      >
        {children}
      </div>
      {(isTruncated || isExpanded) && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-primary font-semibold text-sm hover:text-primary/80 transition-colors focus:outline-none flex items-center gap-1"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
