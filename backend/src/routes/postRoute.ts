import { Router } from 'express';
import {
  createPostHandler,
  getPostsHandler,
  getPostHandler,
  updatePostHandler,
  deletePostHandler,
} from '../controllers/postController';
import requireAuth from '../middleware/requireAuth';

const router = Router();

// Apply requireAuth middleware to ALL post routes that modify data
// GET routes remain public
router.post('/', requireAuth, createPostHandler);
router.get('/', getPostsHandler);
router.get('/:id', getPostHandler);
router.put('/:id', requireAuth, updatePostHandler);
router.delete('/:id', requireAuth, deletePostHandler);

export default router;