import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminCategories, useAdminWritings } from '../../hooks/useQueries';
import { BookOpen, FolderTree, Plus } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: categories } = useAdminCategories();
  const { data: writings } = useAdminWritings();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>
              Organize your writings into categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{categories?.length || 0}</div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate({ to: '/admin/categories' })}
                variant="outline"
                size="sm"
              >
                Manage
              </Button>
              <Button
                onClick={() => navigate({ to: '/admin/categories/new' })}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Writings
            </CardTitle>
            <CardDescription>
              Your collection of literary works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{writings?.length || 0}</div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate({ to: '/admin/writings' })}
                variant="outline"
                size="sm"
              >
                Manage
              </Button>
              <Button
                onClick={() => navigate({ to: '/admin/writings/new' })}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Writing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
