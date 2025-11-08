import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addPost, fetchPosts } from '@/store/slices/post-slice';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import PostForm from '@/features/blog-post';

export default function CreatePostPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleSave = (data: any) => {
    const newPost = {
      id: Date.now().toString(),
      title: data.title || 'Untitled Post',
      content: data.content || '',
      excerpt: data.excerpt || (data.content ? data.content.slice(0, 100) + '...' : ''),
      category: data.category || 'General',
      imageUrl: data.imageUrl || '/default-post-image.jpg',
      date: new Date().toLocaleDateString(),
      status: 'published', // optional
      userId: user?.id ?? 'user123',
      author: data.author || {
        name: user?.name ?? 'Alex',
        avatar: '/profile-image.webp',
        bio: `hey its ${user?.name ?? 'me'}.This is my email ${user?.email ?? 'alex@gmail.com'}`,
      },
      readTime: data.readTime || '5 min read',
      reactions: {
        dislikes: 0,
        likes: 0,
      },
      creatorId:user?.id??"anonymous"
    };

    dispatch(addPost(newPost));
    toast.success('Post created successfully!');
  };

  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <PostForm onSave={handleSave} />
    </div>
  );
}
