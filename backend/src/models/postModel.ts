
import mongoose, { Document, Types, Schema } from 'mongoose';

export interface Author {
  _id: Types.ObjectId;
  username: string;
  email: string;
}
// describes the properties needed to CREATE a new post
export interface CreatePostInput {
  title: string;
  content: string;
  author: Types.ObjectId; // User ID
  tags?: string[];
  status?: 'draft' | 'published';
  coverImage?: string;
}

// describes the properties that a Post has the actual document stored in MongoDB
export interface PostDocument extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
  likes: number;
  likedBy: Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
  toggleLike(userId: Types.ObjectId): { liked: boolean; likes: number };
}

export interface PostDocumentPopulated extends Omit<PostDocument, 'author'> {
  author: Author;
  isLiked?: boolean;
  isSaved?: boolean;
}

// describes the properties that a Post response should have
// example might not want to send the entire author object, but just the ID and username.
export interface PostResponse {
  id: string;
  title: string;
  content: string;
  contentHtml: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema based on the PostDocument interface
const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    contentHtml: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // reference to the User model
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    coverImage: {
      type: String,
      required: false,
      validate: {
        validator: function(v: string) {
          // Optional: validate base64 format or set size limits
          return v === undefined || v.startsWith('data:image/');
        },
        message: 'Cover image must be a valid base64 image string'
      }
    },
    likes: { 
      type: Number, 
      default: 0 },
    likedBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' }],
  },
  {
    timestamps: true, // automatically adds `createdAt` and `updatedAt` fields
  }
);

PostSchema.methods.toggleLike = function(userId: Types.ObjectId): { liked: boolean; likes: number } {
  const index = this.likedBy.findIndex((id: Types.ObjectId) => id.equals(userId));
  
  if (index === -1) {
    // User hasn't liked yet - add like
    this.likedBy.push(userId);
    this.likes = this.likedBy.length;
    return { liked: true, likes: this.likes };
  } else {
    // User already liked - remove like
    this.likedBy.splice(index, 1);
    this.likes = this.likedBy.length;
    return { liked: false, likes: this.likes };
  }
};

// Create and export the model
const PostModel = mongoose.model<PostDocument>('Post', PostSchema);

export default PostModel;