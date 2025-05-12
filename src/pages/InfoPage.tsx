// src/pages/InfoPage.tsx
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link, useLocation, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import { Button } from '@/components/ui/button'; // Import Button if not already

const projectFeatures = [
  'User Authentication (JWT with Cookies)',
  'Role-Based Access Control (Consumer, Farmer, Admin)',
  'Product Browsing & Search',
  'Product Detail Views',
  'Shopping Cart Functionality',
  'Address Management',
  'Stripe Integrated Checkout Process (Conceptual)',
  'Order Creation & History (Conceptual)',
  'User Profile Settings',
];

export default function InfoPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fromPath = searchParams.get('from') || location.pathname; // Get the 'from' query param

  // Determine a title based on the 'from' path
  let pageTitle = 'Site Information';
  if (fromPath.includes('about')) pageTitle = 'About Kisan Choice';
  else if (fromPath.includes('terms')) pageTitle = 'Terms & Conditions';
  else if (fromPath.includes('privacy')) pageTitle = 'Privacy Policy';
  else if (fromPath.includes('contact')) pageTitle = 'Contact Us';
  else if (fromPath.includes('help')) pageTitle = 'Help Center';

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <Header />
      <main className='flex-1 py-12'>
        <div className='container mx-auto px-4'>
          <div className='bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-3xl mx-auto'>
            {' '}
            {/* Adjusted padding and shadow */}
            <h1 className='text-3xl md:text-4xl font-bold text-kisan-primary mb-4'>
              {pageTitle}
            </h1>
            <p className='text-sm text-gray-500 mb-8 border-b pb-4'>
              {/* You clicked a link that originally pointed to: {' '} */}
              {/* <code className='bg-gray-100 p-1 rounded text-kisan-accent text-xs'>
                {fromPath}
              </code> */}
            </p>
            <section className='mb-10'>
              <h2 className='text-2xl font-semibold text-kisan-secondary mb-4'>
                Welcome to Kisan Choice (Project)
              </h2>
              <p className='text-gray-700 leading-relaxed mb-4'>
                <strong>Kisan Choice</strong> is a demonstration e-commerce
                platform designed to illustrate the functionalities of
                connecting farmers directly with consumers. This project
                showcases a range of features typical in modern web
                applications.
              </p>
              <p className='text-gray-700 leading-relaxed'>
                This application is a portfolio piece developed by{' '}
                <strong>Bhawesh Panwar</strong> to highlight full-stack
                development skills. For more projects or to get in touch, you
                can visit{' '}
                <a
                  href='https://github.com/bhaweshpanwar'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-kisan-accent hover:underline font-medium'
                >
                  GitHub/bhaweshpanwar
                </a>
                .
              </p>
            </section>
            <section className='mb-10'>
              <h2 className='text-2xl font-semibold text-kisan-secondary mb-4'>
                Project Features Include:
              </h2>
              <ul className='list-disc list-inside space-y-2 text-gray-700 pl-5 text-sm md:text-base'>
                {projectFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className='text-2xl font-semibold text-kisan-secondary mb-4'>
                Regarding This Page
              </h2>
              <p className='text-gray-700 leading-relaxed mb-4'>
                You've reached this general information page because many of the
                footer links currently point here for demonstration purposes. In
                a fully developed application, each link (like "Terms," "Privacy
                Policy," "About Us," etc.) would lead to a dedicated page with
                specific content relevant to that topic.
              </p>
              <p className='text-gray-700 leading-relaxed'>
                The purpose of this setup is to ensure all links are functional
                and lead to a placeholder page, rather than resulting in errors
                or dead ends during this development and demonstration phase.
              </p>
              <p className='text-gray-700 leading-relaxed mt-4'>
                Thank you for exploring the Kisan Choice project!
              </p>
            </section>
            <div className='mt-12 text-center'>
              <Link to='/'>
                <Button className='bg-kisan-accent text-black hover:bg-kisan-accent/90 px-8 py-3 text-base'>
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
