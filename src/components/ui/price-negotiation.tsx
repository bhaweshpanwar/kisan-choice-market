// src/components/ui/price-negotiation.tsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  sendNegotiationOffer,
  SendOfferPayload,
  ApiErrorResponse,
} from '@/services/negotiationService';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface PriceNegotiationProps {
  productName: string;
  productId: string;
  basePrice: number | string; // Allow string initially, but we'll parse it
  unit?: string;
  minQty?: number;
  maxQty?: number;
}

export function PriceNegotiation({
  productName,
  productId,
  basePrice: initialBasePrice, // Renamed to avoid conflict
  unit = 'unit',
  minQty = 1,
  maxQty, // maxQty can be undefined
}: PriceNegotiationProps) {
  const { isAuthenticated } = useAuth();

  // Parse basePrice to ensure it's a number for calculations
  const basePrice =
    typeof initialBasePrice === 'string'
      ? parseFloat(initialBasePrice)
      : initialBasePrice;

  // Initialize offerPrice based on the parsed numeric basePrice
  const [quantity, setQuantity] = useState<number>(minQty);
  const [offerPrice, setOfferPrice] = useState<number>(() => {
    if (typeof basePrice === 'number' && !isNaN(basePrice)) {
      return parseFloat((basePrice * 0.9).toFixed(2)); // Default offer 10% less, rounded
    }
    return 0; // Fallback if basePrice is not a valid number initially
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Update offerPrice if basePrice prop changes and is valid
  useEffect(() => {
    if (typeof basePrice === 'number' && !isNaN(basePrice)) {
      setOfferPrice(parseFloat((basePrice * 0.9).toFixed(2)));
      // Also ensure minQty is set for quantity if not already
      if (quantity < minQty) {
        setQuantity(minQty);
      }
    }
  }, [basePrice, minQty]); // Add minQty to dependencies if it can change

  const handleQuantityChange = (val: number) => {
    let newQuantity = Math.max(minQty, val);
    if (maxQty !== undefined) {
      // Only apply maxQty if it's defined
      newQuantity = Math.min(maxQty, newQuantity);
    }
    setQuantity(newQuantity);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to send an offer.');
      return;
    }

    if (quantity < minQty) {
      toast.error(`Minimum quantity is ${minQty}.`);
      return;
    }
    if (maxQty !== undefined && quantity > maxQty) {
      toast.error(`Maximum quantity is ${maxQty}.`);
      return;
    }
    if (offerPrice <= 0) {
      toast.error('Offer price must be greater than zero.');
      return;
    }
    if (isNaN(basePrice)) {
      toast.error('Product base price is invalid. Cannot submit offer.');
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    const payload: SendOfferPayload = {
      productId: productId,
      offeredPricePerUnit: offerPrice,
      quantity: quantity,
    };

    try {
      const response = await sendNegotiationOffer(payload);
      if (response.status === 'success') {
        toast.success(response.message || 'Offer sent successfully!');
        setIsSuccess(true);
        if (typeof basePrice === 'number' && !isNaN(basePrice)) {
          setOfferPrice(parseFloat((basePrice * 0.9).toFixed(2)));
        }
        setQuantity(minQty);
        setTimeout(() => setIsSuccess(false), 4000);
      } else {
        toast.error(response.message || 'Failed to send offer.');
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(
        apiError.message || 'An error occurred while sending your offer.'
      );
      console.error('Send offer error:', apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    // ... (Login prompt JSX - this part is fine) ...
    return (
      <div className='rounded-lg border border-gray-200 p-6 text-center'>
        <h3 className='text-lg font-semibold text-kisan-primary mb-3'>
          Interested in this product?
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          <Link to='/login' className='text-kisan-accent underline font-medium'>
            Login
          </Link>{' '}
          or{' '}
          <Link
            to='/signup'
            className='text-kisan-accent underline font-medium'
          >
            Sign up
          </Link>{' '}
          to negotiate the price.
        </p>
      </div>
    );
  }

  // If basePrice is still not a valid number after parsing attempt, show an error or disabled state
  if (isNaN(basePrice)) {
    return (
      <div className='rounded-lg border border-gray-200 p-6'>
        <h3 className='text-xl font-semibold text-kisan-primary mb-6'>
          Negotiate Price for{' '}
          <span className='text-kisan-accent'>{productName}</span>
        </h3>
        <p className='text-red-500'>
          Price information is currently unavailable. Cannot make an offer.
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-gray-200 p-6'>
      <h3 className='text-xl font-semibold text-kisan-primary mb-6'>
        Negotiate Price for{' '}
        <span className='text-kisan-accent'>{productName}</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='neg-quantity'
              className='block text-sm font-medium text-kisan-primary mb-1'
            >
              Quantity (Min: {minQty}{' '}
              {maxQty !== undefined ? `, Max: ${maxQty}` : ''}){' '}
              {/* Handle undefined maxQty */}
            </label>
            <div className='relative'>
              <Input
                id='neg-quantity'
                type='number'
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || minQty)
                } // Ensure fallback to minQty
                min={minQty}
                max={maxQty} // Input max attribute handles undefined gracefully
                className='pr-12'
                placeholder='Quantity'
              />
              <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none text-sm text-gray-500'>
                {unit}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor='neg-offerPrice'
              className='block text-sm font-medium text-kisan-primary mb-1'
            >
              Your Offer Price (per {unit})
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500'>
                ₹
              </div>
              <Input
                id='neg-offerPrice'
                type='number'
                min='0.01' // Minimum offer can be 1 cent/paisa
                step='0.01'
                value={offerPrice}
                onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                className='pl-7 pr-12'
                placeholder='Your offer'
              />
              <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none text-sm text-gray-500'>
                /{unit}
              </div>
            </div>
            {/* Line 184 where the error occurred */}
            <p className='text-xs text-gray-500 mt-1'>
              Current Price: ₹{basePrice.toFixed(2)} / {unit}
            </p>
          </div>

          <Button
            type='submit'
            className='w-full bg-black text-white '
            disabled={
              isSubmitting ||
              quantity < minQty ||
              (maxQty !== undefined && quantity > maxQty) ||
              offerPrice <= 0
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sending
                Offer...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' /> Send Offer
              </>
            )}
          </Button>

          {isSuccess && (
            // ... (Success message JSX - this part is fine) ...
            <div className='mt-3 text-center text-sm text-green-600 p-2 bg-green-50 rounded-md flex items-center justify-center'>
              <CheckCircle className='mr-2 h-5 w-5' />
              Offer sent successfully! The farmer will review it.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
