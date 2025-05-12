
'use server';

/**
 * @fileOverview Mock Email Service.
 * This service simulates sending an email by logging its content to the console.
 *
 * - sendEmail - Function to simulate sending an email.
 * - EmailParams - Interface for the email parameters.
 */

export interface EmailParams {
  to: string;
  subject: string;
  htmlBody: string;
}

/**
 * Simulates sending an email. In a real application, this would integrate
 * with an actual email sending service (e.g., SendGrid, Mailgun, AWS SES).
 * @param params - The email parameters.
 * @returns A promise that resolves with the status of the email sending attempt.
 */
export async function sendEmail(params: EmailParams): Promise<{ success: boolean; message: string }> {
  console.log('--- Simulating Email Send ---');
  console.log(`To: ${params.to}`);
  console.log(`Subject: ${params.subject}`);
  console.log('Body (HTML):');
  console.log(params.htmlBody);
  console.log('--- Email Simulation End ---');

  // Simulate a successful email send
  return { success: true, message: 'Email sent successfully (simulated)' };
}
