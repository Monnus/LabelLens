
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export type SimilarImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  author: string;
  authorUrl: string;
};

type SimilarImagesGridProps = {
  images: SimilarImage[];
  isLoading?: boolean;
};

const SimilarImagesGrid = ({ images, isLoading = false }: SimilarImagesGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden border">
            <div className="aspect-square bg-muted animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="text-center p-10 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No similar images found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <a 
          key={image.id}
          href={image.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group"
        >
          <Card className="overflow-hidden border hover:border-primary transition-colors">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={image.thumbnailUrl} 
                alt={image.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="text-white h-8 w-8" />
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-medium truncate">{image.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                By {image.author}
              </p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};

export default SimilarImagesGrid;
