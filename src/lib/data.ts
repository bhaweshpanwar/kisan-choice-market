import { Product, Offer, BlogPost, Order } from '@/types';

// Sample farmers
const farmers = [
  {
    name: 'Prateek Sharma',
    location: 'Madhya Pradesh',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=100&fit=crop',
  },
  {
    name: 'Ram Saran Verma',
    location: 'Uttar Pradesh',
    image:
      'https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=100&fit=crop',
  },
  {
    name: 'Rajaram Singh',
    location: 'Punjab',
    image:
      'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?q=80&w=100&fit=crop',
  },
];

// Sample products data
export const products: Product[] = [
  {
    id: '1',
    name: 'Wheat - MP Sharbati',
    slug: 'wheat-mp-sharbati',
    price: 1600,
    originalPrice: 1700,
    unit: 'quintal',
    category: 'Grains & Cereals',
    rating: 4.5,
    reviews: 127,
    image:
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=300&fit=crop',
    farmer: farmers[0],
    inStock: true,
    isNegotiable: true,
    isFarmerChoice: true,
    isTopSelling: true,
    isVerified: true,
    description:
      'Our farm specializes in the fertile soils of Madhya Pradesh - soft wheat Sharbati through using traditional, organic, and eco-friendly methods. The grains are cultivated without synthetic chemicals, resulting in a pure and wholesome product. The wheat is of medium hardness, with distinct whitish, translucent grains, measuring 6-7 mm in length and 3-4 mm in thickness. Our team carefully harvests the wheat at optimal maturity, ensuring each grain promises exceptional quality. The wheat is sorted properly, and each batch undergoes a meticulous examination. We prioritize hygiene during every step of production, from harvesting through to storage and packaging. The product is sent directly to our facilities.',
    highlights: [
      'Organic Sharbati Wheat',
      'From certified organic farms',
      'Harvested within 7 days',
      'Eco-friendly, Farmer-First',
    ],
  },
  {
    id: '2',
    name: 'Sanaola Wheat',
    slug: 'sanaola-wheat',
    price: 2100,
    unit: 'quintal',
    category: 'Grains & Cereals',
    rating: 4.2,
    reviews: 78,
    image:
      'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=300&fit=crop',
    farmer: farmers[1],
    inStock: true,
    isNegotiable: true,
    isVerified: true,
    description:
      'Premium quality Sanaola wheat sourced directly from farms in Uttar Pradesh. Known for its exceptional texture and flavor, making it perfect for chapatis and other wheat-based dishes.',
    highlights: [
      'Premium variety wheat',
      'High protein content',
      'Perfect for daily consumption',
      'Direct from farm',
    ],
  },
  {
    id: '3',
    name: 'Lokwan Wheat',
    slug: 'lokwan-wheat',
    price: 2000,
    unit: 'quintal',
    category: 'Grains & Cereals',
    rating: 4.3,
    reviews: 92,
    image:
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?q=80&w=300&fit=crop',
    farmer: farmers[2],
    inStock: true,
    isNegotiable: true,
    isVerified: true,
    description:
      'Lokwan wheat is a premium variety grown in the fertile soils of Punjab. This wheat variety is known for its superior quality and taste, making it ideal for various culinary applications.',
    highlights: [
      'Native wheat variety',
      'Rich in essential nutrients',
      'Traditionally grown',
      'Perfect for chapatis',
    ],
  },
];

// Sample blog posts
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Farmer Who Cut Out the Middlemen & Won',
    excerpt:
      'A story of resilience and innovation in traditional farming methods during tough climate conditions.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper enim vel sapien convallis, in efficitur est dictum. Donec sagittis magna sit amet libero cursus, at finibus purus tincidunt. Praesent volutpat risus vel nunc faucibus, vel commodo ipsum ultrices. Sed commodo consectetur magna, in vehicula justo varius in. Maecenas non ultrices risus. Integer sodales felis ac nulla pulvinar, in ultricies nulla tincidunt. Nulla facilisi. Nullam vel sagittis odio, a efficitur magna. Integer nec nulla vel enim fringilla tincidunt. Praesent vel est vitae magna lobortis elementum.',
    image: '../../public/images/Blogs/5.png',
    date: '2024-01-15',
    author: 'Manish Kumar',
  },
  {
    id: '2',
    title: 'From Struggle to Success: A Woman Farmer’s Inspiring Journey',
    excerpt:
      'Breaking barriers and building sustainable farming practices that revitalized an entire community.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper enim vel sapien convallis, in efficitur est dictum. Donec sagittis magna sit amet libero cursus, at finibus purus tincidunt. Praesent volutpat risus vel nunc faucibus, vel commodo ipsum ultrices. Sed commodo consectetur magna, in vehicula justo varius in. Maecenas non ultrices risus. Integer sodales felis ac nulla pulvinar, in ultricies nulla tincidunt. Nulla facilisi. Nullam vel sagittis odio, a efficitur magna. Integer nec nulla vel enim fringilla tincidunt. Praesent vel est vitae magna lobortis elementum.',
    image: '../../public/images/Blogs/6.png',
    date: '2024-02-10',
    author: 'Sunita Devi',
  },
  {
    id: '3',
    title: 'How Digital Marketplaces Are Changing Farming in India',
    excerpt:
      'The digital revolution is transforming how farmers connect with consumers and manage their operations.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper enim vel sapien convallis, in efficitur est dictum. Donec sagittis magna sit amet libero cursus, at finibus purus tincidunt. Praesent volutpat risus vel nunc faucibus, vel commodo ipsum ultrices. Sed commodo consectetur magna, in vehicula justo varius in. Maecenas non ultrices risus. Integer sodales felis ac nulla pulvinar, in ultricies nulla tincidunt. Nulla facilisi. Nullam vel sagittis odio, a efficitur magna. Integer nec nulla vel enim fringilla tincidunt. Praesent vel est vitae magna lobortis elementum.',
    image: '../../public/images/Blogs/7.png',
    date: '2024-03-05',
    author: 'Raj Patel',
  },
  {
    id: '4',
    title: 'The Future of Farming: Sustainable Practices & Smart Selling',
    excerpt:
      'Innovative approaches to sustainable farming that increase yield while protecting the environment.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper enim vel sapien convallis, in efficitur est dictum. Donec sagittis magna sit amet libero cursus, at finibus purus tincidunt. Praesent volutpat risus vel nunc faucibus, vel commodo ipsum ultrices. Sed commodo consectetur magna, in vehicula justo varius in. Maecenas non ultrices risus. Integer sodales felis ac nulla pulvinar, in ultricies nulla tincidunt. Nulla facilisi. Nullam vel sagittis odio, a efficitur magna. Integer nec nulla vel enim fringilla tincidunt. Praesent vel est vitae magna lobortis elementum.',
    image: '../../public/images/Blogs/8.png',
    date: '2024-03-28',
    author: 'Anand Sharma',
  },
];

// Sample offers
export const offers: Offer[] = [
  {
    id: '1',
    title: 'First Purchase Discount',
    description:
      'Get 10% off on your first purchase with us! Use code FIRSTBUY at checkout.',
    discount: '10% OFF',
    code: 'FIRSTBUY',
    validUntil: '2024-06-30',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=400&fit=crop',
  },
  {
    id: '2',
    title: 'Seasonal Grains Sale',
    description:
      'Enjoy special prices on all grain products this monsoon season.',
    discount: 'Up to 15% OFF',
    code: 'MONSOON2024',
    validUntil: '2024-09-15',
    image:
      'https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=400&fit=crop',
  },
  {
    id: '3',
    title: 'Free Shipping Weekend',
    description: 'Free shipping on all orders above ₹1000 this weekend only!',
    discount: 'Free Shipping',
    code: 'FREESHIP',
    validUntil: '2024-05-22',
    image:
      'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?q=80&w=400&fit=crop',
  },
  {
    id: '4',
    title: 'Bulk Order Discount',
    description:
      'Get 12% off when you purchase 5 or more items in a single order.',
    discount: '12% OFF',
    code: 'BULK12',
    validUntil: '2024-12-31',
    image:
      'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?q=80&w=400&fit=crop',
  },
];

// Sample orders
export const orders: Order[] = [
  {
    id: 'ORD1234',
    date: '2024-04-15',
    status: 'delivered',
    items: [
      { ...products[0], quantity: 2 },
      { ...products[1], quantity: 1 },
    ],
    total: 5300,
    shippingAddress: {
      id: 'addr1',
      name: 'Rahul Kumar',
      line1: '123 Green Park',
      line2: 'Near City Mall',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      phone: '9876543210',
      isDefault: true,
    },
    paymentMethod: 'UPI',
  },
  {
    id: 'ORD2345',
    date: '2024-04-10',
    status: 'shipped',
    items: [{ ...products[2], quantity: 1 }],
    total: 2000,
    shippingAddress: {
      id: 'addr1',
      name: 'Rahul Kumar',
      line1: '123 Green Park',
      line2: 'Near City Mall',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      phone: '9876543210',
      isDefault: true,
    },
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRACK123456',
  },
  {
    id: 'ORD3456',
    date: '2024-04-05',
    status: 'processing',
    items: [
      { ...products[0], quantity: 1 },
      { ...products[2], quantity: 1 },
    ],
    total: 3600,
    shippingAddress: {
      id: 'addr1',
      name: 'Rahul Kumar',
      line1: '123 Green Park',
      line2: 'Near City Mall',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      phone: '9876543210',
      isDefault: true,
    },
    paymentMethod: 'COD',
  },
];
