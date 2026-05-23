import { createHmac, randomUUID } from 'node:crypto';
import type { CareerSubmission, ContactSubmission } from '../src/types';
import { config } from './env';

type SubmissionKind = 'contact' | 'career';

type SubmissionPayload = ContactSubmission | CareerSubmission;

export async function notifySubmission(kind: SubmissionKind, payload: SubmissionPayload) {
  if (!config.submissionWebhookUrl) {
    return;
  }

  const event = `submission.${kind}`;
  const deliveryId = randomUUID();
  const body = JSON.stringify({
    deliveryId,
    event,
    submittedAt: payload.createdAt,
    payload,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-BetterHub-Delivery': deliveryId,
    'X-BetterHub-Event': event,
  };

  if (config.submissionWebhookSecret) {
    headers['X-BetterHub-Signature'] = createHmac('sha256', config.submissionWebhookSecret)
      .update(body)
      .digest('hex');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.submissionWebhookTimeoutMs);

  try {
    const response = await fetch(config.submissionWebhookUrl, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `[notify] ${event} delivery failed with ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(`[notify] ${event} delivery failed`, error);
  } finally {
    clearTimeout(timeout);
  }
}
