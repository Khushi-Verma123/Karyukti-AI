import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { db } from '../config/db';

// Regex for simple PII patterns
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
const PHONE_REGEX = /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g;

export const trustLayerProtection = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { query, prompt } = req.body;
  const content = query || prompt || '';

  if (typeof content !== 'string') {
    return next();
  }

  // 1. Prompt Moderation & Filtering
  const blockedKeywords = ['hack admin', 'drop table', 'bypass restriction', 'bypass jailbreak', 'ignore previous instructions'];
  const lowercaseContent = content.toLowerCase();
  
  const isTriggered = blockedKeywords.some(keyword => lowercaseContent.includes(keyword));
  if (isTriggered) {
    db.addLog(
      'Einstein Security Layer Block',
      `Prompt blocked: "${content.substring(0, 100)}..." contained sensitive or restricted execution terms.`,
      req.user?.id || null,
      req.user?.username || 'Anonymous'
    );
    return res.status(400).json({
      error: 'Security Policy Violation',
      message: 'The Einstein Trust Layer detected potential prompt injection or restricted instructions and halted the request.'
    });
  }

  // 2. Mock PII Masking
  let maskedContent = content;
  let piiDetected = false;

  if (CREDIT_CARD_REGEX.test(maskedContent)) {
    maskedContent = maskedContent.replace(CREDIT_CARD_REGEX, '[MASKED_CREDIT_CARD]');
    piiDetected = true;
  }
  if (SSN_REGEX.test(maskedContent)) {
    maskedContent = maskedContent.replace(SSN_REGEX, '[MASKED_SSN]');
    piiDetected = true;
  }
  if (PHONE_REGEX.test(maskedContent)) {
    maskedContent = maskedContent.replace(PHONE_REGEX, '[MASKED_PHONE_NUMBER]');
    piiDetected = true;
  }

  // Attach processed/safe contents back to the body
  if (req.body.query) req.body.query = maskedContent;
  if (req.body.prompt) req.body.prompt = maskedContent;
  
  if (piiDetected) {
    db.addLog(
      'Einstein Security Layer Masking',
      `PII masked successfully inside query.`,
      req.user?.id || null,
      req.user?.username || 'Anonymous'
    );
  }

  next();
};
