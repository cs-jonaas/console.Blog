import { Card, CardContent, CardActions, CardHeader, Avatar, Typography, Box, Button } from "@mui/material";
import PostMeta from "./postMeta";
import { useAuth } from "../../hooks/useAuth";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from "react-router-dom";

interface Author {
  _id: string;
  username: string;
  email: string;
}

export interface Post {
  _id: string;
  user: string;
  title: string;
  content: string;
  contentHtml: string;
  author: Author;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  date: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  coverImage?: string;
}

interface PostCardProps {
  post: Post;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  onComment: (postId: string) => void;
  isLiking?: boolean;
}

const MAX_PREVIEW_LINES = 5;

const PostCard = ({ post, onEdit, onDelete, onLike, onSave, onShare, onComment }: PostCardProps) => {
  // Get the current user from your authentication context
   const navigate = useNavigate();
   const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post data</div>;
  }

  // This will help identify which property is causing the null access error
  if (!post) {
    console.error('Post is null or undefined');
    return <div>No post data</div>;
  }
  
  if (!post.author) {
    console.log('Author object:', post.author);
    if (post.author && typeof post.author === 'object') {
      console.log('Author keys:', Object.keys(post.author));
      console.log('Author username:', (post.author as Author).username);
      console.log('Author email:', (post.author as Author).email);
      console.log('Author _id:', (post.author as Author)._id);
    }
    
    console.error('Author is null or undefined in post:', post._id);
    return <div>Author information not available</div>;
    
  }
  
  // Safe access to author data with fallbacks
  const author = post.author || {};
  const username = author.username || author.email?.split("@")[0] || 'Unknown User';
  const email = author.email || '';
  const authorId = author._id || '';
  
  // Get first letter for avatar (from email or username)
  const avatarLetter = email 
    ? email.charAt(0).toUpperCase() 
    : username.charAt(0).toUpperCase();


  const createPreview = (content: string) => {
    const lines = content.split('\n');
    if (lines.length <= MAX_PREVIEW_LINES) {
      return content;
    }
    return lines.slice(0, MAX_PREVIEW_LINES).join('\n') + '...';
  };

  const contentPreview = createPreview(post.content);
  // Check if the current user is the author of this post
  const isAuthor = user?._id === authorId;

  //Click into card to read full post
  const handleCardClick = () => {
    navigate(`/post/${post._id}`);
  };

  // Handle action button clicks
  const handleActionClick = (e: React.MouseEvent, callback: (postId: string) => void) => {
    e.stopPropagation();
    callback(post._id);
  };

  const handleLikeToggle = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    onLike(postId);
  };

  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 2, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
        }
      }}
      onClick={handleCardClick}
    >
      <CardHeader
        avatar={
          <Avatar>
            {avatarLetter}
          </Avatar>
        }
        title={username} 
        subheader={new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        />
        {post.coverImage && (
          <Box
            component="img"
            src={post.coverImage}
            alt={post.title}
            sx={{ 
              width: "100%", 
              maxHeight: 300, 
              objectFit: "cover",
              borderRadius: 2, 
              mb: 2 
            }}
          />
        )}

      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
          {post.title}
        </Typography>

        <Box 
          sx={{ 
            color: "text.secondary", 
            typography: "body1",
            cursor: 'pointer',
            maxHeight: 120,
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2em',
              background: 'linear-gradient(transparent, white)',
              pointerEvents: 'none',
            }          
          }}
        >
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contentPreview}
          </ReactMarkdown>
        </Box>
       {/* Display tags if they exist */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
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
            {post.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{post.tags.length - 3} more
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* PostMeta for interactions (likes, comments, etc.) */}
        <PostMeta 
            post={post}
            onLike={handleLikeToggle}
            onSave={(e, postId) => { e.stopPropagation(); onSave(postId); }}
            onShare={(e, postId) => { e.stopPropagation(); onShare(postId); }}
            onComment={(e, postId) => { e.stopPropagation(); onComment(postId); }}
        />
        {/* Conditionally Render Edit/Delete Buttons for the author */}
        {isAuthor && (
          <Box sx={{ mr: 2 }}>
            <Button 
              size="small" 
              variant="outlined"
              onClick={(e) => handleActionClick(e, onEdit)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button 
              size="small"
              variant="outlined"
              onClick={(e) => handleActionClick(e, onDelete)}
            >
              Delete
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default PostCard;
