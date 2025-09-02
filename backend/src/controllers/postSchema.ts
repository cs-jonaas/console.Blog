import { z } from 'zod';

// Base schema for common post properties
const postBaseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be 200 characters or less' })
    .trim(),
  content: z
    .string()
    .min(1, { message: 'Content is required' })
    .trim(),
  tags: z
    .array(z.string().trim())
    .optional(),
  status: z
    .enum(['draft', 'published'])
    .optional(),
  coverImage: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith('data:image/'), {
      message: "Cover image must be a valid base64 image string",
    }),
  inlineImages: z
    .array(z.object({
    id: z.string(),
    data: z.string()
  }))
  .optional()
});

// Schema for creating a new post
export const createPostSchema = postBaseSchema;

// Schema for updating an existing post
// All fields are optional for updates
export const updatePostSchema = postBaseSchema.partial();

// Type exports for use in the controller
export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;