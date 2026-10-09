import { auth } from '@clerk/nextjs/server';

export default async function ProtectedPage() {
  const { userId } = await auth.protect(); // signed-out users go to sign-in
  // ...fetch data for userId
}
