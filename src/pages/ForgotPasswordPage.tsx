// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { forgotPassword, ApiErrorResponse } from '@/services/authService';
import { Mail, Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await forgotPassword({ email: data.email });
      toast.success(
        response.message || 'Password reset instructions sent to your email.'
      );
      setMessage(
        response.message ||
          'If an account with that email exists, we have sent password reset instructions.'
      );
      // Optionally, navigate away or disable form further
      // navigate('/login');
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to send password reset email.');
      setMessage(apiError.message || 'An error occurred. Please try again.');
      console.error('Forgot password error:', apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <Header />
      <main className='flex-1 flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-xl'>
          <div className='text-center'>
            <Mail className='mx-auto h-12 w-12 text-kisan-primary' />
            <h1 className='mt-4 text-2xl font-bold tracking-tight text-kisan-primary'>
              Forgot Your Password?
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              No worries! Enter your email address below, and we'll send you a
              link to reset your password.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='email'>Email Address</Label>
                    <FormControl>
                      <Input
                        id='email'
                        type='email'
                        placeholder='you@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-kisan-primary text-white hover:bg-kisan-primary/90'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </Form>

          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.includes('error') || message.includes('Failed')
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}

          <div className='text-center text-sm'>
            <Link
              to='/login'
              className='font-medium text-kisan-accent hover:text-kisan-accent/80'
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
