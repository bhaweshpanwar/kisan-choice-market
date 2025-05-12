// src/pages/CartPage.tsx
import { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // To check authentication
import {
  getMyAddresses,
  Address,
  ApiErrorResponse as AddressApiErrorResponse, // Avoid naming conflict
} from '@/services/addressService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // For address dropdown
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Alternative for address selection
import {
  Plus,
  Minus,
  X,
  ShoppingCart,
  ArrowRight,
  Tag,
  Info,
} from 'lucide-react';
import { Label } from '@/components/ui/label'; // Add this import for Label
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge'; // Add this import for Badge
// import { getCheckoutSession } from '@/services/cartService'; // For Stripe if you implement it
import { loadStripe } from '@stripe/stripe-js'; // For Stripe
import {
  initiateCheckout,
  getStripeCheckoutSession,
  InitiateCheckoutPayload,
  StripeSessionPayload,
  getCheckoutSession,
} from '../../src/services/cartService'; // or your correct path
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''); // For Stripe

export default function CartPage() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  // console.log(stripePromise);

  const {
    cartItems,
    removeItemFromCart,
    updateItemQuantity,
    cartTotal,
    clearEntireCart,
    isLoading: isCartLoading,
    fetchCart, // To refresh cart on mount
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Local state for coupon, shipping, etc. (can be moved to context if complex)
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(); // Fetch cart if authenticated

      const fetchUserAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
          const response = await getMyAddresses();
          const fetchedAddresses = response.data.addresses || [];
          setAddresses(fetchedAddresses);
          // Automatically select the primary address, or the first one if no primary
          const primaryAddress = fetchedAddresses.find(
            (addr) => addr.is_primary
          );
          if (primaryAddress) {
            setSelectedAddressId(primaryAddress.id);
          } else if (fetchedAddresses.length > 0) {
            setSelectedAddressId(fetchedAddresses[0].id);
          }
        } catch (error) {
          console.error('Failed to fetch addresses for cart:', error);
          // toast.error("Could not load your addresses."); // Optional: can be noisy
        } finally {
          setIsLoadingAddresses(false);
        }
      };
      fetchUserAddresses();
    }
  }, [isAuthenticated, fetchCart]);

  const shippingFee = cartTotal > 2000 ? 0 : cartItems.length > 0 ? 150 : 0; // Only apply shipping if items exist
  const totalWithShippingAndDiscount = cartTotal + shippingFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRSTBUY') {
      setDiscount(cartTotal * 0.1);
      setAppliedCoupon(couponCode);
      toast.success("Coupon 'FIRSTBUY' applied!");
    } else if (couponCode.toUpperCase() === 'MONSOON2024') {
      setDiscount(cartTotal * 0.15);
      setAppliedCoupon(couponCode);
      toast.success("Coupon 'MONSOON2024' applied!");
    } else {
      setDiscount(0);
      setAppliedCoupon('');
      toast.error('Invalid coupon code');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon('');
    toast.info('Coupon removed.');
  };

  // const handleCheckout = async () => {
  //   if (!isAuthenticated) {
  //     toast.error('Please login to proceed.');
  //     navigate('/login', { state: { from: { pathname: '/cart' } } });
  //     return;
  //   }

  //   if (cartItems.length === 0) {
  //     toast.error('Your cart is empty.');
  //     return;
  //   }

  //   if (!selectedAddressId && addresses.length > 0) {
  //     toast.error('Please select a delivery address.');
  //     return;
  //   }

  //   if (addresses.length === 0 && !selectedAddressId) {
  //     toast.error(
  //       'Please add a delivery address in your settings before checking out.'
  //     );
  //     navigate('/settings?tab=addresses');
  //     return;
  //   }
  //   const stripe = await stripePromise;
  //   if (!stripe) {
  //     throw new Error('Stripe failed to initialize.');
  //   }

  //   try {
  //     toast.info('Redirecting to secure payment...');

  //     // Payload to send to backend
  //     const payload = {
  //       address_id: selectedAddressId,
  //       items: cartItems.map((item) => ({
  //         product_id: item.product_id,
  //         quantity: item.quantity,
  //       })),
  //     };

  //     // 1. Get Stripe session from backend
  //     const session = await getCheckoutSession(payload); // This should return the JSON you posted
  //     if (!session?.session?.id) {
  //       console.error('Stripe session ID not found');
  //       return;
  //     }

  //     // 2. Redirect to Stripe checkout

  //     const result = await stripe.redirectToCheckout({
  //       sessionId: session.session.id,
  //     });
  //   } catch (error) {
  //     const apiError = error as AddressApiErrorResponse;
  //     toast.error(apiError.message || 'Checkout failed. Please try again.');
  //     console.error('Stripe checkout error:', apiError);
  //   }
  // };

  // In CartPage.tsx
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed.');
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!selectedAddressId && addresses.length > 0) {
      toast.error('Please select a delivery address.');
      return;
    }

    if (addresses.length === 0 && !selectedAddressId) {
      toast.error(
        'Please add a delivery address in your settings before checking out.'
      );
      navigate('/settings?tab=addresses');
      return;
    }

    const stripeJs = await stripePromise; // Load Stripe.js
    if (!stripeJs) {
      toast.error('Payment system could not be initialized. Please try again.');
      return;
    }

    toast.info('Processing your order...');

    try {
      // Step 1: Call backend to create a PENDING order
      const createOrderPayload: InitiateCheckoutPayload = {
        address_id: selectedAddressId, // Pass the selected address ID
      };
      // This calls POST /api/v1/cart/checkout
      const orderResponse = await initiateCheckout(createOrderPayload);

      if (
        orderResponse.status !== 'success' ||
        !orderResponse.data?.order_id ||
        !orderResponse.data?.items_for_stripe
      ) {
        toast.error(
          orderResponse.message ||
            'Could not initiate your order. Please try again.'
        );
        console.error(
          'Initiate checkout failed or returned unexpected data:',
          orderResponse
        );

        return;
      }

      const { order_id, items_for_stripe } = orderResponse.data;

      // Step 2: Get Stripe session from backend
      const stripeSessionPayload: StripeSessionPayload = {
        order_id: order_id,
        items_for_stripe: items_for_stripe,
      };
      // This calls POST /api/v1/cart/checkout-session
      const stripeSessionData = await getStripeCheckoutSession(
        stripeSessionPayload
      );

      if (
        stripeSessionData.status !== 'success' ||
        !stripeSessionData.session?.id
      ) {
        toast.error(
          stripeSessionData.message ||
            'Could not create payment session. Please try again.'
        );
        console.error(
          'Get Stripe session failed or returned unexpected data:',
          stripeSessionData
        );

        return;
      }

      // Step 3: Redirect to Stripe checkout
      const { error: stripeError } = await stripeJs.redirectToCheckout({
        sessionId: stripeSessionData.session.id,
      });

      if (stripeError) {
        toast.error(
          stripeError.message || 'Redirect to payment failed. Please try again.'
        );
        console.error('Stripe redirection error:', stripeError);
      }
      // If successful, user is on Stripe. If they cancel, they go to cancel_url.
      // If they pay, they go to success_url. Webhook handles the rest.
    } catch (error) {
      const apiError = error as ApiErrorResponse; // Or your aliased AddressApiErrorResponse
      toast.error(apiError.message || 'Checkout failed. Please try again.');
      console.error('Checkout process error:', apiError);
    }
  };

  if (isCartLoading && cartItems.length === 0) {
    // Show loading only if cart is truly empty and loading
    return (
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1 py-8 text-center'>Loading your cart...</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1 py-8'>
        <div className='container mx-auto px-4'>
          <h1 className='mb-8 text-2xl font-bold text-kisan-primary md:text-3xl'>
            Your Cart
          </h1>

          {!isAuthenticated ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <ShoppingCart className='h-16 w-16 text-gray-400 mb-4' />
              <h2 className='text-xl font-medium text-kisan-primary mb-2'>
                Please Login
              </h2>
              <p className='text-gray-500 mb-8'>
                Login to view your cart and continue shopping.
              </p>
              <Link to='/login?redirect=/cart'>
                {' '}
                {/* Pass redirect back to cart */}
                <Button>Login</Button>
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <ShoppingCart className='h-16 w-16 text-gray-400 mb-4' />
              <h2 className='text-xl font-medium text-kisan-primary mb-2'>
                Your cart is empty
              </h2>
              <p className='text-gray-500 mb-8'>
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link to='/products'>
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {/* Left Column: Cart Items List + Address Section */}
              <div className='md:col-span-2 space-y-8'>
                {' '}
                {/* Added space-y-8 to separate cart list and address box */}
                {/* Cart Items List */}
                <div className='rounded-lg border border-gray-200'>
                  <div className='divide-y divide-gray-200'>
                    {/* Table Header */}
                    <div className='grid grid-cols-12 gap-2 p-4 text-sm font-medium text-gray-700 bg-gray-50 rounded-t-lg'>
                      <div className='col-span-12 sm:col-span-6 md:col-span-7'>
                        Product
                      </div>
                      <div className='hidden sm:block sm:col-span-3 md:col-span-3 text-center'>
                        Quantity
                      </div>
                      <div className='hidden sm:block sm:col-span-3 md:col-span-2 text-right'>
                        Subtotal
                      </div>
                    </div>

                    {/* Cart Items Loop */}
                    {cartItems.map((item) => (
                      <div
                        key={item.cart_item_id} // Use the unique cart_item_id
                        className='grid grid-cols-12 gap-2 p-4 items-center'
                      >
                        {/* Product Details Column */}
                        <div className='col-span-12 sm:col-span-6 md:col-span-7'>
                          <div className='flex items-start sm:items-center'>
                            <div className='h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500 shrink-0'>
                              {item.product_name.substring(0, 2).toUpperCase()}{' '}
                              {/* Placeholder if no image */}
                            </div>
                            <div className='ml-4 flex-grow'>
                              <Link to={`/products/${item.product_id}`}>
                                <h3 className='text-sm font-medium text-kisan-primary hover:text-kisan-accent'>
                                  {item.product_name}
                                </h3>
                              </Link>
                              <p className='mt-1 text-xs text-gray-500'>
                                ₹
                                {item.price_per_unit.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                                {item.is_negotiated &&
                                  item.original_product_price && (
                                    <span className='ml-1 line-through text-gray-400'>
                                      ₹
                                      {item.original_product_price.toLocaleString(
                                        undefined,
                                        { minimumFractionDigits: 2 }
                                      )}
                                    </span>
                                  )}
                                {/* Add /unit if you have it */}
                              </p>
                              <p className='mt-1 text-xs text-gray-500'>
                                Sold by: {item.seller_name}
                              </p>
                              {(item.is_negotiated || item.quantity_fixed) && (
                                <div className='mt-1 flex items-center text-xs text-blue-600 bg-blue-50 p-1 rounded'>
                                  <Info size={14} className='mr-1 shrink-0' />
                                  <span className='leading-tight'>
                                    {item.is_negotiated && 'Price Negotiated. '}
                                    {item.quantity_fixed && 'Quantity Fixed.'}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={() =>
                                  removeItemFromCart(item.cart_item_id)
                                }
                                className='mt-2 inline-flex items-center text-xs text-red-500 hover:text-red-700'
                              >
                                <X className='mr-1 h-3 w-3' />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Column */}
                        <div className='col-span-6 sm:col-span-3 md:col-span-3 flex sm:justify-center items-center mt-2 sm:mt-0'>
                          {item.quantity_fixed ? (
                            <span className='text-sm px-3 py-1 bg-gray-100 rounded-md'>
                              {item.quantity}{' '}
                              <span className='text-xs'>(Fixed)</span>
                            </span>
                          ) : (
                            <div className='flex h-8 w-24 items-center border border-gray-300 rounded-md'>
                              <button
                                type='button'
                                className='flex h-full w-8 items-center justify-center border-r text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                                onClick={() =>
                                  updateItemQuantity(
                                    item.cart_item_id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= (item.min_qty || 1)}
                              >
                                <Minus className='h-3 w-3' />
                              </button>
                              <input
                                type='number'
                                className='h-full w-full border-0 text-center text-sm text-gray-700 focus:outline-none focus:ring-0'
                                value={item.quantity}
                                onChange={(e) => {
                                  let val =
                                    parseInt(e.target.value) ||
                                    item.min_qty ||
                                    1;
                                  if (item.min_qty && val < item.min_qty)
                                    val = item.min_qty;
                                  if (item.max_qty && val > item.max_qty)
                                    val = item.max_qty; // Assuming max_qty is on item
                                  updateItemQuantity(item.cart_item_id, val);
                                }}
                                min={item.min_qty || 1}
                                max={item.max_qty || undefined} // Assuming max_qty is on item
                              />
                              <button
                                type='button'
                                className='flex h-full w-8 items-center justify-center border-l text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                                onClick={() =>
                                  updateItemQuantity(
                                    item.cart_item_id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.max_qty
                                    ? item.quantity >= item.max_qty
                                    : false
                                } // Assuming max_qty is on item
                              >
                                <Plus className='h-3 w-3' />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Subtotal Column */}
                        <div className='col-span-6 sm:col-span-3 md:col-span-2 text-right mt-2 sm:mt-0'>
                          <span className='font-medium text-kisan-primary'>
                            ₹
                            {item.total_item_price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Actions */}
                  <div className='flex items-center justify-between border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg'>
                    <Button
                      variant='outline'
                      onClick={clearEntireCart}
                      className='text-sm'
                      disabled={isCartLoading}
                    >
                      Clear Cart
                    </Button>
                    <Link to='/products'>
                      <Button variant='outline' className='text-sm'>
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
                {/* Address Section - THIS IS THE NEWLY ADDED PART */}
                <div className='p-6 rounded-lg border border-gray-200 bg-white'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-medium text-kisan-primary'>
                      Shipping Address
                    </h2>
                    <Link to='/settings' state={{ defaultTab: 'addresses' }}>
                      {' '}
                      {/* Pass state to default to addresses tab */}
                      <Button variant='outline' size='sm' className='text-xs'>
                        <Plus className='mr-1 h-3 w-3' /> Manage Addresses
                      </Button>
                    </Link>
                  </div>
                  {isLoadingAddresses ? (
                    <p className='text-sm text-gray-500'>
                      Loading addresses...
                    </p>
                  ) : addresses.length === 0 ? (
                    <div className='text-center py-4'>
                      <p className='text-sm text-gray-600 mb-2'>
                        No delivery addresses found.
                      </p>
                      <Link to='/settings' state={{ defaultTab: 'addresses' }}>
                        <Button size='sm'>
                          <Plus className='mr-1 h-4 w-4' />
                          Add Delivery Address
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedAddressId || ''}
                      onValueChange={(id) => setSelectedAddressId(id)}
                      className='space-y-3'
                    >
                      {addresses.map((address) => (
                        <Label
                          key={address.id}
                          htmlFor={`address-${address.id}`}
                          className={`flex flex-col p-3  rounded-md cursor-pointer  transition-colors
                                          ${
                                            selectedAddressId === address.id
                                              ? '  bg-kisan-primary/5'
                                              : 'border-gray-200'
                                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center text-sm font-medium text-kisan-primary'>
                              <RadioGroupItem
                                value={address.id}
                                id={`address-${address.id}`}
                                className='mr-3'
                              />
                              {address.name || 'Delivery Address'}{' '}
                              {/* Display address label or user name */}
                            </div>
                            {address.is_primary && (
                              <Badge
                                variant='outline'
                                className='text-xs border-kisan-accent text-kisan-accent'
                              >
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className='ml-7 mt-1 text-xs text-gray-600 space-y-0.5'>
                            {' '}
                            {/* Aligns with RadioGroupItem */}
                            <p>{address.address_line1}</p>
                            {address.address_line2 && (
                              <p>{address.address_line2}</p>
                            )}
                            <p>
                              {address.city}, {address.state} -{' '}
                              {address.postal_code}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>{' '}
              {/* End of md:col-span-2 */}
              {/* Right Column: Order Summary */}
              <div className='md:col-span-1'>
                <div className='rounded-lg border border-gray-200 p-6 sticky top-24'>
                  {' '}
                  {/* sticky top for scroll */}
                  <h2 className='text-lg font-medium text-kisan-primary mb-4'>
                    Order Summary
                  </h2>
                  <div className='space-y-3 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-medium text-kisan-primary'>
                        ₹
                        {cartTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Shipping Fee</span>
                      <span
                        className={
                          shippingFee === 0
                            ? 'text-green-600 font-medium'
                            : 'font-medium text-kisan-primary'
                        }
                      >
                        {shippingFee === 0
                          ? 'Free'
                          : `₹${shippingFee.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className='flex justify-between'>
                        <div className='flex items-center text-green-600'>
                          <span>Discount ({appliedCoupon})</span>
                          <button
                            onClick={removeCoupon}
                            className='ml-1 text-xs text-red-500 hover:text-red-700'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                        <span className='font-medium text-green-600'>
                          -₹
                          {discount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                    <div className='border-t border-gray-200 pt-3 flex justify-between'>
                      <span className='font-medium text-kisan-primary'>
                        Total Amount
                      </span>
                      <span className='text-lg font-semibold text-kisan-primary'>
                        ₹
                        {totalWithShippingAndDiscount.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </div>
                  </div>
                  {!appliedCoupon &&
                    cartTotal > 0 && ( // Show coupon only if no coupon applied and cart has items
                      <div className='mt-4'>
                        <label
                          htmlFor='coupon'
                          className='block text-sm font-medium text-gray-700 mb-1'
                        >
                          Coupon Code
                        </label>
                        <div className='flex space-x-2'>
                          <input
                            type='text'
                            id='coupon'
                            className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-kisan-accent focus:ring-kisan-accent text-sm'
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder='Enter code'
                          />
                          <Button
                            type='button'
                            onClick={handleApplyCoupon}
                            variant='outline'
                            className='text-sm'
                            disabled={!couponCode}
                          >
                            Apply
                          </Button>
                        </div>
                        <div className='mt-1 text-xs text-gray-500'>
                          Try codes: FIRSTBUY, MONSOON2024
                        </div>
                      </div>
                    )}
                  <div className='mt-6'>
                    <Button
                      onClick={handleCheckout}
                      className='w-full bg-black text-white hover:bg-black/90'
                      disabled={
                        isCartLoading ||
                        cartItems.length === 0 ||
                        (addresses.length > 0 && !selectedAddressId)
                      } // Disable if addresses exist but none selected
                    >
                      Proceed to Checkout{' '}
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                  <div className='mt-4 text-center text-xs text-gray-500'>
                    <div className='flex items-center justify-center'>
                      <svg
                        className='h-4 w-4 text-gray-400 mr-1'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                      </svg>
                      Secure Checkout
                    </div>
                    <p className='mt-1'>
                      UPI, Cards, Net Banking, COD options available
                    </p>
                  </div>
                </div>
              </div>{' '}
              {/* End of md:col-span-1 */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
