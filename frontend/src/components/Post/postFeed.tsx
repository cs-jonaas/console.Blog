import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button 
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Post } from './postCard';
import PostCard from './postCard';

const BASE_URL = `${import.meta.env.VITE_API_URL}`

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch posts from your backend API
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        credentials: 'include',
      });
      
      if (response.status === 401) {
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
    navigate(`/edit/${postId}`);
  };

  // Handler for Delete - opens confirmation dialog
  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  // Handler for actual deletion after confirmation
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/posts/${postToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the post from the state on successful deletion
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete));
      } else if (response.status === 403) {
        alert('You are not authorized to delete this post.');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  // Handler for dialog cancel
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleLike = async (postId: string) => {
  try {
    console.log('=== LIKE DEBUG ===');
    const currentPost = posts.find(p => p._id === postId);
    console.log('Before click - isLiked:', currentPost?.isLiked, 'likes:', currentPost?.likes);

    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Like API response:', result); // Debug log
      
      // FIX: Use functional update to avoid stale closure
      setPosts(prevPosts => {
        console.log('setPosts called with prevPosts:', prevPosts.find(p => p._id === postId));
        
        const updatedPosts = prevPosts.map(post =>
         post._id === postId
            ? {
                ...post,
                isLiked: result.isLiked,
                likes: result.likes,
              }
            : post
        );
        
        // Log what we're actually setting
        const updatedPost = updatedPosts.find(p => p._id === postId);
        console.log('Setting state to - isLiked:', updatedPost?.isLiked, 'likes:', updatedPost?.likes);
        
        return updatedPosts;
      });
      
    } else {
      console.error('Failed to toggle like, status:', response.status);
      // Try to get error details
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Error response not JSON', e);
      }
    }
    console.log('=== LIKE DEBUG END ===');
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

  // Update the handleSave function in PostFeed component
const handleSave = async (postId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/${postId}/save`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      
      // Update the post's saved state
      setPosts(prevPosts => 
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, isSaved: result.isSaved }
            : post
        )
      );

      // Redirect to saved posts page
      navigate('/saved');
    } else {
      console.error('Failed to save post');
    }
  } catch (error) {
    console.error('Error saving post:', error);
  }
};

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    // Implement share functionality
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    // Implement comment functionality
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
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Latest Posts
        </Typography>
        
        {posts.map((post) => (
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
        ))}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Post
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostFeed;
