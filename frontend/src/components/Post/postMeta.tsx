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
// interface PostMetaProps {
//   post: Post;
//   onLike: (postId: string) => void;
//   onSave: (postId: string) => void;
//   onShare: (postId: string) => void;
//   onComment: (postId: string) => void;
// }
export interface PostMetaProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  onComment: (postId: string) => void;


}

const PostMeta = ({ post, onLike, onSave, onShare, onComment }: PostMetaProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Box>
        <IconButton aria-label="like" onClick={() => onLike(post._id)}>
          {post.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" component="span">
          {post.likes}
        </Typography>
        
        <IconButton aria-label="comment" onClick={() => onComment(post._id)} sx={{ ml: 1 }}>
          <Comment />
        </IconButton>
        <Typography variant="body2" component="span">
          {post.comments}
        </Typography>
      </Box>
      
      <Box>
        <IconButton aria-label="save" onClick={() => onSave(post._id)}>
          {post.isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
        <IconButton aria-label="share" onClick={() => onShare(post._id)}>
          <Share />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostMeta;