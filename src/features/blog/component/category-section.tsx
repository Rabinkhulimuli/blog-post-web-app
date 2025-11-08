import PostCard from "@/features/blog/component/post-card";
import type { Post } from "@/store/slices/post-slice";



interface CategorySectionProps {
  title: string;
  posts: Post[];
  categorySlug: string;
}

export default function CategorySection({ title, posts, categorySlug }: CategorySectionProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold" data-testid={`text-section-${categorySlug}`}>
            {title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} creatorId={post.creatorId??'dsvsd'} postType={Number(post.id)?"api":"user"} />
          ))}
        </div>
      </div>
    </section>
  );
}
