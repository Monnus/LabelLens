
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ImageUploaderProps = {
  onImageSelected: (file: File) => void;
  onImageUpload?: (file: File) => Promise<void>;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const ImageUploader = ({
  onImageSelected,
  onImageUpload,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxSizeMB = 5
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload an image file (${allowedTypes.join(", ")})`,
        variant: "destructive"
      });
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `The file size should not exceed ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  }

  const processFile = (file: File) => {
    if (!validateFile(file)) return;
    
    setSelectedFile(file);
    onImageSelected(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onImageUpload) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // This would be where we'd use AWS Amplify in a real implementation
      // const fileName = `uploads/${Date.now()}-${selectedFile.name}`;
      // const uploadResult = await uploadData({
      //   path: fileName,
      //   data: selectedFile,
      //   options: {
      //     contentType: selectedFile.type,
      //     onProgress: (progress) => {
      //       setUploadProgress((progress.transferredBytes / progress.totalBytes) * 100);
      //     },
      //   },
      // }).result;
      
      // For now, we'll just call the provided onImageUpload function
      await onImageUpload(selectedFile);
      
      setUploadProgress(100);
      toast({
        title: "Upload Complete",
        description: "Your image has been uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!selectedFile ? (
        <Card 
          className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-muted'} hover:border-primary transition-colors cursor-pointer relative`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
              className="sr-only"
              onChange={handleFileChange}
              accept={allowedTypes.join(",")}
            />
            <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {isDragging ? (
                  <Upload className="h-8 w-8 text-primary animate-bounce" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isDragging ? "Drop your image here" : "Upload an Image"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Drag and drop or click to browse
              </p>
              <Button type="button" onClick={handleButtonClick}>Select Image</Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: JPEG, PNG, GIF, WebP (max {maxSizeMB}MB)
              </p>
            </label>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative">
          <CardContent className="p-6">
            <button 
              className="absolute top-3 right-3 p-1 rounded-full bg-background/80 hover:bg-background z-10"
              onClick={handleRemove}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
              {preview && (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain bg-background/50"
                />
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate max-w-[80%]">{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              
              {isUploading && (
                <Progress value={uploadProgress} className="h-2" />
              )}
              
              {onImageUpload && (
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;