import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Heart, HeartCrack } from "lucide-react";
import { Link } from "react-router";
import { useDispatch} from "react-redux";
import cosmetics from '../../dashboard/assets/cosmetic-hero-image.png';
import { useAuth } from "@/contexts/auth-context";
import { addReactionToApiPost, addReactionToUserPost } from "@/store/slices/post-slice";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author?: {
    name: string;
    avatar?: string;
  };
  readTime?: string;
  imageUrl: string;
  date?: string;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  postType: 'api' | 'user';
  userReactions?: { [userId: string]: 'likes' | 'dislikes' | null };
  creatorId:string
  
}

export default function PostCard({
  id,
  title,
  excerpt,
  category,
  author,
  readTime = "5 min read",
  imageUrl,
  date,
  reactions = { likes: 0, dislikes: 0 },
  postType,
  userReactions = {},
}: PostCardProps) {
  const dispatch = useDispatch();
  
  // Get current user ID from your auth state (adjust based on your auth setup)
  const {user}= useAuth()
  const userId = user?.id || 'anonymous'; // Fallback for non-logged in users
  
  const [localReactions, setLocalReactions] = useState(reactions);
  const [currentReaction, setCurrentReaction] = useState<'likes' | 'dislikes' | null>(
    userReactions[userId] || null
  );

  // Sync with props when they change
  useEffect(() => {
    setLocalReactions(reactions);
  }, [reactions]);

  useEffect(() => {
    setCurrentReaction(userReactions[userId] || null);
  }, [userReactions, userId]);

  const defaultAuthor = author || { name: "Alex", avatar: "/profile-image.webp" };
  const displayDate = date || new Date().toLocaleDateString();

  const handleReaction = (reactionType: 'likes' | 'dislikes', event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Calculate new reaction counts
    let newLikes = localReactions.likes;
    let newDislikes = localReactions.dislikes;
    let newCurrentReaction: 'likes' | 'dislikes' | null = reactionType;

    if (currentReaction === reactionType) {
      // User is removing their reaction
      if (reactionType === 'likes') newLikes--;
      if (reactionType === 'dislikes') newDislikes--;
      newCurrentReaction = null;
    } else {
      // User is changing reaction
      if (currentReaction === 'likes') newLikes--; // Remove previous like
      if (currentReaction === 'dislikes') newDislikes--; // Remove previous dislike
      
      // Add new reaction
      if (reactionType === 'likes') newLikes++;
      if (reactionType === 'dislikes') newDislikes++;
    }

    // Update local state immediately for instant UI feedback
    const newReactions = { likes: newLikes, dislikes: newDislikes };
    setLocalReactions(newReactions);
    setCurrentReaction(newCurrentReaction);

    // Update Redux store
    if (postType === 'api') {
      dispatch(addReactionToApiPost({ 
        postId: id, 
        reaction: reactionType,
        userId 
      }));
    } else {
      dispatch(addReactionToUserPost({ 
        postId: id, 
        reaction: reactionType,
        userId 
      }));
    }
  };

  return (
    <Link to={`/post/${id}`} data-testid={`link-post-${id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={imageUrl || cosmetics || "/profile-image.webp"}
            alt={title}
            className="w-full h-full object-cover"
            data-testid={`img-post-${id}`}
          />

          {/* Reactions top-left as interactive buttons */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
            {/* Like button */}
            <button
              onClick={(e) => handleReaction('likes', e)}
              className={`flex items-center gap-1 text-white px-2 py-1 rounded-lg text-sm font-medium shadow-md transition-all cursor-pointer active:scale-95 ${
                currentReaction === 'likes' 
                  ? 'bg-red-600 ring-2 ring-red-300 scale-105' 
                  : 'bg-red-500 hover:bg-red-600 hover:scale-105'
              }`}
              data-testid={`like-button-${id}`}
            >
              <Heart className={`h-4 w-4 ${currentReaction === 'likes' ? 'fill-white' : ''}`} />
              <span>{localReactions.likes}</span>
            </button>
            
            {/* Dislike button */}
            <button
              onClick={(e) => handleReaction('dislikes', e)}
              className={`flex items-center gap-1 text-white px-2 py-1 rounded-lg text-sm font-medium shadow-md transition-all cursor-pointer active:scale-95 ${
                currentReaction === 'dislikes' 
                  ? 'bg-gray-800 ring-2 ring-gray-400 scale-105' 
                  : 'bg-gray-700 hover:bg-gray-800 hover:scale-105'
              }`}
              data-testid={`dislike-button-${id}`}
            >
              <HeartCrack className={`h-4 w-4 ${currentReaction === 'dislikes' ? 'fill-white' : ''}`} />
              <span>{localReactions.dislikes}</span>
            </button>
          </div>
        </div>

        <CardHeader className="space-y-2">
          <span className="text-xs font-medium text-primary" data-testid={`text-category-${id}`}>
            {category}
          </span>
          <h3 className="font-serif text-xl font-semibold line-clamp-2 leading-tight" data-testid={`text-title-${id}`}>
            {title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-excerpt-${id}`}>
            {excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={defaultAuthor.avatar} alt={defaultAuthor.name} />
              <AvatarFallback>{defaultAuthor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium" data-testid={`text-author-${id}`}>{defaultAuthor.name}</span>
              <span className="text-xs text-muted-foreground" data-testid={`text-date-${id}`}>{displayDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span data-testid={`text-readtime-${id}`}>{readTime}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}