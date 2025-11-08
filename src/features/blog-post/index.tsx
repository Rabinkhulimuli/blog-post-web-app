import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { Save } from "lucide-react";
import PostImageUpload from "./components/image-uploader";
import PostContentFields from "./components/post-content-field";

interface PostFormProps {
  initialData?: any;
  onSave: (data: any) => void;
}

const postSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  excerpt: z.string().min(10),
  category: z.enum(["cosmetics", "perfumes", "lifestyle", "fashion"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export default function PostForm({ initialData, onSave }: PostFormProps) {
  const methods = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      excerpt: "",
      category: "cosmetics",
      imageUrl: "",
    },
  });

  const { watch, handleSubmit, setValue } = methods;

  const submitHandler = (data: any) => {
    onSave(data);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold">{initialData ? "Edit Post" : "Create New Post"}</h1>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {initialData ? "Update" : "Publish"}
          </Button>
        </div>

        <PostImageUpload imageUrl={watch("imageUrl")} setImageUrl={(url) => setValue("imageUrl", url)} />
        <PostContentFields />
      </form>
    </FormProvider>
  );
}
