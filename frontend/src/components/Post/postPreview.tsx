import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'; // For tables, strikethrough.

interface PostPreviewProps {
  title: string;
  tags: string[];
  content: string;
  contentHtml?: string;
  coverImage?: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({ title, tags, content, coverImage }) => {
  const cleanContent = content.replace(/\\([\\`*_[\]{}()#+\-.!])/g, '$1');

  return (
    <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
      {/* Cover image */}
      {coverImage && (
        <Box sx={{ mb: 3 }}>
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
      <Typography 
        variant="h1" 
        component="h1" 
        sx={{ 
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 700,
          mb: 2,
          lineHeight: 1.2
        }}
        gutterBottom
      >
        {title || "Untitled Post"}
      </Typography>

      {/* Tags */}
      {tags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {tags.map((tag, index) => (
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
          <Box className="markdown-body" sx={{ 
            mt: 3,
            '& > *:first-of-type': {
              mt: 0
            }
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {cleanContent || "_Nothing to preview yet..._"}
            </ReactMarkdown>
          </Box>
      {/* )} */}
    </Box>
  );
};

export default PostPreview;

