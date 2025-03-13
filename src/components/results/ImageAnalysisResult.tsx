
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

// Define the structure for image analysis results
export type ImageAnalysis = {
  objects?: string[];
  colors?: Array<{
    name: string;
    hex: string;
    percentage: number;
  }>;
  tags?: string[];
  // Add more fields as needed
};

type ImageAnalysisResultProps = {
  analysis: ImageAnalysis;
  imageUrl: string;
};

const ImageAnalysisResult = ({ analysis, imageUrl }: ImageAnalysisResultProps) => {
  return (
    <div className="w-full">
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-primary" />
            Image Analysis Results
          </CardTitle>
          <CardDescription>
            Detailed information about your uploaded image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Preview */}
          <div className="aspect-video rounded-md overflow-hidden bg-muted/50 border">
            <img 
              src={imageUrl} 
              alt="Analyzed image" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Objects Section */}
          {analysis.objects && analysis.objects.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Objects Detected</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.objects.map((object, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1">
                    {object}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Colors Section */}
          {analysis.colors && analysis.colors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Dominant Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {analysis.colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm">
                      {color.name} ({color.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags Section */}
          {analysis.tags && analysis.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAnalysisResult;
