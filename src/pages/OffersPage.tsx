// src/pages/OffersPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { offers as dummyPromotionalOffers } from '@/lib/data'; // Renamed for clarity
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  ArrowRight,
  Copy,
  Check,
  Tag,
  Package,
  XCircle,
  Loader2,
  Info,
  ShoppingBag,
  CalendarDays,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  getConsumerOffers,
  Offer as NegotiationOffer, // Renamed to avoid conflict with dummyOffers structure
  // cancelMyOffer, // Uncomment and implement if backend route exists
  ApiErrorResponse,
} from '@/services/negotiationService';

// Helper for negotiation offer status
const getNegotiationOfferStatusVisuals = (
  status: NegotiationOffer['status']
) => {
  switch (status) {
    case 'pending':
      return {
        text: 'Pending Review',
        variant: 'default' as const,
        icon: <Package size={14} className='mr-1.5' />,
      };
    case 'accepted':
      return {
        text: 'Accepted by Farmer',
        variant: 'success' as const,
        icon: <Check size={14} className='mr-1.5' />,
      };
    case 'rejected':
      return {
        text: 'Rejected by Farmer',
        variant: 'destructive' as const,
        icon: <XCircle size={14} className='mr-1.5' />,
      };
    case 'expired':
      return {
        text: 'Offer Expired',
        variant: 'secondary' as const,
        icon: <XCircle size={14} className='mr-1.5' />,
      };
    default:
      return {
        text: 'Unknown Status',
        variant: 'secondary' as const,
        icon: <Info size={14} className='mr-1.5' />,
      };
  }
};

export default function OffersPage() {
  const { isAuthenticated } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [myNegotiationOffers, setMyNegotiationOffers] = useState<
    NegotiationOffer[]
  >([]);
  const [isLoadingNegotiations, setIsLoadingNegotiations] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMyNegotiationOffers = async () => {
        setIsLoadingNegotiations(true);
        try {
          const response = await getConsumerOffers();
          setMyNegotiationOffers(response.data.offers || []);
        } catch (error) {
          const apiError = error as ApiErrorResponse;
          toast.error(
            apiError.message || 'Failed to load your negotiation offers.'
          );
          console.error('Fetch consumer offers error:', apiError);
        } finally {
          setIsLoadingNegotiations(false);
        }
      };
      fetchMyNegotiationOffers();
    } else {
      setMyNegotiationOffers([]); // Clear if not authenticated
    }
  }, [isAuthenticated]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast.success('Coupon code copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const handleCancelNegotiationOffer = async (offerId: string) => {
    toast.info(
      `Cancel functionality for offer ID ${offerId.substring(
        0,
        8
      )}... is not yet implemented.`
    );
    // TODO: Implement cancelMyOffer if backend route exists
    // if (window.confirm("Are you sure you want to cancel this negotiation offer?")) {
    //   setIsLoadingNegotiations(true); // Or a specific loading state for cancelling
    //   try {
    //     await cancelMyOffer(offerId); // Assuming cancelMyOffer exists in negotiationService
    //     toast.success("Negotiation offer cancelled.");
    //     // Re-fetch offers to update the list
    //     const response = await getConsumerOffers();
    //     setMyNegotiationOffers(response.data.offers || []);
    //   } catch (error) {
    //     const apiError = error as ApiErrorResponse;
    //     toast.error(apiError.message || "Failed to cancel negotiation offer.");
    //   } finally {
    //     setIsLoadingNegotiations(false);
    //   }
    // }
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <Header />
      <main className='flex-1 py-8'>
        <div className='container mx-auto px-4'>
          {/* Section 1: Promotional Offers / Coupon Codes (Using dummy data) */}
          <section id='promotional-offers' className='mb-16'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-kisan-primary md:text-3xl'>
                  Current Promo Codes & Deals
                </h1>
                <p className='mt-2 text-gray-600'>
                  Exclusive deals and discounts on farm-fresh produce.
                </p>
              </div>
            </div>

            {/* Featured Offer (from dummy data) */}
            <div className='mb-12 overflow-hidden rounded-lg bg-gradient-to-r from-kisan-peach to-kisan-light shadow-lg'>
              <div className='grid grid-cols-1 md:grid-cols-2'>
                <div className='p-8 md:p-12'>
                  <Badge
                    variant='destructive'
                    className='mb-4 bg-red-500 text-white'
                  >
                    Limited Time
                  </Badge>
                  <h2 className='mb-4 text-3xl font-bold text-kisan-primary'>
                    First Purchase Discount
                  </h2>
                  <p className='mb-6 text-kisan-primary/90'>
                    Get 10% off on your first purchase with us! Use code
                    FIRSTBUY at checkout.
                  </p>
                  <div className='flex flex-wrap items-center gap-4'>
                    <div className='flex items-center rounded-md border border-kisan-primary bg-white px-4 py-2 shadow-sm'>
                      <span className='mr-3 font-mono text-lg font-medium text-kisan-primary'>
                        FIRSTBUY
                      </span>
                      <button
                        onClick={() => copyToClipboard('FIRSTBUY')}
                        className='text-kisan-accent hover:text-kisan-accent/80'
                      >
                        {copiedCode === 'FIRSTBUY' ? (
                          <Check className='h-5 w-5 text-green-600' />
                        ) : (
                          <Copy className='h-5 w-5' />
                        )}
                      </button>
                    </div>
                    <Link to='/products'>
                      <Button className='bg-kisan-primary text-white hover:bg-kisan-primary/90'>
                        Shop Now <ArrowRight className='ml-2 h-4 w-4' />
                      </Button>
                    </Link>
                  </div>
                  <p className='mt-4 text-xs text-kisan-primary/70'>
                    Valid until Dec 31, {new Date().getFullYear()}. Min. order
                    ₹500.
                  </p>
                </div>
                {/* Optional: Add an image for the featured offer on md screens */}
                <div
                  className='hidden md:block bg-cover bg-center'
                  style={{
                    backgroundImage:
                      "url('https://via.placeholder.com/600x400?text=Farm+Fresh+Offer')",
                  }}
                ></div>
              </div>
            </div>

            {/* All Other Promotional Offers Grid (from dummy data) */}
            {dummyPromotionalOffers && dummyPromotionalOffers.length > 0 && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {dummyPromotionalOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className='overflow-hidden shadow-md hover:shadow-lg transition-shadow'
                  >
                    <CardHeader>
                      <CardTitle className='text-kisan-secondary'>
                        {offer.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='mb-4 text-sm text-gray-600'>
                        {offer.description}
                      </p>
                      <div className='mb-4 flex items-center'>
                        <div className='mr-2 rounded-md bg-gray-100 px-3 py-1.5 border border-dashed border-kisan-accent'>
                          <span className='font-mono text-base font-medium text-kisan-primary'>
                            {offer.code}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(offer.code)}
                          className='flex items-center text-sm text-kisan-accent hover:text-kisan-accent/80'
                        >
                          {copiedCode === offer.code ? (
                            <>
                              <Check className='mr-1 h-4 w-4 text-green-600' />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className='mr-1 h-4 w-4' />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className='mt-3 text-xs text-gray-500'>
                        Valid until{' '}
                        {new Date(offer.validUntil).toLocaleDateString(
                          'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </p>
                    </CardContent>
                    {/* <CardFooter>
                      <Link to='/products' className='w-full'>
                        <Button className='w-full bg-kisan-primary text-white hover:bg-kisan-primary/90'>
                          Shop This Offer
                        </Button>
                      </Link>
                    </CardFooter> */}
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Section 2: My Price Negotiations (Consumer's Sent Offers) */}
          {isAuthenticated && (
            <section
              id='my-negotiations'
              className='mt-12 pt-10 border-t border-gray-300'
            >
              <div className='mb-8 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-kisan-primary md:text-3xl flex items-center'>
                  <Tag className='mr-3 h-7 w-7 text-kisan-accent' /> My Sent
                  Negotiation Offers
                </h2>
                {/* Optional: Filters for negotiation status */}
              </div>

              {isLoadingNegotiations ? (
                <div className='text-center py-10 flex flex-col items-center justify-center'>
                  <Loader2 className='h-10 w-10 animate-spin text-kisan-primary mb-3' />
                  <p className='text-gray-600'>
                    Loading your negotiation offers...
                  </p>
                </div>
              ) : myNegotiationOffers.length === 0 ? (
                <div className='text-center py-10 bg-white p-8 rounded-lg shadow'>
                  <ShoppingBag className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600 mb-3'>
                    You haven't made any price negotiation offers yet.
                  </p>
                  <Link to='/products'>
                    <Button variant='outline'>
                      Browse Products to Negotiate
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className='space-y-6'>
                  {myNegotiationOffers.map((offer) => {
                    const statusVisuals = getNegotiationOfferStatusVisuals(
                      offer.status
                    );
                    const offerPriceNum = parseFloat(
                      offer.offer_price_per_unit
                    );
                    const offerQuantityNum = parseInt(offer.quantity);
                    const totalOfferedValue = offerPriceNum * offerQuantityNum;

                    return (
                      <Card
                        key={offer.id}
                        className='shadow-md hover:shadow-lg transition-shadow'
                      >
                        <CardHeader className='pb-3'>
                          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                            <Link
                              to={`/products/${offer.product_id}`}
                              className='hover:underline'
                            >
                              <CardTitle className='text-lg text-kisan-secondary mb-1 sm:mb-0'>
                                Offer for: {offer.product_name}
                              </CardTitle>
                            </Link>
                            <Badge
                              variant={statusVisuals.variant}
                              className='text-xs px-2 py-1 mt-1 sm:mt-0'
                            >
                              {statusVisuals.icon} {statusVisuals.text}
                            </Badge>
                          </div>
                          <CardDescription className='text-xs text-gray-500 pt-1'>
                            To: {offer.farmer_name || 'Farmer'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='text-sm text-gray-700 space-y-2'>
                          <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2'>
                            <div>
                              <strong>Offer Price:</strong> ₹
                              {offerPriceNum.toFixed(2)} /unit
                            </div>
                            <div>
                              <strong>Quantity:</strong> {offerQuantityNum}{' '}
                              units
                            </div>
                            <div>
                              <strong>Total Offer:</strong> ₹
                              {totalOfferedValue.toFixed(2)}
                            </div>
                            <div className='flex items-center col-span-2 sm:col-span-1'>
                              <CalendarDays
                                size={14}
                                className='mr-1.5 text-gray-500'
                              />{' '}
                              <strong>Offer Date:</strong>{' '}
                              {new Date(offer.offer_date).toLocaleDateString()}
                            </div>
                            {offer.response_date && (
                              <div className='flex items-center col-span-2 sm:col-span-2'>
                                <CalendarDays
                                  size={14}
                                  className='mr-1.5 text-gray-500'
                                />{' '}
                                <strong>Response Date:</strong>{' '}
                                {new Date(
                                  offer.response_date
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {!isAuthenticated && (
            <section className='mt-16 pt-8 border-t text-center'>
              <Tag className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600 mb-3'>
                <Link
                  to='/login'
                  className='text-kisan-accent underline font-medium'
                >
                  Login
                </Link>{' '}
                or{' '}
                <Link
                  to='/signup'
                  className='text-kisan-accent underline font-medium'
                >
                  Sign up
                </Link>{' '}
                to view and manage your price negotiations.
              </p>
            </section>
          )}

          {/* Terms and Conditions for Promotional Offers */}
          <div className='mt-16 rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-4 text-lg font-medium text-kisan-primary'>
              Promo Offer Terms
            </h3>
            <div className='space-y-2 text-xs text-gray-600'>
              <p>• Promotional offers cannot typically be combined.</p>
              <p>
                • Kisan Choice reserves the right to modify/cancel promo offers.
              </p>
              {/* ... other T&C points ... */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
