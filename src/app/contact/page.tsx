
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const contactEmail = "trefon.agatha@icloud.com";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <div className="container mx-auto py-12">
          <div className="text-center mb-12">
            <Mail className="h-16 w-16 text-accent mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-extrabold text-primary mb-3">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you! Whether you have a question about our productz, an order, or just want to say hi, feel free to reach out.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-card p-8 rounded-xl shadow-xl text-center">
            <h2 className="text-3xl font-semibold text-card-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              The best way to reach us is via email. We'll do our best to get back to you as soon as possible.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-accent-foreground bg-accent hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg"
            >
              <Mail className="mr-3 h-6 w-6" />
              Email: {contactEmail}
            </a>
            <p className="mt-8 text-sm text-muted-foreground">
              You can also find us on our (soon-to-be-launched) social media channels! Stay cœzii!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
