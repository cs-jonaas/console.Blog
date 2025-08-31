
import { Types } from 'mongoose';
import PostModel, { PostDocument, CreatePostInput } from '../models/postModel';
import appAssert from '../utils/appAssert';
import { NOT_FOUND, FORBIDDEN } from '../constants/http';

// Create a new post
export const createPost = async (data: CreatePostInput): Promise<PostDocument> => {
  const post = await PostModel.create(data);
  return post;
};

// Get all posts (with optional filtering later, e.g., by status, author)
export const getPosts = async (): Promise<PostDocument[]> => {
  const posts = await PostModel.find()
    .populate('author', 'email') // Populate the author's email
    .sort({ createdAt: -1 }); // Newest first
  return posts;
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<PostDocument | null> => {
  // Check if the ID is a valid MongoDB ObjectId to avoid casting errors
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  const post = await PostModel.findById(id).populate('author', 'email');
  return post;
};

// Update a post. The `userId` is used to verify ownership.
export const updatePost = async (
  userId: string,
  postId: string,
  updateData: Partial<CreatePostInput>
): Promise<PostDocument> => {

  // 1. Find the post first
  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, 'Post not found');

  // 2. Check if the current user is the author of the post
  appAssert(
    post.author.toString() === userId,
    FORBIDDEN,
    'You are not authorized to update this post'
  );

  // 3. Apply the updates and save
  Object.assign(post, updateData);
  const updatedPost = await post.save();

  return updatedPost;
};

// Delete a post. The `userId` is used to verify ownership.
export const deletePost = async (
  userId: string,
  postId: string
): Promise<void> => {

  // 1. Find the post first
  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, 'Post not found');

  // 2. Check if the current user is the author of the post
  appAssert(
    post.author.toString() === userId,
    FORBIDDEN,
    'You are not authorized to delete this post'
  );

  // 3. Delete the post
  await PostModel.findByIdAndDelete(postId);
};