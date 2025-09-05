import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import { toggleSaveHandler, getSavedPostsHandler } from '../controllers/saveController';

const router = Router();


router.post('/posts/:id/save', requireAuth, toggleSaveHandler);  // Toggle save status for a post

router.get('/users/:userId/saved-posts', requireAuth, getSavedPostsHandler);  // Get user's saved posts

export default router;