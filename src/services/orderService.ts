// src/services/orderService.ts
import apiClient, { ApiResponse, ApiErrorResponse } from './api';

// Interface for a single order summary (as in GET /api/v1/orders response)
export interface OrderSummary {
  id: string;
  total_price: string; // Comes as string from backend
  payment_status: 'pending' | 'completed' | 'failed';
  order_status:
    | 'pending'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'processing'; // Add all your statuses
  created_at: string;
  updated_at: string;
  item_count: string; // Comes as string
  first_product_name: string | null;
  // You might want to add address details here if backend sends them with summary
  // address_line1?: string;
  // city?: string;
  // postal_code?: string;
}

// Interface for detailed order (as in GET /api/v1/orders/:id)
// This will likely include order items and full address details
export interface OrderItemDetail {
  id: string; // order_item_id
  product_id: string;
  product_name: string; // Usually fetched via join in backend
  quantity: number;
  price: string; // Price per unit at time of purchase
  seller_id?: string; // If you track seller per item
  seller_name?: string; // If you track seller per item
  // Add other product details if needed, e.g., a placeholder image representation
}

export interface OrderAddressDetail {
  // Define structure for address
  id: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  // name?: string;
  // phone?: string;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItemDetail[];
  delivery_address: OrderAddressDetail | null; // Full address object
  consumer_name?: string; // For farmer view
  // other details like payment_intent_id, paid_at, etc.
}

// ---- CONSUMER ORDER API FUNCTIONS ----

export const getMyOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ orders: OrderSummary[] }>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ orders: OrderSummary[] }>
    >('/api/v1/orders', { params });
    // Parse numbers if needed
    if (response.data && response.data.orders) {
      response.data.orders = response.data.orders.map((order) => ({
        ...order,
        total_price: parseFloat(order.total_price).toFixed(2), // Keep as string but formatted
        item_count: parseInt(order.item_count, 10).toString(), // Parse then stringify
      }));
    }
    return response;
  } catch (error) {
    console.error('Error fetching consumer orders:', error);
    throw error as ApiErrorResponse;
  }
};

export const getMyOrderDetails = async (
  orderId: string
): Promise<ApiResponse<{ order: OrderDetail }>> => {
  try {
    const response = await apiClient.get<ApiResponse<{ order: OrderDetail }>>(
      `/api/v1/orders/${orderId}`
    );
    // Parse numbers if needed
    if (response.data && response.data.order) {
      response.data.order.total_price = parseFloat(
        response.data.order.total_price
      ).toFixed(2);
      response.data.order.item_count = parseInt(
        response.data.order.item_count,
        10
      ).toString();
      if (response.data.order.items) {
        response.data.order.items = response.data.order.items.map((item) => ({
          ...item,
          price: parseFloat(item.price).toFixed(2),
        }));
      }
    }
    return response;
  } catch (error) {
    console.error(
      `Error fetching consumer order details for ${orderId}:`,
      error
    );
    throw error as ApiErrorResponse;
  }
};

export const cancelMyOrder = async (
  orderId: string
): Promise<ApiResponse<{ order: OrderDetail }>> => {
  // Or just a success message
  try {
    const response = await apiClient.patch<ApiResponse<{ order: OrderDetail }>>(
      `/api/v1/orders/${orderId}/cancel`
    );
    // Potentially parse response like in getMyOrderDetails if full order is returned
    return response;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error as ApiErrorResponse;
  }
};

// ---- FARMER ORDER API FUNCTIONS ----

export const getFarmerSales = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ orders: OrderSummary[] }>> => {
  // Adjust OrderSummary if farmer view is different
  try {
    const response = await apiClient.get<
      ApiResponse<{ orders: OrderSummary[] }>
    >('/api/v1/orders/farmer/my-sales', { params });
    // Similar parsing as getMyOrders if needed
    return response;
  } catch (error) {
    console.error('Error fetching farmer sales:', error);
    throw error as ApiErrorResponse;
  }
};

export const getFarmerOrderDetails = async (
  orderId: string
): Promise<ApiResponse<{ order: OrderDetail }>> => {
  // Adjust OrderDetail if farmer view is different
  try {
    const response = await apiClient.get<ApiResponse<{ order: OrderDetail }>>(
      `/api/v1/orders/farmer/${orderId}`
    );
    // Similar parsing as getMyOrderDetails if needed
    return response;
  } catch (error) {
    console.error(`Error fetching farmer order details for ${orderId}:`, error);
    throw error as ApiErrorResponse;
  }
};

export const updateFarmerOrderStatus = async (
  orderId: string,
  payload: { status: OrderSummary['order_status'] }
): Promise<ApiResponse<{ order: OrderDetail }>> => {
  try {
    const response = await apiClient.patch<ApiResponse<{ order: OrderDetail }>>(
      `/api/v1/orders/farmer/${orderId}/status`,
      payload
    );
    // Similar parsing as getMyOrderDetails if needed
    return response;
  } catch (error) {
    console.error(`Error updating farmer order status for ${orderId}:`, error);
    throw error as ApiErrorResponse;
  }
};

// Note: The createOrderFromCart is typically handled by the cart checkout process,
// so it might not need a separate function here unless you have a different flow.
// Your cartController.checkout initiates the order.
