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
