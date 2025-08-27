import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  Snackbar
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

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle post creation logic here
      console.log('Creating post:', { title, content });
      
      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success'
      });
      
      // Reset form
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Post
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 3 }}
          />
          
          <Typography variant="h6" gutterBottom>
            Content
          </Typography>
          
          <Box sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 3
          }}>
            <MDXEditor
              markdown={content}
              onChange={setContent}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                quotePlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                codeMirrorPlugin({ 
                  codeBlockLanguages: { 
                    js: 'JavaScript', 
                    ts: 'TypeScript', 
                    css: 'CSS', 
                    txt: 'text',
                    html: 'HTML',
                    python: 'Python',
                    java: 'Java',
                    cpp: 'C++',
                    ruby: 'Ruby',
                    php: 'PHP'
                  } 
                }),
                thematicBreakPlugin(),
                tablePlugin(),
                imagePlugin({
                  imageUploadHandler: () => {
                    return Promise.resolve('https://picsum.photos/600/300');
                  },
                  imageAutocompleteSuggestions: [
                    'https://picsum.photos/600/300',
                    'https://picsum.photos/800/400'
                  ]
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
                diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' })
              ]}
              contentEditableClassName="prose max-w-none"
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostCreate;