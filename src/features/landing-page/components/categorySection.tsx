import { useState } from "react";
import CategorySection from "@/features/blog/component/category-section";
import CustomPagination from "./pagination";

interface PaginatedCategorySectionProps {
  posts: any[];
  title?: string;
  categorySlug?: string;
  limit?: number;
}

export default function CategorySections({
  posts,
  title,
  categorySlug,
  limit = 10,
}: PaginatedCategorySectionProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(posts.length / limit);
  const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <CategorySection
        categorySlug={categorySlug || "All Blogs"}
        posts={paginatedPosts}
        title={title || "All Blogs"}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
