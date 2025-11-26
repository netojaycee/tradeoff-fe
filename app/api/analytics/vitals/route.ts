import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

/**
 * API route to collect web vitals and performance metrics
 * POST /api/analytics/vitals
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      value,
      rating,
      id,
      url,
      userAgent,
      timestamp,
    } = body;

    // Log the metric
    logger.info(`Web Vital: ${name}`, {
      name,
      value: parseFloat(value).toFixed(2),
      rating,
      id,
      url,
      timestamp,
    });

    // Here you can:
    // 1. Store in database
    // 2. Send to external service (e.g., Google Analytics)
    // 3. Alert on poor metrics
    // 4. Calculate aggregates

    if (rating === 'poor') {
      logger.warn(`Poor Core Web Vital detected: ${name} = ${value}`, {
        url,
        userAgent,
      });
    }

    return NextResponse.json(
      { success: true, metric: name },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Failed to process web vital:', error);
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    );
  }
}
