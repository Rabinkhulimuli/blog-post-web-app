import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar } from "lucide-react";
import { useParams } from "react-router";
import PostNotFound from "./component/post-not-found";

export default function PostDetailPage() {
  const { id } = useParams(); // e.g., /posts/[postId]
  const userPosts = useAppSelector(state => state.persistedReducer.posts.userPosts);
  const [post, setPost] = useState(userPosts.find(p => p.id === id));

  useEffect(() => {
    setPost(userPosts.find(p => p.id === id));
  }, [id, userPosts]);

  if (!post) return <div><PostNotFound/></div>

  const defaultAuthor = post.author|| { name: "Alex", avatar: "/profile-image.webp", bio: "" };
  const displayReadTime = post.readTime||"5 min read";
  const displayImageUrl = post.imageUrl|| "/default-post-image.jpg";
  const displayDate = post.date|| new Date().toLocaleDateString();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <article>
          <div className="w-full h-[500px] relative overflow-hidden">
            <img
              src={displayImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-background/95 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-xl">
                <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                  {post.category || "General"}
                </span>

                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-4 pb-8 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={defaultAuthor.avatar} alt={defaultAuthor.name} />
                    <AvatarFallback>{defaultAuthor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{defaultAuthor.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{displayDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{displayReadTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mt-8 dark:prose-invert text-justify">
                  {post.content?.split("\n").map((paragraph: string, index: number) => {
                    if (paragraph.trim().startsWith("##")) {
                      return (
                        <h2 key={index} className="font-serif text-2xl font-bold mt-8 mb-4">
                          {paragraph.replace("##", "").trim()}
                        </h2>
                      );
                    } else if (paragraph.trim().startsWith("###")) {
                      return (
                        <h3 key={index} className="font-serif text-xl font-semibold mt-6 mb-3">
                          {paragraph.replace("###", "").trim()}
                        </h3>
                      );
                    } else if (paragraph.trim()) {
                      return (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph.trim()}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={defaultAuthor.avatar} alt={defaultAuthor.name} />
                      <AvatarFallback>{defaultAuthor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg mb-1">About {defaultAuthor.name}</p>
                      <p className="text-muted-foreground">{defaultAuthor.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
