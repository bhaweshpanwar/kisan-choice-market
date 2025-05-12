// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { Stats } from "@/components/dashboard/Stats";
// import { NegotiationOffers } from "@/components/dashboard/NegotiationOffers";
// import { BlockedUsers } from "@/components/dashboard/BlockedUsers";
// import { UploadProduct } from "@/components/dashboard/UploadProduct";
// import { CurrentProducts } from "@/components/dashboard/CurrentProducts";
// import { Orders } from "@/components/dashboard/Orders";
// import { Settings } from "@/components/dashboard/Settings";
// import { TodaysTip } from "@/components/dashboard/TodaysTip";

// const Index = () => {
//   return (
//     <DashboardLayout>
//       <div className="space-y-6 pb-8">
//         {/* Insights */}
//         <Stats />

//         {/* Negotiation Offers */}
//         <NegotiationOffers />

//         {/* Current Products */}
//         <CurrentProducts />

//         {/* Today's Tip */}
//         <TodaysTip />

//         {/* Orders */}
//         <Orders />

//         {/* Blocked Users */}
//         <BlockedUsers />

//         {/* Upload Product */}
//         <UploadProduct />

//         {/* Settings */}
//         <Settings />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Index;

// pages/dashboard/DashboardOverview.tsx (previously Index.tsx)
import { Stats } from '@/components/dashboard/Stats';
import { TodaysTip } from '@/components/dashboard/TodaysTip';
// Maybe include a summary of recent activity or key stats
// import { RecentOrdersSummary } from "@/components/dashboard/RecentOrdersSummary";
// import { QuickLinks } from "@/components/dashboard/QuickLinks";

const DashboardOverview = () => {
  return (
    <div className='space-y-6 pb-8'>
      <h2 className='text-2xl font-semibold'>Dashboard Overview</h2>
      {/* Insights */}
      <Stats />

      {/* Today's Tip */}
      <TodaysTip />

      {/* Add other relevant overview components here */}
      {/* <RecentOrdersSummary /> */}
      {/* <QuickLinks /> */}
    </div>
  );
};

export default DashboardOverview;
