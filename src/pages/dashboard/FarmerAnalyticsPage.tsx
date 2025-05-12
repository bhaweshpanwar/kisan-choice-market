// pages/dashboard/FarmerAnalyticsPage.tsx (New File)
// You might reuse Stats or have a more detailed analytics component
import { Stats } from '@/components/dashboard/Stats';
// import { SalesChart } from "@/components/dashboard/SalesChart"; // Example

const FarmerAnalyticsPage = () => {
  return (
    <div className='space-y-6 pb-8'>
      <h2 className='text-2xl font-semibold'>Insights & Analytics</h2>
      <Stats />
      {/* Add more detailed charts/data */}
      {/* <SalesChart /> */}
    </div>
  );
};
export default FarmerAnalyticsPage;
