'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { contactFormSchema } from '@/lib/validations/schemas';
import { useToast } from '@/components/ui/toast';
import type { z } from 'zod';

type ContactValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
  const [resetTick, setResetTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartedAt(Date.now());
    }, 0);
    return () => clearTimeout(timer);
  }, [resetTick]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data: ContactValues) => {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          startedAt,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json.error || 'Unable to send message.';
        setServerError(msg);
        toast({ title: 'Message not sent', description: msg, variant: 'error' });
        return;
      }

      setSubmitted(true);
      reset();
      setResetTick((t) => t + 1);
      toast({
        title: 'Message sent',
        description: 'Your message has been delivered to Faryal.',
        variant: 'success',
      });
    } catch {
      setServerError('Network error while sending your message.');
      toast({ title: 'Connection error', description: 'Please try again.', variant: 'error' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-white border border-[#172554]/12 rounded-lg p-7 md:p-9 space-y-5"
    >
      <h2 className="font-serif text-2xl text-[#172554]">Send a Message</h2>

      {submitted && (
        <div
          role="status"
          className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-sm text-emerald-900"
        >
          Thank you for reaching out. Your inquiry has been recorded and Faryal will respond soon.
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-md bg-rose-50 border border-rose-200 text-sm text-rose-900"
        >
          {serverError}
        </div>
      )}

      {/* Honeypot anti-spam field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-[#172554] mb-1.5">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md focus:border-[#172554] focus:outline-none"
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-xs text-rose-700 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-[#172554] mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md focus:border-[#172554] focus:outline-none"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-rose-700 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-medium text-[#172554] mb-1.5">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md focus:border-[#172554] focus:outline-none"
          placeholder="Academic inquiry, collaboration, or opportunity"
        />
        {errors.subject && (
          <p className="text-xs text-rose-700 mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-[#172554] mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#172554]/15 rounded-md focus:border-[#172554] focus:outline-none resize-y"
          placeholder="Write your message here..."
        />
        {errors.message && (
          <p className="text-xs text-rose-700 mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[#172554] text-white rounded-md hover:bg-[#1e3170] transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
      </button>
    </form>
  );
}
