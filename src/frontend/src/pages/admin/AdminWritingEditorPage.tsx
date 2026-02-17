import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useWriting, useAdminCategories, useCreateWriting, useUpdateWriting } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingState from '../../components/state/LoadingState';
import WritingPreview from '../../components/admin/WritingPreview';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWritingEditorPage() {
  const navigate = useNavigate();
  const { writingId } = useParams({ strict: false });
  const isEditing = !!writingId;
  const writingIdBigInt = writingId ? BigInt(writingId) : null;

  const { data: writing, isLoading: writingLoading } = useWriting(writingIdBigInt);
  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();
  const createWriting = useCreateWriting();
  const updateWriting = useUpdateWriting();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [contentWarnings, setContentWarnings] = useState('');

  useEffect(() => {
    if (writing) {
      setTitle(writing.title);
      setContent(writing.content);
      setSelectedCategoryId(writing.categories[0]?.toString() || '');
      setContentWarnings(writing.contentWarnings.join(', '));
    }
  }, [writing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }

    const categoryIds = selectedCategoryId ? [BigInt(selectedCategoryId)] : [];
    const warningsList = contentWarnings
      .split(',')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    try {
      if (isEditing && writingIdBigInt) {
        await updateWriting.mutateAsync({
          id: writingIdBigInt,
          title: title.trim(),
          content: content.trim(),
          categoryIds,
          contentWarnings: warningsList,
        });
        toast.success('Writing updated successfully');
      } else {
        await createWriting.mutateAsync({
          title: title.trim(),
          categoryIds,
          content: content.trim(),
          contentWarnings: warningsList,
        });
        toast.success('Writing created successfully');
      }
      navigate({ to: '/admin/writings' });
    } catch (error) {
      console.error('Error saving writing:', error);
      toast.error('Failed to save writing');
    }
  };

  if ((writingLoading || categoriesLoading) && isEditing) {
    return (
      <div className="space-y-6">
        <LoadingState message="Loading writing..." />
      </div>
    );
  }

  const isPending = createWriting.isPending || updateWriting.isPending;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/admin/writings' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Writings
      </Button>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Writing' : 'New Writing'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Update your writing' : 'Create a new piece'}
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
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id.toString()} value={cat.id.toString()}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your piece here..."
                    rows={15}
                    className="font-serif"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warnings">Content Warnings (optional)</Label>
                  <Input
                    id="warnings"
                    value={contentWarnings}
                    onChange={(e) => setContentWarnings(e.target.value)}
                    placeholder="Comma-separated, e.g., mature themes, violence"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : isEditing ? 'Update Writing' : 'Create Writing'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: '/admin/writings' })}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <WritingPreview
            title={title || 'Untitled'}
            content={content || 'No content yet...'}
            categoryTitle={categories?.find((c) => c.id.toString() === selectedCategoryId)?.title}
            contentWarnings={contentWarnings
              .split(',')
              .map((w) => w.trim())
              .filter((w) => w.length > 0)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
