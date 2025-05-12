// src/services/negotiationService.ts
import apiClient, { ApiResponse, ApiErrorResponse } from './api';

// Payload for sending an offer
export interface SendOfferPayload {
  productId: string;
  offeredPricePerUnit: number;
  quantity: number;
}

// Response from sending an offer
export interface SendOfferResponseData {
  offerId: string;
  offerDate: string;
}

// Interface for a single offer (as seen by consumer or farmer)
export interface Offer {
  id: string; // Offer ID
  offer_price_per_unit: string; // Comes as string, parse to number
  quantity: string; // Comes as string, parse to number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'; // Add 'expired' if your backend uses it
  offer_date: string;
  response_date: string | null;
  product_name: string;
  product_id: string;
  // For consumer viewing their offers:
  farmer_name?: string;
  farmer_id?: string;
  // For farmer viewing offers received:
  consumer_name?: string; // You'll need to add this to backend response for GET /farmer
  consumer_id?: string; // You'll need to add this to backend response for GET /farmer
  // Add any other relevant fields your backend might send
}

// --- API Functions ---

// Consumer: Send an offer
export const sendNegotiationOffer = async (
  payload: SendOfferPayload
): Promise<ApiResponse<SendOfferResponseData>> => {
  try {
    const response = await apiClient.post<ApiResponse<SendOfferResponseData>>(
      '/api/v1/negotiations',
      payload
    );
    return response;
  } catch (error) {
    console.error('Error sending negotiation offer:', error);
    throw error as ApiErrorResponse;
  }
};

// Consumer: Get all offers they have sent
export const getConsumerOffers = async (): Promise<
  ApiResponse<{ offers: Offer[] }>
> => {
  try {
    const response = await apiClient.get<ApiResponse<{ offers: Offer[] }>>(
      '/api/v1/negotiations/consumer'
    );
    // Parse numbers if needed
    if (response.data && response.data.offers) {
      response.data.offers = response.data.offers.map((offer) => ({
        ...offer,
        offer_price_per_unit: parseFloat(offer.offer_price_per_unit).toFixed(2),
        quantity: parseInt(offer.quantity, 10).toString(),
      }));
    }
    return response;
  } catch (error) {
    console.error('Error fetching consumer offers:', error);
    throw error as ApiErrorResponse;
  }
};

// Consumer: Cancel a PENDING offer (You'll need a backend route for this, e.g., DELETE /api/v1/negotiations/:offerId)
// For now, I'll assume this route doesn't exist yet based on your list.
// If it does, it would look like:
/*
export const cancelMyOffer = async (offerId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.delete<ApiResponse<any>>(`/api/v1/negotiations/${offerId}`);
    return response;
  } catch (error) {
    console.error(`Error cancelling offer ${offerId}:`, error);
    throw error as ApiErrorResponse;
  }
};
*/

// ---- FARMER-SPECIFIC NEGOTIATION FUNCTIONS ----

// Farmer: Get all offers received for their products
export const getFarmerOffers = async (): Promise<
  ApiResponse<{ offers: Offer[] }>
> => {
  try {
    const response = await apiClient.get<ApiResponse<{ offers: Offer[] }>>(
      '/api/v1/negotiations/farmer'
    );
    // Parse numbers similar to getConsumerOffers
    if (response.data && response.data.offers) {
      response.data.offers = response.data.offers.map((offer) => ({
        ...offer,
        offer_price_per_unit: parseFloat(offer.offer_price_per_unit).toFixed(2),
        quantity: parseInt(offer.quantity, 10).toString(),
        // Backend should include consumer_name and consumer_id for farmer's view
      }));
    }
    return response;
  } catch (error) {
    console.error('Error fetching farmer offers:', error);
    throw error as ApiErrorResponse;
  }
};

// Farmer: Accept an offer
export const acceptFarmerOffer = async (
  offerId: string
): Promise<ApiResponse<any>> => {
  // Response might contain updated offer or cart item
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/v1/negotiations/accept/${offerId}`
    );
    return response;
  } catch (error) {
    console.error(`Error accepting offer ${offerId}:`, error);
    throw error as ApiErrorResponse;
  }
};

// Farmer: Reject an offer
export const rejectFarmerOffer = async (
  offerId: string
): Promise<ApiResponse<any>> => {
  // Response might contain updated offer
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/v1/negotiations/reject/${offerId}`
    );
    return response;
  } catch (error) {
    console.error(`Error rejecting offer ${offerId}:`, error);
    throw error as ApiErrorResponse;
  }
};
