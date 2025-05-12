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
  console.log('\n**************************************************');
  console.log('***           SIMULATING EMAIL SEND            ***');
  console.log('**************************************************');
  console.log(`Recipient (To): ${params.to}`);
  console.log(`Subject: ${params.subject}`);
  console.log('--- HTML Body Start ---');
  console.log(params.htmlBody);
  console.log('--- HTML Body End ---');
  console.log('\nNOTE: This is a SIMULATED email. No actual email has been dispatched to an inbox.');
  console.log('In a production environment, this service would integrate with a real email provider.');
  console.log('Verify the recipient, subject, and body above for correctness based on the order.');
  console.log('**************************************************\n');

  // Simulate a successful email send
  return { success: true, message: 'Email sent successfully (simulated, check console log)' };
}

