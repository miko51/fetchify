/**
 * Zyte API Integration Service
 * 
 * This service handles all communication with Zyte API.
 * The Zyte brand is never exposed to end users - Fetchify acts as a simplified interface.
 */

import { z } from 'zod';

const ZYTE_API_URL = 'https://api.zyte.com/v1/extract';
const ZYTE_API_KEY = process.env.ZYTE_API_KEY;

if (!ZYTE_API_KEY) {
  console.warn('⚠️  ZYTE_API_KEY is not configured. Extraction features will not work.');
}

/**
 * Supported extraction types
 */
export type ExtractionType = 
  | 'product'           // Single product page
  | 'productList'       // Product listing page
  | 'productNavigation' // Product navigation page
  | 'article'           // Single article page
  | 'articleList'       // Article listing page
  | 'articleNavigation' // Article navigation page
  | 'forumThread'       // Forum thread page
  | 'jobPosting'        // Single job posting
  | 'jobPostingNavigation' // Job listing page
  | 'pageContent'       // Generic page content
  | 'serp';             // Search Engine Results Page (Google)

/**
 * Extraction source options
 */
export type ExtractionSource = 
  | 'httpResponseBody'   // Fast, cheap, works for most sites
  | 'browserHtmlOnly'    // Better for JS-heavy sites
  | 'browserHtml';       // Best quality, visual features

/**
 * Country codes for geolocation (ISO 3166-1 alpha-2)
 */
export type CountryCode = string; // e.g., 'US', 'FR', 'GB', 'DE', 'ES', 'IT'

export interface ZyteExtractionOptions {
  url: string;
  type: ExtractionType;
  extractFrom?: ExtractionSource;
  geolocation?: CountryCode;
  customAttributes?: Record<string, any>;
}

export interface ZyteExtractionResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    extractionType: ExtractionType;
    source: ExtractionSource;
    country?: CountryCode;
    processingTime?: number;
  };
}

/**
 * Build Zyte API request body based on extraction type
 */
function buildZyteRequestBody(options: ZyteExtractionOptions): Record<string, any> {
  const { url, type, extractFrom, geolocation, customAttributes } = options;

  const body: Record<string, any> = {
    url,
    [type]: true, // Enable the specific extraction type
  };

  // Add extraction source if specified
  if (extractFrom) {
    const optionsKey = `${type}Options`;
    body[optionsKey] = {
      extractFrom,
    };
  }

  // Add geolocation if specified
  if (geolocation) {
    body.geolocation = geolocation;
  }

  // Add custom attributes if specified
  if (customAttributes && Object.keys(customAttributes).length > 0) {
    body.customAttributes = customAttributes;
  }

  return body;
}

/**
 * Extract structured data from a URL using Zyte API
 */
export async function extractWithZyte(
  options: ZyteExtractionOptions
): Promise<ZyteExtractionResult> {
  if (!ZYTE_API_KEY) {
    return {
      success: false,
      error: 'Zyte API key is not configured. Please contact support.',
    };
  }

  const startTime = Date.now();

  try {
    const requestBody = buildZyteRequestBody(options);

    // Create Basic Auth header
    const auth = Buffer.from(`${ZYTE_API_KEY}:`).toString('base64');

    const response = await fetch(ZYTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Zyte API error:', response.status, errorText);
      
      return {
        success: false,
        error: `Extraction failed: ${response.statusText}`,
        metadata: {
          extractionType: options.type,
          source: options.extractFrom || 'browserHtml',
          country: options.geolocation,
          processingTime: Date.now() - startTime,
        },
      };
    }

    const result = await response.json();
    const extractedData = result[options.type];

    if (!extractedData) {
      return {
        success: false,
        error: `No ${options.type} data found in the response`,
        metadata: {
          extractionType: options.type,
          source: options.extractFrom || 'browserHtml',
          country: options.geolocation,
          processingTime: Date.now() - startTime,
        },
      };
    }

    return {
      success: true,
      data: extractedData,
      metadata: {
        extractionType: options.type,
        source: options.extractFrom || 'browserHtml',
        country: options.geolocation,
        processingTime: Date.now() - startTime,
      },
    };
  } catch (error: any) {
    console.error('Zyte extraction error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during extraction',
      metadata: {
        extractionType: options.type,
        source: options.extractFrom || 'browserHtml',
        country: options.geolocation,
        processingTime: Date.now() - startTime,
      },
    };
  }
}

/**
 * Get the credit cost for an extraction type
 * This is a simplified pricing model - adjust based on actual costs
 */
export function getExtractionCost(type: ExtractionType, source: ExtractionSource = 'browserHtml'): number {
  // Base costs (credits per request)
  const baseCosts: Record<ExtractionType, number> = {
    product: 2,
    productList: 3,
    productNavigation: 2,
    article: 2,
    articleList: 3,
    articleNavigation: 2,
    forumThread: 2,
    jobPosting: 2,
    jobPostingNavigation: 2,
    pageContent: 2,
    serp: 1, // SERP is non-AI and cheaper
  };

  // Multipliers based on extraction source
  const sourceMultipliers: Record<ExtractionSource, number> = {
    httpResponseBody: 0.5,  // Cheapest
    browserHtmlOnly: 1,     // Standard
    browserHtml: 1.5,       // Most expensive but best quality
  };

  const baseCost = baseCosts[type] || 2;
  const multiplier = sourceMultipliers[source] || 1;

  return Math.ceil(baseCost * multiplier);
}

/**
 * Validate extraction type
 */
export function isValidExtractionType(type: string): type is ExtractionType {
  const validTypes: ExtractionType[] = [
    'product',
    'productList',
    'productNavigation',
    'article',
    'articleList',
    'articleNavigation',
    'forumThread',
    'jobPosting',
    'jobPostingNavigation',
    'pageContent',
    'serp',
  ];
  return validTypes.includes(type as ExtractionType);
}

/**
 * Validate extraction source
 */
export function isValidExtractionSource(source: string): source is ExtractionSource {
  const validSources: ExtractionSource[] = [
    'httpResponseBody',
    'browserHtmlOnly',
    'browserHtml',
  ];
  return validSources.includes(source as ExtractionSource);
}

/**
 * Validate country code (basic validation for ISO 3166-1 alpha-2)
 */
export function isValidCountryCode(code: string): boolean {
  return /^[A-Z]{2}$/.test(code);
}

