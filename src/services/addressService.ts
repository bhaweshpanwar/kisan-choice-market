// src/services/addressService.ts
import apiClient, { ApiResponse, ApiErrorResponse } from './api';

export interface Address {
  id: string;
  user_id: string;
  address_line1: string;
  address_line2?: string | null; // Optional
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  created_at?: string; // Optional, backend might not always send
  // Add 'name' and 'phone' if you store them directly on the address,
  // or if they are part of a different data structure you join.
  // Based on your SettingsPage dummy data:
  name?: string; // For display purposes, might be user's name or a label for the address
}

export type CreateAddressPayload = Omit<
  Address,
  'id' | 'user_id' | 'created_at' | 'is_primary'
> & { is_primary?: boolean };
export type UpdateAddressPayload = Partial<CreateAddressPayload>;

// Assuming routes are nested under the authenticated user, e.g., /api/v1/users/me/addresses
const BASE_URL = '/api/v1/users/me/addresses'; // Adjust if your routes are different (e.g., /api/v1/addresses)

export const getMyAddresses = async (): Promise<
  ApiResponse<{ addresses: Address[] }>
> => {
  try {
    const response = await apiClient.get<ApiResponse<{ addresses: Address[] }>>(
      BASE_URL
    );
    return response;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error as ApiErrorResponse;
  }
};

export const addMyAddress = async (
  payload: CreateAddressPayload
): Promise<ApiResponse<{ address: Address }>> => {
  try {
    const response = await apiClient.post<ApiResponse<{ address: Address }>>(
      BASE_URL,
      payload
    );
    return response;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error as ApiErrorResponse;
  }
};

export const updateMyAddress = async (
  addressId: string,
  payload: UpdateAddressPayload
): Promise<ApiResponse<{ address: Address }>> => {
  try {
    const response = await apiClient.put<ApiResponse<{ address: Address }>>(
      `${BASE_URL}/${addressId}`,
      payload
    );
    return response;
  } catch (error) {
    console.error(`Error updating address ${addressId}:`, error);
    throw error as ApiErrorResponse;
  }
};

export const deleteMyAddress = async (
  addressId: string
): Promise<ApiResponse<null>> => {
  // Assuming no content on success
  try {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${BASE_URL}/${addressId}`
    );
    return response;
  } catch (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    throw error as ApiErrorResponse;
  }
};

export const setPrimaryAddress = async (
  addressId: string
): Promise<ApiResponse<{ address: Address }>> => {
  // This might be part of updateMyAddress (e.g., payload includes is_primary)
  // Or a dedicated endpoint. Assuming part of update for now.
  return updateMyAddress(addressId, { is_primary: true });
};
