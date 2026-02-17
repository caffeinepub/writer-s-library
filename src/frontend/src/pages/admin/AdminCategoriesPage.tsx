import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminCategories, useDeleteCategory } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import LoadingState from '../../components/state/LoadingState';
import ErrorState from '../../components/state/ErrorState';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Status } from '../../backend';

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading, error, refetch } = useAdminCategories();
  const deleteCategory = useDeleteCategory();

  const handleDelete = async (id: bigint, title: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success(`Category "${title}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading categories..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold">Categories</h2>
          <p className="text-muted-foreground">Manage your writing categories</p>
        </div>
        <Button onClick={() => navigate({ to: '/admin/categories/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif">{category.title}</CardTitle>
                    <CardDescription>
                      <Badge variant={category.status === Status.active ? 'default' : 'secondary'} className="mt-2">
                        {category.status}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ to: '/admin/categories/$categoryId', params: { categoryId: category.id.toString() } })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id, category.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No categories yet</p>
            <Button onClick={() => navigate({ to: '/admin/categories/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
