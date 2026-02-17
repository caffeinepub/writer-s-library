import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminWritings, usePublishWriting, useUnpublishWriting, useDeleteWriting } from '../../hooks/useQueries';
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
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { WritingState } from '../../backend';

export default function AdminWritingsPage() {
  const navigate = useNavigate();
  const { data: writings, isLoading, error, refetch } = useAdminWritings();
  const publishWriting = usePublishWriting();
  const unpublishWriting = useUnpublishWriting();
  const deleteWriting = useDeleteWriting();

  const handlePublish = async (id: bigint, title: string) => {
    try {
      await publishWriting.mutateAsync(id);
      toast.success(`"${title}" published successfully`);
    } catch (error) {
      console.error('Error publishing writing:', error);
      toast.error('Failed to publish writing');
    }
  };

  const handleUnpublish = async (id: bigint, title: string) => {
    try {
      await unpublishWriting.mutateAsync(id);
      toast.success(`"${title}" unpublished successfully`);
    } catch (error) {
      console.error('Error unpublishing writing:', error);
      toast.error('Failed to unpublish writing');
    }
  };

  const handleDelete = async (id: bigint, title: string) => {
    try {
      await deleteWriting.mutateAsync(id);
      toast.success(`"${title}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting writing:', error);
      toast.error('Failed to delete writing');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading writings..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold">Writings</h2>
          <p className="text-muted-foreground">Manage your literary works</p>
        </div>
        <Button onClick={() => navigate({ to: '/admin/writings/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Writing
        </Button>
      </div>

      {writings && writings.length > 0 ? (
        <div className="grid gap-4">
          {writings.map((writing) => (
            <Card key={writing.id.toString()}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="font-serif">{writing.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {writing.content.substring(0, 150)}...
                    </CardDescription>
                    <div className="flex gap-2 mt-3">
                      <Badge variant={writing.state === WritingState.published ? 'default' : 'secondary'}>
                        {writing.state}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ to: '/admin/writings/$writingId', params: { writingId: writing.id.toString() } })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {writing.state === WritingState.published ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnpublish(writing.id, writing.title)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(writing.id, writing.title)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Writing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{writing.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(writing.id, writing.title)}
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
            <p className="text-muted-foreground mb-4">No writings yet</p>
            <Button onClick={() => navigate({ to: '/admin/writings/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Writing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
