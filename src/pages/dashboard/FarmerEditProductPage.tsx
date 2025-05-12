import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FarmerProduct, getFarmerProductById } from '@/data/mockFarmerProducts';
import { EditProductForm } from '@/components/dashboard/EditProductForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FarmerEditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<FarmerProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const id = parseInt(productId, 10);
      if (isNaN(id)) {
        setError('Invalid product ID.');
        setLoading(false);
        return;
      }
      // Simulate fetching product data
      const fetchedProduct = getFarmerProductById(id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError('Product not found.');
      }
      setLoading(false);
    } else {
      setError('No product ID provided.');
      setLoading(false);
    }
  }, [productId]);

  const handleSave = (updatedProduct: FarmerProduct) => {
    console.log('Product saved in page:', updatedProduct);
    // The form itself handles the toast and navigation after successful mock update
    // If you had more complex logic here (e.g., global state update), you'd do it.
    // navigate('/dashboard/farmer/current-products'); // Form handles this now
  };

  const handleCancel = () => {
    navigate('/dashboard/farmer/current-products');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-red-600'>
        <p className='text-xl mb-4'>{error}</p>
        <Button asChild variant='outline'>
          <Link to='/dashboard/farmer/current-products'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Go Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    // Should be covered by error state, but as a fallback
    return (
      <div className='flex justify-center items-center h-screen'>
        Product data could not be loaded.
      </div>
    );
  }

  return (
    <div className='space-y-6 pb-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' asChild className='mr-2'>
            <Link to='/dashboard/farmer/current-products'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <h1 className='text-2xl font-semibold'>
            Edit Product / उत्पाद संपादित करें
          </h1>
        </div>
      </div>
      <EditProductForm
        product={product}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default FarmerEditProductPage;
