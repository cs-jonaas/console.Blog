const BASE_URL = `${import.meta.env.VITE_API_URL}/posts`

interface PostData {
  title: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}

interface PostResponse {
  post: Post;
}

interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
}

export const createNewPost = async (
  postData: PostData,
  token: string
): Promise<Post> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP problem ${response.status}`);
    }
    const data: PostResponse = await response.json();
    return data.post;
  } catch (err) {
    console.log(err);
    throw new Error(err as string);
  }
};
// export const createNewPost = async (postData: PostData): Promise<Post> => {
//   try {
//     const response = await fetch(BASE_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // REMOVE the Authorization header entirely
//       },
//       credentials: 'include', // <- THIS IS THE KEY. This sends the cookies.
//       body: JSON.stringify(postData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({})); // Try to get JSON error info
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data; // Your backend currently returns the post directly, not wrapped in { post }
//   } catch (err) {
//     console.error('Creation failed:', err);
//     throw err; // Re-throw to let the component handle it
//   }
// };