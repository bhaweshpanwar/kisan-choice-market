// src/pages/SelectRolePage.tsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Ensure path is correct
import { Header } from '@/components/layout/Header'; // Ensure path is correct
import { Button } from '@/components/ui/button';
import { User, UserCog } from 'lucide-react';
import { toast } from 'sonner';

export default function SelectRolePage() {
  const { user, isAuthenticated, updateUserRoleAndDetails, isLoading } =
    useAuth();
  const navigate = useNavigate();

  // Redirect if user already has a role other than default 'consumer' or if they become a farmer
  useEffect(() => {
    if (user?.role && user.role !== 'consumer') {
      // Or whatever your default role is after signup
      navigate('/'); // Navigate to dashboard or appropriate page
    }
  }, [user, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    // Allow loading to finish before checking isAuthenticated
    if (!isLoading && !isAuthenticated) {
      toast.error('Please log in to select a role.');
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleRoleSelect = async (role: 'consumer' | 'farmer') => {
    if (!user) {
      toast.error('User data not available. Please try logging in again.');
      navigate('/login');
      return;
    }

    if (role === 'farmer') {
      navigate('/farmer-details-form'); // Navigate to a new form to collect farmer details
    } else {
      try {
        await updateUserRoleAndDetails('consumer'); // Update role to consumer
        // toast.success('Role set to Consumer!'); // Handled in context
        navigate('/'); // Navigate to consumer dashboard or home
      } catch (error) {
        // Error toast handled in context
        console.error('Failed to set role to consumer', error);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className='container mx-auto flex flex-col items-center justify-center py-16 px-4 md:px-6'>
          Loading user information...
        </div>
      </>
    );
  }

  if (!user) {
    // This case should ideally be handled by the useEffect redirecting to /login
    // but as a fallback:
    return (
      <>
        <Header />
        <div className='container mx-auto flex flex-col items-center justify-center py-16 px-4 md:px-6'>
          <p>
            User not loaded. Please try{' '}
            <Link to='/login' className='underline'>
              logging in
            </Link>
            .
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='container mx-auto flex flex-col items-center justify-center py-16 px-4 md:px-6'>
        <div className='w-full max-w-xl space-y-8 text-center'>
          <div className='space-y-4'>
            <h1 className='text-3xl font-bold text-kisan-primary'>
              How will you use Kisan Choice?
            </h1>
            <p className='text-muted-foreground max-w-lg mx-auto'>
              Welcome, {user?.name}! Choose your role to personalize your
              experience.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-8'>
            <div className='border rounded-xl p-6 bg-white hover:shadow-md transition-shadow'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='w-16 h-16 rounded-full bg-kisan-light flex items-center justify-center'>
                  <User className='h-8 w-8 text-kisan-primary' />
                </div>
                <h3 className='text-xl font-medium text-kisan-primary'>
                  Customer
                </h3>
                <p className='text-muted-foreground text-sm'>
                  I want to buy fresh produce from farmers
                </p>
                <Button
                  onClick={() => handleRoleSelect('consumer')}
                  className='w-full bg-kisan-accent hover:bg-kisan-accent/90 text-black'
                >
                  Continue as Customer
                </Button>
              </div>
            </div>

            <div className='border rounded-xl p-6 bg-white hover:shadow-md transition-shadow'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='w-16 h-16 rounded-full bg-kisan-green flex items-center justify-center'>
                  <UserCog className='h-8 w-8 text-kisan-primary' />
                </div>
                <h3 className='text-xl font-medium text-kisan-primary'>
                  Farmer (Kisan)
                </h3>
                <p className='text-muted-foreground text-sm'>
                  I want to sell my farm produce to customers
                </p>
                <Button
                  onClick={() => handleRoleSelect('farmer')}
                  variant='outline'
                  className='w-full border-kisan-accent text-kisan-primary hover:bg-kisan-green/20'
                >
                  Continue as Farmer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
