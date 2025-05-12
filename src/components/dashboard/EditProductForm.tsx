// src/components/dashboard/EditProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, Ban, Info } from 'lucide-react';
import {
  getProductById, // To fetch current product details
  updateFarmerProduct,
  UpdateProductPayload,
  Product as FarmerProductData, // Use the interface from service
  getCategories,
  Category,
  ApiErrorResponse,
} from '@/services/productService';

// Zod Schema for Product Update (similar to create, but ID is from URL)
// Fields are optional for PATCH, but form might require some
const productUpdateSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  nameHindi: z.string().optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  stock_quantity: z.coerce
    .number()
    .int()
    .min(0, 'Stock quantity cannot be negative.'),
  category_id: z.string().uuid('Please select a valid category.'),
  negotiate: z.boolean().optional().default(false),
  key_highlights: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s)
        : []
    ),
  min_qty: z.coerce
    .number()
    .int()
    .min(1, 'Minimum quantity must be at least 1.')
    .default(1),
  max_qty: z.coerce
    .number()
    .int()
    .positive('Maximum quantity must be positive.'),
  status: z.string().optional(), // Allow updating status if needed e.g. available, sold out
});
type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>;

interface EditProductPageProps {
  // This component will likely be a full page
  // productId: string; // We'll get this from useParams
}

export const EditProductForm: React.FC<EditProductPageProps> = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [initialProductData, setInitialProductData] =
    useState<FarmerProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const form = useForm<ProductUpdateFormValues>({
    resolver: zodResolver(productUpdateSchema),
    // Default values will be set by useEffect after fetching product
  });

  useEffect(() => {
    if (!productId) {
      toast.error('Product ID missing.');
      navigate('/dashboard/farmer/current-products');
      return;
    }

    const fetchProductAndCategories = async () => {
      setIsLoadingProduct(true);
      setIsLoadingCategories(true);
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          getProductById(productId),
          getCategories(),
        ]);

        const productData = productResponse.data.product;
        setInitialProductData(productData);
        setCategories(categoriesResponse.data.categories || []);

        // Set form default values after data is fetched
        form.reset({
          name: productData.name,
          nameHindi: productData.nameHindi || '',
          description: productData.description || '',
          price: parseFloat(productData.price), // Parse string price to number for form
          stock_quantity: productData.stock_quantity,
          category_id: productData.category_id || '',
          negotiate: productData.negotiate || false,
          key_highlights: productData.key_highlights?.join(', ') || '', // Join array to comma-separated string for input
          min_qty: productData.min_qty || 1,
          max_qty: productData.max_qty || 100,
          status: productData.status || 'available',
        });
      } catch (error) {
        toast.error('Failed to load product or category data.');
        console.error('Error fetching product/categories for edit:', error);
        navigate('/dashboard/farmer/current-products');
      } finally {
        setIsLoadingProduct(false);
        setIsLoadingCategories(false);
      }
    };

    fetchProductAndCategories();
  }, [productId, navigate, form]);

  const onSubmit = async (data: ProductUpdateFormValues) => {
    if (!productId) return;

    const payload: UpdateProductPayload = {
      ...data,
      key_highlights: data.key_highlights, // Already an array from Zod transform
      // Ensure price is number if backend expects it
      price: Number(data.price),
      stock_quantity: Number(data.stock_quantity),
      min_qty: Number(data.min_qty),
      max_qty: Number(data.max_qty),
    };

    try {
      await updateFarmerProduct(productId, payload);
      toast.success('Product updated successfully!');
      navigate('/dashboard/farmer/current-products');
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to update product.');
      console.error('Update product error:', apiError);
    }
  };

  if (isLoadingProduct || isLoadingCategories) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
        <p className='ml-3'>Loading product details...</p>
      </div>
    );
  }

  if (!initialProductData) {
    return (
      <div className='text-center py-10'>
        Product not found or could not be loaded.{' '}
        <Link
          to='/dashboard/farmer/current-products'
          className='text-kisan-accent underline'
        >
          Go back
        </Link>
        .
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-8 max-w-3xl mx-auto'>
      <div className='flex items-center gap-2 mb-6'>
        <Edit className='h-6 w-6 text-primary' />
        <h2 className='text-2xl font-semibold text-gray-800'>
          Edit Product:{' '}
          <span className='text-kisan-accent'>{initialProductData.name}</span>
        </h2>
      </div>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg text-gray-700'>
            Update Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Fields are similar to UploadProduct form */}
            <div>
              <Label htmlFor='name'>Product Name (English)</Label>
              <Input id='name' {...form.register('name')} />
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.name?.message}
              </p>
            </div>
            <div>
              <Label htmlFor='nameHindi'>Product Name (Hindi)</Label>
              <Input id='nameHindi' {...form.register('nameHindi')} />
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.nameHindi?.message}
              </p>
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                {...form.register('description')}
                rows={4}
              />
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.description?.message}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <div>
                <Label htmlFor='price'>Price (₹)</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  {...form.register('price')}
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.price?.message}
                </p>
              </div>
              <div>
                <Label htmlFor='stock_quantity'>Stock Quantity</Label>
                <Input
                  id='stock_quantity'
                  type='number'
                  {...form.register('stock_quantity')}
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.stock_quantity?.message}
                </p>
              </div>
              <div>
                <Label htmlFor='category_id'>Category</Label>
                <Select
                  onValueChange={(value) => form.setValue('category_id', value)}
                  defaultValue={form.getValues('category_id')}
                >
                  <SelectTrigger disabled={isLoadingCategories}>
                    <SelectValue
                      placeholder={
                        isLoadingCategories ? 'Loading...' : 'Select category'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.category_id?.message}
                </p>
              </div>
              <div className='flex items-center space-x-2 pt-6'>
                <Checkbox
                  id='negotiate'
                  {...form.register('negotiate')}
                  defaultChecked={initialProductData.negotiate}
                  onCheckedChange={(checked) =>
                    form.setValue('negotiate', Boolean(checked))
                  }
                />
                <Label htmlFor='negotiate' className='text-sm font-medium'>
                  Allow Price Negotiation?
                </Label>
              </div>
              <div>
                <Label htmlFor='min_qty'>Min. Order Qty</Label>
                <Input
                  id='min_qty'
                  type='number'
                  {...form.register('min_qty')}
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.min_qty?.message}
                </p>
              </div>
              <div>
                <Label htmlFor='max_qty'>Max. Order Qty</Label>
                <Input
                  id='max_qty'
                  type='number'
                  {...form.register('max_qty')}
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.max_qty?.message}
                </p>
              </div>
              <div>
                <Label htmlFor='status'>Product Status</Label>
                <Select
                  name='status'
                  defaultValue={initialProductData.status || 'available'}
                  onValueChange={(value) =>
                    form.setValue(
                      'status',
                      value as ProductUpdateFormValues['status']
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='available'>Available</SelectItem>
                    <SelectItem value='sold out'>Sold Out</SelectItem>
                    <SelectItem value='pending'>Pending Approval</SelectItem>
                    {/* Add other relevant statuses */}
                  </SelectContent>
                </Select>
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.status?.message}
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor='key_highlights'>
                Key Highlights (comma-separated)
              </Label>
              <Input id='key_highlights' {...form.register('key_highlights')} />
              <p className='text-xs text-gray-500 mt-1'>
                Enter features separated by commas.
              </p>
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.key_highlights?.message}
              </p>
            </div>

            <div className='pt-4'>
              <p className='text-xs text-gray-500 mb-4 flex items-start'>
                <Info size={20} className='mr-2 text-blue-500 shrink-0' /> Image
                management is handled separately or will be added in a future
                update. This form focuses on product details.
              </p>
            </div>

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate('/dashboard/farmer/current-products')}
                disabled={form.formState.isSubmitting}
              >
                <Ban className='mr-2 h-4 w-4' />
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='bg-primary text-primary-foreground hover:bg-primary/90'
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
