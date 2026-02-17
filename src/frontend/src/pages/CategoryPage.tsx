import React, { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useCategory, usePublishedWritings } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoadingState from '../components/state/LoadingState';
import ErrorState from '../components/state/ErrorState';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams({ strict: false });
  const categoryIdBigInt = categoryId ? BigInt(categoryId) : null;

  const { data: category, isLoading: categoryLoading, error: categoryError, refetch: refetchCategory } = useCategory(categoryIdBigInt);
  const { data: allWritings, isLoading: writingsLoading } = usePublishedWritings();

  const writings = allWritings?.filter((w) =>
    w.categories.some((cid) => cid === categoryIdBigInt)
  ) || [];

  useEffect(() => {
    if (category) {
      document.title = `${category.title} - Meri KITAAB`;
    }
  }, [category]);

  if (categoryLoading || writingsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingState message="Loading category..." />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorState
          error={categoryError || new Error('Category not found')}
          onRetry={refetchCategory}
          title="Category Not Found"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{category.title}</h1>
          <Separator className="max-w-xs mb-4" />
          <p className="text-lg text-muted-foreground">
            {writings.length} {writings.length === 1 ? 'piece' : 'pieces'} in this collection
          </p>
        </header>

        {writings.length > 0 ? (
          <div className="space-y-6">
            {writings.map((writing) => (
              <Card
                key={writing.id.toString()}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate({ to: '/writing/$writingId', params: { writingId: writing.id.toString() } })}
              >
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">{writing.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {writing.content.substring(0, 200)}
                    {writing.content.length > 200 ? '...' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="group">
                    Read Full Piece
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Writings Yet</h3>
              <p className="text-muted-foreground">
                This category doesn't have any published writings yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
