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

  const trimmedName = typeof name === 'string' ? name.trim() : '';
   const trimmedEmail = typeof email === 'string' ? email.trim() : '';
   const trimmedMessage = typeof message === 'string' ? message.trim() : '';
   if (!trimmedName || !trimmedEmail || !trimmedMessage) {
     return NextResponse.json({
       error: 'All fields are required'
     }, {
       status: 400
     });
   }
   const MAX_NAME_LENGTH = 200;
   const MAX_EMAIL_LENGTH = 320;
   const MAX_MESSAGE_LENGTH = 5000;

  if (
     trimmedName.length > MAX_NAME_LENGTH ||
     trimmedEmail.length > MAX_EMAIL_LENGTH ||
     trimmedMessage.length > MAX_MESSAGE_LENGTH
  ) {
     return NextResponse.json({
       error: 'One or more fields are too long'
     }, {
       status: 400
    });
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
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
