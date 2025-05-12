// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/product-card'; // Ensure this component is ready
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import {
  getProducts,
  Product,
  GetProductsParams,
  ProductsResponseData,
} from '@/services/productService';
import { ApiErrorResponse } from '@/services/api';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/pagination'; // Assuming you'll create/use a Pagination component

// Helper to create an array for page numbers
const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export default function ProductsPage() {
  const { category: categoryFromPath } = useParams<{ category?: string }>(); // For /products/category/:category
  const [searchParams, setSearchParams] = useSearchParams(); // For other filters like search, sort, page

  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );

  // Local state for UI filter toggles
  const [expandedFilters, setExpandedFilters] = useState({
    quality: true,
    price: true,
    negotiable: true,
    // popularity: true, // If you add popularity filters based on API params
  });

  // Filter state that will be translated into API params
  // Initialize from searchParams for persistence on reload/navigation
  const [apiFilters, setApiFilters] = useState<GetProductsParams>({
    category: categoryFromPath, // From path param
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 12, // Or your preferred default
    sort: searchParams.get('sort') || undefined,
    verified: searchParams.get('verified') === 'true' || undefined,
    negotiate: searchParams.get('negotiate') === 'true' || undefined,
    // top_selling: searchParams.get('top_selling') === 'true' || undefined,
  });

  const fetchProductsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const currentParams: GetProductsParams = {
      limit: apiFilters.limit,
      page: apiFilters.page,
    };

    if (apiFilters.category) currentParams.category = apiFilters.category;
    if (searchTerm) currentParams.search = searchTerm; // Add search term if present
    if (apiFilters.sort) currentParams.sort = apiFilters.sort;
    if (apiFilters.verified !== undefined)
      currentParams.verified = apiFilters.verified;
    if (apiFilters.negotiate !== undefined)
      currentParams.negotiate = apiFilters.negotiate;
    // Add other filters here if your API supports them

    try {
      const response = await getProducts(currentParams); // response is ApiResponse<ProductsResponseData>

      setProducts(response.data.products || []);

      setPaginationData({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalProducts: response.data.total,
      });
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Failed to load products.');
      toast.error(apiError.message || 'Failed to load products.');
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  }, [apiFilters, searchTerm]); // Dependencies for useCallback

  // Effect to update URL search params when apiFilters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (apiFilters.page && apiFilters.page > 1)
      params.set('page', String(apiFilters.page));
    if (apiFilters.sort) params.set('sort', apiFilters.sort);
    if (searchTerm) params.set('search', searchTerm); // Also include search term in URL
    if (apiFilters.verified !== undefined)
      params.set('verified', String(apiFilters.verified));
    if (apiFilters.negotiate !== undefined)
      params.set('negotiate', String(apiFilters.negotiate));
    // ... other filters ...

    // Construct the path with categoryFromPath if it exists
    const path = categoryFromPath
      ? `/products/category/${categoryFromPath}`
      : '/products';
    navigate(`${path}?${params.toString()}`, { replace: true });
  }, [apiFilters, searchTerm, categoryFromPath, navigate]);

  // Effect to fetch products when apiFilters or categoryFromPath changes
  useEffect(() => {
    // Update apiFilters.category if categoryFromPath changes
    setApiFilters((prev) => ({ ...prev, category: categoryFromPath, page: 1 })); // Reset to page 1 on category change
  }, [categoryFromPath]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]); // fetchProductsData is memoized with useCallback

  const handleCheckboxFilterChange = (
    key: 'verified' | 'negotiate',
    checked: boolean
  ) => {
    setApiFilters((prev) => ({
      ...prev,
      [key]: checked ? true : undefined, // Set to true or undefined (to remove from query)
      page: 1, // Reset to page 1 when filters change
    }));
  };

  const handleSortChange = (
    sortValue: 'price_asc' | 'price_desc' | 'ratings_average_desc' | ''
  ) => {
    setApiFilters((prev) => ({
      ...prev,
      sort: sortValue || undefined, // Empty string to undefined to remove sort
      page: 1,
    }));
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Prevent form submission if wrapped in form
    setApiFilters((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on new search
    // fetchProductsData will be called by the useEffect dependency on apiFilters/searchTerm
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.totalPages) {
      setApiFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const toggleFilterSection = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setApiFilters({
      category: categoryFromPath, // Keep category from path
      page: 1,
      limit: 12, // Or your default
      sort: undefined,
      verified: undefined,
      negotiate: undefined,
    });
  };

  const pageTitle = categoryFromPath
    ? categoryFromPath.charAt(0).toUpperCase() + categoryFromPath.slice(1)
    : 'All Products';

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
              {categoryFromPath && (
                <>
                  <span>/</span>
                  <span className='capitalize text-kisan-primary'>
                    {categoryFromPath}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-kisan-primary md:text-3xl'>
                {pageTitle}
              </h1>
              <p className='mt-1 text-gray-600'>
                {isLoading
                  ? 'Loading...'
                  : `${paginationData.totalProducts} Results`}
              </p>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className='mt-4 flex items-center md:mt-0'
            >
              <div className='relative w-full md:w-64'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search products...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
              </div>
              <Button type='submit' className='ml-2'>
                Search
              </Button>
            </form>
          </div>

          <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-4'>
            {/* Filters */}
            <div className='md:col-span-1'>
              <div className='rounded-lg border border-gray-200 p-4'>
                {/* Quality Filters */}
                <div className='border-b border-gray-200 pb-4'>
                  <button
                    className='flex w-full items-center justify-between'
                    onClick={() => toggleFilterSection('quality')}
                  >
                    <span className='text-sm font-semibold text-kisan-primary'>
                      QUALITY
                    </span>
                    {expandedFilters.quality ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedFilters.quality && (
                    <div className='mt-3 space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='verified'
                          checked={!!apiFilters.verified}
                          onCheckedChange={(checked) =>
                            handleCheckboxFilterChange('verified', !!checked)
                          }
                        />
                        <label htmlFor='verified' className='text-sm'>
                          Verified Products
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort by Price */}
                <div className='border-b border-gray-200 py-4'>
                  <button
                    className='flex w-full items-center justify-between'
                    onClick={() => toggleFilterSection('price')}
                  >
                    <span className='text-sm font-semibold text-kisan-primary'>
                      SORT BY PRICE
                    </span>
                    {expandedFilters.price ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedFilters.price && (
                    <div className='mt-3 space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='lowToHigh'
                          checked={apiFilters.sort === 'price_asc'}
                          onCheckedChange={(checked) =>
                            handleSortChange(checked ? 'price_asc' : '')
                          }
                        />
                        <label htmlFor='lowToHigh' className='text-sm'>
                          Low to High
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='highToLow'
                          checked={apiFilters.sort === 'price_desc'}
                          onCheckedChange={(checked) =>
                            handleSortChange(checked ? 'price_desc' : '')
                          }
                        />
                        <label htmlFor='highToLow' className='text-sm'>
                          High to Low
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Negotiable Products */}
                <div className='border-b border-gray-200 py-4'>
                  <button
                    className='flex w-full items-center justify-between'
                    onClick={() => toggleFilterSection('negotiable')}
                  >
                    <span className='text-sm font-semibold text-kisan-primary'>
                      NEGOTIABLE
                    </span>
                    {expandedFilters.negotiable ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </button>
                  {expandedFilters.negotiable && (
                    <div className='mt-3 space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='negotiable'
                          checked={!!apiFilters.negotiate}
                          onCheckedChange={(checked) =>
                            handleCheckboxFilterChange('negotiate', !!checked)
                          }
                        />
                        <label htmlFor='negotiable' className='text-sm'>
                          Negotiable
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* You can add other sort options like ratings here */}
                {/* Example: Sort by Rating (if API supports 'ratings_average_desc') */}
                {/* <div className='border-b border-gray-200 py-4'> ... 
                      <Checkbox id='topRated' checked={apiFilters.sort === 'ratings_average_desc'} onCheckedChange={(checked) => handleSortChange(checked ? 'ratings_average_desc' : '')} />
                      <label htmlFor='topRated' className='text-sm'>Top Rated</label>
                ... </div> */}

                <Button
                  variant='outline'
                  className='mt-4 w-full text-sm'
                  onClick={resetAllFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className='md:col-span-3'>
              {isLoading ? (
                <div className='text-center py-10'>Loading products...</div>
              ) : error ? (
                <div className='text-center py-10 text-red-500'>{error}</div>
              ) : products.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16'>
                  <h2 className='text-xl font-medium text-kisan-primary'>
                    No products found
                  </h2>
                  <p className='mt-2 text-gray-600'>
                    Try adjusting your filters or search terms.
                  </p>
                  <Button className='mt-4' onClick={resetAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading &&
                !error &&
                products.length > 0 &&
                paginationData.totalPages > 1 && (
                  <div className='mt-8 flex justify-center'>
                    <Pagination // Your ShadCN/UI Pagination component or a custom one
                      currentPage={paginationData.currentPage}
                      totalPages={paginationData.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
