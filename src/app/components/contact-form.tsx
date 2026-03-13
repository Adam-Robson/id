'use client';

import { useState } from 'react';
import type { Status } from '@/types/status'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus('success');
      form.reset();
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMsg(json.error ?? 'Something went wrong. Try again.');
      setStatus('error');
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="contact-label" htmlFor="name">Name</label>
        <input
          className="form-input"
          id="name"
          name="name"
          type="text"
          required
          disabled={status === 'submitting'}
        />
      </div>

      <div className="form-field">
        <label className="contact-label" htmlFor="email">Email</label>
        <input
          className="form-input"
          id="email"
          name="email"
          type="email"
          required
          disabled={status === 'submitting'}
        />
      </div>

      <div className="form-field">
        <label className="contact-label" htmlFor="message">Message</label>
        <textarea
          className="form-input form-textarea"
          id="message"
          name="message"
          rows={5}
          required
          disabled={status === 'submitting'}
        />
      </div>

      {status === 'error' && (
        <p className="form-feedback form-feedback--error">{errorMsg}</p>
      )}

      {status === 'success' && (
        <p className="form-feedback form-feedback--success">Message sent.</p>
      )}

      <button
        className="form-submit"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
