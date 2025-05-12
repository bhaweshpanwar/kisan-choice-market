// src/services/cartService.ts
import apiClient, { ApiResponse, ApiErrorResponse } from './api';

// Type for an item in the cart (as returned by viewCart)
export interface CartItem {
  cart_item_id: string;
  product_id: string;
  product_name: string;
  product_description?: string; // Optional as per your viewCart response
  seller_id: string;
  seller_name: string;
  quantity: number;
  is_negotiated: boolean;
  quantity_fixed: boolean;
  price_per_unit: number; // Assuming number, parse if string
  original_product_price?: number; // Optional, for negotiated items
  total_item_price: number; // Assuming number, parse if string
  min_qty?: number; // From product details, useful for validation
  max_qty?: number; // From product details, useful for validation
  // No 'image' or 'unit' directly in the backend cart item response
}

// Type for the entire cart (as returned by viewCart)
export interface CartData {
  cart: CartItem[];
  overall_total_price: number; // Assuming number, parse if string
}

// Payload for adding to cart
export interface AddToCartPayload {
  product_id: string;
  quantity: number;
  // price?: number; // Only if sending a negotiated price
  // is_negotiated?: boolean; // Only if sending a negotiated price
}

// Response from adding to cart
export interface AddToCartResponseData {
  cart_item: {
    id: string; // This is cart_item_id
    product_id: string;
    product_name: string;
    quantity: number;
    price_per_unit: number;
    is_negotiated: boolean;
    quantity_fixed: boolean;
    total_item_price: number;
  };
}

// Payload for updating cart item
export interface UpdateCartItemPayload {
  quantity: number;
}

// --- API Functions ---

export const viewCart = async (): Promise<ApiResponse<CartData>> => {
  try {
    const response = await apiClient.get<ApiResponse<CartData>>('/api/v1/cart');
    // Parse prices if they come as strings
    if (response.data?.cart) {
      response.data.cart = response.data.cart.map((item) => ({
        ...item,
        price_per_unit: Number(item.price_per_unit),
        original_product_price: item.original_product_price
          ? Number(item.original_product_price)
          : undefined,
        total_item_price: Number(item.total_item_price),
      }));
    }
    if (response.data) {
      response.data.overall_total_price = Number(
        response.data.overall_total_price
      );
    }
    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error as ApiErrorResponse;
  }
};

export const addToCart = async (
  payload: AddToCartPayload
): Promise<ApiResponse<AddToCartResponseData>> => {
  try {
    const response = await apiClient.post<ApiResponse<AddToCartResponseData>>(
      '/api/v1/cart',
      payload
    );
    if (response.data?.cart_item) {
      response.data.cart_item.price_per_unit = Number(
        response.data.cart_item.price_per_unit
      );
      response.data.cart_item.total_item_price = Number(
        response.data.cart_item.total_item_price
      );
    }
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error as ApiErrorResponse;
  }
};

// cartItemId is the id of the item *in the cart*, not the product_id
export const updateCartItem = async (
  cartItemId: string,
  payload: UpdateCartItemPayload
): Promise<ApiResponse<any>> => {
  // Backend response for update might vary
  try {
    // Assuming backend returns the updated cart item or the whole cart
    const response = await apiClient.put<ApiResponse<any>>(
      `/api/v1/cart/${cartItemId}`,
      payload
    );
    return response;
  } catch (error) {
    console.error(`Error updating cart item ${cartItemId}:`, error);
    throw error as ApiErrorResponse;
  }
};

export const removeFromCart = async (
  cartItemId: string
): Promise<ApiResponse<any>> => {
  // Backend response might be simple success message
  try {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/api/v1/cart/${cartItemId}`
    );
    return response;
  } catch (error) {
    console.error(`Error removing cart item ${cartItemId}:`, error);
    throw error as ApiErrorResponse;
  }
};

export const clearCart = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/v1/cart/clear'
    );
    return response;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error as ApiErrorResponse;
  }
};

// Checkout related (basic structure, may need more complex handling)
export const checkoutCart = async (
  payload?: any
): Promise<ApiResponse<any>> => {
  // Payload might include address_id, payment_method_id
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/v1/cart/checkout',
      payload
    );
    return response;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error as ApiErrorResponse;
  }
};

export const getCheckoutSession = async (payload: {
  items: { product_id: string; quantity: number }[];
}): Promise<ApiResponse<any>> => {
  // Stripe specific
  try {
    // This usually involves sending cart items to backend to create a Stripe session
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/v1/cart/checkout-session',
      payload
    );
    return response;
  } catch (error) {
    console.error('Error getting checkout session:', error);
    throw error as ApiErrorResponse;
  }
};

// Payload for initiating checkout (creating pending order)
export interface InitiateCheckoutPayload {
  address_id: string | null; // Or your Address object if backend expects more
  // Backend will likely use the authenticated user's cart
}

// Expected response from initiating checkout (pending order created)
export interface InitiateCheckoutResponseData {
  order_id: string;
  items_for_stripe: Array<{
    // Structure this to match what your backend's getCheckoutSession expects
    price_data: {
      currency: string;
      unit_amount: number; // In cents
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
    };
    quantity: number;
  }>;
  total_amount: number;
  // other relevant order details you might want to pass to frontend
}

// This function calls your backend's POST /api/v1/cart/checkout route
export const initiateCheckout = async (
  payload: InitiateCheckoutPayload
): Promise<ApiResponse<InitiateCheckoutResponseData>> => {
  try {
    // This route is responsible for creating the 'pending_payment' order
    // and returning details needed for the Stripe session.
    const response = await apiClient.post<
      ApiResponse<InitiateCheckoutResponseData>
    >(
      '/api/v1/cart/checkout', // Matches your cartController.checkout route
      payload
    );
    return response;
  } catch (error) {
    console.error('Error initiating checkout (creating pending order):', error);
    throw error as ApiErrorResponse;
  }
};

// /api/1v / cart / checkout - session;
export interface StripeSessionPayload {
  order_id: string;
  items_for_stripe: InitiateCheckoutResponseData['items_for_stripe']; // Use the same items structure
}
export interface StripeSessionResponseData {
  session: {
    id: string;
    url: string;
  };
}
export const getStripeCheckoutSession = async (
  payload: StripeSessionPayload
): Promise<ApiResponse<StripeSessionResponseData>> => {
  try {
    const response = await apiClient.post<
      ApiResponse<StripeSessionResponseData>
    >(
      '/api/v1/cart/checkout-session', // Path to your getCheckoutSession controller
      payload
    );
    return response;
  } catch (error) {
    console.error('Error getting Stripe checkout session:', error);
    throw error as ApiErrorResponse;
  }
};
