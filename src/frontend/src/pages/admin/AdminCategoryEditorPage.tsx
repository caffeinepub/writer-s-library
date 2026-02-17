import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useCategory, useCreateCategory, useUpdateCategory } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingState from '../../components/state/LoadingState';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Status } from '../../backend';

export default function AdminCategoryEditorPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams({ strict: false });
  const isEditing = !!categoryId;
  const categoryIdBigInt = categoryId ? BigInt(categoryId) : null;

  const { data: category, isLoading } = useCategory(categoryIdBigInt);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>(Status.active);
  const [focusBannerUrl, setFocusBannerUrl] = useState('');

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setStatus(category.status);
      setFocusBannerUrl(category.focusBannerUrl);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a category title');
      return;
    }

    try {
      if (isEditing && categoryIdBigInt) {
        await updateCategory.mutateAsync({
          id: categoryIdBigInt,
          title: title.trim(),
          parentCategoryId: null,
          supportedLanguages: [],
          focusBannerUrl: focusBannerUrl.trim(),
          status,
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync({
          title: title.trim(),
          parentCategoryId: null,
          supportedLanguages: [],
          focusBannerUrl: focusBannerUrl.trim(),
          status,
        });
        toast.success('Category created successfully');
      }
      navigate({ to: '/admin/categories' });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="space-y-6">
        <LoadingState message="Loading category..." />
      </div>
    );
  }

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/admin/categories' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Category' : 'New Category'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update category details' : 'Create a new category for your writings'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Shayari, Novels, Poetry"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.active}>Active</SelectItem>
                  <SelectItem value={Status.inactive}>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner URL (optional)</Label>
              <Input
                id="banner"
                value={focusBannerUrl}
                onChange={(e) => setFocusBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/admin/categories' })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
