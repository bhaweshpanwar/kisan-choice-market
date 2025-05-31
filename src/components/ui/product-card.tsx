// src/components/ui/product-card.tsx
import { Link } from 'react-router-dom';
// Import Product type from productService.ts
import { Product } from '@/services/productService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { useCart } from '@/context/CartContext'; // Uncomment if you use it
// import { ShoppingCart } from 'lucide-react'; // Uncomment if you use it

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // const { addToCart } = useCart(); // Uncomment if you use it
  const BASE_URL = 'https://apiaws.bhaweshpanwar.xyz';
  // --- Data Mapping & Defaults ---

  const farmerImage = product.seller_photo
    ? `${BASE_URL}${product.seller_photo}`
    : `${BASE_URL}/public/img/default_profile_avatar.jpg`;

  const farmerName =
    product.farmer?.name || product.seller_name || 'KisanChoice Seller';
  // const farmerImage =
  //   product.farmer?.image || '/images/default-farmer-avatar.png'; // Provide a default avatar

  // Use product.id for navigation if slug is not reliably available
  // If your backend detail endpoint uses slug, then prioritize product.slug
  const productDetailLink = `/products/${product.slug || product.id}`;

  const ratingValue = product.ratings_average
    ? parseFloat(product.ratings_average)
    : 0;
  const reviewCount = product.reviews_count || 0; // Assuming reviews_count if available

  const displayPrice = parseFloat(product.price).toFixed(2);
  const displayOriginalPrice = product.originalPrice
    ? parseFloat(String(product.originalPrice)).toFixed(2)
    : null;
  const displayUnit = product.unit ? `/${product.unit}` : '';

  return (
    <Card className='bg-white border border-gray-300 shadow-none rounded-none flex flex-col h-full'>
      <CardContent className='p-4 flex flex-col flex-grow'>
        {/* Farmer's image and name */}
        <div className='flex items-center mb-2'>
          <img
            src={farmerImage}
            alt={farmerName}
            className='h-8 w-8 rounded-full object-cover' // Added object-cover
          />
          <span className='ml-2 text-sm text-black font-light'>
            {farmerName}
          </span>
        </div>

        {/* Product Name */}
        <Link to={productDetailLink}>
          <h3 className='font-semibold text-black mb-1 text-xl leading-tight hover:text-kisan-primary transition-colors duration-200 line-clamp-2 h-[3rem]'>
            {' '}
            {/* Adjusted for consistency */}
            {product.name}
          </h3>
        </Link>

        {/* Star rating and reviews */}
        {ratingValue > 0 && ( // Only show if rating exists
          <div className='flex items-center space-x-1 mb-2'>
            <div className='flex items-center space-x-1'>
              {/* Stars */}
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(ratingValue)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>

              {/* Average rating number */}
              <span className='text-xs text-gray-700'>
                {ratingValue.toFixed(1)}
              </span>
            </div>

            {/* Number of reviews */}
            <span className='text-xs text-gray-500'>
              ({reviewCount} Reviews)
            </span>
          </div>
        )}

        {/* Badges */}
        <div className='flex flex-wrap gap-2 mb-2 min-h-[24px]'>
          {' '}
          {/* Added min-height and flex-wrap */}
          {product.negotiate && ( // Using 'negotiate' from backend
            <Badge
              variant='outline'
              className='text-xs border-kisan-accent text-kisan-accent'
            >
              Negotiable
            </Badge>
          )}
          {product.verified && ( // Using 'verified' from backend
            <Badge
              variant='default'
              className='text-xs bg-green-500 text-white'
            >
              Verified
            </Badge>
          )}
          {/* If you have a separate 'isFarmerChoice' flag from backend and want a different badge:
          {product.isFarmerChoice && (
            <Badge variant='secondary' className='text-xs'>
              Farmer's Choice
            </Badge>
          )}
          */}
        </div>

        {/* Price section */}
        <div className='flex items-baseline space-x-2 mb-4 mt-auto pt-2'>
          {' '}
          {/* Added mt-auto to push to bottom */}
          <span className='text-lg font-semibold text-black'>
            ₹{displayPrice}
            {displayUnit}
          </span>
          {displayOriginalPrice && (
            <span className='text-sm text-gray-500 line-through'>
              ₹{displayOriginalPrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className='p-4 pt-0'>
        {' '}
        {/* Ensure padding consistent with CardContent if needed */}
        <Button
          asChild
          className='w-full text-center bg-black text-white text-sm py-2 px-4 block rounded-none hover:bg-gray-800'
        >
          <Link to={productDetailLink}>View Details</Link>
        </Button>
        {/* Example Add to Cart Button (Uncomment and adapt if using CartContext)
        <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={() => {
                // addToCart({ id: product.id, name: product.name, price: parseFloat(product.price), quantity: 1, image: product.images?.[0] });
                // toast.success(`${product.name} added to cart!`);
            }}
        >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        */}
      </CardFooter>
    </Card>
  );
}
