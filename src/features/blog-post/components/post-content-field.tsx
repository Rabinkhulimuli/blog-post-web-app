import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export default function PostContentFields() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<any>();
  const category = watch("category");

  return (
    <>
      <div className="space-y-2">
        <Input
          placeholder="Post title..."
          {...register("title")}
          className="text-3xl font-serif font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message?.toString()}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(val) => setValue("category", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cosmetics">Cosmetics</SelectItem>
              <SelectItem value="perfumes">Perfumes</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message?.toString()}</p>}
        </div>

        <div className="space-y-2">
          <Label>Excerpt</Label>
          <Input {...register("excerpt")} placeholder="Brief description..." />
          {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt.message?.toString()}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea {...register("content")} placeholder="Write your post content here..." className="min-h-[400px]" />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message?.toString()}</p>}
      </div>
    </>
  );
}
