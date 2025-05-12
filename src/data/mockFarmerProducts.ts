export interface FarmerProduct {
  id: number;
  name: string;
  nameHindi: string;
  quantity: string;
  price: string;
  status: 'available' | 'sold';
  imageUrl: string;
  description?: string; // Add description for editing
  category?: string; // Add category for editing
}

export const mockFarmerProductsData: FarmerProduct[] = [
  {
    id: 1,
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    quantity: '500 kg',
    price: '₹3,500',
    status: 'available',
    imageUrl:
      'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description:
      'Premium quality Basmati rice, long grain, aromatic. Grown with traditional methods.',
    category: 'Grains',
  },
  {
    id: 2,
    name: 'Wheat',
    nameHindi: 'गेहूं',
    quantity: '200 kg',
    price: '₹2,200',
    status: 'available',
    imageUrl:
      'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description:
      'High-quality MP Sharbati wheat, perfect for chapatis and bread.',
    category: 'Grains',
  },
  {
    id: 3,
    name: 'Organic Potatoes',
    nameHindi: 'जैविक आलू',
    quantity: '100 kg',
    price: '₹1,200',
    status: 'sold',
    imageUrl:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Freshly harvested organic potatoes, free from pesticides.',
    category: 'Vegetables',
  },
  // Add more products if needed
];

// A utility function to find a product by ID (simulates API call)
export const getFarmerProductById = (id: number): FarmerProduct | undefined => {
  return mockFarmerProductsData.find((product) => product.id === id);
};

// A utility function to update a product (simulates API call)
// In a real app, this would make a PUT/PATCH request
export const updateFarmerProduct = (updatedProduct: FarmerProduct): boolean => {
  const index = mockFarmerProductsData.findIndex(
    (p) => p.id === updatedProduct.id
  );
  if (index !== -1) {
    mockFarmerProductsData[index] = updatedProduct;
    console.log('Mock API: Product updated', updatedProduct);
    return true;
  }
  console.log('Mock API: Product not found for update', updatedProduct);
  return false;
};
