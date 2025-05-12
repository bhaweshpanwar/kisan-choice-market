// import { Home, ShoppingCart, Package, BarChart, Settings, UserX, Upload, AlertCircle } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// export const Sidebar = () => {
//   return (
//     <aside className="hidden md:flex md:w-64 flex-col bg-sidebar border-r border-border">
//       <div className="p-4 border-b border-border flex justify-center">
//         <div className="flex items-center gap-2">
//           <div className="bg-primary rounded-full p-1.5">
//             <Package className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <div className="flex flex-col">
//             <h1 className="font-semibold text-lg">Kisan App</h1>
//             <p className="text-xs text-muted-foreground">किसान ऐप</p>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 p-4 space-y-2">
//         <NavItem icon={Home} label="Dashboard" englishLabel="Home" isActive />
//         <NavItem icon={BarChart} label="इनसाइट्स" englishLabel="Insights" />
//         <NavItem icon={AlertCircle} label="बातचीत ऑफ़र" englishLabel="Negotiation Offers" />
//         <NavItem icon={UserX} label="अवरुद्ध उपयोगकर्ता" englishLabel="Blocked Users" />
//         <NavItem icon={Upload} label="उत्पाद सूचीबद्ध करें" englishLabel="Upload Product" />
//         <NavItem icon={Package} label="वर्तमान उत्पाद" englishLabel="Current Products" />
//         <NavItem icon={ShoppingCart} label="ऑर्डर" englishLabel="Orders" />
//         <NavItem icon={Settings} label="सेटिंग्स" englishLabel="Settings" />
//       </nav>
//     </aside>
//   );
// };

// interface NavItemProps {
//   icon: React.ElementType;
//   label: string;
//   englishLabel: string;
//   isActive?: boolean;
// }

// const NavItem = ({ icon: Icon, label, englishLabel, isActive }: NavItemProps) => {
//   return (
//     <Button
//       variant="ghost"
//       className={cn(
//         "w-full justify-start gap-2 px-3 py-6 h-auto",
//         isActive && "bg-sidebar-accent text-primary"
//       )}
//     >
//       <Icon className="h-5 w-5" />
//       <div className="flex flex-col items-start">
//         <span className="text-sm">{label}</span>
//         <span className="text-xs text-muted-foreground">{englishLabel}</span>
//       </div>
//     </Button>
//   );
// };

// components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Package,
  BarChart,
  Settings,
  UserX,
  Upload,
  AlertCircle,
  X, // Import X for close icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // For the close button

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const closeSidebar = () => setIsOpen(false);

  return (
    <aside
      className={cn(
        // Base styles for mobile (fixed position, full height, off-screen initially)
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar border-r border-border',
        'transform transition-transform duration-300 ease-in-out',
        // Conditional translation based on isOpen state for mobile
        isOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop styles (relative position, part of the flow, always visible)
        'md:relative md:translate-x-0 md:flex md:border-r'
      )}
      aria-label='Main navigation'
    >
      <div className='p-4 border-b border-border flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary rounded-full p-1.5'>
            <Package className='h-5 w-5 text-primary-foreground' />
          </div>
          <div className='flex flex-col'>
            <h1 className='font-semibold text-lg'>Kisan App</h1>
            <p className='text-xs text-muted-foreground'>किसान ऐप</p>
          </div>
        </div>
        {/* Close button for mobile */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={closeSidebar}
          aria-label='Close sidebar'
        >
          <X className='h-5 w-5' />
        </Button>
      </div>

      {/* Navigation items: Add onClick={closeSidebar} to close on navigation */}
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        <NavItem
          to='/dashboard/farmer'
          icon={Home}
          label='डैशबोर्ड'
          englishLabel='Dashboard'
          end
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/insights'
          icon={BarChart}
          label='इनसाइट्स'
          englishLabel='Insights'
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/negotiations'
          icon={AlertCircle}
          label='बातचीत ऑफ़र'
          englishLabel='Negotiation Offers'
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/blocked-users'
          icon={UserX}
          label='अवरुद्ध उपयोगकर्ता'
          englishLabel='Blocked Users'
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/upload-product'
          icon={Upload}
          label='उत्पाद सूचीबद्ध करें'
          englishLabel='Upload Product'
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/current-products'
          icon={Package}
          label='वर्तमान उत्पाद'
          englishLabel='Current Products'
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/orders'
          icon={ShoppingCart}
          label='ऑर्डर'
          englishLabel='Orders'
          onClick={closeSidebar}
        />
        <NavItem
          to='/dashboard/farmer/settings'
          icon={Settings}
          label='सेटिंग्स'
          englishLabel='Settings'
          onClick={closeSidebar}
        />
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  englishLabel: string;
  end?: boolean;
  onClick?: () => void; // Make onClick optional and add it here
}

const NavItem = ({
  to,
  icon: Icon,
  label,
  englishLabel,
  end = false,
  onClick, // Destructure onClick
}: NavItemProps) => {
  const handleItemClick = () => {
    // If an onClick handler is provided (for closing the sidebar on mobile), call it.
    if (onClick) {
      // We only want to call this if it's actually a mobile interaction.
      // A simple way is to check window width, though responsive hooks are better for complex apps.
      if (window.innerWidth < 768) {
        // 768px is Tailwind's default 'md' breakpoint
        onClick();
      }
    }
  };

  return (
    <NavLink
      to={to}
      end={end}
      onClick={handleItemClick} // Call the wrapper
      className={({ isActive }) =>
        cn(
          'w-full justify-start gap-2 px-3 py-4 h-auto', // Adjusted padding
          'flex items-center',
          'text-sm font-medium rounded-md transition-colors',
          'hover:bg-sidebar-accent/80 hover:text-primary',
          isActive
            ? 'bg-sidebar-accent text-primary' // Active styles
            : 'text-foreground/70' // Inactive styles
        )
      }
    >
      <Icon className='h-5 w-5' />
      <div className='flex flex-col items-start'>
        <span className='text-sm'>{label}</span>
        <span className='text-xs text-muted-foreground'>{englishLabel}</span>
      </div>
    </NavLink>
  );
};
