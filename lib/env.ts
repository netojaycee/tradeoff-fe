import { z } from 'zod';

/**
 * Environment variable schema validation
 * Validates required and optional env vars on app startup
 */

const envSchema = z.object({
  // Public variables (exposed to browser)
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL'),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').default('https://tradeoff.ng'),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Secret variables (server-only)
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  API_SECRET: z.string().optional(),

  // Feature flags
  NEXT_PUBLIC_ENABLE_PWA: z.enum(['true', 'false']).default('true'),
  NEXT_PUBLIC_ENABLE_SERVICE_WORKER: z.enum(['true', 'false']).default('true'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).default('true'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 */
function validateEnv(): Env {
  const env = process.env;

  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_GA_ID: env.NEXT_PUBLIC_GA_ID,
      NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
      DATABASE_URL: env.DATABASE_URL,
      REDIS_URL: env.REDIS_URL,
      JWT_SECRET: env.JWT_SECRET,
      API_SECRET: env.API_SECRET,
      NEXT_PUBLIC_ENABLE_PWA: env.NEXT_PUBLIC_ENABLE_PWA,
      NEXT_PUBLIC_ENABLE_SERVICE_WORKER: env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER,
      NEXT_PUBLIC_ENABLE_ANALYTICS: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
      NODE_ENV: env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Cached validated environment
 */
let validatedEnv: Env | null = null;

/**
 * Get validated environment variables
 */
export function getEnv(): Env {
  if (!validatedEnv) {
    validatedEnv = validateEnv();
  }
  return validatedEnv;
}

/**
 * Helper to get public env var safely
 */
export function getPublicEnv(key: keyof Pick<Env, 'NEXT_PUBLIC_API_URL' | 'NEXT_PUBLIC_APP_URL' | 'NEXT_PUBLIC_GA_ID' | 'NEXT_PUBLIC_SENTRY_DSN' | 'NEXT_PUBLIC_ENABLE_PWA' | 'NEXT_PUBLIC_ENABLE_SERVICE_WORKER' | 'NEXT_PUBLIC_ENABLE_ANALYTICS'>): string | undefined {
  return process.env[key];
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: 'PWA' | 'SERVICE_WORKER' | 'ANALYTICS'): boolean {
  const env = getEnv();
  switch (feature) {
    case 'PWA':
      return env.NEXT_PUBLIC_ENABLE_PWA === 'true';
    case 'SERVICE_WORKER':
      return env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER === 'true';
    case 'ANALYTICS':
      return env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
    default:
      return false;
  }
}

/**
 * Validate single environment variable
 */
export function validateEnvVar(key: string, value: string | undefined, schema: z.ZodSchema): void {
  try {
    schema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(`⚠️  Environment variable ${key}: ${error.issues[0]?.message || 'Invalid'}`);
    }
  }
}
