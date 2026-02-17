import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WritingPreviewProps {
  title: string;
  content: string;
  categoryTitle?: string;
  contentWarnings?: string[];
}

export default function WritingPreview({
  title,
  content,
  categoryTitle,
  contentWarnings = [],
}: WritingPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground mb-6">
            {categoryTitle && (
              <Badge variant="secondary" className="font-normal">
                {categoryTitle}
              </Badge>
            )}
            {contentWarnings.length > 0 && (
              <>
                {contentWarnings.map((warning, idx) => (
                  <Badge key={idx} variant="outline" className="font-normal">
                    {warning}
                  </Badge>
                ))}
              </>
            )}
          </div>

          <Separator className="max-w-xs" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-w-3xl mx-auto prose prose-lg prose-stone dark:prose-invert">
          <div className="whitespace-pre-wrap leading-relaxed text-foreground">
            {content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
