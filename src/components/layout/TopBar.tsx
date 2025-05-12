// components/layout/TopBar.tsx
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/services/authService';
interface TopBarProps {
  onMenuClick: () => void; // Callback for when the menu icon is clicked
}
import { toast } from 'sonner';
export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user, logout } = useAuth();
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

  const getInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className='bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20 md:z-10'>
      {' '}
      {/* Ensure TopBar is above main content */}
      <div className='flex items-center gap-3'>
        {/* Menu button for mobile, triggers onMenuClick */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden' // Only visible on screens smaller than md
          onClick={onMenuClick}
          aria-label='Open sidebar'
        >
          <Menu className='h-5 w-5' />
        </Button>
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>Kisan App</h1>
          <p className='text-xs text-muted-foreground'>किसान ऐप</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon'>
          <Bell className='h-5 w-5' />
        </Button>
        <Avatar className='h-8 w-8'>
          <AvatarFallback className='bg-primary text-primary-foreground'>
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleLogout}
          title='Logout'
        >
          <LogOut className='h-5 w-5' />
        </Button>
      </div>
    </header>
  );
};
