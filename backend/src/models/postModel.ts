
import mongoose, { Document, Types, Schema } from 'mongoose';

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
  createdAt: Date;
  updatedAt: Date;
}

// describes the properties that a Post response should have
// example might not want to send the entire author object, but just the ID and username.
export interface PostResponse {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
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
      default: 'draft',
    },
    coverImage: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true, // automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the model
const PostModel = mongoose.model<PostDocument>('Post', PostSchema);

export default PostModel;