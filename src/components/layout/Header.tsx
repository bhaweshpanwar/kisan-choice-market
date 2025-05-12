import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { logoutUser } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Header() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    toast.loading('Logging out...');

    try {
      const res = await logoutUser();

      if (res.status === 'success') {
        toast.dismiss();
        toast.success('Logged out successfully!');

        // Clear any client-side state if needed here
        // e.g., setUser(null) or resetAuthContext()

        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login'; // full reload (important to trigger new request)
        }, 500);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Logout failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm'>
      <div className='container flex items-center justify-between h-16 px-4 mx-auto md:px-6'>
        {/* Logo */}
        <Link to='/' className='flex items-center'>
          <img
            src='../../../public/images/kisan-choice-logo.png'
            alt='kisan choice'
            className='w-[238px] h-[138px] max-w-full object-contain'
          />
        </Link>

        {/* Search (hidden on mobile) */}
        {!isMobile && (
          <div className='hidden w-1/3 md:flex'>
            <div className='relative w-full'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by brand, item...'
                className='w-full pl-8 bg-gray-50'
              />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        {!isMobile ? (
          <nav className='flex items-center space-x-6'>
            <Link to='/' className='text-sm font-medium text-kisan-primary'>
              Home
            </Link>
            <Link
              to='/products'
              className='text-sm font-medium text-kisan-primary'
            >
              Products
            </Link>
            <Link
              to='/offers'
              className='text-sm font-medium text-kisan-primary'
            >
              Offers
            </Link>
            {/* <Link
              to='/wishlist'
              className='text-sm font-medium text-kisan-primary hover:text-kisan-accent'
            >
              Wish List
            </Link> */}
          </nav>
        ) : null}

        {/* Actions */}
        <div className='flex items-center space-x-3'>
          {isMobile && (
            <Button variant='ghost' size='icon' className='text-kisan-primary'>
              <Search className='w-5 h-5' />
            </Button>
          )}

          {/* <Link to='/wishlist'>
            <Button variant='ghost' size='icon' className='text-kisan-primary'>
              <Heart className='w-5 h-5' />
            </Button>
          </Link> */}

          <Link to='/cart'>
            <Button
              variant='ghost'
              size='icon'
              className='relative text-kisan-primary hover:bg-kisan-primary/10' // Added hover effect
            >
              <ShoppingCart className='w-5 h-5' />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] text-white bg-kisan-accent rounded-full ring-2 ring-white'>
                  {' '}
                  {/* Adjusted size and added ring */}
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {!isAuthenticated ? (
            !isMobile ? (
              <div className='flex items-center space-x-2'>
                <Link to='/login'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-kisan-primary'
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button
                    size='sm'
                    className='bg-black text-white hover:bg-black/90'
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-kisan-primary'
                  >
                    <User className='w-5 h-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem asChild>
                    <Link to='/login'>Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to='/signup'>Sign up</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-kisan-primary'
                >
                  <User className='w-5 h-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <div className='flex flex-col space-y-1 p-2'>
                  <p className='text-sm font-medium'>{user?.name}</p>
                  <p className='text-xs text-muted-foreground'>{user?.email}</p>
                  {user?.role === 'farmer' && (
                    <span className='text-xs bg-kisan-green px-2 py-0.5 rounded-full text-kisan-primary w-fit mt-1'>
                      Farmer
                    </span>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to='/orders'>My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings'>Profile Settings</Link>
                </DropdownMenuItem>
                {user?.role === 'farmer' && (
                  <DropdownMenuItem asChild>
                    <Link to='/farmer-dashboard'>Farmer Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-red-500'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-kisan-primary'
                >
                  <Menu className='w-5 h-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem asChild>
                  <Link to='/'>Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/products'>Products</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/offers'>Offers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/orders'>My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings'>Settings</Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='text-red-500'
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
