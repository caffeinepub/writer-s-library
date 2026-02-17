import React, { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useWriting, useCategory } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import LoadingState from '../components/state/LoadingState';
import ErrorState from '../components/state/ErrorState';
import { ArrowLeft } from 'lucide-react';

export default function WritingDetailPage() {
  const navigate = useNavigate();
  const { writingId } = useParams({ strict: false });
  const writingIdBigInt = writingId ? BigInt(writingId) : null;

  const { data: writing, isLoading: writingLoading, error: writingError, refetch: refetchWriting } = useWriting(writingIdBigInt);
  const categoryId = writing?.categories[0] || null;
  const { data: category } = useCategory(categoryId);

  useEffect(() => {
    if (writing) {
      document.title = `${writing.title} - Meri KITAAB`;
    }
  }, [writing]);

  if (writingLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingState message="Loading writing..." />
      </div>
    );
  }

  if (writingError || !writing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorState
          error={writingError || new Error('Writing not found')}
          onRetry={refetchWriting}
          title="Writing Not Found"
        />
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (categoryId) {
              navigate({ to: '/category/$categoryId', params: { categoryId: categoryId.toString() } });
            } else {
              navigate({ to: '/' });
            }
          }}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {category ? `Back to ${category.title}` : 'Back to Home'}
        </Button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            {writing.title}
          </h1>

          <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground mb-6">
            {category && (
              <Badge variant="secondary" className="font-normal">
                {category.title}
              </Badge>
            )}
            {writing.contentWarnings.length > 0 && (
              <>
                {writing.contentWarnings.map((warning, idx) => (
                  <Badge key={idx} variant="outline" className="font-normal">
                    {warning}
                  </Badge>
                ))}
              </>
            )}
          </div>

          <Separator className="max-w-xs" />
        </header>

        <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-foreground">
            {writing.content}
          </div>
        </div>

        <Separator className="my-12 max-w-xs mx-auto" />

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
          >
            Explore More Writings
          </Button>
        </div>
      </div>
    </article>
  );
}
