import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

/**
 * API route to collect client-side errors
 * POST /api/errors
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      error,
      stack,
      context,
      severity = 'error',
      userId,
      url,
      userAgent,
      timestamp,
    } = body;

    // Log the error
    logger.error(`[Client Error - ${severity}] ${message}`, {
      error,
      stack,
      context,
      userId,
      url,
      userAgent,
      timestamp,
    });

    // Here you can:
    // 1. Store error in database
    // 2. Send to Sentry or similar service
    // 3. Alert team if critical
    // 4. Group similar errors

    // Example: Send to Sentry if configured
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && severity === 'fatal') {
      logger.warn('Critical error detected, consider alerting team', {
        message,
        userId,
        url,
      });
    }

    return NextResponse.json(
      { success: true, errorId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Failed to process error report:', error);
    return NextResponse.json(
      { error: 'Failed to process error' },
      { status: 500 }
    );
  }
}
