import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error?: Error | unknown;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorState({ error, onRetry, title = 'Error' }: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  const friendlyMessage = errorMessage.includes('Unauthorized')
    ? 'You do not have permission to access this content.'
    : errorMessage.includes('not found')
    ? 'The requested content could not be found.'
    : errorMessage;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>{friendlyMessage}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
