import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

interface PostImageUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export default function PostImageUpload({ imageUrl, setImageUrl }: PostImageUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Featured Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate">
          {imageUrl ? (
            <div className="space-y-4">
              <img src={imageUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              <Button variant="outline" size="sm" onClick={() => setImageUrl("")}>
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <Input
                placeholder="Or paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="max-w-md mx-auto"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
