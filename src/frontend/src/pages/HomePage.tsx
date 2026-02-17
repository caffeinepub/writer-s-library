import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePublicCategories, usePublishedWritings } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoadingState from '../components/state/LoadingState';
import ErrorState from '../components/state/ErrorState';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = usePublicCategories();
  const { data: writings, isLoading: writingsLoading } = usePublishedWritings();

  useEffect(() => {
    document.title = "Meri KITAAB - Home";
  }, []);

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingState message="Loading categories..." />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorState error={categoriesError} onRetry={refetchCategories} />
      </div>
    );
  }

  const recentWritings = writings?.slice(0, 3) || [];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-24 px-4 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/hero-paper.dim_1600x900.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto relative z-10 max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Welcome to My Literary World
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Explore a curated collection of writings, from heartfelt shayari to captivating novels.
            Each piece is crafted with care and shared with love.
          </p>
          <Separator className="max-w-xs mx-auto mb-8" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-2">Browse by Category</h2>
          <p className="text-muted-foreground mb-8">
            Discover writings organized by theme and style
          </p>

          {categories && categories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((category) => {
                const categoryWritings = writings?.filter((w) =>
                  w.categories.some((cid) => cid === category.id)
                ) || [];

                return (
                  <Card
                    key={category.id.toString()}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: category.id.toString() } })}
                  >
                    <CardHeader>
                      <CardTitle className="font-serif">{category.title}</CardTitle>
                      <CardDescription>
                        {categoryWritings.length} {categoryWritings.length === 1 ? 'piece' : 'pieces'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" className="group">
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No categories available yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Recent Writings Section */}
      {recentWritings.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-2">Recent Writings</h2>
              <p className="text-muted-foreground mb-8">
                Latest additions to the collection
              </p>

              <div className="space-y-6">
                {recentWritings.map((writing) => (
                  <Card
                    key={writing.id.toString()}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate({ to: '/writing/$writingId', params: { writingId: writing.id.toString() } })}
                  >
                    <CardHeader>
                      <CardTitle className="font-serif">{writing.title}</CardTitle>
                      <CardDescription>
                        {writing.content.substring(0, 150)}
                        {writing.content.length > 150 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" className="group">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
