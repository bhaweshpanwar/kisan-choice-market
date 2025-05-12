// src/pages/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import {
  resetPassword,
  ApiErrorResponse,
  AuthResponse,
} from '@/services/authService';
import { useAuth } from '@/context/AuthContext'; // To handle login after reset
import { LockKeyhole, Loader2 } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { commonAuthSuccessHandlerAfterReset } = useAuth(); // Assuming you'll add this to context

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing password reset token.');
      navigate('/login');
    }
  }, [token, navigate]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Password reset token is missing.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // The resetPassword service should ideally return user data & set cookie
      const response = await resetPassword(token, {
        password: data.password,
        confirmPassword: data.confirmPassword, // Or passwordConfirm if backend expects that
      });

      toast.success(
        'Password has been reset successfully! You are now logged in.'
      );
      // Backend's resetPassword controller calls createSendToken, which sets the cookie.
      // Now, update frontend auth state.
      if (response && response.data && response.data.user) {
        commonAuthSuccessHandlerAfterReset(response); // Call context handler
      } else {
        // If backend doesn't return full AuthResponse, manually call getMe or prompt login
        console.warn(
          "Reset password didn't return full user data for auto-login."
        );
        // await checkAuthStatus(); // If checkAuthStatus is exposed from context
      }
      navigate('/'); // Navigate to home or dashboard
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to reset password.');
      setError(
        apiError.message ||
          'An error occurred. Please try again or request a new link.'
      );
      console.error('Reset password error:', apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    // Should be caught by useEffect but as a fallback
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <p>Invalid reset link.</p>{' '}
        <Link to='/login' className='text-kisan-accent'>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <Header />
      <main className='flex-1 flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-xl'>
          <div className='text-center'>
            <LockKeyhole className='mx-auto h-12 w-12 text-kisan-primary' />
            <h1 className='mt-4 text-2xl font-bold tracking-tight text-kisan-primary'>
              Reset Your Password
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              Enter your new password below. Make sure it's strong and
              memorable.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='password'>New Password</Label>
                    <FormControl>
                      <Input
                        id='password'
                        type='password'
                        placeholder='••••••••'
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
                    <Label htmlFor='confirmPassword'>
                      Confirm New Password
                    </Label>
                    <FormControl>
                      <Input
                        id='confirmPassword'
                        type='password'
                        placeholder='••••••••'
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
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>

          {error && (
            <p className='mt-4 text-sm text-center text-red-600'>{error}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
