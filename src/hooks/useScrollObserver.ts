
import { useEffect, useRef } from 'react';

interface UseScrollObserverProps {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useScrollObserver = ({ 
  onIntersect, 
  threshold = 0.1, 
  rootMargin = '100px' 
}: UseScrollObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onIntersect, threshold, rootMargin]);

  return targetRef;
};
