import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className='bg-black text-white pt-12 pb-6'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* OUR SERVICES */}
          <div>
            <h3 className='text-sm font-semibold uppercase mb-4'>
              Our Services
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link to='/services' className='text-gray-400 hover:text-white'>
                  Our Connect
                </Link>
              </li>
              <li>
                <Link
                  to='/services/concierge'
                  className='text-gray-400 hover:text-white'
                >
                  Concierge Service
                </Link>
              </li>
            </ul>
          </div>

          {/* BUY */}
          <div>
            <h3 className='text-sm font-semibold uppercase mb-4'>Buy</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/order-tracking'
                  className='text-gray-400 hover:text-white'
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  to='/return-policy'
                  className='text-gray-400 hover:text-white'
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/services/authentication'
                  className='text-gray-400 hover:text-white'
                >
                  Our Authentication Service
                </Link>
              </li>
              <li>
                <Link
                  to='/sell-an-item'
                  className='text-gray-400 hover:text-white'
                >
                  Sell an Item
                </Link>
              </li>
            </ul>
          </div>

          {/* SELL */}
          <div>
            <h3 className='text-sm font-semibold uppercase mb-4'>Sell</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/how-to-sell'
                  className='text-gray-400 hover:text-white'
                >
                  How to Sell
                </Link>
              </li>
              <li>
                <Link
                  to='/selling-advice'
                  className='text-gray-400 hover:text-white'
                >
                  Our Selling Advice
                </Link>
              </li>
              <li>
                <Link
                  to='/sell-an-item'
                  className='text-gray-400 hover:text-white'
                >
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link
                  to='/professional-seller'
                  className='text-gray-400 hover:text-white'
                >
                  Professional Seller Service
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className='text-sm font-semibold uppercase mb-4'>Help</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link to='/help' className='text-gray-400 hover:text-white'>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-gray-400 hover:text-white'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* KISAN CHOICE */}
          <div>
            <h3 className='text-sm font-semibold uppercase mb-4'>
              Kisan Choice
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link to='/about' className='text-gray-400 hover:text-white'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/sustainability'
                  className='text-gray-400 hover:text-white'
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to='/impact' className='text-gray-400 hover:text-white'>
                  Impact Report
                </Link>
              </li>
              <li>
                <Link to='/careers' className='text-gray-400 hover:text-white'>
                  Join the team
                </Link>
              </li>
              <li>
                <Link to='/stories' className='text-gray-400 hover:text-white'>
                  Product Stories
                </Link>
              </li>
              <li>
                <Link
                  to='/affiliate'
                  className='text-gray-400 hover:text-white'
                >
                  Affiliate program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mid section with logo, links, and social */}
        <div className='border-t border-gray-800 pt-6 pb-4 flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <span className='text-xl font-semibold tracking-tight'>
              Kisan <span className='text-kisan-accent'>Choice</span>
            </span>
          </div>

          <div className='flex flex-wrap justify-center mb-4 md:mb-0 space-x-4 text-xs text-gray-400'>
            <Link to='/accessibility' className='hover:text-white'>
              Accessibility Statement
            </Link>
            <Link to='/legal' className='hover:text-white'>
              Legal Information
            </Link>
            <Link to='/terms' className='hover:text-white'>
              Terms
            </Link>
            <Link to='/privacy' className='hover:text-white'>
              Privacy Policy & Cookies
            </Link>
            <Link to='/privileges' className='hover:text-white'>
              Student Privileges
            </Link>
          </div>

          <div className='flex space-x-4'>
            <a
              href='https://facebook.com'
              aria-label='Facebook'
              className='text-gray-400 hover:text-white'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                  clipRule='evenodd'
                />
              </svg>
            </a>
            <a
              href='https://twitter.com'
              aria-label='Twitter'
              className='text-gray-400 hover:text-white'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
              </svg>
            </a>
            <a
              href='https://instagram.com'
              aria-label='Instagram'
              className='text-gray-400 hover:text-white'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                  clipRule='evenodd'
                />
              </svg>
            </a>
            <a
              href='https://pinterest.com'
              aria-label='Pinterest'
              className='text-gray-400 hover:text-white'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z' />
              </svg>
            </a>
          </div>
        </div>

        {/* App store links */}
        <div className='flex flex-col md:flex-row justify-between items-center py-4 border-t border-gray-800'>
          <div className='flex space-x-3 mb-4 md:mb-0'>
            <a href='#' className='block'>
              <img
                src='https://cdn.worldvectorlogo.com/logos/get-it-on-google-play.svg'
                alt='Get it on Google Play'
                className='h-8'
              />
            </a>
            <a href='#' className='block'>
              <img
                src='https://cdn.worldvectorlogo.com/logos/available-on-the-app-store.svg'
                alt='Download on the App Store'
                className='h-8'
              />
            </a>
          </div>

          <div className='text-xs text-gray-500'>
            <p>Certified B Corporation™</p>
            <p className='mt-1'>
              This company meets the highest standards of social and
              environmental performance, transparency, and accountability.
            </p>
          </div>
        </div>

        {/* Payment methods */}
        <div className='pt-4 border-t border-gray-800'>
          <div className='flex flex-wrap justify-center space-x-4 mb-2'>
            {[
              'Affirm',
              'Klarna',
              'Mastercard',
              'Visa',
              'Amex',
              'Discover',
              'PayPal',
              'Apple Pay',
              'Google Pay',
            ].map((payment) => (
              <span key={payment} className='text-xs text-gray-500'>
                {payment}
              </span>
            ))}
          </div>
          <p className='text-xs text-center text-gray-500 mt-4'>
            © 2024 · Kisan Choice · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
