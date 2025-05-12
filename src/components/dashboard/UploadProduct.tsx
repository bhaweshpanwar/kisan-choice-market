// src/components/dashboard/UploadProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox'; // For 'negotiate'
import { Upload, Loader2, Info } from 'lucide-react';
import {
  createFarmerProduct,
  CreateProductPayload,
  getCategories, // To fetch categories for dropdown
  Category, // Category type
  ApiErrorResponse,
} from '@/services/productService';

// Zod Schema for Product Creation
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  nameHindi: z.string().optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'), // coerce to number
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
    ), // Comma-separated to array
  min_qty: z.coerce
    .number()
    .int()
    .min(1, 'Minimum quantity must be at least 1.')
    .default(1),
  max_qty: z.coerce
    .number()
    .int()
    .positive('Maximum quantity must be positive.'),
});
type ProductFormValues = z.infer<typeof productSchema>;

export const UploadProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      nameHindi: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      category_id: '',
      negotiate: false,
      key_highlights: [], // Represented as string in form, transformed by Zod
      min_qty: 1,
      max_qty: 100, // Default max quantity
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await getCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        toast.error('Failed to load product categories.');
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    // console.log("Form data submitted:", data);
    const payload: CreateProductPayload = {
      ...data,
      // key_highlights is already an array due to Zod transform
    };
    // console.log("Payload to send:", payload);

    try {
      await createFarmerProduct(payload);
      toast.success('Product listed successfully!');
      navigate('/dashboard/farmer/current-products'); // Or wherever you list products
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to list product.');
      console.error('Create product error:', apiError);
    }
  };

  return (
    <div className='space-y-6 mt-8 max-w-3xl mx-auto'>
      {' '}
      {/* Centered and max-width */}
      <div className='flex items-center gap-2 mb-6'>
        <Upload className='h-6 w-6 text-primary' />
        <h2 className='text-2xl font-semibold text-gray-800'>
          List New Product
        </h2>
      </div>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-lg text-gray-700'>
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Product Name (English) */}
            <div>
              <Label htmlFor='name'>Product Name (English)</Label>
              <Input
                id='name'
                {...form.register('name')}
                placeholder='e.g., Organic Basmati Rice'
              />
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.name?.message}
              </p>
            </div>
            {/* Product Name (Hindi) */}
            <div>
              <Label htmlFor='nameHindi'>Product Name (Hindi - Optional)</Label>
              <Input
                id='nameHindi'
                {...form.register('nameHindi')}
                placeholder='उदाहरण: जैविक बासमती चावल'
              />
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.nameHindi?.message}
              </p>
            </div>
            {/* Description */}
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                {...form.register('description')}
                placeholder='Detailed description of your product...'
                rows={4}
              />
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.description?.message}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              {/* Price */}
              <div>
                <Label htmlFor='price'>Price per Unit (₹)</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  {...form.register('price')}
                  placeholder='e.g., 150.50'
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.price?.message}
                </p>
              </div>
              {/* Stock Quantity */}
              <div>
                <Label htmlFor='stock_quantity'>
                  Stock Quantity (units/kg)
                </Label>
                <Input
                  id='stock_quantity'
                  type='number'
                  {...form.register('stock_quantity')}
                  placeholder='e.g., 100'
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.stock_quantity?.message}
                </p>
              </div>
              {/* Category */}
              <div>
                <Label htmlFor='category_id'>Category</Label>
                <Select
                  onValueChange={(value) => form.setValue('category_id', value)}
                  defaultValue={form.getValues('category_id')}
                >
                  <SelectTrigger disabled={isLoadingCategories}>
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? 'Loading categories...'
                          : 'Select a category'
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
              {/* Negotiable */}
              <div className='flex items-center space-x-2 pt-6'>
                {' '}
                {/* Adjusted for alignment */}
                <Checkbox id='negotiate' {...form.register('negotiate')} />
                <Label
                  htmlFor='negotiate'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Allow Price Negotiation?
                </Label>
              </div>
              {/* Min Quantity */}
              <div>
                <Label htmlFor='min_qty'>Minimum Order Quantity</Label>
                <Input
                  id='min_qty'
                  type='number'
                  {...form.register('min_qty')}
                  placeholder='e.g., 1'
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.min_qty?.message}
                </p>
              </div>
              {/* Max Quantity */}
              <div>
                <Label htmlFor='max_qty'>Maximum Order Quantity</Label>
                <Input
                  id='max_qty'
                  type='number'
                  {...form.register('max_qty')}
                  placeholder='e.g., 50'
                />
                <p className='text-xs text-red-500 mt-1 h-4'>
                  {form.formState.errors.max_qty?.message}
                </p>
              </div>
            </div>
            {/* Key Highlights */}
            <div>
              <Label htmlFor='key_highlights'>
                Key Highlights (comma-separated)
              </Label>
              <Input
                id='key_highlights'
                {...form.register('key_highlights')}
                placeholder='e.g., Organic, Rich in Fiber, Gluten-free'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Enter features separated by commas.
              </p>
              <p className='text-xs text-red-500 mt-1 h-4'>
                {form.formState.errors.key_highlights?.message}
              </p>
            </div>

            {/* Image Upload Removed */}
            {/* <div className="space-y-2">
                <Label>Photos / तस्वीरें</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center"> ... </div>
            </div> */}
            <div className='pt-4'>
              <p className='text-xs text-gray-500 mb-4 flex items-start'>
                <Info size={20} className='mr-2 text-blue-500 shrink-0' />{' '}
                Product images can be added/managed after initial listing from
                the 'Edit Product' section. For now, we are skipping direct
                image uploads on creation.
              </p>
            </div>

            <Button
              type='submit'
              className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className='h-4 w-4 mr-2' /> List Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
