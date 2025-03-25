import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}

const ImagePreview = ({ previewUrl, fileName, fileSize, onRemove }: ImagePreviewProps) => {
  return (
    <Card className="relative border shadow-sm overflow-hidden">
      <button 
        className="absolute top-3 right-3 p-1 rounded-full bg-background/80 hover:bg-background z-10 shadow-sm"
        onClick={onRemove}
      >
        <X className="h-5 w-5" />
      </button>
      
      <CardContent className="p-0">
        <div className="aspect-video relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain bg-background/50"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate max-w-[80%]">{fileName}</span>
            <span className="text-sm text-muted-foreground">
              {(fileSize / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreview;