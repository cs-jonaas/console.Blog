import { useState } from 'react';
import { useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Container,
  Alert,
  Snackbar,
  IconButton,
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
  diffSourcePlugin,
  UndoRedo,
  Separator
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import CloseIcon from '@mui/icons-material/Close';

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

    // Example: simulate tag entry by comma-separated text
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = raw.split(",").map(tag => tag.trim()).filter(Boolean);
    setTags(parsed.slice(0, 4)); // max 4 tags
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
    // Extract inline images (base64) from markdown
    const inlineImages: { id: string; data: string }[] = [];
    const processedContent = content.replace(
      /!\[.*?\]\((data:image\/.*?;base64,.*?)\)/g,
      (match, p1, offset) => {
        const id = `image-${offset}`;
        inlineImages.push({ id, data: p1 });
        return match.replace(p1, id); // replace base64 with "image-id"
      }
    );

    const payload = {
      title,
      tags,
      content: processedContent,
      coverImage,
      inlineImages
    };

    // Call backend API
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to create post");

    const data = await res.json();
      
      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success'
      });
      
      router(`/posts/${data.post._id}`);

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

  // const handleCloseSnackbar = () => {
  //   setSnackbar({ ...snackbar, open: false });
  // };

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
            coverImage={coverImage ? undefined : coverImage}
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
            <TextField
              placeholder="Add up to 4 tags (comma separated)..."
              variant="standard"
              onChange={handleTagChange}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "1rem", color: "text.secondary" }
              }}
              sx={{ mb: 2 }}
            />

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
                  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" })
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
