// src/pages/SignupPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext'; // Make sure path is correct
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
import { Header } from '@/components/layout/Header'; // Make sure path is correct

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error shown under confirmPassword field
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup: contextSignup } = useAuth(); // Renamed to avoid conflict
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsSigningUp(true);
    try {
      // Construct the payload object as expected by authService.signupUser
      const signupPayload = {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        // confirmPassword is not usually sent to the backend, only used for frontend validation
      };
      await contextSignup(signupPayload); // Pass the whole object
      // Toast success is handled in AuthContext, but you can add specific ones here if needed
      // toast.success('Account created successfully! Proceed to select your role.');
      navigate('/select-role'); // Navigate after successful signup
    } catch (error) {
      // Error toast is handled in AuthContext, but you can add specific error handling
      console.error('Signup page error:', error);
      // toast.error('Failed to create account. Please check your details.');
    } finally {
      setIsSigningUp(false);
    }
  }

  return (
    <>
      <Header />
      <div className='container mx-auto flex flex-col items-center justify-center py-12 px-4 md:px-6'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-kisan-primary'>
              Create Account
            </h1>
            <p className='text-muted-foreground'>
              Join Kisan Choice for farm-fresh produce
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='you@example.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mobile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter mobile number'
                        type='tel'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='••••••••'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='••••••••'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full mt-2 bg-black text-white hover:bg-gray-900'
                disabled={isSigningUp || !form.formState.isValid} // Disable if form invalid
              >
                {isSigningUp ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* ... rest of your social login buttons and links ... */}
              <div className='relative flex items-center justify-center py-4'>
                <div className='h-px w-full bg-gray-300'></div>
                <span className='absolute bg-white px-3 text-sm text-gray-500'>
                  OR
                </span>
              </div>
              {/* Google Signup Button Placeholder */}
              <Button
                variant='outline'
                type='button'
                className='w-full'
                onClick={() => toast.info('Google Sign up: Coming soon!')}
              >
                Sign up with Google
              </Button>
              {/* Facebook Signup Button Placeholder */}
              <Button
                variant='outline'
                type='button'
                className='w-full'
                onClick={() => toast.info('Facebook Sign up: Coming soon!')}
              >
                Sign up with Facebook
              </Button>

              <div className='text-center space-y-2 pt-4'>
                <p className='text-sm text-muted-foreground'>
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className='text-kisan-accent font-medium underline-offset-4 hover:underline'
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
