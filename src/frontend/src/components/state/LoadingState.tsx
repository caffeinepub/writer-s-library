import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export default function LoadingState({ message = 'Loading...', count = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{message}</p>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
