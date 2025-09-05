import { Types } from 'mongoose';
import UserModel from '../models/userModel';
import PostModel from '../models/postModel';
import appAssert from '../utils/appAssert';
import { NOT_FOUND } from '../constants/http';

export const toggleSavePost = async (userId: Types.ObjectId, postId: string) => {
  // Validate post exists
  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, 'Post not found');

  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'User not found');

  const postObjectId = new Types.ObjectId(postId);
  const isCurrentlySaved = user.savedPosts.some(savedPostId => 
    savedPostId.equals(postObjectId)
  );

  if (isCurrentlySaved) {
    // Remove from saved posts
    user.savedPosts = user.savedPosts.filter(
      savedPostId => !savedPostId.equals(postObjectId)
    );
  } else {
    // Add to saved posts
    user.savedPosts.push(postObjectId);
  }

  await user.save();

  return {
    success: true,
    saved: !isCurrentlySaved,
    isSaved: !isCurrentlySaved
  };
};

export const getUserSavedPosts = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById(userId)
    .populate({
      path: 'savedPosts',
      populate: {
        path: 'author',
        select: 'username email'
      }
    });

  appAssert(user, NOT_FOUND, 'User not found');

  // Convert to proper format and add like status
  const savedPosts = user.savedPosts.map((post: any) => ({
    ...post.toObject(),
    isLiked: post.likedBy.some((id: Types.ObjectId) => id.equals(userId)),
    isSaved: true
  }));

  return savedPosts;
};