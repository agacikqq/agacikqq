
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import type { CartItem, HoodieCartItem, BraceletCartItem, MatchingSetCartItem, SweatpantsCartItem, Charm } from '@/types';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { CreditCard, ShoppingBag, Lock, ArrowLeft } from 'lucide-react';

const INCLUDED_CHARMS_COUNT = 4;
const INCLUDED_CHARMS_PER_BRACELET_IN_SET = 4;

export default function CheckoutPage() {
  const { items, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // Form state
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    setHasMounted(true);
    if (items.length === 0 && hasMounted) { // Redirect if cart is empty after mount
      toast({
        title: 'Your cart is empty!',
        description: 'Redirecting you to browse our products.',
        variant: 'default',
      });
      router.push('/all-products');
    }
  }, [items, router, hasMounted]);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation (mock)
    if (!nameOnCard || !cardNumber || !expiryDate || !cvv) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all payment details.',
        variant: 'destructive',
      });
      return;
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      toast({ title: 'Invalid Card', description: 'Please enter a valid 16-digit card number.', variant: 'destructive' });
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        toast({ title: 'Invalid Expiry', description: 'Please use MM/YY format for expiry date.', variant: 'destructive' });
        return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
        toast({ title: 'Invalid CVV', description: 'Please enter a valid 3 or 4 digit CVV.', variant: 'destructive' });
        return;
    }


    // Simulate payment processing
    toast({
      title: 'Payment Successful!',
      description: 'Thank you for your order. Your cœzii items are on their way!',
    });
    clearCart();
    router.push('/'); // Redirect to homepage or an order confirmation page
  };
  
  const renderCharmListMini = (charms: Charm[], includedCount: number) => {
    if (!charms || charms.length === 0) return <p className="text-xs text-muted-foreground">No charms.</p>;
    return (
        <ul className="text-xs list-disc list-inside pl-2 text-muted-foreground">
            {charms.slice(0, 3).map(charm => <li key={charm.id}>{charm.name}</li>)}
            {charms.length > 3 && <li>...and more</li>}
        </ul>
    );
  };


  if (!hasMounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 text-center">
          <p className="text-3xl font-semibold text-primary animate-pulse">Loading Checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    // This state should ideally be caught by useEffect, but as a fallback:
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 bg-transparent">
          <div className="container mx-auto text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Add some cœzii items to your cart before proceeding to checkout.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/all-products">Explore Productz</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <div className="container mx-auto">
          <Button variant="outline" onClick={() => router.back()} className="mb-6 text-lg">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Shopping
          </Button>
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-primary mb-3 flex items-center justify-center gap-3">
              <CreditCard className="h-12 w-12 text-accent animate-pulse" />
              Checkout
            </h1>
            <p className="text-xl text-muted-foreground">
              Review your order and complete your purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">Order Summary ({cartCount} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.cartItemId} className="flex items-start space-x-4 p-4 border rounded-lg shadow-sm bg-card/50">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={item.productType === 'hoodie' || item.productType === 'sweatpants' ? 80 : 60}
                            className="rounded-md object-cover aspect-[3/4] sm:aspect-square"
                            data-ai-hint={`${item.name} checkout image`}
                          />
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} &times; AED {item.unitPrice.toFixed(2)}
                            </p>
                            {item.productType === 'hoodie' && (
                              <p className="text-xs text-muted-foreground">
                                Color: {(item as HoodieCartItem).selectedColor.name}, Size: {(item as HoodieCartItem).selectedSize.name}
                              </p>
                            )}
                            {item.productType === 'sweatpants' && (
                              <p className="text-xs text-muted-foreground">
                                Color: {(item as SweatpantsCartItem).selectedColor.name}, Size: {(item as SweatpantsCartItem).selectedSize.name}
                              </p>
                            )}
                            {item.productType === 'bracelet' && (
                              <div className="mt-1">
                                <p className="text-xs font-medium">Charms:</p>
                                {renderCharmListMini((item as BraceletCartItem).selectedCharms, INCLUDED_CHARMS_COUNT)}
                              </div>
                            )}
                            {item.productType === 'matchingSet' && (
                              <div className="mt-1 space-y-1">
                                {(item as MatchingSetCartItem).braceletsCustomization.map(bc => (
                                  <div key={bc.braceletId}>
                                    <p className="text-xs font-medium">{bc.braceletName} Charms:</p>
                                    {renderCharmListMini(bc.selectedCharms, INCLUDED_CHARMS_PER_BRACELET_IN_SET)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-accent">
                            AED {(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator className="my-6" />
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-primary">Total:</span>
                    <span className="text-accent">AED {cartTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Details */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-primary flex items-center">
                    <Lock className="mr-2 h-7 w-7 text-primary" /> Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="nameOnCard" className="text-lg">Name on Card</Label>
                      <Input 
                        id="nameOnCard" 
                        type="text" 
                        value={nameOnCard} 
                        onChange={(e) => setNameOnCard(e.target.value)} 
                        placeholder="Full Name" 
                        required 
                        className="mt-1 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber" className="text-lg">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        type="text" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} 
                        placeholder="0000 0000 0000 0000" 
                        required 
                        className="mt-1 text-base"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-lg">Expiry Date</Label>
                        <Input 
                          id="expiryDate" 
                          type="text" 
                          value={expiryDate}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) {
                                val = val.slice(0,2) + '/' + val.slice(2);
                            }
                            setExpiryDate(val.slice(0,5));
                          }}
                          placeholder="MM/YY" 
                          required 
                          className="mt-1 text-base"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-lg">CVV</Label>
                        <Input 
                          id="cvv" 
                          type="text" 
                          value={cvv} 
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))} 
                          placeholder="123" 
                          required 
                          className="mt-1 text-base"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <CardFooter className="p-0 pt-6">
                      <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-7">
                        Pay AED {cartTotal.toFixed(2)}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
               <p className="text-sm text-muted-foreground mt-4 text-center">
                This is a demo. No real payment will be processed.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
