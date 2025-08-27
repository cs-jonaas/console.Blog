import { Card, CardContent, CardActions, CardHeader, Avatar, Typography } from "@mui/material";
import PostMeta from "./postMeta";

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  onShare: (postId: number) => void;
  onComment: (postId: number) => void;
}

const PostCard = ({ post, onLike, onSave, onShare, onComment }: PostCardProps) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <CardHeader
        avatar={
          <Avatar src={post.author.avatar} alt={post.author.name}>
            {post.author.name.charAt(0)}
          </Avatar>
        }
        title={post.author.name}
        subheader={new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      />
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {post.excerpt}
        </Typography>
      </CardContent>
      <CardActions>
        <PostMeta 
          post={post} 
          onLike={onLike} 
          onSave={onSave} 
          onShare={onShare} 
          onComment={onComment} 
        />
      </CardActions>
    </Card>
  );
};

export default PostCard;