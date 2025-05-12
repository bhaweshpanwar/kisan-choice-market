// pages/dashboard/FarmerOrdersPage.tsx (New File)
import { Orders } from '@/components/dashboard/Orders';

const FarmerOrdersPage = () => {
  return (
    <div className='space-y-6 pb-8'>
      <h2 className='text-2xl font-semibold'>Manage Orders</h2>
      <Orders />
    </div>
  );
};

export default FarmerOrdersPage;
