// This function retrieves an environment variable by key, with an optional default value.
// If the variable is not defined, it throws an error.
// This is to ensure that required environment variables are set before connecting to the database.

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "3000");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");

// export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
// export const RESEND_API_KEY = getEnv("RESEND_API_KEY");