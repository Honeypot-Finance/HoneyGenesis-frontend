import { useState, useRef, useEffect, ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect if device supports touch
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Close tooltip when clicking outside on mobile
    if (!isMobile || !isVisible) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isMobile, isVisible]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsVisible(false);
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div
      className="tooltip-wrapper"
      ref={tooltipRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouch}
    >
      {children}
      {isVisible && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
}
