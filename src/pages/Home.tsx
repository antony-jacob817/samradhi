import React from 'react';
import { Leaf, Sprout, FlaskRound as Flask, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

const categories = [
  { name: 'Seeds', icon: Leaf, color: 'bg-yellow-100' },
  { name: 'Saplings', icon: Sprout, color: 'bg-green-100' },
  { name: 'Pesticides', icon: Flask, color: 'bg-red-100' },
  { name: 'Fertilizers', icon: Droplets, color: 'bg-blue-100' }
];

const featuredProducts = [
    {
    id: '1',
    name: 'Organic Tomato Seeds',
    description: 'High-yield, disease-resistant tomato seeds perfect for home gardens',
    price: 45,
    category: 'seeds',
    imageUrl: '/src/components/tomato_seeds.jpg', // Update the imageUrl to the local path
    stock: 100,
    officeId: 'kb1'
  },
  {
    id: '2',
    name: 'Mango Saplings',
    description: 'Alphonso mango variety, grafted saplings ready for planting',
    price: 120,
    category: 'saplings',
    imageUrl: '/src/components/mango_sapling.webp ',
    stock: 50,
    officeId: 'kb1'
  }
] as const;

export const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[400px] bg-gradient-to-r from-green-700 to-green-900 rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200"
            alt="Agriculture"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="max-w-2xl px-4">
              <h1 className="text-4xl font-bold text-white mb-4">
                Your Trusted Source for Agricultural Supplies
              </h1>
              <p className="text-lg text-green-100 mb-8">
                Pre-book quality seeds, saplings, pesticides, and fertilizers from your local Krishi-Bahavan
              </p>
              <Link to="/products"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className={`${category.color} p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
              >
                <Icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
      
  );
};