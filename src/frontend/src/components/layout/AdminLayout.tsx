import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, FolderTree, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Site
        </Button>
        <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your writings and categories</p>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/admin/categories' })}
        >
          <FolderTree className="mr-2 h-4 w-4" />
          Categories
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/admin/writings' })}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Writings
        </Button>
      </div>

      <Separator className="mb-8" />

      {children}
    </div>
  );
}
