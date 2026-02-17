import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home } from 'lucide-react';
import LoginButton from './LoginButton';

interface AccessDeniedScreenProps {
  reason: 'not-authenticated' | 'not-admin';
}

export default function AccessDeniedScreen({ reason }: AccessDeniedScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            {reason === 'not-authenticated'
              ? 'You need to sign in to access this area.'
              : 'You do not have permission to access this area. Admin access is required.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {reason === 'not-authenticated' && (
            <LoginButton />
          )}
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
