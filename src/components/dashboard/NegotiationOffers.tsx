// src/components/dashboard/NegotiationOffers.tsx
import React, { useState, useEffect } from 'react'; // Added React import
import {
  AlertCircle,
  Check,
  X,
  Loader2,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getFarmerOffers,
  acceptFarmerOffer,
  rejectFarmerOffer,
  Offer as NegotiationOfferData, // Using the Offer interface from service
  ApiErrorResponse,
} from '@/services/negotiationService'; // Assuming negotiationService is in src/services
import { useAuth } from '@/context/AuthContext'; // To ensure farmer is logged in

// Helper for offer status styling
const getOfferStatusBadgeVariant = (
  status: NegotiationOfferData['status']
): 'default' | 'secondary' | 'destructive' | 'success' | 'outline' => {
  switch (status) {
    case 'pending':
      return 'default'; // Blue-ish for pending
    case 'accepted':
      return 'success'; // Green for accepted
    case 'rejected':
      return 'destructive'; // Red for rejected
    case 'expired':
      return 'secondary'; // Grey for expired
    default:
      return 'secondary';
  }
};

export const NegotiationOffers = () => {
  const { isAuthenticated, user } = useAuth();
  const [offers, setOffers] = useState<NegotiationOfferData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  ); // For individual offer actions

  const fetchOffers = async () => {
    if (!isAuthenticated || user?.role !== 'farmer') {
      // setError("You must be logged in as a farmer to view offers.");
      setIsLoading(false);
      setOffers([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFarmerOffers();
      setOffers(response.data.offers || []);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Failed to load negotiation offers.');
      toast.error(apiError.message || 'Failed to load offers.');
      console.error('Fetch farmer offers error:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [isAuthenticated, user]); // Re-fetch if auth state changes

  const handleOfferAction = async (
    offerId: string,
    action: 'accept' | 'reject'
  ) => {
    setActionLoading((prev) => ({ ...prev, [offerId]: true }));
    try {
      if (action === 'accept') {
        await acceptFarmerOffer(offerId);
        toast.success(
          `Offer ${offerId.substring(
            0,
            6
          )}... accepted! The item has been added to the consumer's cart.`
        );
      } else {
        await rejectFarmerOffer(offerId);
        toast.info(`Offer ${offerId.substring(0, 6)}... rejected.`);
      }
      // Refresh offers after action
      await fetchOffers();
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      toast.error(apiError.message || `Failed to ${action} offer.`);
      console.error(`Error ${action}ing offer:`, apiError);
    } finally {
      setActionLoading((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  if (!isAuthenticated || user?.role !== 'farmer') {
    return (
      <div className='space-y-4 mt-8 p-6 border rounded-lg bg-yellow-50 text-yellow-700 text-center'>
        <AlertCircle className='h-8 w-8 mx-auto mb-2' />
        <p>Please log in as a farmer to view and manage negotiation offers.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4 mt-8 text-center py-10'>
        <Loader2 className='h-10 w-10 animate-spin text-primary mx-auto' />
        <p className='mt-2 text-muted-foreground'>
          Loading negotiation offers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4 mt-8 text-center py-10 text-destructive'>
        <AlertCircle className='h-10 w-10 mx-auto' />
        <p className='mt-2'>{error}</p>
        <Button onClick={fetchOffers} variant='outline'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-8'>
      {' '}
      {/* Increased spacing */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <div className='flex items-center gap-2'>
          <AlertCircle className='h-6 w-6 text-primary' />{' '}
          {/* Slightly larger icon */}
          <h2 className='text-xl lg:text-2xl font-semibold text-gray-800'>
            Negotiation Offers Received
          </h2>
        </div>
        <Button
          onClick={fetchOffers}
          variant='outline'
          size='sm'
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />{' '}
          Refresh Offers
        </Button>
      </div>
      <Card className='shadow-md'>
        <CardHeader className='pb-3 border-b'>
          {' '}
          {/* Added border and adjusted padding */}
          <CardTitle className='text-lg text-gray-700'>Recent Offers</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {offers.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <ShoppingBag className='h-12 w-12 mx-auto mb-3 text-gray-400' />
              <p>You have no pending negotiation offers at the moment.</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {offers.map((offer) => {
                const offerPriceNum = parseFloat(offer.offer_price_per_unit);
                const quantityNum = parseInt(offer.quantity);
                // Original price isn't directly in the offer object from backend,
                // but you might fetch product details or have it if backend joins
                // For now, we'll just show offered price.
                // const originalPriceNum = offer.originalPrice ? parseFloat(offer.originalPrice.replace('₹','').replace(',','')) : null;

                return (
                  <div
                    key={offer.id}
                    className='p-4 md:p-5 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors'
                  >
                    <div className='flex justify-between items-start'>
                      <div className='flex gap-3 items-start'>
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback className='bg-secondary text-secondary-foreground text-sm'>
                            {offer.consumer_name
                              ? offer.consumer_name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className='flex items-center gap-2 mb-0.5'>
                            <p className='font-semibold text-gray-800'>
                              {offer.consumer_name || 'Unknown User'}
                            </p>
                            {/* 'isNew' isn't from backend, can be derived from offer_date vs last viewed time, or if status is pending */}
                            {offer.status === 'pending' && (
                              <Badge className='bg-blue-500 text-white text-xs px-1.5 py-0.5'>
                                New
                              </Badge>
                            )}
                          </div>
                          <Link
                            to={`/products/${offer.product_id}`}
                            className='text-sm text-muted-foreground hover:underline hover:text-primary'
                          >
                            Product: {offer.product_name}
                          </Link>
                          <p className='text-sm mt-0.5'>
                            {/* Original Price could be shown if available on 'offer' object from backend */}
                            {/* {originalPriceNum && <span className="line-through text-gray-500">₹{originalPriceNum.toFixed(2)}</span>} */}
                            {/* {originalPriceNum && " → "} */}
                            Offered:{' '}
                            <span className='font-medium text-primary'>
                              ₹{offerPriceNum.toFixed(2)}
                            </span>{' '}
                            / unit
                            <span className='text-gray-600'>
                              {' '}
                              x {quantityNum} units
                            </span>
                          </p>
                          <p className='text-xs text-muted-foreground mt-0.5'>
                            Offer Date:{' '}
                            {new Date(offer.offer_date).toLocaleDateString()}
                            {offer.response_date &&
                              ` | Responded: ${new Date(
                                offer.response_date
                              ).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      {/* Offer Status */}
                      <Badge
                        variant={getOfferStatusBadgeVariant(offer.status)}
                        className='text-xs shrink-0'
                      >
                        {offer.status.charAt(0).toUpperCase() +
                          offer.status.slice(1)}
                      </Badge>
                    </div>

                    {offer.status === 'pending' && ( // Only show action buttons for pending offers
                      <div className='flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100 mt-2'>
                        <Button
                          size='sm'
                          className='flex-1'
                          onClick={() => handleOfferAction(offer.id, 'accept')}
                          disabled={actionLoading[offer.id]}
                        >
                          {actionLoading[offer.id] ? (
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                          ) : (
                            <Check className='h-4 w-4 mr-2' />
                          )}
                          Accept
                        </Button>
                        <Button
                          size='sm'
                          variant='outline' // Or ghost
                          className='flex-1 '
                          onClick={() => handleOfferAction(offer.id, 'reject')}
                          disabled={actionLoading[offer.id]}
                        >
                          {actionLoading[offer.id] ? (
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                          ) : (
                            <X className='h-4 w-4 mr-2' />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
