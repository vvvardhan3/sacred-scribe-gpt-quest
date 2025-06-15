
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

  useEffect(() => {
    // Initialize with first batch
    const initialItems = items.slice(0, initialLoad);
    setDisplayedItems(initialItems);
    setHasMore(items.length > initialLoad);
  }, [items, initialLoad]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedItems.length;
      const nextItems = items.slice(currentLength, currentLength + itemsPerLoad);
      
      setDisplayedItems(prev => [...prev, ...nextItems]);
      setHasMore(currentLength + nextItems.length < items.length);
      setIsLoading(false);
    }, 500);
  }, [items, displayedItems.length, itemsPerLoad, isLoading, hasMore]);

  return { displayedItems, hasMore, isLoading, loadMore };
};
