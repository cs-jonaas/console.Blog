import { useState } from 'react';
import { useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  TextField,
  Container,
  Alert,
  Snackbar,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertTable,
  tablePlugin,
  imagePlugin,
  InsertImage,
  linkDialogPlugin,
  UndoRedo,
  Separator,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';


import PostPreview from './postPreview';
import { useNavigate } from 'react-router-dom';

const PostCreate = () => {
  const router = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Handle cover image selection 
const coverInputRef = useRef<HTMLInputElement | null>(null);
  const handleAddCoverImage = () => {
    coverInputRef.current?.click();
  };

  // const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const url = URL.createObjectURL(e.target.files[0]);
  //     setCoverImage(url);
  //   }
  // };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string); // base64 string
      };
      reader.readAsDataURL(file);
    }
    };

  const handleRemoveCoverImage = () => {
    setCoverImage(undefined);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
  const trimmed = newTag.trim();
  if (trimmed && !tags.includes(trimmed)) {
    setTags([...tags, trimmed]);
    setNewTag('');
  }
};

const handleRemoveTag = (tagToRemove: string) => {
  setTags(tags.filter(tag => tag !== tagToRemove));
};

const handleTagKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleAddTag();
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in both title and content',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Cover image being sent:', coverImage ? 'YES' : 'NO');
      console.log('Cover image length:', coverImage?.length);
      console.log('Cover image preview:', coverImage?.substring(0, 50) + '...');
    // Extract inline images (base64) from markdown
    const inlineImages: { id: string; data: string }[] = [];
    
    // Step 1: Replace inline base64 images with placeholders
    let processedContent = content.replace(
      /!\[.*?\]\((data:image\/.*?;base64,.*?)\)/g,
      (match, p1, offset) => {
        const id = `image-${offset}`;
        inlineImages.push({ id, data: p1 });
        return match.replace(p1, id); // replace base64 with "image-id"
      }
    );

    // Step 2: Unescape Markdown characters
    processedContent = processedContent.replace(/\\([\\`*_[\]{}()#+\-.!])/g, '$1');

     // Prepare payload - ensure coverImage is properly formatted
    const payload = {
      title,
      tags,
      content: processedContent,
      ...(coverImage && { coverImage }),
      inlineImages
    };

    console.log("Processed content:", processedContent);
    console.log("Sending content:", content);

    // Call backend API
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to create post");

      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success'
      });
      
      router(`/home`);

      // Reset form after creating
      setTitle('');
      setContent('');
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to create post. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton onClick={() => router("/home")}>
          <CloseIcon /> 
        </IconButton>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 4
        }}
      >
        {/* Cover image input */}
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          onChange={handleCoverChange}
          style={{ display: "none" }}
        />

        {/* Cover image preview */}
        {coverImage && (
          <Box sx={{ position: "relative", mb: 2 }}>
            <img
              src={coverImage}
              alt="Cover"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveCoverImage}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Top row: Cover image + Edit/Preview toggle */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button variant="outlined" size="small" onClick={handleAddCoverImage}>
            {coverImage ? "Change cover image" : "Add a cover image"}
          </Button>
          <Box>
            <Button
              variant={!previewMode ? "contained" : "outlined"}
              size="small"
              onClick={() => setPreviewMode(false)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant={previewMode ? "contained" : "outlined"}
              size="small"
              onClick={() => setPreviewMode(true)}
            >
              Preview
            </Button>
          </Box>
        </Box>

        {previewMode ? (
          <PostPreview
            title={title}
            tags={tags}
            content={content}
            contentHtml={undefined} // You can implement HTML conversion if needed
            coverImage={coverImage}
          />
        ) : (
          <>
            {/* Title */}
            <TextField
              placeholder="New post title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "2rem", fontWeight: 700 }
              }}
            />

            {/* Tags input */}
            <Box sx={{ mt: 2, mb: 2 }}>
  <Typography variant="h6" gutterBottom>
    Tags
  </Typography>
  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
    {tags.map((tag, index) => (
      <Chip
        key={index}
        label={`#${tag}`}
        onDelete={() => handleRemoveTag(tag)}
        color="primary"
        variant="outlined"
      />
    ))}
  </Box>
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    <TextField
      label="Add tag"
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      onKeyPress={handleTagKeyPress}
      size="small"
      variant="outlined"
      helperText="Press Enter or click + to add tag"
    />
    <IconButton 
      onClick={handleAddTag} 
      color="primary"
      disabled={!newTag.trim()}
    >
      <AddIcon />
    </IconButton>
  </Box>
</Box>


            {/* Content Editor */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                p: 2,
                minHeight: "200px"
              }}
            >
              <MDXEditor
                markdown={content}
                onChange={setContent}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  linkPlugin(),
                  linkDialogPlugin(),
                  quotePlugin(),
                  codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                  codeMirrorPlugin({
                    codeBlockLanguages: {
                      js: "JavaScript",
                      ts: "TypeScript",
                      css: "CSS",
                      txt: "text",
                      html: "HTML",
                      python: "Python",
                      java: "Java",
                      cpp: "C++",
                      ruby: "Ruby",
                      php: "PHP"
                    }
                  }),
                  thematicBreakPlugin(),
                  tablePlugin(),
                  imagePlugin({
                    imageUploadHandler: async (file: File) => {
                      // Convert file → base64
                      const reader = new FileReader();
                      return new Promise<string>((resolve) => {
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          resolve(base64); // This gets inserted into markdown
                        };
                        reader.readAsDataURL(file);
                      });
                    },
                  }),
                  markdownShortcutPlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <ListsToggle />
                        <Separator />
                        <BlockTypeSelect />
                        <Separator />
                        <CreateLink />
                        <InsertImage />
                        <InsertCodeBlock />
                        <InsertThematicBreak />
                        <InsertTable />
                      </>
                    )
                  }),
                ]}
                contentEditableClassName="prose max-w-none"
              />
            </Box>
          </>
        )}

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
          <Button variant="outlined">Save draft</Button>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>

  );
};

export default PostCreate;
