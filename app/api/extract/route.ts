/**
 * Fetchify Extraction API
 * 
 * A simplified interface for web data extraction.
 * Supports multiple data types: products, articles, jobs, SERP, and more.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
  extractWithZyte,
  getExtractionCost,
  isValidExtractionType,
  isValidExtractionSource,
  isValidCountryCode,
  type ExtractionType,
  type ExtractionSource,
} from '@/lib/zyte';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

// Request schema validation
const extractionRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  type: z.string(),
  source: z.string().optional(),
  country: z.string().length(2).optional(),
  customAttributes: z.record(z.any()).optional(),
});

/**
 * Authenticate request via API key
 */
async function authenticateRequest(req: NextRequest) {
  // Check for API key in Authorization header
  const authHeader = req.headers.get('authorization');
  let apiKey: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
  }

  // Check for API key in query parameter (alternative method)
  if (!apiKey) {
    const url = new URL(req.url);
    apiKey = url.searchParams.get('apiKey');
  }

  if (!apiKey) {
    return {
      error: 'API key is required. Pass it via Authorization header or apiKey query parameter.',
      status: 401,
    };
  }

  // Find and validate API key
  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          credits: true,
        },
      },
    },
  });

  if (!apiKeyRecord) {
    return {
      error: 'Invalid API key',
      status: 401,
    };
  }

  if (!apiKeyRecord.isActive) {
    return {
      error: 'This API key has been disabled',
      status: 403,
    };
  }

  if (!apiKeyRecord.user) {
    return {
      error: 'User not found',
      status: 404,
    };
  }

  return {
    apiKeyRecord,
    user: apiKeyRecord.user,
  };
}

/**
 * Check rate limiting
 */
async function checkRateLimit(userId: string, apiKeyId: string) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW);

  const recentRequests = await prisma.apiUsage.count({
    where: {
      userId,
      apiKeyId,
      createdAt: {
        gte: since,
      },
    },
  });

  if (recentRequests >= MAX_REQUESTS_PER_WINDOW) {
    return {
      error: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute.`,
      status: 429,
    };
  }

  return null;
}

/**
 * POST /api/extract
 * 
 * Extract structured data from a URL
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse request body
    const body = await req.json();
    const validatedData = extractionRequestSchema.parse(body);

    // 2. Validate extraction type
    if (!isValidExtractionType(validatedData.type)) {
      return NextResponse.json(
        {
          error: `Invalid extraction type. Supported types: product, productList, productNavigation, article, articleList, articleNavigation, forumThread, jobPosting, jobPostingNavigation, pageContent, serp`,
        },
        { status: 400 }
      );
    }

    // 3. Validate extraction source if provided
    const extractionSource = validatedData.source || 'browserHtml';
    if (validatedData.source && !isValidExtractionSource(validatedData.source)) {
      return NextResponse.json(
        {
          error: `Invalid extraction source. Supported sources: httpResponseBody, browserHtmlOnly, browserHtml`,
        },
        { status: 400 }
      );
    }

    // 4. Validate country code if provided
    if (validatedData.country && !isValidCountryCode(validatedData.country)) {
      return NextResponse.json(
        {
          error: `Invalid country code. Must be a 2-letter ISO code (e.g., US, FR, GB)`,
        },
        { status: 400 }
      );
    }

    // 5. Authenticate request
    const authResult = await authenticateRequest(req);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { apiKeyRecord, user } = authResult;

    // 6. Check rate limiting
    const rateLimitError = await checkRateLimit(user.id, apiKeyRecord.id);
    if (rateLimitError) {
      return NextResponse.json(
        { error: rateLimitError.error },
        { status: rateLimitError.status }
      );
    }

    // 7. Calculate credit cost
    const creditCost = getExtractionCost(
      validatedData.type as ExtractionType,
      extractionSource as ExtractionSource
    );

    // 8. Check if user has enough credits
    if (user.credits < creditCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. Required: ${creditCost}, Available: ${user.credits}`,
          required: creditCost,
          available: user.credits,
        },
        { status: 402 } // Payment Required
      );
    }

    // 9. Perform extraction using Zyte API
    const extractionResult = await extractWithZyte({
      url: validatedData.url,
      type: validatedData.type as ExtractionType,
      extractFrom: extractionSource as ExtractionSource,
      geolocation: validatedData.country,
      customAttributes: validatedData.customAttributes,
    });

    const processingTime = Date.now() - startTime;

    // 10. If extraction failed, return error without deducting credits
    if (!extractionResult.success) {
      // Log failed attempt (no credit deduction)
      await prisma.apiUsage.create({
        data: {
          userId: user.id,
          apiKeyId: apiKeyRecord.id,
          endpoint: `/api/extract?type=${validatedData.type}`,
          method: 'POST',
          statusCode: 500,
          creditsUsed: 0,
          response: JSON.stringify({
            error: extractionResult.error,
          }),
          metadata: extractionResult.metadata,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: extractionResult.error,
          metadata: extractionResult.metadata,
        },
        { status: 500 }
      );
    }

    // 11. Deduct credits from user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: creditCost,
        },
      },
    });

    // 12. Update API key last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: {
        lastUsedAt: new Date(),
      },
    });

    // 13. Log successful API usage
    await prisma.apiUsage.create({
      data: {
        userId: user.id,
        apiKeyId: apiKeyRecord.id,
        endpoint: `/api/extract?type=${validatedData.type}`,
        method: 'POST',
        statusCode: 200,
        creditsUsed: creditCost,
        response: JSON.stringify(extractionResult.data),
        metadata: extractionResult.metadata,
      },
    });

    // 14. Return successful response
    return NextResponse.json(
      {
        success: true,
        data: extractionResult.data,
        metadata: {
          ...extractionResult.metadata,
          creditsUsed: creditCost,
          creditsRemaining: user.credits - creditCost,
          processingTime,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Extraction API error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/extract
 * 
 * Get information about available extraction types and pricing
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    availableTypes: [
      {
        type: 'product',
        description: 'Extract data from a single product page',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'productList',
        description: 'Extract data from a product listing page',
        cost: { httpResponseBody: 2, browserHtmlOnly: 3, browserHtml: 5 },
      },
      {
        type: 'productNavigation',
        description: 'Extract navigation data from a product category page',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'article',
        description: 'Extract data from a single article/blog post',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'articleList',
        description: 'Extract data from an article listing page',
        cost: { httpResponseBody: 2, browserHtmlOnly: 3, browserHtml: 5 },
      },
      {
        type: 'articleNavigation',
        description: 'Extract navigation data from an article category page',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'forumThread',
        description: 'Extract data from a forum thread',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'jobPosting',
        description: 'Extract data from a single job posting',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'jobPostingNavigation',
        description: 'Extract data from a job listing page',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'pageContent',
        description: 'Extract generic content from any page',
        cost: { httpResponseBody: 1, browserHtmlOnly: 2, browserHtml: 3 },
      },
      {
        type: 'serp',
        description: 'Extract Google Search Engine Results Page data',
        cost: { httpResponseBody: 1, browserHtmlOnly: 1, browserHtml: 2 },
      },
    ],
    extractionSources: [
      {
        source: 'httpResponseBody',
        description: 'Fast and cheap, works for most sites',
        speed: 'Fast',
        quality: 'Good',
        cost: 'Low',
      },
      {
        source: 'browserHtmlOnly',
        description: 'Better for JavaScript-heavy sites',
        speed: 'Medium',
        quality: 'Better',
        cost: 'Medium',
      },
      {
        source: 'browserHtml',
        description: 'Best quality with visual features (default)',
        speed: 'Slower',
        quality: 'Best',
        cost: 'High',
      },
    ],
    geolocation: {
      description: 'Optional 2-letter ISO country code',
      examples: ['US', 'FR', 'GB', 'DE', 'ES', 'IT'],
    },
    rateLimit: {
      requests: MAX_REQUESTS_PER_WINDOW,
      window: `${RATE_LIMIT_WINDOW / 1000} seconds`,
    },
  });
}

