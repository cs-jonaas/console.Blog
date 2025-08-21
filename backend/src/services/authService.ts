
export type CreateAccountParams = {
  email: string;
  password: string;
  confirmPassword: string;
  userAgent?: string;
}

export const createAccount = async (data: CreateAccountParams) => {
  //verify existing user doesnt exist
  //create user
  //create session
  //sign access token and refresh token
  //return user and token
}