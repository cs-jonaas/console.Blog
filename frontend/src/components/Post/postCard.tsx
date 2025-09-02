import { Card, CardContent, CardActions, CardHeader, Avatar, Typography, Box, Button } from "@mui/material";
import PostMeta from "./postMeta";
import { useAuth } from "../../hooks/useAuth";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
}


const PostCard = ({ post, onEdit, onDelete, onLike, onSave, onShare, onComment }: PostCardProps) => {
  // Get the current user from your authentication context
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


  // Check if the current user is the author of this post
  const isAuthor = user?._id === authorId;

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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
        <Typography variant="h5" component="h2" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ color: "text.secondary", typography: "body1" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </Box>
        {/* <Typography variant="body1" color="text.secondary">
          {post.content}
        </Typography> */}
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
          </Box>
        )}
      </CardContent>
      <CardActions>
        {/* PostMeta for interactions (likes, comments, etc.) */}
        <PostMeta 
            post={post}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
            onComment={onComment}
        />
        {/* Conditionally Render Edit/Delete Buttons for the author */}
        {isAuthor && (
          <Box sx={{ mr: 2 }}>
            <Button 
              size="small" 
              onClick={() => onEdit(post._id)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button 
              size="small" 
              color="error" 
              onClick={() => onDelete(post._id)}
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
