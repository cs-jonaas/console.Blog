import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/requireAuth';
import catchErrors from '../utils/catchErrors';
import { toggleSavePost, getUserSavedPosts } from '../services/saveService';
import { OK } from '../constants/http';
import { Types } from 'mongoose';

export const toggleSaveHandler = catchErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = new Types.ObjectId(req.userId!);
  const postId = req.params.id!;

  const result = await toggleSavePost(userId, postId);
  res.status(OK).json(result);
});

export const getSavedPostsHandler = catchErrors(async (req: AuthenticatedRequest, res: Response) => {

  const userId = new Types.ObjectId(req.params.userId!);
  const savedPosts = await getUserSavedPosts(userId);
  res.status(OK).json(savedPosts);
});