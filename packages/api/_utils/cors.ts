import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Attaches standard CORS headers to the response and handles OPTIONS preflight requests
 * @param req - The Vercel request object
 * @param res - The Vercel response object
 * @returns true if the request was an OPTIONS preflight (handler should return), false otherwise
 */
export function handleCors(req: VercelRequest, res: VercelResponse): boolean {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates that the handler should return early
  }

  return false; // Indicates that the handler should continue processing
}
