'use client';
import { useClerk, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import '@/components/styles/user-menu.css';

export default function UserMenu() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!isLoaded || !isSignedIn) return null;

  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const initial = (email || user.fullName || '?').charAt(0).toUpperCase();

  async function handleSignOut() {
    setOpen(false);
    await signOut(() => router.push('/'));
  }

  return (
    <div className='user-menu' ref={menuRef}>
      <button
        type='button'
        className='user-menu-trigger'
        onClick={() => setOpen((v) => !v)}
        aria-haspopup='true'
        aria-expanded={open}
        aria-label='Account menu'
      >
        {/* Clerk's generated default avatar is off-palette, so only show
            a photo the user uploaded and fall back to our own initial. */}
        {user.hasImage ? (
          <Image
            src={user.imageUrl}
            alt=''
            width={28}
            height={28}
            className='user-menu-avatar'
          />
        ) : (
          <span className='user-menu-avatar user-menu-avatar--fallback'>
            {initial}
          </span>
        )}
      </button>
      {open && (
        <div className='user-menu-popover' role='menu'>
          <p className='user-menu-email'>{email}</p>
          <Link
            href='/privacy'
            className='user-menu-link'
            role='menuitem'
            onClick={() => setOpen(false)}
          >
            Privacy
          </Link>
          <button
            type='button'
            className='user-menu-signout'
            role='menuitem'
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
