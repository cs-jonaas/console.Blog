import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Post } from './postCard';
import PostCard from './postCard';

const BASE_URL = `${import.meta.env.VITE_API_URL}`

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth(); // Get auth status
  const navigate = useNavigate();

  // Fetch posts from your backend API
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        credentials: 'include', // <- This sends the JWT cookies automatically
      });
      
      if (response.status === 401) {
        // Token is invalid/expired - trigger logout
        logout();
        navigate('/signin');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const postsData: Post[] = await response.json();
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handler for Edit
  const handleEdit = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };

  // Handler for Delete
  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // Send auth cookie
      });

      if (response.ok) {
        // Remove the post from the state on successful deletion
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      } else if (response.status === 403) {
        alert('You are not authorized to delete this post.');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleLike = (postId: string) => console.log('Like post:', postId);
  const handleSave = (postId: string) => console.log('Save post:', postId);
  const handleShare = (postId: string) => console.log('Share post:', postId);
  const handleComment = (postId: string) => console.log('Comment on post:', postId);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Latest Posts
      </Typography>
      
      {posts.map((post) => (
        <PostCard
          key={post._id} // Use the MongoDB _id
          post={post}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onComment={handleComment}
        />
      ))}
    </Container>
  );
};

export default PostFeed;
