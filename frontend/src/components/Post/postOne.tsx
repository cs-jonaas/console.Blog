import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Box, 
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import { useAuth } from '../../hooks/useAuth';
import PostMeta from './postMeta';
import type { Post } from './postCard';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const PostOne = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/posts/${postId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const postData: Post = await response.json();
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

const handleLike = async (e: React.MouseEvent, postId: string) => {
  e.preventDefault();
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Like API response:', result); // Debug log
      
      // Update the local post state with the API response
      setPost(prevPost => 
        prevPost ? { 
          ...prevPost, 
          isLiked: result.isLiked, 
          likes: result.likes       
        } : null
      );
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

// Update the handleSave function in PostOne component
const handleSave = async (e: React.MouseEvent, postId: string) => {
  e.preventDefault();
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/save`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      
      // Update the post's saved state
      setPost(prevPost => 
        prevPost ? { ...prevPost, isSaved: result.isSaved } : null
      );

      // Redirect to saved posts page
      navigate('/saved');
    }
  } catch (error) {
    console.error('Error saving post:', error);
  }
};

const handleShare = async (e: React.MouseEvent, postId: string) => {
  e.preventDefault();
  console.log('Share post:', postId);
  // Implement share functionality
};

const handleComment = async (e: React.MouseEvent, postId: string) => {
  e.preventDefault();
  console.log('Comment on post:', postId);
  // Implement comment functionality
};

  const handleEdit = (postId: string) => {
    navigate(`/edit/${postId}`);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // Confirm and execute deletion
  const handleDeleteConfirm = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(`${BASE_URL}/posts/${post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/home');
      } else if (response.status === 403) {
        alert('You are not authorized to delete this post.');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Cancel deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/home')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Post not found</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/home')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const isAuthor = user?._id === post.author._id;
  const avatarLetter = post.author.email 
    ? post.author.email.charAt(0).toUpperCase() 
    : post.author.username.charAt(0).toUpperCase();

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <IconButton 
          onClick={() => navigate('/home')}
          sx={{ mb: 3 }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ mr: 2 }}>
            {avatarLetter}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {post.author.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
          
          {isAuthor && (
            <Box sx={{ ml: 'auto' }}>
              <Button 
                size="small"
                variant="outlined"
                onClick={() => handleEdit(post._id)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button 
                size="small" 
                variant="outlined"
                onClick={handleDeleteClick} // Changed to open dialog
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>

        {post.coverImage && (
          <Box
            component="img"
            src={post.coverImage}
            alt={post.title}
            sx={{ 
              width: "100%", 
              maxHeight: 400, 
              objectFit: "cover",
              borderRadius: 2, 
              mb: 3 
            }}
          />
        )}

        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
          {post.title}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <div 
            className="markdown-body" 
            dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
          />
          {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown> */}
        </Box>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {post.tags.map((tag, index) => (
              <Typography 
                key={index} 
                variant="caption" 
                sx={{ 
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1, 
                  mr: 1 
                }}
              >
                #{tag}
              </Typography>
            ))}
          </Box>
        )}

        <PostMeta 
          post={post}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onComment={handleComment}
        />
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

export default PostOne;
