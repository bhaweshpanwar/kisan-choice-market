import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/product-card';
import { products, blogPosts } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        {/* Hero Section */}
        <section className='relative'>
          <div className='grid grid-cols-1 md:grid-cols-2'>
            <div className='relative h-[50vh] md:h-[80vh]'>
              <img
                src='../../public/images/hero.png'
                alt='Farmers working in a field'
                className='absolute inset-0 h-full w-full object-cover'
              />
            </div>
            <div className='flex items-center bg-black px-6 py-12 md:px-12 md:py-0'>
              <div className='max-w-md'>
                <h1 className='mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl'>
                  From Farm to Table, Directly
                </h1>
                <p className='mb-8 text-gray-300'>
                  We connect farmers directly with consumers, empowering rural
                  communities and providing you with the freshest produce.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <Link to='/products'>
                    <Button className='bg-white text-black hover:bg-gray-100'>
                      Shop Now
                    </Button>
                  </Link>
                  <Link to='/about'>
                    <Button
                      variant='outline'
                      className='text-white border-white hover:bg-white/10'
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className='px-4 py-12 md:px-6 md:py-20'>
          <div className='container mx-auto'>
            <h2 className='mb-8 text-2xl font-semibold text-kisan-primary md:text-3xl'>
              Shop by Category{' '}
              <ArrowRight className='ml-2 inline-block h-5 w-5' />
            </h2>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Category 1 */}
              <Link
                to='/products/category/grains'
                className='group relative h-40 overflow-hidden border-[1.5px] border-[#C2C2C2] '
              >
                <div className='absolute inset-0 ' />
                <div className='absolute bottom-0 left-0 p-4'>
                  <h3 className='text-lg font-medium text-black'>
                    Grains & Cereals
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {' '}
                    (for wheat, rice, brown rice, etc.)
                  </p>
                  <Button className='text-white text-[15px] font-thin px-6 bg-kisan-primary mt-2'>
                    View
                  </Button>
                </div>
              </Link>

              {/* Category 2 */}
              <Link
                to='/products/category/pulses'
                className='group relative h-40 overflow-hidden border-[1.5px] border-[#C2C2C2] '
              >
                <div className='absolute inset-0 ' />
                <div className='absolute bottom-0 left-0 p-4'>
                  <h3 className='text-lg font-medium text-black'>
                    Pulses & Lentils
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {' '}
                    (for all types of pulses)
                  </p>
                  <Button className='text-white text-[15px] font-thin px-6 bg-kisan-primary mt-2'>
                    View
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className='px-4 py-12 md:px-6 md:py-20'>
          <div className='container mx-auto'>
            <div className='md:flex md:items-center md:space-x-10'>
              <div className='mb-8 md:mb-0 md:w-1/2'>
                <img
                  src='../../public/images/about-us.png'
                  alt='Farmers working in the field'
                  className=' object-cover'
                />
              </div>
              <div className='md:w-1/2'>
                <h2 className='mb-6 text-2xl font-semibold text-kisan-primary md:text-3xl'>
                  About us <ArrowRight className='ml-2 inline-block h-5 w-5' />
                </h2>
                <div className='prose prose-slate max-w-none'>
                  <p>
                    At Kisan Choice, we believe that technology can bridge the
                    gap between rural farmers and urban consumers, fostering a
                    sense of community and trust. Our platform is designed to be
                    user-friendly, allowing farmers to showcase their produce
                    with ease and consumers to browse through a wide variety of
                    fresh, locally-sourced products. From seasonal fruits and
                    vegetables to organic grains and dairy, we bring the farm
                    directly to your table. By prioritizing transparency, we
                    ensure that every product comes with detailed information
                    about its origin, farming practices, and the farmer behind
                    it, giving consumers peace of mind and a deeper connection
                    to their food.
                  </p>
                  <p>
                    Sustainability lies at the heart of what we do. Kisan Choice
                    is committed to promoting eco-friendly farming practices and
                    reducing food waste by connecting farmers directly with
                    consumers. We also provide farmers with valuable insights
                    and resources to improve their yields and adopt sustainable
                    methods. Together, we are not just building a marketplace
                    but a movement—one that supports rural livelihoods, promotes
                    healthier eating habits, and contributes to a greener
                    planet. Join Kisan Choice today and be a part of this
                    transformative journey toward a more equitable and
                    sustainable agricultural ecosystem.
                  </p>
                </div>
                <Link to='/about' className='mt-6 inline-block'>
                  <Button
                    variant='outline'
                    className='border-kisan-primary text-kisan-primary hover:bg-kisan-primary hover:text-white'
                  >
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className='bg-gray-50 px-4 py-12 md:px-6 md:py-20'>
          <div className='container mx-auto'>
            <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <h2 className='text-2xl font-semibold text-kisan-primary md:text-3xl'>
                Blogs <ArrowRight className='ml-2 inline-block h-5 w-5' />
              </h2>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className='relative overflow-hidden transition-all hover:shadow-md'
                >
                  {/* Image with Gradient Overlay */}
                  <div className='relative'>
                    <img
                      src={post.image}
                      alt={post.title}
                      className='h-78 w-full object-cover'
                    />
                    {/* Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent'></div>

                    {/* Heading Text on Image */}
                    <div className='absolute inset-0 flex flex-col justify-end items-end p-4'>
                      <h3 className='text-lg font-medium text-white'>
                        {post.title}
                      </h3>
                      {/* <Button
                        variant='outline'
                        className='border-white text-white hover:bg-white hover:text-black text-sm'
                      >
                        Find out More
                      </Button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tutorial Section */}
        <section className='px-4 py-12 md:px-6 md:py-20'>
          <div className='container mx-auto'>
            <div className='overflow-hidden rounded-lg bg-kisan-peach'>
              <div className='p-8 md:p-12'>
                <h2 className='mb-6 text-center text-2xl font-semibold text-kisan-primary md:text-3xl'>
                  Tutorial
                </h2>
                <div className='mx-auto max-w-2xl text-center'>
                  <p className='mb-8 text-xl text-kisan-primary'>
                    Video Maybe or Image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
