
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { PastOrder, EmailOrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, ShoppingBag, PackageSearch, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function PastOrdersPage() {
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const storedOrdersString = localStorage.getItem('pastOrders');
        if (storedOrdersString) {
          const parsedOrders: PastOrder[] = JSON.parse(storedOrdersString);
          // Sort orders by date, newest first
          parsedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
          setPastOrders(parsedOrders);
        }
      } catch (e) {
        console.error("Failed to load past orders from localStorage", e);
        setError("Could not load your order history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  

  if (!hasMounted || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-4 md:p-8 text-center">
          <History className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-3xl font-semibold text-primary">Loading Order History...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 bg-transparent">
          <div className="container mx-auto text-center py-16">
            <AlertCircle className="h-24 w-24 text-destructive mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-destructive mb-4">Error Loading History</h1>
            <p className="text-xl text-muted-foreground">{error}</p>
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
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-primary mb-3 flex items-center justify-center gap-3">
              <History className="h-12 w-12 text-accent" />
              Your Past Orderz
            </h1>
            <p className="text-xl text-muted-foreground">
              Review your previous purchases with cœzii.
            </p>
          </div>

          {pastOrders.length === 0 ? (
            <div className="text-center py-16">
              <PackageSearch className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-3xl font-semibold mb-2 text-foreground">No Past Orderz Found</h2>
              <p className="text-lg text-muted-foreground mb-6">
                You haven't placed any orders yet. Start shopping to see your history here!
              </p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="/all-products">Explore Productz</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {pastOrders.map((order) => (
                <Card key={order.orderId} className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="cursor-pointer hover:bg-muted/30 rounded-t-lg" onClick={() => toggleOrderDetails(order.orderId)}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <CardTitle className="text-2xl text-primary">Order ID: {order.orderId.split('-').pop()?.toUpperCase()}</CardTitle>
                        <CardDescription className="text-lg">
                          Placed on: {format(parseISO(order.orderDate), "MMMM d, yyyy 'at' h:mm a")}
                        </CardDescription>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-2xl font-bold text-accent">AED {order.cartTotal.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedOrderId === order.orderId && (
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-xl font-semibold text-primary mb-2">Shipping Address</h4>
                          <address className="not-italic text-muted-foreground text-base">
                            {order.shippingAddress.streetAddress}<br />
                            {order.shippingAddress.apartmentSuite && `${order.shippingAddress.apartmentSuite}<br />`}
                            {order.shippingAddress.city}, {order.shippingAddress.emirate}<br />
                            {order.shippingAddress.zipCode && `${order.shippingAddress.zipCode}<br />`}
                            United Arab Emirates
                          </address>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-primary mb-2">Payment Method</h4>
                          <p className="text-muted-foreground text-base">{order.paymentMethod}</p>
                           <h4 className="text-xl font-semibold text-primary mb-1 mt-3">Customer Name</h4>
                          <p className="text-muted-foreground text-base">{order.customerName}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <h4 className="text-xl font-semibold text-primary mb-3">Items in this Order</h4>
                      <ScrollArea className="h-[250px] pr-3">
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={`${order.orderId}-item-${index}`} className="flex items-start space-x-3 p-3 border rounded-md bg-card/50 shadow-sm my-2">
                              <Image 
                                src={`https://picsum.photos/seed/${encodeURIComponent(item.name)}/60/80`} 
                                alt={item.name} 
                                width={60} 
                                height={80} 
                                className="rounded-md object-cover aspect-[3/4]"
                                data-ai-hint="product item past order"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{item.name} (x{item.quantity})</p>
                                <p className="text-sm text-muted-foreground">Unit Price: AED {item.unitPrice.toFixed(2)}</p>
                                {item.details && <p className="text-xs text-muted-foreground mt-1"><em>Details: {item.details}</em></p>}
                              </div>
                              <p className="font-semibold text-accent text-lg">AED {item.itemTotal.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  )}
                  <CardFooter className="p-4 justify-end">
                     <Button variant="outline" onClick={() => toggleOrderDetails(order.orderId)}>
                        {expandedOrderId === order.orderId ? 'Hide Details' : 'View Details'}
                      </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

