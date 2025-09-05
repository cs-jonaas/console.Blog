import { Types } from 'mongoose';
import PostModel, { PostDocument, CreatePostInput, PostDocumentPopulated, Author } from '../models/postModel';
import appAssert from '../utils/appAssert';
import { NOT_FOUND, FORBIDDEN } from '../constants/http';
import UserModel from '../models/userModel';
import { parseMarkdownToHtml } from '../utils/markdownParser';


// Create a new post
export const createPost = async (data: CreatePostInput): Promise<PostDocument> => {
  // Optional: Validate and process cover image if it's too large
  if (data.coverImage && data.coverImage.length > 1000000000) { 
    // You might want to compress or reject very large images
    throw new Error('Cover image is too large');
  }

  console.log('Service received data:', {
    title: data.title,
    hasCoverImage: !!data.coverImage,
    coverImageLength: data.coverImage?.length
  });

  // Parse markdown to HTML
  const contentHtml = parseMarkdownToHtml(data.content);
  const post = await PostModel.create({
    ...data,
    contentHtml,
});

  return post;
};
// Get all posts (with optional filtering later, e.g., by status, author)
export const getPosts = async (userId?: Types.ObjectId): Promise<PostDocumentPopulated[]> => {
  const posts = await PostModel.find()
    .populate('author', 'username email')
    .sort({ createdAt: -1 });

  // Get user's saved posts if userId is provided
  let userSavedPostIds: Types.ObjectId[] = [];
  if (userId) {
    const user = await UserModel.findById(userId).select('savedPosts');
    userSavedPostIds = user?.savedPosts || [];
  }

  const postsWithStatus = posts.map(post => ({
    ...post.toObject(),
    isLiked: userId ? post.likedBy.some(id => id.equals(userId)) : false,
    isSaved: userId ? userSavedPostIds.some(savedId => savedId.equals(post._id as Types.ObjectId)) : false
  }));

  return postsWithStatus as unknown as PostDocumentPopulated[];
};

// Get a single post by ID
export const getPostById = async (id: string, userId?: Types.ObjectId): Promise<PostDocumentPopulated | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const post = await PostModel.findById(id).populate('author', 'username email');
  if (!post) return null;

  // Check if user has saved this post
  let isSaved = false;
  if (userId) {
    const user = await UserModel.findById(userId).select('savedPosts');
    isSaved = user?.savedPosts.some(savedId => savedId.equals(post._id as Types.ObjectId)) || false;
  }

  const postWithStatus = {
    ...post.toObject(),
    isLiked: userId ? post.likedBy.some(id => id.equals(userId)) : false,
    isSaved
  };

  return postWithStatus as unknown as PostDocumentPopulated;
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
    'Not authorized'
  );

  // If content is being updated, parse it to HTML
  if (updateData.content) {
    (updateData as any).contentHtml = await parseMarkdownToHtml(updateData.content);
  }

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

export const togglePostLike = async (userId: Types.ObjectId, postId: string) => {
  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, 'Post not found');

  const result = post.toggleLike(userId);
  await post.save();

  console.log('Backend toggle result:', result);

  return {
    success: true,
    liked: result.liked,
    likes: result.likes,
    isLiked: result.liked
  };
};