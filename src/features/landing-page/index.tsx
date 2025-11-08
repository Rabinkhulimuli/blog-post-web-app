import { useAppDispatch, useAppSelector } from "@/store/hooks";
import HeroSection from "@/features/auth/components/hero-section";
import heroImage from "../dashboard/assets/fashion-beauty-lifestyle.png";
import CategorySections from "./components/categorySection";
import { useEffect } from "react";
import { fetchPosts } from "@/store/slices/post-slice";

export default function HomePage() {
   const dispatch = useAppDispatch();

  const { loading, error, apiPosts, userPosts } = useAppSelector(
    state => state.persistedReducer.posts
  );
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const allPosts = [...(userPosts || []), ...(apiPosts || [])];


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <HeroSection
            author="Sarah Mitchell"
            category="Beauty & Lifestyle"
            excerpt="Discover how to create a beauty routine that's not only good for your skin but also kind to the planet."
            imageUrl={heroImage}
            postId="hero-1"
            readTime="8 min read"
            title="The Ultimate Guide to Building a Sustainable Beauty Routine"
          />
        </div>

        <div className="container mx-auto px-4 py-4">
          {loading && <p className="text-center text-lg text-muted-foreground">Loading posts...</p>}
          {!loading&&error && <p className="text-center text-red-500 text-lg">{error}</p>}

          {!loading && !error && (
            <CategorySections posts={allPosts} limit={10} />
          )}
        </div>
      </main>
    </div>
  );
}
