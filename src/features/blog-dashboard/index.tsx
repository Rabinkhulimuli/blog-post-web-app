import DashboardPostCard from "@/features/blog-dashboard/components/dashboard-post-card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePost, fetchPosts } from "@/store/slices/post-slice";
import { useEffect } from "react";
import { Link } from "react-router";
import { ROUTES } from "@/configs/routes";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { loading, userPosts } = useAppSelector(
    state => state.persistedReducer.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Posts</h1>
      {userPosts && userPosts.length > 0 && <Link to={ROUTES.DASHBOARD.CREATE_POST}>
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <PenSquare className="h-4 w-4" /> Write Post
          </Button>
        </Link>}
      </div>

      {loading && <p>Loading...</p>}

      {userPosts && userPosts.length > 0 ? (
        userPosts.map(post => (
          <DashboardPostCard
            key={post.id}
            {...post}
            onDelete={handleDelete}
            date={post.date || new Date().toISOString()}
            status={post.status || "draft" as "draft"}
          />
        ))
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          You don’t have any posts yet. <br />
          <Link to={ROUTES.DASHBOARD.CREATE_POST}>
            <Button variant="default" size="sm" className="mt-4">
              Create your first post
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
