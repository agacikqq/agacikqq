
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import type { CartItem, HoodieCartItem, BraceletCartItem, MatchingSetCartItem, SweatpantsCartItem, Charm, PastOrder } from '@/types';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from '@/hooks/use-toast';
import { CreditCard, ShoppingBag, Lock, ArrowLeft, Truck, Apple, MapPin, CheckCircle, AlertTriangle, Edit, PackageCheck } from 'lucide-react';
import { sendOrderConfirmationEmail, type SendOrderConfirmationEmailInput, type EmailOrderItem } from '@/ai/flows/send-order-confirmation-email-flow';


const INCLUDED_CHARMS_COUNT = 4;
const INCLUDED_CHARMS_PER_BRACELET_IN_SET = 4;

type PaymentMethod = 'card' | 'cash' | 'applepay';
type OrderState = 'form' | 'submitting' | 'confirmed' | 'editingAddress';

export default function CheckoutPage() {
  const { items, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // Form state
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');

  // Address state
  const [streetAddress, setStreetAddress] = useState('');
  const [apartmentSuite, setApartmentSuite] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  // const [emirate, setEmirate] = useState(''); // Removed emirate

  // Order processing state
  const [orderState, setOrderState] = useState<OrderState>('form');
  const [confirmedOrderData, setConfirmedOrderData] = useState<SendOrderConfirmationEmailInput | null>(null);


  useEffect(() => {
    setHasMounted(true);
    if (items.length === 0 && hasMounted && orderState === 'form') {
      toast({
        title: 'Your cart is empty!',
        description: 'Redirecting you to browse our products.',
        variant: 'default',
      });
      router.push('/all-products');
    }
  }, [items, router, hasMounted, orderState]);

  const getPaymentMethodName = (method: PaymentMethod): string => {
    if (method === 'cash') return "Cash on Delivery";
    if (method === 'applepay') return "Apple Pay";
    return "Card";
  }

  const prepareEmailInput = (): SendOrderConfirmationEmailInput | null => {
    const customerName = nameOnCard || "Valued Coezii Customer"; // Use nameOnCard if available for card payments
    const emailOrderItems: EmailOrderItem[] = items.map(item => {
      let details = '';
      if (item.productType === 'hoodie') {
        const hoodieItem = item as HoodieCartItem;
        details = `Color: ${hoodieItem.selectedColor.name}, Size: ${hoodieItem.selectedSize.name}`;
      } else if (item.productType === 'sweatpants') {
        const sweatpantsItem = item as SweatpantsCartItem;
        details = `Color: ${sweatpantsItem.selectedColor.name}, Size: ${sweatpantsItem.selectedSize.name}`;
      } else if (item.productType === 'bracelet') {
        const braceletItem = item as BraceletCartItem;
        const included = braceletItem.selectedCharms.slice(0, INCLUDED_CHARMS_COUNT).map(c => c.name).join(', ');
        const extra = braceletItem.selectedCharms.slice(INCLUDED_CHARMS_COUNT).map(c => `${c.name} (+AED ${c.price.toFixed(2)})`).join(', ');
        details = `Charms: ${included || 'None'}${extra ? (included ? '; ' : '') + extra : ''}`;
      } else if (item.productType === 'matchingSet') {
        const setItem = item as MatchingSetCartItem;
        details = setItem.braceletsCustomization.map(bc => {
          const included = bc.selectedCharms.slice(0, INCLUDED_CHARMS_PER_BRACELET_IN_SET).map(c => c.name).join(', ');
          const extra = bc.selectedCharms.slice(INCLUDED_CHARMS_PER_BRACELET_IN_SET).map(c => `${c.name} (+AED ${c.price.toFixed(2)})`).join(', ');
          return `${bc.braceletName} Charms: ${included || 'None'}${extra ? (included ? '; ' : '') + extra : ''}`;
        }).join(' | ');
      }

      return {
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        itemTotal: item.unitPrice * item.quantity,
        details: details,
      };
    });

    return {
      customerName,
      shippingAddress: {
        streetAddress,
        apartmentSuite: apartmentSuite || undefined,
        city,
        // emirate, // Removed emirate
        zipCode: zipCode || undefined,
      },
      items: emailOrderItems,
      cartTotal,
      paymentMethod: getPaymentMethodName(selectedPaymentMethod),
      recipientEmail: 'trefon.agatha@icloud.com', // Hardcoded recipient email
    };
  };

  const handleSubmitInitialOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderState('submitting');

    if (!streetAddress || !city) { // Removed emirate from check
      toast({
        title: 'Missing Shipping Information',
        description: 'Please fill in all required shipping address details (Street, City).', // Updated description
        variant: 'destructive',
      });
      setOrderState('form');
      return;
    }

    if (selectedPaymentMethod === 'card') {
      if (!nameOnCard || !cardNumber || !expiryDate || !cvv) {
        toast({
          title: 'Missing Card Information',
          description: 'Please fill in all payment details for your card.',
          variant: 'destructive',
        });
        setOrderState('form');
        return;
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        toast({ title: 'Invalid Card Number', description: 'Please enter a valid 16-digit card number.', variant: 'destructive' });
        setOrderState('form');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
          toast({ title: 'Invalid Expiry Date', description: 'Please use MM/YY format for expiry date.', variant: 'destructive' });
          setOrderState('form');
          return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
          toast({ title: 'Invalid CVV', description: 'Please enter a valid 3 or 4 digit CVV.', variant: 'destructive' });
          setOrderState('form');
          return;
      }
    }

    const emailInput = prepareEmailInput();
    if (!emailInput) {
      toast({ title: 'Error', description: 'Could not prepare order details.', variant: 'destructive' });
      setOrderState('form');
      return;
    }
    
    try {
      const emailResult = await sendOrderConfirmationEmail(emailInput);
      if (emailResult.success) {
        setConfirmedOrderData(emailInput);
        setOrderState('confirmed');
        toast({
          title: 'Order Confirmed (Simulated)!',
          description: `Email simulation successful. Check your Next.js server console for details. Message: ${emailResult.message}`,
        });
      } else {
        toast({
          title: 'Order Failed',
          description: `Your order could not be placed: ${emailResult.message}. Please try again.`,
          variant: 'destructive',
        });
        setOrderState('form');
      }
    } catch (error) {
      console.error("Error sending confirmation email flow:", error);
      toast({
        title: 'Order Error',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
      setOrderState('form');
    }
  };

  const handleUpdateAddressAndResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderState('submitting');

    if (!streetAddress || !city ) { // Removed emirate check
      toast({
        title: 'Missing Shipping Information',
        description: 'Please fill in all required shipping address details.',
        variant: 'destructive',
      });
      setOrderState('editingAddress');
      return;
    }

    if (!confirmedOrderData) {
        toast({ title: 'Error', description: 'Original order data not found.', variant: 'destructive' });
        setOrderState('form'); // Reset to start
        return;
    }

    const updatedEmailInput: SendOrderConfirmationEmailInput = {
      ...confirmedOrderData,
      shippingAddress: {
        streetAddress,
        apartmentSuite: apartmentSuite || undefined,
        city,
        // emirate, // Removed emirate
        zipCode: zipCode || undefined,
      },
    };
    
    try {
      const emailResult = await sendOrderConfirmationEmail(updatedEmailInput);
      if (emailResult.success) {
        setConfirmedOrderData(updatedEmailInput);
        setOrderState('confirmed');
        toast({
          title: 'Address Updated & Confirmation Resent (Simulated)!',
          description: `Email simulation successful. Check your Next.js server console for details. Message: ${emailResult.message}`,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: `Could not update address: ${emailResult.message}. Please try again.`,
          variant: 'destructive',
        });
        setOrderState('editingAddress');
      }
    } catch (error) {
      console.error("Error resending confirmation email flow:", error);
      toast({
        title: 'Update Error',
        description: 'There was an error updating your address. Please try again.',
        variant: 'destructive',
      });
      setOrderState('editingAddress');
    }
  };

  const handleCompleteOrder = () => {
    if (confirmedOrderData) {
      const pastOrder: PastOrder = {
        ...confirmedOrderData,
        orderId: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        orderDate: new Date().toISOString(),
      };

      try {
        const existingOrdersString = localStorage.getItem('pastOrders');
        const existingOrders: PastOrder[] = existingOrdersString ? JSON.parse(existingOrdersString) : [];
        existingOrders.unshift(pastOrder); // Add to the beginning of the array
        localStorage.setItem('pastOrders', JSON.stringify(existingOrders));
      } catch (e) {
        console.error("Failed to save past order to localStorage", e);
        toast({
          title: 'Storage Error',
          description: 'Could not save order to history due to a storage issue.',
          variant: 'destructive'
        });
      }
    }

    clearCart();
    router.push('/');
    toast({
        title: 'Thank You!',
        description: 'Your order has been finalized. Redirecting to homepage.',
    });
  };

  const startEditAddress = () => {
    if (confirmedOrderData) {
        setStreetAddress(confirmedOrderData.shippingAddress.streetAddress);
        setApartmentSuite(confirmedOrderData.shippingAddress.apartmentSuite || '');
        setCity(confirmedOrderData.shippingAddress.city);
        // setEmirate(confirmedOrderData.shippingAddress.emirate); // Removed emirate
        setZipCode(confirmedOrderData.shippingAddress.zipCode || '');
        setOrderState('editingAddress');
    }
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

  if (items.length === 0 && orderState === 'form') { 
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

  const isLoading = orderState === 'submitting';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 bg-transparent">
        <div className="container mx-auto">
          {orderState !== 'confirmed' && orderState !== 'editingAddress' && (
            <Button variant="outline" onClick={() => router.back()} className="mb-6 text-lg" disabled={isLoading}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Shopping
            </Button>
          )}
          
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-primary mb-3 flex items-center justify-center gap-3">
              {orderState === 'confirmed' || orderState === 'editingAddress' ? <PackageCheck className="h-12 w-12 text-accent" /> : <CreditCard className="h-12 w-12 text-accent animate-pulse" />}
              {orderState === 'form' && 'Checkout'}
              {orderState === 'editingAddress' && 'Update Shipping Address'}
              {(orderState === 'confirmed') && 'Order Confirmation'}
              {orderState === 'submitting' && 'Processing...'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {orderState === 'form' && 'Review your order and complete your purchase.'}
              {orderState === 'editingAddress' && 'Please update your shipping details below.'}
              {orderState === 'confirmed' && 'Your order is confirmed. Please review the details.'}
              {orderState === 'submitting' && 'Please wait while we process your request.'}
            </p>
          </div>

          {(orderState === 'form' || orderState === 'editingAddress') && (
            <form onSubmit={orderState === 'form' ? handleSubmitInitialOrder : handleUpdateAddressAndResend}>
              <fieldset disabled={isLoading} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-3xl text-primary">Order Summary ({orderState === 'form' ? cartCount : confirmedOrderData?.items.reduce((sum, i) => sum + i.quantity, 0) || 0} items)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-6">
                            {(orderState === 'form' ? items : confirmedOrderData?.items || []).map((item: CartItem | EmailOrderItem, index) => (
                              <div key={(item as CartItem).cartItemId || `confirmed-item-${index}`} className="flex items-start space-x-4 p-4 border rounded-lg shadow-sm bg-card/50">
                                <Image
                                  src={(item as CartItem).image || `https://picsum.photos/seed/${item.name}/60/80`} 
                                  alt={item.name}
                                  width={60}
                                  height={((item as CartItem).productType === 'hoodie' || (item as CartItem).productType === 'sweatpants') ? 80 : 60}
                                  className="rounded-md object-cover aspect-[3/4] sm:aspect-square"
                                  data-ai-hint={`${item.name} checkout image`}
                                />
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity} &times; AED {item.unitPrice.toFixed(2)}
                                  </p>
                                  {('productType' in item && item.productType === 'hoodie') && (
                                    <p className="text-xs text-muted-foreground">
                                      Color: {(item as HoodieCartItem).selectedColor.name}, Size: {(item as HoodieCartItem).selectedSize.name}
                                    </p>
                                  )}
                                  {('productType' in item && item.productType === 'sweatpants') && (
                                    <p className="text-xs text-muted-foreground">
                                      Color: {(item as SweatpantsCartItem).selectedColor.name}, Size: {(item as SweatpantsCartItem).selectedSize.name}
                                    </p>
                                  )}
                                  {('productType' in item && item.productType === 'bracelet') && (
                                    <div className="mt-1">
                                      <p className="text-xs font-medium">Charms:</p>
                                      {renderCharmListMini((item as BraceletCartItem).selectedCharms, INCLUDED_CHARMS_COUNT)}
                                    </div>
                                  )}
                                  {('productType' in item && item.productType === 'matchingSet') && (
                                    <div className="mt-1 space-y-1">
                                      {(item as MatchingSetCartItem).braceletsCustomization.map(bc => (
                                        <div key={bc.braceletId}>
                                          <p className="text-xs font-medium">{bc.braceletName} Charms:</p>
                                          {renderCharmListMini(bc.selectedCharms, INCLUDED_CHARMS_PER_BRACELET_IN_SET)}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {('details' in item && item.details) && (
                                      <p className="text-xs text-muted-foreground"><em>Details: {item.details}</em></p>
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
                          <span className="text-accent">AED {(orderState === 'form' ? cartTotal : confirmedOrderData?.cartTotal || 0).toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-3xl text-primary flex items-center">
                          <MapPin className="mr-2 h-7 w-7 text-primary" /> Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="streetAddress" className="text-lg">Street Address*</Label>
                          <Input id="streetAddress" type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="e.g., 123 Main St" required className="mt-1 text-base"/>
                        </div>
                        <div>
                          <Label htmlFor="apartmentSuite" className="text-lg">Apartment, suite, etc. (optional)</Label>
                          <Input id="apartmentSuite" type="text" value={apartmentSuite} onChange={(e) => setApartmentSuite(e.target.value)} placeholder="e.g., Apt 4B, Unit 12" className="mt-1 text-base"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-lg">City*</Label>
                            <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Dubai" required className="mt-1 text-base"/>
                          </div>
                           <div>
                            <Label htmlFor="zipCode" className="text-lg">ZIP / Postal Code (optional)</Label>
                            <Input id="zipCode" type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="e.g., 00000" className="mt-1 text-base"/>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">* Required field</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-1">
                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-3xl text-primary flex items-center">
                          <Lock className="mr-2 h-7 w-7 text-primary" /> Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <fieldset disabled={orderState === 'editingAddress'} className="space-y-6">
                          <RadioGroup
                            value={selectedPaymentMethod}
                            onValueChange={(value: string) => setSelectedPaymentMethod(value as PaymentMethod)}
                            className="space-y-3 mb-6"
                          >
                            <Label htmlFor="payment-card" className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'card' ? 'border-accent ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/30'} ${orderState === 'editingAddress' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                              <RadioGroupItem value="card" id="payment-card" disabled={orderState === 'editingAddress'} />
                              <CreditCard className="h-6 w-6 text-primary" />
                              <span className="text-lg font-medium">Debit/Credit Card</span>
                            </Label>
                            <Label htmlFor="payment-cash" className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'cash' ? 'border-accent ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/30'} ${orderState === 'editingAddress' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                              <RadioGroupItem value="cash" id="payment-cash" disabled={orderState === 'editingAddress'} />
                              <Truck className="h-6 w-6 text-primary" />
                              <span className="text-lg font-medium">Cash on Delivery</span>
                            </Label>
                            <Label htmlFor="payment-applepay" className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'applepay' ? 'border-accent ring-2 ring-accent bg-accent/10' : 'hover:bg-muted/30'} ${orderState === 'editingAddress' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                              <RadioGroupItem value="applepay" id="payment-applepay" disabled={orderState === 'editingAddress'} />
                              <Apple className="h-6 w-6 text-primary" />
                              <span className="text-lg font-medium">Apple Pay</span>
                            </Label>
                          </RadioGroup>

                          {selectedPaymentMethod === 'card' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                              <div>
                                <Label htmlFor="nameOnCard" className="text-lg">Name on Card</Label>
                                <Input id="nameOnCard" type="text" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} placeholder="Full Name" required={selectedPaymentMethod === 'card' && orderState === 'form'} className="mt-1 text-base" disabled={orderState === 'editingAddress'}/>
                              </div>
                              <div>
                                <Label htmlFor="cardNumber" className="text-lg">Card Number</Label>
                                <Input id="cardNumber" type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} placeholder="0000 0000 0000 0000" required={selectedPaymentMethod === 'card' && orderState === 'form'} className="mt-1 text-base" maxLength={19} disabled={orderState === 'editingAddress'}/>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiryDate" className="text-lg">Expiry Date</Label>
                                  <Input id="expiryDate" type="text" value={expiryDate} onChange={(e) => { let val = e.target.value.replace(/\D/g, ''); if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2); setExpiryDate(val.slice(0,5));}} placeholder="MM/YY" required={selectedPaymentMethod === 'card' && orderState === 'form'} className="mt-1 text-base" maxLength={5} disabled={orderState === 'editingAddress'}/>
                                </div>
                                <div>
                                  <Label htmlFor="cvv" className="text-lg">CVV</Label>
                                  <Input id="cvv" type="text" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))} placeholder="123" required={selectedPaymentMethod === 'card' && orderState === 'form'} className="mt-1 text-base" maxLength={4} disabled={orderState === 'editingAddress'}/>
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedPaymentMethod === 'cash' && (
                            <div className="p-4 border rounded-lg bg-muted/20 text-center animate-in fade-in duration-300">
                              <Truck className="h-12 w-12 text-primary mx-auto mb-2" />
                              <p className="text-muted-foreground">You will pay AED {(orderState === 'form' ? cartTotal : confirmedOrderData?.cartTotal || 0).toFixed(2)} upon delivery.</p>
                            </div>
                          )}
                          {selectedPaymentMethod === 'applepay' && (
                            <div className="p-4 border rounded-lg bg-muted/20 text-center animate-in fade-in duration-300">
                              <Apple className="h-12 w-12 text-primary mx-auto mb-2" />
                              <p className="text-muted-foreground">Proceed to finalize payment with Apple Pay.</p>
                              <Button variant="outline" className="mt-3 bg-black text-white hover:bg-gray-800 w-full" disabled={orderState === 'editingAddress' || isLoading}>Pay with <Apple className="ml-2 h-5 w-5 fill-white"/></Button>
                            </div>
                          )}
                        </fieldset>
                      </CardContent>
                      <CardFooter className="p-0 pt-6 px-6">
                        {orderState === 'form' && (
                            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-7" disabled={isLoading}>
                                {isLoading ? 'Processing...' : `Pay AED ${cartTotal.toFixed(2)}`}
                            </Button>
                        )}
                        {orderState === 'editingAddress' && (
                            <div className="w-full space-y-2">
                                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-7" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Save Changes & Resend Confirmation'}
                                </Button>
                                <Button variant="outline" size="lg" className="w-full text-lg" onClick={() => setOrderState('confirmed')} disabled={isLoading}>
                                    Cancel Edit
                                </Button>
                            </div>
                        )}
                      </CardFooter>
                    </Card>
                    {orderState === 'form' && <p className="text-sm text-muted-foreground mt-4 text-center">This is a demo. No real payment will be processed.</p>}
                  </div>
                </div>
              </fieldset>
            </form>
          )}

          {orderState === 'confirmed' && confirmedOrderData && (
            <div className="space-y-8">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl text-primary flex items-center gap-2"><CheckCircle className="h-8 w-8 text-green-500" /> Order Confirmed!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-lg">Thank you, {confirmedOrderData.customerName}! Your order has been successfully placed. A <strong>simulated</strong> confirmation email has been logged to the server console for {confirmedOrderData.recipientEmail}.</p>
                        
                        <div>
                            <h3 className="text-2xl font-semibold text-primary mb-2">Shipping Address</h3>
                            <p className="text-lg text-muted-foreground">
                                {confirmedOrderData.shippingAddress.streetAddress}<br />
                                {confirmedOrderData.shippingAddress.apartmentSuite && `${confirmedOrderData.shippingAddress.apartmentSuite}<br />`}
                                {confirmedOrderData.shippingAddress.city}<br />
                                {confirmedOrderData.shippingAddress.zipCode && `${confirmedOrderData.shippingAddress.zipCode}<br />`}
                                United Arab Emirates
                            </p>
                        </div>
                        <Separator/>
                        <div>
                            <h3 className="text-2xl font-semibold text-primary mb-2">Payment Method</h3>
                            <p className="text-lg text-muted-foreground">{confirmedOrderData.paymentMethod}</p>
                        </div>
                        <Separator/>
                         <div>
                            <h3 className="text-2xl font-semibold text-primary mb-2">Order Summary</h3>
                             <ScrollArea className="h-[200px] pr-4">
                                <div className="space-y-4">
                                {confirmedOrderData.items.map((item, index) => (
                                  <div key={`confirmed-item-summary-${index}`} className="flex items-start space-x-3 p-3 border rounded-md bg-card/30">
                                    <Image src={`https://picsum.photos/seed/${item.name}/50/66`} alt={item.name} width={50} height={66} className="rounded object-cover aspect-[3/4]" data-ai-hint="product item small" />
                                    <div className="flex-1">
                                      <p className="font-semibold">{item.name} (x{item.quantity})</p>
                                      {item.details && <p className="text-xs text-muted-foreground"><em>{item.details}</em></p>}
                                    </div>
                                    <p className="font-semibold text-accent">AED {item.itemTotal.toFixed(2)}</p>
                                  </div>
                                ))}
                                </div>
                            </ScrollArea>
                            <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t">
                              <span>Total:</span>
                              <span className="text-accent">AED {confirmedOrderData.cartTotal.toFixed(2)}</span>
                            </div>
                        </div>


                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <Button onClick={startEditAddress} variant="outline" size="lg" className="text-lg flex-1">
                               <Edit className="mr-2 h-5 w-5" /> Edit Shipping Address
                            </Button>
                            <Button onClick={handleCompleteOrder} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg flex-1">
                               <PackageCheck className="mr-2 h-5 w-5" /> Looks Good, Complete Order
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
          )}
           {orderState === 'submitting' && (
            <div className="text-center py-16">
                <div role="status" className="flex justify-center items-center">
                    <svg aria-hidden="true" className="w-12 h-12 text-muted-foreground animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Processing...</span>
                </div>
                <p className="text-2xl font-semibold text-primary mt-4">Processing your order...</p>
            </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

