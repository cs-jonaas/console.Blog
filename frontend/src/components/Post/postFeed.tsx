import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import PostCard from "./postCard";

// Mock data for posts (in a real app, this would come from an API)
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    excerpt: "Learn the basics of React and how to create your first component.",
    author: {
      name: "Jane Doe",
      avatar: "/static/images/avatar/1.jpg"
    },
    date: "2023-05-15",
    likes: 24,
    comments: 8,
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    excerpt: "Explore advanced design patterns in TypeScript for better code architecture.",
    author: {
      name: "John Smith",
      avatar: "/static/images/avatar/2.jpg"
    },
    date: "2023-05-10",
    likes: 42,
    comments: 12,
    isLiked: true,
    isSaved: true
  },
  {
    id: 3,
    title: "CSS-in-JS: Pros and Cons",
    excerpt: "A deep dive into the advantages and disadvantages of CSS-in-JS solutions.",
    author: {
      name: "Alex Johnson",
      avatar: "/static/images/avatar/3.jpg"
    },
    date: "2023-05-05",
    likes: 31,
    comments: 5,
    isLiked: false,
    isSaved: false
  }
];

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Simulate fetching posts from an API
  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    
    // const response = await fetch('/api/posts', {
    //   credentials: 'include', // <- This sends the JWT cookies automatically
    // });
    
    // if (response.status === 401) {
    //   // Token is invalid/expired - redirect to login
    //   navigate('/login');
    //   return;
    // }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // fetch  API here
    const newPosts = [...mockPosts].map(post => ({
      ...post,
      id: post.id + (pageNum - 1) * mockPosts.length
    }));
    
    // For demo purposes, we'll stop after 3 pages
    if (pageNum >= 3) {
      setHasMore(false);
    }
    
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // Handle scroll event for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
        loading ||
        !hasMore
      ) {
        return;
      }
      setPage(prevPage => prevPage + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleLike = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            } 
          : post
      )
    );
  };

  const handleSave = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved } 
          : post
      )
    );
  };

  const handleShare = (postId: number) => {
    // In a real app, this would open a share dialog
    console.log(`Sharing post ${postId}`);
    alert(`Sharing post ${postId}`);
  };

  const handleComment = (postId: number) => {
    // In a real app, this would focus the comment input or navigate to the post detail
    console.log(`Commenting on post ${postId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Latest Posts
      </Typography>
      
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onComment={handleComment}
        />
      ))}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!hasMore && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 4 }}>
          You've reached the end of the feed
        </Typography>
      )}
    </Container>
  );
};

export default PostFeed;