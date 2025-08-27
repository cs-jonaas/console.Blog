import { Box, IconButton, Typography } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Bookmark,
  BookmarkBorder,
  Share
} from "@mui/icons-material";

interface PostMetaProps {
  post: {
    id: number;
    likes: number;
    comments: number;
    isLiked: boolean;
    isSaved: boolean;
  };
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  onShare: (postId: number) => void;
  onComment: (postId: number) => void;
}

const PostMeta = ({ post, onLike, onSave, onShare, onComment }: PostMetaProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Box>
        <IconButton aria-label="like" onClick={() => onLike(post.id)}>
          {post.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" component="span">
          {post.likes}
        </Typography>
        
        <IconButton aria-label="comment" onClick={() => onComment(post.id)} sx={{ ml: 1 }}>
          <Comment />
        </IconButton>
        <Typography variant="body2" component="span">
          {post.comments}
        </Typography>
      </Box>
      
      <Box>
        <IconButton aria-label="save" onClick={() => onSave(post.id)}>
          {post.isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
        <IconButton aria-label="share" onClick={() => onShare(post.id)}>
          <Share />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostMeta;