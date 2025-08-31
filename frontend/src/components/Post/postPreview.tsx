import { Box, Typography, Chip } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface PostPreviewProps {
  title: string;
  tags: string[];
  content: string;
  coverImage?: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({ title, tags, content, coverImage }) => {
  return (
    <Box>
      {/* Cover image */}
      {coverImage && (
        <Box sx={{ mb: 2 }}>
          <img
            src={coverImage}
            alt="cover"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
      )}

      {/* Title */}
      <Typography variant="h3" component="h1" gutterBottom>
        {title || "Untitled Post"}
      </Typography>

      {/* Tags */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {tags.map((tag, i) => (
          <Chip key={i} label={`#${tag}`} variant="outlined" />
        ))}
      </Box>

      {/* Content */}
      <Box className="prose max-w-none">
        <ReactMarkdown>
          {content || "_Nothing to preview yet..._"}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default PostPreview;
