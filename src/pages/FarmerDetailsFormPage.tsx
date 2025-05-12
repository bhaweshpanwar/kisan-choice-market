// src/pages/FarmerDetailsFormPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // For longer text like specialization
import { Header } from '@/components/layout/Header';
import { BecomeFarmerPayload } from '@/services/authService'; // Import the payload type

const farmerDetailsSchema = z.object({
  experience: z.coerce
    .number({ invalid_type_error: 'Experience must be a number' })
    .min(0, 'Experience cannot be negative')
    .max(100, 'Experience seems too high'),
  farm_location: z.string().min(5, 'Farm location is required'),
  certifications: z
    .string()
    .min(1, "Please list certifications or type 'None'")
    .transform((val) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    ), // Comma-separated string to array
  location: z.string().min(3, 'General location is required (e.g., State)'),
  specialization: z
    .string()
    .min(3, 'Specialization is required (e.g., Wheat, Pulses)'),
});

type FarmerDetailsFormValues = z.infer<typeof farmerDetailsSchema>;

export default function FarmerDetailsFormPage() {
  const {
    user,
    isAuthenticated,
    updateUserRoleAndDetails,
    isLoading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info('Please login to continue.');
      navigate('/login');
    }
    // If user is already a farmer, redirect them away
    if (user?.role === 'farmer') {
      toast.info("You're already registered as a farmer!");
      navigate('/dashboard/farmer'); // Or appropriate farmer dashboard
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  const form = useForm<FarmerDetailsFormValues>({
    resolver: zodResolver(farmerDetailsSchema),
    defaultValues: {
      experience: 0,
      farm_location: '',
      certifications: [], // Represented as string in form, converted on submit
      location: '',
      specialization: '',
    },
  });

  async function onSubmit(values: FarmerDetailsFormValues) {
    if (!user) {
      toast.error('User not found. Please re-login.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: BecomeFarmerPayload = {
        experience: values.experience ?? 0,
        farm_location: values.farm_location ?? '',
        certifications: values.certifications ?? [],
        location: values.location ?? '',
        specialization: values.specialization ?? '',
      };
      await updateUserRoleAndDetails('farmer', payload);
      // Success toast handled in AuthContext
      navigate('/dashboard/farmer'); // Or wherever farmers should go
    } catch (error) {
      // Error toast handled in AuthContext
      console.error('Failed to submit farmer details:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // Should be redirected by useEffect

  return (
    <>
      <Header />
      <div className='container mx-auto flex flex-col items-center justify-center py-12 px-4 md:px-6'>
        <div className='w-full max-w-lg space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-kisan-primary'>
              Farmer Registration
            </h1>
            <p className='text-muted-foreground'>
              Tell us more about your farm.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='experience'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='e.g., 15' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='farm_location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Location (Full Address)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Village, Tehsil, District, State'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>General Location (e.g., State)</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Madhya Pradesh' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='specialization'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Specialization (e.g., Wheat, Pulses, Organic Vegetables)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe what you specialize in growing or producing'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='certifications'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Certifications (comma-separated, e.g., FSSAI, Organic
                      India, None)
                    </FormLabel>
                    <FormControl>
                      {/* For Zod transform to work, field.value needs to be string if it's an array.
                          Or handle array to string conversion here for display and string to array for onChange.
                          Simpler: keep it as a string input and transform in schema.
                      */}
                      <Input
                        placeholder='FSSAI, Organic, PGS-India'
                        {...field}
                        // value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                        // onChange={(e) => field.onChange(e.target.value)} // Zod transform will handle it
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full mt-2 bg-kisan-primary text-white hover:bg-kisan-primary/90'
                disabled={
                  isSubmitting || !form.formState.isValid || authLoading
                }
              >
                {isSubmitting
                  ? 'Submitting...'
                  : 'Complete Farmer Registration'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
