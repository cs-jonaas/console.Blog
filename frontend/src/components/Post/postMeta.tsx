import { Box, IconButton, Typography } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Bookmark,
  BookmarkBorder,
  Share
} from "@mui/icons-material";

interface Author {
  _id: string;
  email: string;
}

interface Post {
  _id: string;
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

export interface PostMetaProps {
  post: Post;
  onLike: (e: React.MouseEvent, postId: string) => void;
  onSave: (e: React.MouseEvent, postId: string) => void;
  onShare: (e: React.MouseEvent, postId: string) => void;
  onComment: (e: React.MouseEvent, postId: string) => void;


}

const PostMeta = ({ post, onLike, onSave, onShare, onComment }: PostMetaProps) => {
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Box>
        <IconButton 
          aria-label="like" 
          onClick={(e) => {
            console.log('Like button clicked - post:', post._id, 'time:', Date.now()); // check
            e.preventDefault();
            e.stopPropagation();
            onLike(e, post._id);
          }}
        >
          {post.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>

        <Typography variant="body2" component="span">
          {post.likes}
        </Typography>
        
        <IconButton 
          aria-label="comment" 
          onClick={(e) => {
              e.stopPropagation();
              onComment(e, post._id);
          }} 
          sx={{ ml: 1 }}
        >
          <Comment />
        </IconButton>
        <Typography variant="body2" component="span">
          {post.comments}
        </Typography>
      </Box>
      
      <Box>
        <IconButton 
          aria-label="save" 
          onClick={(e) => {
            e.stopPropagation();
            onSave(e, post._id);
          }}
        >
          {post.isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
        <IconButton aria-label="share" onClick={(e) => onShare(e, post._id)}>
          <Share />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostMeta;