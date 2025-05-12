
'use server';
/**
 * @fileOverview A Genkit flow for sending order confirmation emails.
 *
 * - sendOrderConfirmationEmail - A function that handles sending the order confirmation.
 * - SendOrderConfirmationEmailInput - The input type for the sendOrderConfirmationEmail function.
 * - SendOrderConfirmationEmailOutput - The return type for the sendOrderConfirmationEmail function.
 */

import { ai } from '@/ai/genkit';
import { sendEmail } from '@/services/email-service';
import { z } from 'genkit';

const EmailOrderItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  itemTotal: z.number(),
  details: z.string().optional().describe("Formatted string of selected options like color, size, or charms"),
});
export type EmailOrderItem = z.infer<typeof EmailOrderItemSchema>;

const ShippingAddressSchema = z.object({
  streetAddress: z.string(),
  apartmentSuite: z.string().optional(),
  city: z.string(),
  emirate: z.string(),
  zipCode: z.string().optional(),
});
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

const SendOrderConfirmationEmailInputSchema = z.object({
  customerName: z.string(),
  shippingAddress: ShippingAddressSchema,
  items: z.array(EmailOrderItemSchema),
  cartTotal: z.number(),
  paymentMethod: z.string(),
  recipientEmail: z.string().email().describe('The email address to send the confirmation to.'),
});
export type SendOrderConfirmationEmailInput = z.infer<typeof SendOrderConfirmationEmailInputSchema>;

const SendOrderConfirmationEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendOrderConfirmationEmailOutput = z.infer<typeof SendOrderConfirmationEmailOutputSchema>;

export async function sendOrderConfirmationEmail(input: SendOrderConfirmationEmailInput): Promise<SendOrderConfirmationEmailOutput> {
  return sendOrderConfirmationEmailFlow(input);
}

const sendOrderConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendOrderConfirmationEmailFlow',
    inputSchema: SendOrderConfirmationEmailInputSchema,
    outputSchema: SendOrderConfirmationEmailOutputSchema,
  },
  async (input) => {
    const { customerName, shippingAddress, items, cartTotal, paymentMethod, recipientEmail } = input;

    const subject = `Your Coezii Order Confirmation! #${Math.floor(Math.random() * 100000)}`;

    let itemsHtml = '';
    items.forEach(item => {
      itemsHtml += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} (x${item.quantity})</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.itemTotal.toFixed(2)}</td>
        </tr>
      `;
      if (item.details) {
        itemsHtml += `
          <tr>
            <td colspan="2" style="padding: 0 8px 8px 16px; font-size: 0.9em; color: #555;"><em>Details: ${item.details}</em></td>
          </tr>
        `;
      }
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #200A48;">Hi ${customerName},</h1>
        <p>Thank you for your order with <strong>cœzii</strong>! We're excited to get your items to you.</p>
        
        <h2 style="color: #200A48; border-bottom: 2px solid #FF69B4; padding-bottom: 5px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; background-color: #f9f9f9;">Item</th>
              <th style="text-align: right; padding: 8px; background-color: #f9f9f9;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">AED ${cartTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <h2 style="color: #200A48; border-bottom: 2px solid #FF69B4; padding-bottom: 5px;">Shipping Address</h2>
        <p>
          ${shippingAddress.streetAddress}<br>
          ${shippingAddress.apartmentSuite ? shippingAddress.apartmentSuite + '<br>' : ''}
          ${shippingAddress.city}, ${shippingAddress.emirate}<br>
          ${shippingAddress.zipCode ? shippingAddress.zipCode + '<br>' : ''}
          United Arab Emirates
        </p>

        <h2 style="color: #200A48; border-bottom: 2px solid #FF69B4; padding-bottom: 5px;">Payment Method</h2>
        <p>${paymentMethod}</p>

        <p>Your cœzii items are on their way!</p>
        <p>Thanks for choosing cœzii!</p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    `;

    try {
      const emailResult = await sendEmail({
        to: recipientEmail,
        subject,
        htmlBody,
      });
      return emailResult;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, message: 'Failed to send confirmation email.' };
    }
  }
);
