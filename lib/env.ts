// Environment variable validation
function getEnvVar(key: string, required: boolean = false): string | undefined {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

// Validate required environment variables for NextAuth
export function validateEnv() {
  if (process.env.NODE_ENV === 'production') {
    // Relaxed validation for Vercel builds where NEXTAUTH_URL might not be present yet
    getEnvVar('NEXTAUTH_URL', false);
    getEnvVar('NEXTAUTH_SECRET', false);
    getEnvVar('EMAIL_SERVER_HOST', false);
    getEnvVar('EMAIL_SERVER_PORT', false);
    getEnvVar('EMAIL_FROM', false);

    // Validate NEXTAUTH_SECRET is not the default dev value
    if (process.env.NEXTAUTH_SECRET === 'dev-secret-change-me') {
      throw new Error('NEXTAUTH_SECRET must be changed from the default value in production');
    }
  }
}

export const env = {
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  EMAIL_SERVER_HOST: getEnvVar('EMAIL_SERVER_HOST'),
  EMAIL_SERVER_PORT: getEnvVar('EMAIL_SERVER_PORT'),
  EMAIL_SERVER_USER: getEnvVar('EMAIL_SERVER_USER'),
  EMAIL_SERVER_PASSWORD: getEnvVar('EMAIL_SERVER_PASSWORD'),
  EMAIL_SERVER_SECURE: getEnvVar('EMAIL_SERVER_SECURE'),
  EMAIL_FROM: getEnvVar('EMAIL_FROM'),
};
