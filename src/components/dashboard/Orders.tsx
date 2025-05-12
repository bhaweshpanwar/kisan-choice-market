// src/components/dashboard/Orders.tsx (Farmer's View of their Sales)
import React, { useState, useEffect } from 'react'; // Added React
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit3,
} from 'lucide-react'; // Edit3 for status update
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // For status update
import {
  getFarmerSales,
  updateFarmerOrderStatus,
  OrderSummary, // Use interface from service
  ApiErrorResponse,
} from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';

// Helper for status badge based on OrderSummary's order_status
const getOrderStatusBadgeVariant = (
  status: OrderSummary['order_status']
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'outline'
  | 'warning' => {
  switch (status) {
    case 'pending':
      return 'default'; // Blue-ish
    case 'processing':
      return 'default'; // If you use 'processing'
    case 'shipped':
      return 'warning';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};
const getOrderStatusText = (status: OrderSummary['order_status']): string => {
  const map: Record<string, string> = {
    pending: 'Pending Confirmation',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

export const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const [sales, setSales] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Available statuses a farmer can set an order to
  const availableStatuses: OrderSummary['order_status'][] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const fetchFarmerSales = async () => {
    if (!isAuthenticated || user?.role !== 'farmer') {
      setSales([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFarmerSales();
      // Ensure total_price and item_count are handled as expected (string or number)
      const formattedSales = response.data.orders.map((sale) => ({
        ...sale,
        total_price: parseFloat(sale.total_price).toFixed(2), // Keep as formatted string
        item_count: sale.item_count, // Already string from backend
      }));
      setSales(formattedSales || []);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Failed to load your sales.');
      toast.error(apiError.message || 'Failed to load sales.');
      console.error('Fetch farmer sales error:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerSales();
  }, [isAuthenticated, user]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderSummary['order_status']
  ) => {
    setUpdatingStatusId(orderId);
    try {
      await updateFarmerOrderStatus(orderId, { status: newStatus });
      toast.success(
        `Order ${orderId.substring(0, 6)}... status updated to ${newStatus}.`
      );
      // Optimistically update local state or refetch
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.id === orderId ? { ...sale, order_status: newStatus } : sale
        )
      );
      // await fetchFarmerSales(); // Or refetch for full consistency
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (!isAuthenticated || user?.role !== 'farmer') {
    return (
      <div className='space-y-4 mt-8 p-6 border rounded-lg bg-yellow-50 text-yellow-700 text-center'>
        <ShoppingCart className='h-8 w-8 mx-auto mb-2' />
        <p>Please log in as a farmer to view your sales.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4 mt-8 text-center py-10'>
        <Loader2 className='h-10 w-10 animate-spin text-primary mx-auto' />
        <p className='mt-2 text-muted-foreground'>
          Loading your sales orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4 mt-8 text-center py-10 text-destructive'>
        <AlertCircle className='h-10 w-10 mx-auto' />
        <p className='mt-2'>{error}</p>
        <Button onClick={fetchFarmerSales} variant='outline'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
        <div className='flex items-center gap-2'>
          <ShoppingCart className='h-6 w-6 text-primary' />
          <h2 className='text-xl lg:text-2xl font-semibold text-gray-800'>
            Sales Orders
          </h2>
        </div>
        <Button
          onClick={fetchFarmerSales}
          variant='outline'
          size='sm'
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />{' '}
          Refresh Sales
        </Button>
      </div>

      <Card className='shadow-md'>
        <CardHeader className='pb-3 border-b'>
          <CardTitle className='text-lg text-gray-700'>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {sales.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <ShoppingCart className='h-12 w-12 mx-auto mb-3 text-gray-400' />
              <p>You have no sales orders yet.</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {sales.map((order) => (
                <div
                  key={order.id}
                  className='p-4 md:p-5 hover:bg-gray-50/50 transition-colors'
                >
                  <div className='flex flex-col sm:flex-row justify-between items-start mb-2 gap-2'>
                    <div>
                      <p className='font-medium text-primary text-sm'>
                        Order ID:{' '}
                        <Link
                          to={`/dashboard/farmer/orders/${order.id}`}
                          className='hover:underline'
                        >
                          {order.id.substring(0, 12)}...
                        </Link>
                      </p>
                      {/* Backend needs to provide consumer name for this order */}
                      {/* <p className="text-sm text-muted-foreground">Buyer: {order.consumer_name || 'N/A'}</p> */}
                      <p className='text-xs text-muted-foreground'>
                        Date: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='text-left sm:text-right mt-2 sm:mt-0'>
                      <p className='font-semibold text-lg text-kisan-accent'>
                        ₹{order.total_price}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {order.item_count}{' '}
                        {parseInt(order.item_count) === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-3 border-t border-gray-100 gap-3'>
                    <div className='flex flex-col items-start'>
                      <p className='text-sm text-muted-foreground mb-1'>
                        {order.first_product_name
                          ? `Includes: ${order.first_product_name}`
                          : 'View details for items.'}
                        {parseInt(order.item_count) > 1 &&
                          ` + ${parseInt(order.item_count) - 1} more`}
                      </p>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-medium'>
                          Order Status:
                        </span>
                        <Badge
                          variant={getOrderStatusBadgeVariant(
                            order.order_status
                          )}
                          className='text-xs'
                        >
                          {getOrderStatusText(order.order_status)}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='text-xs font-medium'>Payment:</span>
                        <Badge
                          variant={
                            order.payment_status === 'completed'
                              ? 'success'
                              : 'secondary'
                          }
                          className='text-xs'
                        >
                          {order.payment_status.charAt(0).toUpperCase() +
                            order.payment_status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0'>
                      <Select
                        value={order.order_status}
                        onValueChange={(newStatus) =>
                          handleUpdateStatus(
                            order.id,
                            newStatus as OrderSummary['order_status']
                          )
                        }
                        disabled={
                          updatingStatusId === order.id ||
                          order.order_status === 'delivered' ||
                          order.order_status === 'cancelled'
                        }
                      >
                        <SelectTrigger className='h-9 text-xs sm:w-[150px] w-full'>
                          <SelectValue placeholder='Update Status' />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStatuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className='text-xs'
                            >
                              {getOrderStatusText(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Link
                        to={`/dashboard/farmer/orders/${order.id}`}
                        className='w-full sm:w-auto'
                      >
                        <Button
                          size='sm'
                          variant='outline'
                          className='w-full text-xs'
                        >
                          <FileText className='h-3.5 w-3.5 mr-1.5' />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
