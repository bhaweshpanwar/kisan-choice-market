// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext'; // Path should be correct
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
import { Header } from '@/components/layout/Header'; // Path should be correct

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, isAuthenticated, isLoading: authIsLoading } = useAuth(); // Use authIsLoading
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed for clarity

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Wait for initial auth check to complete
    if (!authIsLoading && isAuthenticated) {
      console.log('LoginPage: Already authenticated, redirecting...', user);
      let redirectTo = from;
      if (user?.role === 'farmer') {
        redirectTo = '/dashboard/farmer';
      } else if (user?.role === 'consumer') {
        redirectTo = '/'; // Or consumer dashboard
      } else if (!user?.role) {
        // After signup, role might be pending selection
        redirectTo = '/select-role';
      }
      // Only navigate if we are currently on an auth page and not already at the target
      if (
        (location.pathname === '/login' || location.pathname === '/signup') &&
        location.pathname !== redirectTo
      ) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [authIsLoading, isAuthenticated, user, navigate, from, location.pathname]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const loggedInUserData = await login({
        email: values.email!,
        password: values.password!,
      });

      if (loggedInUserData) {
        toast.success('Login successful! Redirecting...');
        // Navigation logic based on loggedInUserData.role
        if (loggedInUserData.role === 'farmer') {
          navigate('/dashboard/farmer', { replace: true });
        } else if (loggedInUserData.role === 'consumer') {
          navigate('/', { replace: true }); // Or consumer dashboard
        } else if (!loggedInUserData.role) {
          navigate('/select-role', { replace: true });
        } else {
          navigate(from, { replace: true }); // Fallback to 'from' or a default
        }
      }
      // If loggedInUserData is undefined, error handling was done in AuthContext
    } catch (error) {
      // Error toast is already handled by AuthContext.login
      console.error(
        'Login page submit error (already handled by context):',
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleLogin = () => {
    // Backend URL for Google OAuth initiation
    // This will redirect the user to Google, and Google will redirect back to your backend callback
    const googleLoginUrl = `${
      process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'
    }/api/v1/auth/google`;
    window.location.href = googleLoginUrl; // Full page redirect
  };

  if (authIsLoading) {
    return (
      <>
        <Header />
        <div className='container mx-auto flex items-center justify-center py-12'>
          Authenticating...
        </div>
      </>
    );
  }

  // If authenticated after loading, the useEffect should handle redirection.
  // This is a fallback or can show a brief "Redirecting..." message.
  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div className='container mx-auto flex items-center justify-center py-12'>
          Redirecting...
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className='container mx-auto flex flex-col items-center justify-center py-12 px-4 md:px-6'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-kisan-primary'>
              Welcome Back
            </h1>
            <p className='text-muted-foreground'>
              Sign in to your Kisan Choice account
            </p>
            <div className='text-sm bg-blue-50 p-3 rounded-md text-blue-800 mt-3'>
              <p className='font-semibold'>Demo Accounts:</p>
              <p>Customer: john@gmail.com / John@123</p>
              <p>Farmer: ramesh@gmail.com / Ramesh@123</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
              {/* Forgot Password Link */}
              <div className='flex items-center justify-end'>
                <Link
                  to='/forgot-password'
                  className='text-sm font-medium text-kisan-accent hover:text-kisan-accent/80 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type='submit'
                className='w-full bg-black hover:bg-kisan-primary/90 text-white'
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>

          {/* Google Button */}
          <button className='w-full flex items-center justify-center bg-white border border-gray-300 px-6 py-2 text-sm font-medium text-gray-800  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
            {/* Google Logo */}
            <svg
              className='h-6 w-6 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='-0.5 0 48 48'
              version='1.1'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g transform='translate(-401.000000, -860.000000)'>
                  <g transform='translate(401.000000, 860.000000)'>
                    <path
                      d='M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24'
                      id='Fill-1'
                      fill='#FBBC05'
                    >
                      {' '}
                    </path>
                    <path
                      d='M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333'
                      id='Fill-2'
                      fill='#EB4335'
                    >
                      {' '}
                    </path>
                    <path
                      d='M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667'
                      id='Fill-3'
                      fill='#34A853'
                    >
                      {' '}
                    </path>
                    <path
                      d='M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24'
                      id='Fill-4'
                      fill='#4285F4'
                    >
                      {' '}
                    </path>
                  </g>
                </g>
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Facebook Button */}
          <button className='w-full flex items-center justify-center bg-white border border-gray-300 px-6 py-2 text-sm font-medium text-gray-800  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
            {/* Facebook Logo */}

            <svg
              className='h-6 w-6  mr-2 '
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 -4 48 48'
              version='1.1'
            >
              <g
                id='Icons'
                stroke='none'
                strokeWidth='1'
                fill='none'
                fill-rule='evenodd'
              >
                <g
                  id='Color-'
                  transform='translate(-200.000000, -160.000000)'
                  fill='#4460A0'
                >
                  <path
                    d='M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z'
                    id='Facebook'
                  ></path>
                </g>
              </g>
            </svg>
            <span>Continue with Facebook</span>
          </button>

          <div className='text-center space-y-2 pt-4'>
            <p className='text-sm text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <Link
                to='/signup'
                className='text-kisan-accent font-medium underline-offset-4 hover:underline'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
