import { type NextRequest, NextResponse } from 'next/server';
import {
  EMAIL_SHAPE,
  LIMIT,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  WINDOW_MS,
} from '@/lib/constants/contact-information';
import { saveContact } from '@/lib/db/r2/save-contact';
import { clientKey } from '@/lib/utils/client-key';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function POST(req: NextRequest) {
  // Every submission writes an object to the bucket, so the cost of an
  // unthrottled form is paid in storage as well as inbox noise.
  const limit = rateLimit(`contact:${clientKey(req.headers)}`, {
    limit: LIMIT,
    windowMs: WINDOW_MS,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Try again a little later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { name, email, message, website } = body;

  // Honeypot: a hidden field no person can see or tab into. Answer 200 so a
  // bot has no signal that it was caught, but write nothing.
  if (typeof website === 'string' && website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 },
    );
  }

  if (
    trimmedName.length > MAX_NAME_LENGTH ||
    trimmedEmail.length > MAX_EMAIL_LENGTH ||
    trimmedMessage.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { error: 'One or more fields are too long' },
      { status: 400 },
    );
  }

  if (!EMAIL_SHAPE.test(trimmedEmail)) {
    return NextResponse.json(
      { error: "That email address doesn't look right" },
      { status: 400 },
    );
  }

  try {
    await saveContact({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });
  } catch (error) {
    console.error('Failed to save contact', error);
    return NextResponse.json(
      { error: 'Failed to save contact' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
