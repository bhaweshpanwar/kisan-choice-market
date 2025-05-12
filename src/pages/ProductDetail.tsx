// src / pages / ProductDetail.tsx;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ui/product-card'; // For related products
// import { PriceNegotiation } from '@/components/ui/price-negotiation'; // Keep if this component is ready
import { useCart } from '@/context/CartContext';
import {
  getProductById,
  Product,
  Review as ProductReview, // Renamed to avoid conflict if you have another Review type
  getProducts, // For fetching related products
} from '@/services/productService';
import { ApiErrorResponse } from '@/services/api';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  MessageCircleQuestion,
  Truck,
} from 'lucide-react';
import { PriceNegotiation } from '@/components/ui/price-negotiation';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItemToCart: contextAddToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1); // Initial quantity
  const [activeTab, setActiveTab] = useState<string>('details');

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setIsLoading(false);
      toast.error('Product ID is missing.');
      return;
    }

    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProductById(productId);
        if (response.data.product) {
          setProduct(response.data.product);
          setQuantity(response.data.product.min_qty || 1); // Set initial quantity to min_qty

          // Fetch related products
          //   if (response.data.product.category_id) {
          //     try {
          //       const relatedResponse = await getProducts({
          //         category_id: response.data.product.category_id, // Assuming your getProducts accepts category_id
          //         limit: 3,
          //       });
          //       // Filter out the current product from related products
          //       setRelatedProducts(
          //         relatedResponse.data.products.filter(
          //           (p) => p.id !== response.data.product.id
          //         )
          //       );
          //     } catch (relatedError) {
          //       console.warn('Could not fetch related products:', relatedError);
          //       // Not critical, so don't block page for this
          //     }
          //   }
          // } else {
          //   throw new Error('Product data not found in response.');
        }
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        console.error('Failed to fetch product:', apiError);
        const message = apiError.message || 'Could not load product details.';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const incrementQuantity = () => {
    if (
      product &&
      quantity < product.max_qty &&
      quantity < product.stock_quantity
    ) {
      setQuantity((prev) => prev + 1);
    } else if (product) {
      toast.warn(
        `Maximum order quantity reached (${Math.min(
          product.max_qty,
          product.stock_quantity
        )})`
      );
    }
  };

  const decrementQuantity = () => {
    if (product && quantity > product.min_qty) {
      setQuantity((prev) => prev - 1);
    } else if (product) {
      toast.warn(`Minimum order quantity is ${product.min_qty}`);
    }
  };

  // const handleAddToCart = () => {
  //   if (!product) return;
  //   const cartItem = {
  //     id: product.id,
  //     name: product.name,
  //     price: parseFloat(product.price),
  //     quantity: quantity,
  //     // image: `https://via.placeholder.com/100?text=${encodeURIComponent(product.name)}`, // Placeholder image for cart
  //     // unit: 'unit', // Add unit if available and needed by cart
  //     seller_id: product.seller_id, // Pass seller_id if your cart needs it
  //     stock_quantity: product.stock_quantity,
  //     min_qty: product.min_qty,
  //     max_qty: product.max_qty,
  //   };
  //   addToCart(cartItem, quantity); // Ensure addToCart in CartContext handles this structure
  //   toast.success(`${quantity} x ${product.name} added to cart!`);
  // };

  const handleAddToCart = () => {
    if (!product) return;

    const payload: AddToCartPayload = {
      product_id: product.id,
      quantity: quantity,
      // If your backend expects negotiated price/status directly on add:
      // price: product.is_negotiated ? negotiated_price : parseFloat(product.price),
      // is_negotiated: product.is_negotiated
    };
    contextAddToCart(payload); // Call the context function
    // Toast success is handled within contextAddToCart
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1 container mx-auto px-4 py-8 text-center'>
          Loading product details...
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1 container mx-auto px-4 py-8 text-center text-red-500'>
          Error: {error}
          <Link to='/products' className='mt-4 block'>
            <Button>Back to Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1 container mx-auto px-4 py-8'>
          <div className='flex flex-col items-center justify-center h-[50vh]'>
            <h1 className='text-2xl font-semibold text-kisan-primary'>
              Product not found
            </h1>
            <p className='mt-2 text-gray-600'>
              The product you are looking for does not exist or could not be
              loaded.
            </p>
            <Link to='/products' className='mt-4'>
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const productPrice = parseFloat(product.price);
  const averageRating = parseFloat(product.ratings_average);

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        {/* Breadcrumb */}
        <div className='bg-gray-50 py-3'>
          <div className='container mx-auto px-4'>
            <div className='flex items-center space-x-2 text-sm text-gray-600'>
              <Link to='/' className='hover:text-kisan-accent'>
                Home
              </Link>
              <span>/</span>
              <Link to='/products' className='hover:text-kisan-accent'>
                Products
              </Link>
              <span>/</span>
              {product.category_name && (
                <>
                  <Link
                    to={`/products?category=${product.category_id}`}
                    className='hover:text-kisan-accent'
                  >
                    {product.category_name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className='text-kisan-primary'>{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Section */}
        <section className='py-8 md:py-12'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* Product Image Placeholder */}
              <div className='bg-gray-100 aspect-square flex items-center justify-center rounded-lg border'>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    product.name
                  )}&size=256&background=random&font-size=0.33`} // Placeholder using name
                  alt={product.name}
                  className='max-w-xs max-h-xs object-contain' // Adjusted size
                />
              </div>

              {/* Product Info */}
              <div className='space-y-6'>
                <h1 className='text-3xl font-bold text-kisan-primary'>
                  {product.name}
                </h1>

                <div className='flex items-center space-x-2'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(averageRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {averageRating ? averageRating.toFixed(1) : 'N/A'} (
                    {product.reviews?.length || 0} reviews)
                  </span>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {product.verified && (
                    <Badge variant='verified'>
                      <ShieldCheck className='inline-block mr-1 h-3 w-3' />
                      Verified
                    </Badge>
                  )}
                  {product.negotiate && (
                    <Badge variant='negotiable'>
                      <Tag className='inline-block mr-1 h-3 w-3' />
                      Negotiable
                    </Badge>
                  )}
                </div>

                <div className='flex items-baseline space-x-3'>
                  <span className='text-3xl font-bold text-kisan-primary'>
                    ₹
                    {productPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  {/* Add unit if available, e.g., /kg, /piece */}
                  {/* <span className='text-base text-gray-600'>/ unit</span> */}
                </div>

                <div className='text-sm'>
                  {product.stock_quantity > 0 ? (
                    <span className='text-green-600 font-medium'>
                      In Stock ({product.stock_quantity} available)
                    </span>
                  ) : (
                    <span className='text-red-600 font-medium'>
                      Out of Stock
                    </span>
                  )}
                </div>
                <p className='text-xs text-gray-500'>
                  Min Qty: {product.min_qty} | Max Qty: {product.max_qty}
                </p>

                <div className='rounded-md bg-gray-50 p-3 text-sm text-gray-600'>
                  <p className='flex items-center'>
                    <Truck className='mr-2 h-5 w-5 text-kisan-accent' />
                    Estimated Delivery: 3-5 Days
                  </p>
                  <p className='mt-1'>
                    Free shipping above ₹2000 | COD Available
                  </p>
                </div>

                <div className='flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0'>
                  <div className='flex items-center'>
                    <span className='mr-3 text-sm font-medium text-gray-700'>
                      Quantity:
                    </span>
                    <div className='flex h-10 items-center border border-gray-300 rounded-md'>
                      <button
                        type='button'
                        className='flex h-full w-10 items-center justify-center border-r text-gray-600 hover:bg-gray-50'
                        onClick={decrementQuantity}
                        disabled={quantity <= product.min_qty}
                      >
                        <Minus className='h-3 w-3' />
                      </button>
                      <input
                        type='number'
                        className='h-full w-16 border-0 text-center text-gray-700 focus:outline-none focus:ring-0'
                        value={quantity}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || product.min_qty;
                          if (val < product.min_qty) val = product.min_qty;
                          if (val > product.max_qty) val = product.max_qty;
                          if (val > product.stock_quantity)
                            val = product.stock_quantity;
                          setQuantity(val);
                        }}
                        min={product.min_qty}
                        max={Math.min(product.max_qty, product.stock_quantity)}
                      />
                      <button
                        type='button'
                        className='flex h-full w-10 items-center justify-center border-l text-gray-600 hover:bg-gray-50'
                        onClick={incrementQuantity}
                        disabled={
                          quantity >=
                          Math.min(product.max_qty, product.stock_quantity)
                        }
                      >
                        <Plus className='h-3 w-3' />
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-1 items-center space-x-2'>
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0 || quantity === 0}
                      className='flex-1 bg-black text-white hover:bg-black/90'
                    >
                      <ShoppingCart className='mr-2 h-4 w-4' />
                      Add to cart
                    </Button>
                  </div>
                </div>

                {product.negotiate && (
                  <Button
                    variant='outline'
                    className='w-full border-kisan-accent text-kisan-accent hover:bg-kisan-accent/10'
                    onClick={() =>
                      toast.info('Negotiation feature coming soon!')
                    }
                  >
                    <Tag className='mr-2 h-4 w-4' />
                    Negotiate Price
                  </Button>
                )}

                <div className='rounded-md border border-gray-200 p-4'>
                  <h3 className='mb-3 text-lg font-medium text-kisan-primary'>
                    Sold by
                  </h3>
                  <div className='flex items-center'>
                    <img
                      src={`http://localhost:3000${product.seller_photo}`}
                      alt={product.seller_photo}
                      className='h-16 w-16 rounded-full border-2 border-white shadow-sm'
                    />
                    <div className='ml-4'>
                      <h4 className='text-base font-medium text-kisan-primary'>
                        {product.seller_name}
                      </h4>
                      {/* <p className='text-sm text-gray-600'>Seller Location if available</p> */}
                      <Link
                        to={`/sellers/${product.seller_id}`}
                        className='mt-1 inline-flex items-center text-xs font-medium text-kisan-accent'
                      >
                        View profile <ArrowRight className='ml-1 h-3 w-3' />
                      </Link>
                    </div>
                  </div>
                </div>

                {product.key_highlights &&
                  product.key_highlights.length > 0 && (
                    <div className='rounded-md border border-gray-200 p-4'>
                      <h3 className='mb-3 text-lg font-medium text-kisan-primary'>
                        Key Highlights
                      </h3>
                      <ul className='space-y-2 text-sm text-gray-700'>
                        {product.key_highlights.map((highlight, index) => (
                          <li key={index} className='flex items-start'>
                            <ShieldCheck className='mr-2 h-5 w-5 flex-shrink-0 text-kisan-accent' />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>

        <PriceNegotiation
          productName={product.name}
          productId={product.id}
          basePrice={product.price} // Pass the number here
          unit={product.unit || 'unit'}
          minQty={product.min_qty}
          maxQty={product.max_qty}
        />

        <section className='border-t border-gray-200 py-8 md:py-12'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 gap-8'>
              {' '}
              {/* Using md:grid-cols-3 caused layout issues with tabs */}
              <div className='md:col-span-3'>
                {' '}
                {/* Full width for tab content area */}
                <div className='mb-6 border-b border-gray-200'>
                  <nav
                    className='flex space-x-4 sm:space-x-8 overflow-x-auto'
                    aria-label='Tabs'
                  >
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === 'details'
                          ? 'border-kisan-accent text-kisan-accent'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === 'reviews'
                          ? 'border-kisan-accent text-kisan-accent'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Reviews ({product.reviews?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('shipping')}
                      className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === 'shipping'
                          ? 'border-kisan-accent text-kisan-accent'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Shipping & Returns
                    </button>
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                        activeTab === 'faq'
                          ? 'border-kisan-accent text-kisan-accent'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Help & FAQ
                    </button>
                  </nav>
                </div>
                <div className='prose prose-slate max-w-none'>
                  {activeTab === 'details' && (
                    <div>
                      <p>{product.description}</p>
                      <h3 className='mt-4'>Specifications</h3>
                      <table className='min-w-full divide-y divide-gray-300'>
                        <tbody className='divide-y divide-gray-200 text-sm'>
                          <tr>
                            <td className='py-2 pr-4 font-medium text-gray-900'>
                              Sold By
                            </td>
                            <td className='py-2 pl-4 text-gray-600'>
                              {product.seller_name}
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 pr-4 font-medium text-gray-900'>
                              Category
                            </td>
                            <td className='py-2 pl-4 text-gray-600'>
                              {product.category_name}
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 pr-4 font-medium text-gray-900'>
                              Available Stock
                            </td>
                            <td className='py-2 pl-4 text-gray-600'>
                              {product.stock_quantity}
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 pr-4 font-medium text-gray-900'>
                              Min. Order Qty
                            </td>
                            <td className='py-2 pl-4 text-gray-600'>
                              {product.min_qty}
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 pr-4 font-medium text-gray-900'>
                              Max. Order Qty
                            </td>
                            <td className='py-2 pl-4 text-gray-600'>
                              {product.max_qty}
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 pr-4 font-medium text-gray-900'>
                              Product ID
                            </td>
                            <td className='py-2 pl-4 text-gray-600'>
                              {product.id}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div>
                      <h3 className='text-xl font-semibold text-kisan-primary mb-6'>
                        Customer Reviews
                      </h3>
                      {/* TODO: Add a Review Form component here */}
                      <div className='mb-8'>
                        <h4 className='text-lg font-medium text-kisan-primary mb-2'>
                          Write a Review
                        </h4>
                        <textarea
                          className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-kisan-accent focus:outline-none focus:ring-1 focus:ring-kisan-accent'
                          rows={3}
                          placeholder='Share your experience...'
                        ></textarea>
                        <Button
                          className='mt-2 bg-kisan-primary text-white hover:bg-kisan-primary/90'
                          onClick={() =>
                            toast.info('Submit review feature coming soon!')
                          }
                        >
                          Submit Review
                        </Button>
                      </div>
                      {product.reviews && product.reviews.length > 0 ? (
                        <div className='space-y-6'>
                          {product.reviews.map((review: ProductReview) => (
                            <div
                              key={review.id}
                              className='border-b border-gray-200 pb-6 last:border-b-0'
                            >
                              <div className='flex items-center mb-2'>
                                <img
                                  src={`http://localhost:3000${review.user_image}`}
                                  alt={review.user_image}
                                  className='h-10 w-10 rounded-full'
                                />
                                <div className='ml-3'>
                                  <h5 className='text-sm font-medium text-kisan-primary'>
                                    {review.user_name}
                                  </h5>
                                  <div className='flex items-center'>
                                    <div className='flex'>
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating
                                              ? 'text-yellow-400 fill-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className='ml-2 text-xs text-gray-500'>
                                      {new Date(
                                        review.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className='text-sm text-gray-600'>
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>
                          No reviews yet for this product. Be the first to write
                          one!
                        </p>
                      )}
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div>
                      <h3>Shipping Information</h3>
                      <p>
                        Standard delivery: 3-5 business days. Express delivery:
                        1-2 business days (additional charges apply). Free
                        shipping on orders above ₹2000. Tracked delivery with
                        SMS/email notifications. Special packaging to maintain
                        product freshness.
                      </p>
                      <h3 className='mt-4'>Return Policy</h3>
                      <p>
                        Your satisfaction is our priority. If you're not
                        completely happy with your purchase: Report quality
                        issues within 24 hours of delivery. Provide clear photos
                        of the product showing the quality issues. Our team will
                        review your complaint and process eligible refunds
                        within 5-7 business days. Please note that due to the
                        perishable nature of farm produce, we handle returns on
                        a case-by-case basis. Our goal is to ensure you receive
                        the quality you expect.
                      </p>
                    </div>
                  )}
                  {activeTab === 'faq' && (
                    <div>
                      <h3 className='text-xl font-semibold text-kisan-primary mb-4'>
                        Frequently Asked Questions
                      </h3>
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                          <AccordionTrigger>
                            What payment methods do you accept?
                          </AccordionTrigger>
                          <AccordionContent>
                            We accept UPI, credit/debit cards, net banking,
                            popular wallets, and Cash on Delivery (COD) for
                            eligible orders.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-2'>
                          <AccordionTrigger>
                            How long does shipping take?
                          </AccordionTrigger>
                          <AccordionContent>
                            Standard shipping usually takes 3-5 business days.
                            Express options are available. You'll receive
                            tracking information once your order is shipped.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-3'>
                          <AccordionTrigger>
                            What is your return policy?
                          </AccordionTrigger>
                          <AccordionContent>
                            For perishable goods, please report any quality
                            issues with photographic evidence within 24 hours of
                            delivery. We review each case individually to ensure
                            fairness.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='item-4'>
                          <AccordionTrigger>
                            Can I negotiate the price for this product?
                          </AccordionTrigger>
                          <AccordionContent>
                            {product.negotiate
                              ? `Yes, price negotiation is available for ${product.name}. Please use the 'Negotiate Price' button to start.`
                              : `Price negotiation is currently not available for this product.`}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <div className='mt-6 text-center'>
                        <Link
                          to='/contact-us#faq'
                          className='inline-flex items-center text-sm text-kisan-accent'
                        >
                          <MessageCircleQuestion className='mr-1 h-4 w-4' />
                          Still have questions? Visit our FAQ page or contact
                          support.
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className='bg-gray-50 py-8 md:py-12'>
            <div className='container mx-auto px-4'>
              <h2 className='mb-8 text-2xl font-semibold text-kisan-primary'>
                You may also like
              </h2>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
