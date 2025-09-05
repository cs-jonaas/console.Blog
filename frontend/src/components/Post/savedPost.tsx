// src/components/Post/savedPosts.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert,
  Box
} from "@mui/material";
import { useAuth } from '../../hooks/useAuth';
import type { Post } from './postCard';
import PostCard from './postCard';
import { useNavigate } from 'react-router-dom';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchSavedPosts = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/users/${user._id}/saved-posts`, {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        logout();
        navigate('/signin');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch saved posts: ${response.statusText}`);
      }

      const postsData: Post[] = await response.json();
      setSavedPosts(postsData);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user, logout, navigate]);

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  // Handler functions for post actions
  const handleEdit = (postId: string) => {
    navigate(`/edit/${postId}`);
  };

  const handleDeleteClick = (postId: string) => {
    // You can implement delete functionality if needed
    console.log('Delete post:', postId);
  };

  const handleLike = async (postId: string) => {
    // Implement like functionality
    console.log('Like post:', postId);
  };

  const handleSave = async (postId: string) => {
    // Implement unsave functionality
    try {
      const response = await fetch(`${BASE_URL}/api/posts/${postId}/save`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the post from saved posts
        setSavedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

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
        Saved Posts
      </Typography>
      
      {savedPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No saved posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Save posts you want to read later by clicking the bookmark icon
          </Typography>
        </Box>
      ) : (
        savedPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onLike={handleLike}
            onSave={handleSave}
            onShare={handleShare}
            onComment={handleComment}
          />
        ))
      )}
    </Container>
  );
};

export default SavedPosts;