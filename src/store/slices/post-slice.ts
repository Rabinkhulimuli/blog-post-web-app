import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://dummyjson.com/posts';

// ---------------- Post Type ----------------
export interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  userId: string;
  author: Author;
  readTime: string;
  date: string;
  status?: string;
  reactions: {
    dislikes: number;
    likes: number;
  };
  userReactions?: {
    [userId: string]: 'likes' | 'dislikes' | null;
  };
  creatorId?: string 
}

// State Type 
interface PostsState {
  apiPosts: Post[];
  userPosts: Post[];
  loading: boolean;
  error: string | null;
  selectedPost?: Post;
}

// Initial State
const initialState: PostsState = {
  apiPosts: [],
  userPosts: [],
  loading: false,
  error: null,
  selectedPost: undefined,
};

//Fetch API posts 
export const fetchPosts = createAsyncThunk<Post[]>(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      console.log(res.data);
      return res.data.posts;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch posts');
    }
  }
);

//  Get single post detail
export const fetchPostById = createAsyncThunk<Post, string>(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${postId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch post details');
    }
  }
);

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      const { creatorId, ...postData } = action.payload;
      
      const newPost: Post = {
        ...postData,
        reactions: postData.reactions || { likes: 0, dislikes: 0 },
        userReactions: {} 
      };
      
      state.userPosts.push(newPost);
    },

    // Update user post
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.userPosts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.userPosts[index] = action.payload;
    },

    // Delete user post
    deletePost: (state, action: PayloadAction<string>) => {
      state.userPosts = state.userPosts.filter(p => p.id !== action.payload);
    },

    setSelectedPost: (state, action: PayloadAction<Post | undefined>) => {
      state.selectedPost = action.payload;
    },

    addReactionToApiPost: (state, action: PayloadAction<{ 
      postId: string; 
      reaction: 'likes' | 'dislikes';
      userId: string;
    }>) => {
      const { postId, reaction, userId } = action.payload;
      const post = state.apiPosts.find(p => p.id === postId);
      
      if (post) {
        if (!post.reactions) {
          post.reactions = { likes: 0, dislikes: 0 };
        }
        if (!post.userReactions) {
          post.userReactions = {};
        }
        
        const currentUserReaction = post.userReactions[userId];
        
        if (currentUserReaction === reaction) {
          post.reactions[reaction] = Math.max(0, post.reactions[reaction] - 1);
          post.userReactions[userId] = null;
        } 
        else {
          if (currentUserReaction) {
            post.reactions[currentUserReaction] = Math.max(0, post.reactions[currentUserReaction] - 1);
          }
          // Add new reaction
          post.reactions[reaction] += 1;
          post.userReactions[userId] = reaction;
        }
      }
    },

    addReactionToUserPost: (state, action: PayloadAction<{ 
      postId: string; 
      reaction: 'likes' | 'dislikes';
      userId: string;
    }>) => {
      const { postId, reaction, userId } = action.payload;
      const post = state.userPosts.find(p => p.id === postId);
      
      if (post) {
        if (!post.reactions) {
          post.reactions = { likes: 0, dislikes: 0 };
        }
        if (!post.userReactions) {
          post.userReactions = {};
        }
        
        const currentUserReaction = post.userReactions[userId];
        
        if (currentUserReaction === reaction) {
          post.reactions[reaction] = Math.max(0, post.reactions[reaction] - 1);
          post.userReactions[userId] = null;
        } 
        else {
          if (currentUserReaction) {
            post.reactions[currentUserReaction] = Math.max(0, post.reactions[currentUserReaction] - 1);
          }
          post.reactions[reaction] += 1;
          post.userReactions[userId] = reaction;
        }
      }
    },

    addReactionToSelectedPost: (state, action: PayloadAction<{ 
      reaction: 'likes' | 'dislikes';
      userId: string;
    }>) => {
      const { reaction, userId } = action.payload;
      if (state.selectedPost) {
        if (!state.selectedPost.reactions) {
          state.selectedPost.reactions = { likes: 0, dislikes: 0 };
        }
        if (!state.selectedPost.userReactions) {
          state.selectedPost.userReactions = {};
        }
        
        const currentUserReaction = state.selectedPost.userReactions[userId];
        
        if (currentUserReaction === reaction) {
          state.selectedPost.reactions[reaction] = Math.max(0, state.selectedPost.reactions[reaction] - 1);
          state.selectedPost.userReactions[userId] = null;
        } 
        else {
          if (currentUserReaction) {
            state.selectedPost.reactions[currentUserReaction] = Math.max(0, state.selectedPost.reactions[currentUserReaction] - 1);
          }
          state.selectedPost.reactions[reaction] += 1;
          state.selectedPost.userReactions[userId] = reaction;
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.apiPosts = action.payload.map(post => ({
          ...post,
          reactions: post.reactions || { likes: 0, dislikes: 0 },
          userReactions: post.userReactions || {}
        }));
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPostById.pending, state => {
        state.loading = true;
        state.error = null;
        state.selectedPost = undefined;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = {
          ...action.payload,
          reactions: action.payload.reactions || { likes: 0, dislikes: 0 },
          userReactions: action.payload.userReactions || {}
        };
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exports 
export const { 
  addPost, 
  updatePost, 
  deletePost, 
  setSelectedPost,
  addReactionToApiPost,
  addReactionToUserPost,
  addReactionToSelectedPost
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;