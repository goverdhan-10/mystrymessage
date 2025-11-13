import { Resend } from 'resend';

// Use RESEND_API_KEY from environment (.env.local or hosting provider)
export const resend = new Resend(process.env.RESEND_API_KEY || '');