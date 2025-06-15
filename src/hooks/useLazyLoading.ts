
import { useState, useEffect, useCallback } from 'react';

interface UseLazyLoadingProps {
  items: any[];
  itemsPerLoad: number;
  initialLoad: number;
}

export const useLazyLoading = ({ items, itemsPerLoad, initialLoad }: UseLazyLoadingProps) => {
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Initialize with first batch
    const initialItems = items.slice(0, initialLoad);
    setDisplayedItems(initialItems);
    setCurrentIndex(initialLoad);
    setHasMore(items.length > initialLoad);
  }, [items, initialLoad]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextItems = items.slice(currentIndex, currentIndex + itemsPerLoad);
      
      setDisplayedItems(prev => [...prev, ...nextItems]);
      const newIndex = currentIndex + nextItems.length;
      setCurrentIndex(newIndex);
      setHasMore(newIndex < items.length);
      setIsLoading(false);
    }, 500);
  }, [items, currentIndex, itemsPerLoad, isLoading, hasMore]);

  return { displayedItems, hasMore, isLoading, loadMore };
};
