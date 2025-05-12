// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
// import { Button } from "@/components/ui/button";
// import { orders } from "@/lib/data";
// import {
//   Package,
//   ShoppingBag,
//   Truck,
//   CheckCircle,
//   XCircle,
//   Search,
//   Calendar,
//   ChevronDown
// } from "lucide-react";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";

// // Helper function to get status icon
// const getStatusIcon = (status: string) => {
//   switch (status) {
//     case "processing":
//       return <Package className="h-5 w-5 text-blue-500" />;
//     case "shipped":
//       return <Truck className="h-5 w-5 text-amber-500" />;
//     case "delivered":
//       return <CheckCircle className="h-5 w-5 text-green-500" />;
//     case "cancelled":
//       return <XCircle className="h-5 w-5 text-red-500" />;
//     default:
//       return <ShoppingBag className="h-5 w-5 text-gray-500" />;
//   }
// };

// // Helper function to get status text
// const getStatusText = (status: string) => {
//   switch (status) {
//     case "processing":
//       return "Processing";
//     case "shipped":
//       return "Shipped";
//     case "delivered":
//       return "Delivered";
//     case "cancelled":
//       return "Cancelled";
//     default:
//       return "Unknown";
//   }
// };

// // Helper function to get status badge variant
// const getStatusVariant = (status: string) => {
//   switch (status) {
//     case "processing":
//       return "default";
//     case "shipped":
//       return "warning";
//     case "delivered":
//       return "success";
//     case "cancelled":
//       return "destructive";
//     default:
//       return "secondary";
//   }
// };

// export default function OrdersPage() {
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [sortBy, setSortBy] = useState<string>("date-desc");

//   // Filtered and sorted orders
//   const filteredOrders = orders.filter((order) => {
//     // If there's a search query, search in order ID and product names
//     if (searchQuery) {
//       const productNames = order.items.map((item) => item.name.toLowerCase()).join(" ");
//       return (
//         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         productNames.includes(searchQuery.toLowerCase())
//       );
//     }
//     return true;
//   });

//   // Sort orders
//   const sortedOrders = [...filteredOrders].sort((a, b) => {
//     const dateA = new Date(a.date).getTime();
//     const dateB = new Date(b.date).getTime();

//     switch (sortBy) {
//       case "date-asc":
//         return dateA - dateB;
//       case "date-desc":
//         return dateB - dateA;
//       case "amount-asc":
//         return a.total - b.total;
//       case "amount-desc":
//         return b.total - a.total;
//       default:
//         return dateB - dateA;
//     }
//   });

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Header />
//       <main className="flex-1 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="mb-6 text-2xl font-bold text-kisan-primary md:text-3xl">
//             My Orders
//           </h1>

//           {/* Filters and Search */}
//           <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
//             <div className="w-full md:w-64">
//               <div className="relative">
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search orders..."
//                   className="pl-10"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Calendar className="h-4 w-4 text-gray-500" />
//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Sort by" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="date-desc">Newest First</SelectItem>
//                     <SelectItem value="date-asc">Oldest First</SelectItem>
//                     <SelectItem value="amount-desc">Amount: High to Low</SelectItem>
//                     <SelectItem value="amount-asc">Amount: Low to High</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* Orders Tabs */}
//           <Tabs defaultValue="all" className="w-full">
//             <TabsList className="mb-6 grid w-full grid-cols-4">
//               <TabsTrigger value="all">All</TabsTrigger>
//               <TabsTrigger value="processing">Processing</TabsTrigger>
//               <TabsTrigger value="shipped">Shipped</TabsTrigger>
//               <TabsTrigger value="delivered">Delivered</TabsTrigger>
//             </TabsList>

//             {/* All Orders */}
//             <TabsContent value="all">
//               {sortedOrders.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
//                   <h2 className="text-xl font-medium text-kisan-primary mb-2">No orders found</h2>
//                   <p className="text-gray-500 mb-8">
//                     {searchQuery
//                       ? "No orders match your search criteria."
//                       : "You haven't placed any orders yet."}
//                   </p>
//                   <Link to="/products">
//                     <Button>Shop Now</Button>
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {sortedOrders.map((order) => (
//                     <div key={order.id} className="rounded-lg border border-gray-200 overflow-hidden">
//                       {/* Order Header */}
//                       <div className="bg-gray-50 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
//                         <div className="flex flex-col space-y-1 mb-2 md:mb-0">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-sm font-medium text-kisan-primary">
//                               Order #{order.id}
//                             </span>
//                             <Badge variant={getStatusVariant(order.status) as any}>
//                               {getStatusText(order.status)}
//                             </Badge>
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             Placed on {new Date(order.date).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <div className="text-right">
//                             <div className="text-sm font-medium text-kisan-primary">
//                               ₹{order.total.toLocaleString()}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
//                             </div>
//                           </div>
//                           <Link to={`/orders/${order.id}`}>
//                             <Button variant="outline" size="sm">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </div>

//                       {/* Order Items */}
//                       <div className="px-4 py-3">
//                         <div className="grid grid-cols-12 gap-4 items-center">
//                           {/* Status Icon */}
//                           <div className="col-span-1">
//                             {getStatusIcon(order.status)}
//                           </div>

//                           {/* Product Details */}
//                           <div className="col-span-9 md:col-span-10">
//                             <div className="flex items-center">
//                               <div className="flex overflow-x-auto space-x-2 pb-2">
//                                 {order.items.map((item) => (
//                                   <img
//                                     key={item.id}
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="h-16 w-16 rounded-md object-cover border border-gray-200 flex-shrink-0"
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Chevron */}
//                           <div className="col-span-2 md:col-span-1 flex justify-end">
//                             <ChevronDown className="h-5 w-5 text-gray-400" />
//                           </div>
//                         </div>

//                         {/* Delivery Address (Collapsed by default) */}
//                         <div className="mt-4 border-t border-gray-200 pt-4 hidden">
//                           <h4 className="text-sm font-medium text-kisan-primary mb-2">
//                             Delivery Address
//                           </h4>
//                           <div className="text-sm text-gray-700">
//                             <p>{order.shippingAddress.name}</p>
//                             <p>{order.shippingAddress.line1}</p>
//                             {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
//                             <p>
//                               {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
//                               {order.shippingAddress.postalCode}
//                             </p>
//                             <p>Phone: {order.shippingAddress.phone}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>

//             {/* Processing Orders */}
//             <TabsContent value="processing">
//               {sortedOrders.filter((order) => order.status === "processing").length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <Package className="h-16 w-16 text-gray-400 mb-4" />
//                   <h2 className="text-xl font-medium text-kisan-primary mb-2">No processing orders</h2>
//                   <p className="text-gray-500 mb-8">
//                     You don't have any orders currently being processed.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {sortedOrders
//                     .filter((order) => order.status === "processing")
//                     .map((order) => (
//                       <div key={order.id} className="rounded-lg border border-gray-200 overflow-hidden">
//                         {/* Order Header */}
//                         <div className="bg-gray-50 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
//                           <div className="flex flex-col space-y-1 mb-2 md:mb-0">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-sm font-medium text-kisan-primary">
//                                 Order #{order.id}
//                               </span>
//                               <Badge variant="default">Processing</Badge>
//                             </div>
//                             <span className="text-xs text-gray-500">
//                               Placed on {new Date(order.date).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-4">
//                             <div className="text-right">
//                               <div className="text-sm font-medium text-kisan-primary">
//                                 ₹{order.total.toLocaleString()}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
//                               </div>
//                             </div>
//                             <Link to={`/orders/${order.id}`}>
//                               <Button variant="outline" size="sm">
//                                 View Details
//                               </Button>
//                             </Link>
//                           </div>
//                         </div>

//                         {/* Order Items */}
//                         <div className="px-4 py-3">
//                           <div className="grid grid-cols-12 gap-4 items-center">
//                             {/* Status Icon */}
//                             <div className="col-span-1">
//                               <Package className="h-5 w-5 text-blue-500" />
//                             </div>

//                             {/* Product Details */}
//                             <div className="col-span-9 md:col-span-10">
//                               <div className="flex items-center">
//                                 <div className="flex overflow-x-auto space-x-2 pb-2">
//                                   {order.items.map((item) => (
//                                     <img
//                                       key={item.id}
//                                       src={item.image}
//                                       alt={item.name}
//                                       className="h-16 w-16 rounded-md object-cover border border-gray-200 flex-shrink-0"
//                                     />
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Chevron */}
//                             <div className="col-span-2 md:col-span-1 flex justify-end">
//                               <ChevronDown className="h-5 w-5 text-gray-400" />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </TabsContent>

//             {/* Shipped Orders */}
//             <TabsContent value="shipped">
//               {sortedOrders.filter((order) => order.status === "shipped").length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <Truck className="h-16 w-16 text-gray-400 mb-4" />
//                   <h2 className="text-xl font-medium text-kisan-primary mb-2">No shipped orders</h2>
//                   <p className="text-gray-500 mb-8">
//                     You don't have any orders currently in transit.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {sortedOrders
//                     .filter((order) => order.status === "shipped")
//                     .map((order) => (
//                       <div key={order.id} className="rounded-lg border border-gray-200 overflow-hidden">
//                         {/* Order Header */}
//                         <div className="bg-gray-50 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
//                           <div className="flex flex-col space-y-1 mb-2 md:mb-0">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-sm font-medium text-kisan-primary">
//                                 Order #{order.id}
//                               </span>
//                               <Badge variant="warning">Shipped</Badge>
//                             </div>
//                             <span className="text-xs text-gray-500">
//                               Placed on {new Date(order.date).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-4">
//                             <div className="text-right">
//                               <div className="text-sm font-medium text-kisan-primary">
//                                 ₹{order.total.toLocaleString()}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
//                               </div>
//                             </div>
//                             <Link to={`/orders/${order.id}`}>
//                               <Button variant="outline" size="sm">
//                                 View Details
//                               </Button>
//                             </Link>
//                           </div>
//                         </div>

//                         {/* Order Items */}
//                         <div className="px-4 py-3">
//                           <div className="grid grid-cols-12 gap-4 items-center">
//                             {/* Status Icon */}
//                             <div className="col-span-1">
//                               <Truck className="h-5 w-5 text-amber-500" />
//                             </div>

//                             {/* Product Details */}
//                             <div className="col-span-9 md:col-span-10">
//                               <div className="flex items-center">
//                                 <div className="flex overflow-x-auto space-x-2 pb-2">
//                                   {order.items.map((item) => (
//                                     <img
//                                       key={item.id}
//                                       src={item.image}
//                                       alt={item.name}
//                                       className="h-16 w-16 rounded-md object-cover border border-gray-200 flex-shrink-0"
//                                     />
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Chevron */}
//                             <div className="col-span-2 md:col-span-1 flex justify-end">
//                               <ChevronDown className="h-5 w-5 text-gray-400" />
//                             </div>
//                           </div>

//                           {/* Tracking Info */}
//                           <div className="mt-3 pt-3 border-t border-gray-200">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-xs font-medium text-gray-700">
//                                 Tracking #:
//                               </span>
//                               <span className="text-xs text-gray-600">
//                                 {order.trackingNumber || "N/A"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </TabsContent>

//             {/* Delivered Orders */}
//             <TabsContent value="delivered">
//               {sortedOrders.filter((order) => order.status === "delivered").length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <CheckCircle className="h-16 w-16 text-gray-400 mb-4" />
//                   <h2 className="text-xl font-medium text-kisan-primary mb-2">No delivered orders</h2>
//                   <p className="text-gray-500 mb-8">
//                     You don't have any delivered orders yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {sortedOrders
//                     .filter((order) => order.status === "delivered")
//                     .map((order) => (
//                       <div key={order.id} className="rounded-lg border border-gray-200 overflow-hidden">
//                         {/* Order Header */}
//                         <div className="bg-gray-50 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
//                           <div className="flex flex-col space-y-1 mb-2 md:mb-0">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-sm font-medium text-kisan-primary">
//                                 Order #{order.id}
//                               </span>
//                               <Badge variant="success">Delivered</Badge>
//                             </div>
//                             <span className="text-xs text-gray-500">
//                               Placed on {new Date(order.date).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-4">
//                             <div className="text-right">
//                               <div className="text-sm font-medium text-kisan-primary">
//                                 ₹{order.total.toLocaleString()}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
//                               </div>
//                             </div>
//                             <Link to={`/orders/${order.id}`}>
//                               <Button variant="outline" size="sm">
//                                 View Details
//                               </Button>
//                             </Link>
//                           </div>
//                         </div>

//                         {/* Order Items */}
//                         <div className="px-4 py-3">
//                           <div className="grid grid-cols-12 gap-4 items-center">
//                             {/* Status Icon */}
//                             <div className="col-span-1">
//                               <CheckCircle className="h-5 w-5 text-green-500" />
//                             </div>

//                             {/* Product Details */}
//                             <div className="col-span-9 md:col-span-10">
//                               <div className="flex items-center">
//                                 <div className="flex overflow-x-auto space-x-2 pb-2">
//                                   {order.items.map((item) => (
//                                     <img
//                                       key={item.id}
//                                       src={item.image}
//                                       alt={item.name}
//                                       className="h-16 w-16 rounded-md object-cover border border-gray-200 flex-shrink-0"
//                                     />
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Chevron */}
//                             <div className="col-span-2 md:col-span-1 flex justify-end">
//                               <ChevronDown className="h-5 w-5 text-gray-400" />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// src/pages/OrdersPage.tsx
import React, { useState, useEffect } from 'react'; // Added React
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  getMyOrders,
  OrderSummary,
  // getMyOrderDetails, // For a future order detail modal/page
  // cancelMyOrder,    // For future cancel functionality
} from '@/services/orderService';
import { ApiErrorResponse } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  ChevronRight, // Changed from ChevronDown as it's often used for "view more"
  Loader2, // For loading state
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Helper function to get status icon
const getStatusIcon = (
  status: OrderSummary['order_status'] | OrderSummary['payment_status']
) => {
  switch (status) {
    case 'pending': // Can be order_status or payment_status
      return <Package className='h-5 w-5 text-blue-500' />; // Or Hourglass for pending payment
    case 'processing': // Typically order_status
      return <Package className='h-5 w-5 text-blue-500' />;
    case 'shipped':
      return <Truck className='h-5 w-5 text-amber-500' />;
    case 'delivered':
      return <CheckCircle className='h-5 w-5 text-green-500' />;
    case 'cancelled':
      return <XCircle className='h-5 w-5 text-red-500' />;
    case 'completed': // payment_status
      return <CheckCircle className='h-5 w-5 text-green-500' />;
    case 'failed': // payment_status
      return <XCircle className='h-5 w-5 text-red-500' />;
    default:
      return <ShoppingBag className='h-5 w-5 text-gray-500' />;
  }
};

// Helper function to get status text (more comprehensive)
const getStatusText = (
  status: OrderSummary['order_status'] | OrderSummary['payment_status']
) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    completed: 'Payment Completed',
    failed: 'Payment Failed',
  };
  return statusMap[status] || 'Unknown';
};

// Helper function to get status badge variant
const getStatusVariant = (
  status: OrderSummary['order_status'] | OrderSummary['payment_status']
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning' => {
  switch (status) {
    case 'pending':
      return 'default'; // Blue-ish
    case 'processing':
      return 'default';
    case 'shipped':
      return 'warning'; // Amber/Orange
    case 'delivered':
      return 'success'; // Green
    case 'cancelled':
      return 'destructive'; // Red
    case 'completed':
      return 'success';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary'; // Grey
  }
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>(''); // Keep for client-side search for now
  const [sortBy, setSortBy] = useState<string>('date-desc'); // Keep for client-side sort
  const [activeTab, setActiveTab] = useState<
    OrderSummary['order_status'] | 'all'
  >('all');

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      // Optionally redirect to login or show a message
      // toast.info("Please login to view your orders.");
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Backend filtering by status can be added later if `getMyOrders` supports it
        // const params = activeTab !== "all" ? { status: activeTab } : {};
        const response = await getMyOrders(/* params */);
        setOrders(response.data.orders || []);
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || 'Failed to load your orders.');
        toast.error(apiError.message || 'Failed to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, activeTab]); // Re-fetch if activeTab changes, if backend supports status filter

  // Client-side filtering and sorting (can be moved to backend later for pagination)
  const processedOrders = orders
    .filter((order) => {
      if (activeTab !== 'all' && order.order_status !== activeTab) {
        return false;
      }
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(searchTerm) ||
          (order.first_product_name &&
            order.first_product_name.toLowerCase().includes(searchTerm))
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      const amountA = parseFloat(a.total_price);
      const amountB = parseFloat(b.total_price);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return amountA - amountB;
        case 'amount-desc':
          return amountB - amountA;
        default:
          return dateB - dateA;
      }
    });

  if (!isAuthenticated && !isLoading) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1 py-8 text-center'>
          <p className='mb-4'>
            Please{' '}
            <Link
              to='/login?redirect=/orders'
              className='text-kisan-accent underline'
            >
              login
            </Link>{' '}
            to view your orders.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1 py-8'>
        <div className='container mx-auto px-4'>
          <h1 className='mb-6 text-2xl font-bold text-kisan-primary md:text-3xl'>
            My Orders
          </h1>

          <div className='mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
            <div className='w-full md:w-64'>
              <div className='relative'>
                <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search by Order ID or Product...'
                  className='pl-10'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-gray-500' />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='date-desc'>Newest First</SelectItem>
                    <SelectItem value='date-asc'>Oldest First</SelectItem>
                    <SelectItem value='amount-desc'>
                      Amount: High to Low
                    </SelectItem>
                    <SelectItem value='amount-asc'>
                      Amount: Low to High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Simplified Tabs - can be expanded later */}
          <Tabs
            defaultValue='all'
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as OrderSummary['order_status'] | 'all')
            }
            className='w-full'
          >
            <TabsList className='mb-6 grid w-full grid-cols-2 sm:grid-cols-5'>
              {' '}
              {/* Adjusted for more statuses */}
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='pending'>Pending</TabsTrigger>
              <TabsTrigger value='processing'>Processing</TabsTrigger>{' '}
              {/* Add if you use this status */}
              <TabsTrigger value='shipped'>Shipped</TabsTrigger>
              <TabsTrigger value='delivered'>Delivered</TabsTrigger>
              {/* <TabsTrigger value="cancelled">Cancelled</TabsTrigger> */}
            </TabsList>

            <TabsContent value={activeTab}>
              {' '}
              {/* Display content based on activeTab directly */}
              {isLoading ? (
                <div className='flex justify-center items-center py-20'>
                  <Loader2 className='h-12 w-12 animate-spin text-kisan-primary' />{' '}
                  <p className='ml-3 text-lg'>Loading orders...</p>
                </div>
              ) : error ? (
                <div className='text-center py-20 text-red-500'>
                  <p>Error: {error}</p>
                </div>
              ) : processedOrders.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20'>
                  <ShoppingBag className='h-16 w-16 text-gray-400 mb-4' />
                  <h2 className='text-xl font-medium text-kisan-primary mb-2'>
                    No orders found
                  </h2>
                  <p className='text-gray-500 mb-8'>
                    {searchQuery
                      ? 'No orders match your search.'
                      : `You have no ${
                          activeTab !== 'all' ? getStatusText(activeTab) : ''
                        } orders.`}
                  </p>
                  {activeTab === 'all' && !searchQuery && (
                    <Link to='/products'>
                      <Button>Shop Now</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className='space-y-4'>
                  {processedOrders.map((order) => (
                    <div
                      key={order.id}
                      className='rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden'
                    >
                      <div className='bg-gray-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b'>
                        <div className='flex flex-col mb-2 sm:mb-0'>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs sm:text-sm font-semibold text-kisan-primary hover:underline'>
                              <Link to={`/orders/${order.id}`}>
                                Order #{order.id.substring(0, 8)}...
                              </Link>
                            </span>
                            <Badge
                              variant={getStatusVariant(order.order_status)}
                              className='text-xs px-1.5 py-0.5'
                            >
                              {getStatusText(order.order_status)}
                            </Badge>
                          </div>
                          <span className='text-xs text-gray-500 mt-0.5'>
                            Placed:{' '}
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className='flex items-center space-x-3 sm:space-x-4'>
                          <div className='text-right'>
                            <div className='text-sm sm:text-base font-medium text-kisan-primary'>
                              ₹
                              {parseFloat(order.total_price).toLocaleString(
                                undefined,
                                { minimumFractionDigits: 2 }
                              )}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {order.item_count}{' '}
                              {parseInt(order.item_count) === 1
                                ? 'item'
                                : 'items'}
                            </div>
                          </div>
                          <Link to={`/orders/${order.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='text-xs px-2 py-1 sm:px-3 sm:py-1.5'
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className='px-4 py-3'>
                        <div className='flex items-center'>
                          <div className='mr-3 shrink-0'>
                            {getStatusIcon(order.order_status)}
                          </div>
                          <div className='flex-grow'>
                            <p className='text-sm font-medium text-gray-800'>
                              {order.first_product_name
                                ? `Includes: ${order.first_product_name}`
                                : 'Order details available.'}
                              {parseInt(order.item_count) > 1 &&
                                ` and ${
                                  parseInt(order.item_count) - 1
                                } more item(s)`}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Payment:{' '}
                              <Badge
                                variant={getStatusVariant(order.payment_status)}
                                className='text-xs px-1.5 py-0.5'
                              >
                                {getStatusText(order.payment_status)}
                              </Badge>
                            </p>
                          </div>
                          <Link
                            to={`/orders/${order.id}`}
                            className='ml-auto shrink-0'
                          >
                            <ChevronRight className='h-5 w-5 text-gray-400 hover:text-kisan-accent' />
                          </Link>
                        </div>
                        {/* Delivery Address could be shown here on expand, or on detail page */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            {/* You would have more TabsContent for 'pending', 'shipped', etc. if doing client-side tab filtering, or rely on activeTab for API filtering */}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
