import { NextRequest, NextResponse } from 'next/server';
import { saveContact } from '@/lib/r2';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({
      error: 'Invalid request' 
    }, { 
      status: 400 
    });
  }

  const { name, email, message } = body;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return NextResponse.json({ 
      error: 'All fields are required'
     }, { 
      status: 400 
    });
  }

  try {
    await saveContact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
  } catch (error) {
    console.error('Failed to save contact', error);
    return NextResponse.json(
      { error: 'Failed to save contact' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
