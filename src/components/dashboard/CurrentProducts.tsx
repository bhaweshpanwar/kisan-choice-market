// src/components/dashboard/CurrentProducts.tsx
import React, { useState, useEffect } from 'react'; // Added React and useEffect
import {
  Package,
  Edit,
  Trash2,
  Loader2,
  ShoppingBag,
  RefreshCw,
  PlusCircle,
} from 'lucide-react'; // Added Loader2, ShoppingBag, RefreshCw, PlusCircle
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import CardHeader and CardTitle
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getMyFarmerProducts,
  deleteFarmerProduct,
  Product as FarmerProductData, // Use Product interface from service
  ApiErrorResponse,
} from '@/services/productService'; // Assuming productService is in src/services
import { useAuth } from '@/context/AuthContext';

// Helper for product status badge
const getProductStatusBadgeVariant = (
  status?: FarmerProductData['status']
): 'default' | 'secondary' | 'destructive' | 'success' | 'outline' => {
  switch (status) {
    case 'available':
      return 'success';
    case 'sold out':
      return 'destructive';
    case 'pending':
      return 'default';
    default:
      return 'secondary';
  }
};
const getProductStatusText = (status?: FarmerProductData['status']): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'sold out':
      return 'Sold Out';
    case 'pending':
      return 'Pending Approval';
    default:
      return status || 'Unknown';
  }
};

export const CurrentProducts = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<FarmerProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  const fetchProducts = async () => {
    if (!isAuthenticated || user?.role !== 'farmer') {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyFarmerProducts();
      setProducts(response.data.products || []);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Failed to load your products.');
      toast.error(apiError.message || 'Failed to load products.');
      console.error('Fetch farmer products error:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated, user]);

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      setDeletingProductId(productId);
      try {
        await deleteFarmerProduct(productId);
        toast.success(`Product "${productName}" deleted successfully.`);
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== productId)
        ); // Optimistic update
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        toast.error(
          apiError.message || `Failed to delete product "${productName}".`
        );
        console.error('Delete product error:', apiError);
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  if (!isAuthenticated || user?.role !== 'farmer') {
    return (
      <div className='space-y-4 mt-8 p-6 border rounded-lg bg-yellow-50 text-yellow-700 text-center'>
        <Package className='h-8 w-8 mx-auto mb-2' />
        <p>Please log in as a farmer to manage your products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4 mt-8 text-center py-10'>
        <Loader2 className='h-10 w-10 animate-spin text-primary mx-auto' />
        <p className='mt-2 text-muted-foreground'>Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4 mt-8 text-center py-10 text-destructive'>
        <Package className='h-10 w-10 mx-auto' /> {/* Error icon */}
        <p className='mt-2'>{error}</p>
        <Button onClick={fetchProducts} variant='outline'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Package className='h-6 w-6 text-primary' />
          <h2 className='text-xl lg:text-2xl font-semibold text-gray-800'>
            My Current Products
          </h2>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={fetchProducts}
            variant='outline'
            size='sm'
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />{' '}
            Refresh
          </Button>
          <Link to='/dashboard/farmer/upload-product'>
            {' '}
            {/* Link to add product page */}
            <Button size='sm'>
              <PlusCircle className='h-4 w-4 mr-2' /> Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className='text-center py-10 bg-white p-8 rounded-lg shadow'>
          <ShoppingBag className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <p className='text-muted-foreground mb-4'>
            You have not listed any products yet.
          </p>
          <Link to='/dashboard/farmer/add-product'>
            <Button>List Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
          {products.map((product) => (
            <Card
              key={product.id}
              className='overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow'
            >
              {/* No product image section as per request */}
              <div className='p-3 bg-gray-50 text-center border-b'>
                {/* Placeholder or minimal info if no image */}
                <Package size={32} className='mx-auto text-gray-400' />
                <Badge
                  className={`mt-2 text-xs px-2 py-0.5 ${getProductStatusBadgeVariant(
                    product.status ||
                      (product.stock_quantity > 0 ? 'available' : 'sold out')
                  )}`}
                  variant={getProductStatusBadgeVariant(
                    product.status ||
                      (product.stock_quantity > 0 ? 'available' : 'sold out')
                  )}
                >
                  {getProductStatusText(
                    product.status ||
                      (product.stock_quantity > 0 ? 'available' : 'sold out')
                  )}
                </Badge>
              </div>

              <CardContent className='p-4 flex flex-col flex-grow'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <h3 className='font-semibold text-base text-kisan-primary'>
                      {product.name}
                    </h3>
                    {product.nameHindi && (
                      <p className='text-xs text-muted-foreground'>
                        {product.nameHindi}
                      </p>
                    )}
                  </div>
                  <div className='text-right shrink-0 ml-2'>
                    <p className='font-semibold text-kisan-accent'>
                      ₹{product.price}
                    </p>{' '}
                    {/* Assumes price is already formatted string */}
                    <p className='text-xs text-muted-foreground'>
                      Stock: {product.stock_quantity}
                    </p>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground mb-3 line-clamp-3 flex-grow leading-relaxed'>
                  {product.description || 'No description available.'}
                </p>

                <div className='flex gap-2 mt-auto pt-3 border-t'>
                  {/* View button removed as requested */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='flex-1 text-xs'
                    asChild
                  >
                    <Link
                      to={`/dashboard/farmer/current-products/edit/${product.id}`}
                    >
                      <Edit className='h-3 w-3 mr-1.5' /> Edit
                    </Link>
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive-outline'
                    className='flex-1 text-xs'
                    onClick={() =>
                      handleDeleteProduct(product.id, product.name)
                    }
                    disabled={deletingProductId === product.id}
                  >
                    {deletingProductId === product.id ? (
                      <Loader2 className='h-3 w-3 mr-1.5 animate-spin' />
                    ) : (
                      <Trash2 className='h-3 w-3 mr-1.5' />
                    )}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
