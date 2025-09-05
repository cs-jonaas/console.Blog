// controllers/postController.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/requireAuth';
import catchErrors from '../utils/catchErrors';
import { createPostSchema, updatePostSchema, CreatePostRequest, UpdatePostRequest } from '../controllers/postSchema';
import { createPost, getPosts, getPostById, updatePost, deletePost, togglePostLike } from '../services/postServices';
import { CREATED, OK } from '../constants/http';
import { Types } from 'mongoose';

// Handler to create a new post
export const createPostHandler = catchErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
  // Validate request body
  const validatedData = createPostSchema.parse(req.body);

  // Get userId from authentication middleware
  const userId = req.userId!; // The ! asserts it exists (middleware ensures this)
  const authorId = new Types.ObjectId(userId);
  // Call service to create post

  const postData = {
    title: validatedData.title,
    content: validatedData.content,
    author: authorId,
    ...(validatedData.coverImage !== undefined && { coverImage: validatedData.coverImage }),
    ...(validatedData.tags !== undefined && { tags: validatedData.tags }),
    ...(validatedData.status !== undefined && { status: validatedData.status }),
  };

  const newPost = await createPost(postData);

  // Return success response with the created post
  res.status(CREATED).json(newPost);
});

// Handler to get all posts
export const getPostsHandler = catchErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Call service to get all posts
  const userId = req.userId ? new Types.ObjectId(req.userId) : undefined;
  const posts = await getPosts(userId);
  // const posts = await getPosts();
  
  // 2. Return posts
  res.status(OK).json(posts);
});

// Handler to get a single post by ID
export const getPostHandler = catchErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Get post ID from URL parameters
  const postId = req.params.id!;
  const userId = req.userId ? new Types.ObjectId(req.userId) : undefined;

  // 2. Call service to find post
  const post = await getPostById(postId, userId);

  // 3. Return post (service returns null if not found, which gets handled by error handler)
  res.status(OK).json(post);
});

// Handler to update a post
export const updatePostHandler = catchErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Validate request body
  const validatedData = updatePostSchema.parse(req.body);

  // 2. Get IDs from request
  const userId = req.userId!;
  const postId = req.params.id!;

  // 3. Remove undefined properties to satisfy exactOptionalPropertyTypes
  const filteredData = Object.fromEntries(
    Object.entries(validatedData).filter(([_, v]) => v !== undefined)
  );

  // 4. Call service to update post (service handles ownership check)
  const updatedPost = await updatePost(userId, postId, filteredData);

  // 5. Return updated post
  res.status(OK).json(updatedPost);
});

// Handler to delete a post
export const deletePostHandler = catchErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Get IDs from request
  const userId = req.userId!;
  const postId = req.params.id!;

  // 2. Call service to delete post (service handles ownership check)
  await deletePost(userId, postId);

  // 3. Return success response with no content
  res.status(OK).json({ message: 'Post deleted successfully' });
});

export const toggleLikeHandler = catchErrors(async (req: AuthenticatedRequest, res: Response) => {
  
  // 1. Get ID from request
  const userId = new Types.ObjectId(req.userId!);
  const postId = req.params.id!;

  const result = await togglePostLike(userId, postId);
  res.status(OK).json(result);
});