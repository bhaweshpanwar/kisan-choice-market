// {
//     "status": "success",
//     "results": 10,
//     "total": 32,
//     "currentPage": 2,
//     "totalPages": 4,
//     "data": {
//         "products": [
//             {
//                 "id": "eba3933e-8edf-4303-bf72-49a6a3f60127",
//                 "name": "Rice",
//                 "price": "60.00",
//                 "stock_quantity": 800,
//                 "seller_id": "af14b624-e3d4-486f-b321-212f4ce004e7",
//                 "category_id": "8ffd9949-d1fb-43c7-b833-63db38c63ddb",
//                 "negotiate": true,
//                 "description": "West Bengal's Gobindobhog rice with distinctive aroma. Short grain that becomes slightly sticky when cooked. Essential for traditional Bengali meals and sweets. Rich in carbohydrates and B vitamins. Parboiled for higher nutrient retention.",
//                 "key_highlights": [
//                     "Aromatic variety",
//                     "Sweet preparation staple",
//                     "Nutrient-retention processing"
//                 ],
//                 "min_qty": 5,
//                 "max_qty": 60,
//                 "created_at": "2025-04-16T17:24:20.815Z",
//                 "verified": true,
//                 "ratings_average": "3.7",
//                 "category_name": "Grains & Cereals",
//                 "seller_name": "Pooja Mehta"
//             },
//         ]
//     }
// }

import apiClient, { ApiResponse, ApiErrorResponse } from './api';
import axios from 'axios';

export interface Product {
  id: string; // From backend (UUID)
  slug?: string; // Optional: if backend provides it for SEO-friendly URLs
  name: string;
  price: string; // Backend sends as string
  originalPrice?: string | number; // Optional: if backend provides it
  unit?: string; // Optional: e.g., "kg", "dozen" - if backend provides it
  stock_quantity: number;

  // Farmer/Seller Info
  seller_id: string;
  seller_name: string;
  farmer?: {
    // If backend can provide a nested farmer object for convenience
    name: string;
    image?: string; // URL to farmer's profile image
  };

  category_id: string;
  category_name: string;

  negotiate: boolean; // From backend (maps to isNegotiable)
  description: string;
  key_highlights: string[];
  min_qty: number;
  max_qty: number;
  created_at: string;

  verified: boolean; // From backend (maps to one of your badges like "Verified Product")
  isFarmerChoice?: boolean; // If this is a distinct flag from 'verified'

  ratings_average: string; // Backend sends as string (maps to product.rating)
  reviews_count?: number; // Optional: if backend provides review count (maps to product.reviews)
  reviews: Review[];
  images?: string[]; // Array of product image URLs
}

// Payload for creating a product
export interface CreateProductPayload {
  name: string;
  price: number; // Send as number
  stock_quantity: number;
  category_id: string; // This needs to be the UUID of an existing category
  negotiate?: boolean;
  description: string;
  key_highlights?: string[];
  min_qty: number;
  max_qty: number;
  nameHindi?: string; // Optional
  // 'verified' is usually set by backend/admin
}

// export interface UpdateProductPayload
//   extends Omit<Product, 'created_at' | 'category_name' | 'seller_name'> {
//   category_id: string;
// }

//Fetching all pruducts with query params on click on category
//default page is 1 and limit is 10
//{{URL}}api/v1/products/category/Cereals?page=2&limit=10

// export const getProducts = async (params?: {
//   category?: string;
//   search?: string;
//   page?: number;
//   limit?: number;
// }): Promise<
//   ApiResponse<{ products: Product[]; totalPages: number; currentPage: number }>
// > => {
//   try {
//     const response = await apiClient.get<
//       ApiResponse<{
//         products: Product[];
//         totalPages: number;
//         currentPage: number;
//       }>
//     >('/api/v1/products/category', { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     throw error as ApiErrorResponse;
//   }
// };

// Define the structure for the 'data' part of the successful response
export interface ProductsResponseData {
  products: Product[];
  total: number; // Total number of products matching query (for pagination)
  currentPage: number;
  totalPages: number;
  results?: number; // Number of results on current page
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

// Params for the getProducts API call
export interface GetProductsParams {
  category?: string; // For filtering by category name from URL
  search?: string; // For text search
  page?: number;
  limit?: number; // How many items per page
  sort?: string; // e.g., 'price_asc', 'price_desc', 'ratings_average_desc'
  verified?: boolean;
  negotiate?: boolean; // Changed from negotiable
  // Add other filter params your backend supports
  // e.g. top_selling?: boolean; farmer_choice?: boolean;
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<ApiResponse<ProductsResponseData>> => {
  try {
    let url = '/api/v1/products';
    const queryParams: Omit<GetProductsParams, 'category'> = { ...params }; // Copy params

    if (params?.category) {
      // If a category is provided, use the specific backend route
      url = `/api/v1/products/category/${encodeURIComponent(params.category)}`;
      delete queryParams.category; // Don't send category as a query param if it's in the path
    }

    // queryParams will now contain page, limit, sort, search, verified, negotiate etc.
    const response = await apiClient.get<ApiResponse<ProductsResponseData>>(
      url,
      { params: queryParams }
    );
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error as ApiErrorResponse;
  }
};

//Fetching a single product by id
//{{URL}}api/v1/products/4bfa2348-b831-476d-a127-e2dcfacb3f6c
export const getProductById = async (
  productId: string
): Promise<ApiResponse<{ product: Product }>> => {
  try {
    const apiCallResponse = await apiClient.get<
      ApiResponse<{ product: Product }>
    >(`/api/v1/products/${productId}`);
    // console.log(
    //   'getProductById - apiCallResponse:',
    //   JSON.stringify(apiCallResponse, null, 2)
    // ); // Log what apiClient.get returns
    return apiCallResponse;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error as ApiErrorResponse;
  }
};

//This route for farmer is not completely defined
export const createFarmerProduct = async (
  payload: CreateProductPayload
): Promise<ApiResponse<{ product: Product }>> => {
  try {
    // Backend route: POST /api/v1/products
    const response = await apiClient.post<ApiResponse<{ product: Product }>>(
      '/api/v1/products',
      payload
    );
    // Parse price back to string for consistency if needed, or handle as number in Product interface
    if (response.data && response.data.product) {
      response.data.product.price = parseFloat(
        response.data.product.price
      ).toFixed(2);
    }
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error as ApiErrorResponse;
  }
};

//Update a product by its Id
//{{URL}}api/v1/products/00d7bd59-1daa-4e44-b892-06cb73248754
// Payload for updating a product (all fields optional)
export type UpdateProductPayload = Partial<CreateProductPayload> & {
  // You might want to allow updating specific fields like 'verified' by an admin,
  // but for farmer update, usually stick to fields they control.
  // For now, using CreateProductPayload as base for updatable fields.
  // Status might be a separate update or part of this.
  status?: Product['status']; // If farmer can update status directly
};
// Update an existing product
export const updateFarmerProduct = async (
  productId: string,
  payload: UpdateProductPayload
): Promise<ApiResponse<{ product: Product }>> => {
  try {
    // Backend route: PATCH /api/v1/products/:id
    const response = await apiClient.patch<ApiResponse<{ product: Product }>>(
      `/api/v1/products/${productId}`,
      payload
    );
    if (response.data && response.data.product) {
      response.data.product.price = parseFloat(
        response.data.product.price
      ).toFixed(2);
    }
    return response;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error as ApiErrorResponse;
  }
};

// You'll need a way to fetch categories for the dropdown in Add/Edit product forms
export interface Category {
  id: string; // UUID
  name: string;
  // description?: string;
}
export const getCategories = async (): Promise<
  ApiResponse<{ categories: Category[] }>
> => {
  try {
    // Assuming you have a backend route like GET /api/v1/categories
    // If not, you'll need to create one or hardcode categories for now.
    const response = await apiClient.get<
      ApiResponse<{ categories: Category[] }>
    >('/api/v1/categories'); // ADJUST THIS ROUTE
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array or throw, depending on how you want to handle this
    // For now, let's allow it to throw, component should handle error
    throw error as ApiErrorResponse;
  }
};

//Delete Product by ID for farmer not defined yet

//Important Search Functionality for the users
//{{URL}}api/v1/products/search?q=bhawesh
//result output no products
// {
//     "status": "fail",
//     "message": "No products found"
// }

//{{URL}}api/v1/products/search?q=rice by Priya Patel
//success query example
// {
//     "status": "success",
//     "results": 1,
//     "data": {
//         "products": [
//             {
//                 "id": "ac668b12-65b2-49ab-8c59-a9f5278231fa",
//                 "name": "Rice",
//                 "price": "65.00",
//                 "stock_quantity": 1000,
//                 "seller_id": "5a23a2d0-2aab-407e-afd3-8cb9fde117c3",
//                 "category_id": "8ffd9949-d1fb-43c7-b833-63db38c63ddb",
//                 "negotiate": true,
//                 "description": "Gujarati Kolam rice with medium grain length. Non-sticky texture ideal for daily meals. Aged for 6 months for reduced moisture content. Cooks fluffy with distinct aroma. Perfect for pulao, biryani or steamed rice.",
//                 "key_highlights": [
//                     "Low arsenic content",
//                     "Easy to digest",
//                     "Less breakage"
//                 ],
//                 "min_qty": 5,
//                 "max_qty": 100,
//                 "created_at": "2025-04-16T17:24:20.543Z",
//                 "verified": true,
//                 "ratings_average": "3.0",
//                 "category_name": "Grains & Cereals",
//                 "seller_name": "Priya Patel"
//             }
//         ]
//     }
// }
export const searchProducts = async (
  query: string
): Promise<ApiResponse<{ products: Product[] }>> => {
  try {
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>(
      `/api/v1/products/search`,
      {
        params: { q: query },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    throw error as ApiErrorResponse;
  }
};

// New function to get products for the logged-in farmer
export const getMyFarmerProducts = async (): Promise<
  ApiResponse<{ products: Product[] }>
> => {
  try {
    // The path here must match your backend route for farmer's products
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>(
      '/api/v1/products/my-products'
    );
    // Parse numbers if necessary
    if (response.data && response.data.products) {
      response.data.products = response.data.products.map((p) => ({
        ...p,
        price: parseFloat(p.price).toFixed(2), // Keep as formatted string
        ratings_average: p.ratings_average
          ? parseFloat(p.ratings_average).toFixed(1)
          : undefined,
      }));
    }
    return response;
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    throw error as ApiErrorResponse;
  }
};

// Function to delete a product (specific to farmer deleting their own)
export const deleteFarmerProduct = async (
  productId: string
): Promise<ApiResponse<null>> => {
  try {
    // This uses the generic DELETE /api/v1/products/:id
    // The backend controller (productController.deleteProduct) will verify ownership
    const response = await apiClient.delete<ApiResponse<null>>(
      `/api/v1/products/${productId}`
    );
    return response;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error as ApiErrorResponse;
  }
};
